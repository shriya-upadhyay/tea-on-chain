export const runtime = 'nodejs'; // Force Node.js runtime for snarkjs

import { NextRequest, NextResponse } from 'next/server';
import { 
  generateCommitmentForVerification, 
  generateZKProof, 
  type ZKProof 
} from '@/lib/zk-proof';

interface VerificationResponse {
  success: boolean;
  proof?: ZKProof;
  commitment?: string;
  verificationToken?: string;
  error?: string;
  message?: string;
}

// Upload constraints
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

// Simple in-memory rate limiting (use Redis in production)
const rateLimitMap = new Map<string, number[]>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 5;

function checkRateLimit(clientId: string): boolean {
  const now = Date.now();
  const requests = rateLimitMap.get(clientId) || [];
  
  // Filter out old requests
  const recentRequests = requests.filter(time => now - time < RATE_LIMIT_WINDOW);
  
  if (recentRequests.length >= MAX_REQUESTS_PER_WINDOW) {
    return false;
  }
  
  recentRequests.push(now);
  rateLimitMap.set(clientId, recentRequests);
  
  // Clean up old entries periodically
  if (Math.random() < 0.01) { // 1% chance to clean up
    for (const [key, times] of rateLimitMap.entries()) {
      const recent = times.filter(time => now - time < RATE_LIMIT_WINDOW);
      if (recent.length === 0) {
        rateLimitMap.delete(key);
      } else {
        rateLimitMap.set(key, recent);
      }
    }
  }
  
  return true;
}

// Gemini implementation with proper camelCase and hardened parsing
async function is_female_gemini(imageBuffer: Buffer, mimeType: string): Promise<boolean> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY not set');
  }
  
  const base64Image = imageBuffer.toString('base64');
  
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          role: 'user',
          parts: [
            {
              text: `You are a document OCR system. Read ONLY the printed SEX or GENDER field on this official ID document.

Return strict JSON format:
{"sex": "FEMALE"} or {"sex": "MALE"} or {"sex": "UNABLE_TO_DETERMINE"}

Rules:
- Look ONLY at the printed text field labeled SEX or GENDER
- Common values: F/FEMALE means female, M/MALE means male  
- Do NOT analyze faces, photos, names, or any other fields
- If unclear or no gender field visible, return UNABLE_TO_DETERMINE
- Response must be valid JSON only, no other text`
            },
            {
              inline_data: {
                mime_type: mimeType,
                data: base64Image
              }
            }
          ]
        }],
        generationConfig: {
          temperature: 0,
          topK: 1,
          topP: 0.1,
          maxOutputTokens: 30,
          responseMimeType: "application/json"
        },
        safetySettings: [
          { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_NONE" },
          { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_NONE" },
          { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_NONE" },
          { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_NONE" }
        ]
      })
    }
  );
  
  if (!response.ok) {
    if (process.env.NODE_ENV === 'development') {
      const errorText = await response.text();
      console.error('Gemini API error:', response.status, errorText);
    }
    return false;
  }
  
  const data = await response.json();
  const content = data.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
  
  // Hardened JSON parsing with normalization
  let parsed: { sex?: string } = {};
  try {
    // Clean up potential JSON wrapping issues
    const cleaned = content.trim();
    const jsonStart = cleaned.indexOf('{');
    const jsonEnd = cleaned.lastIndexOf('}');
    const jsonStr = jsonStart >= 0 && jsonEnd >= 0 
      ? cleaned.substring(jsonStart, jsonEnd + 1)
      : cleaned;
    
    parsed = JSON.parse(jsonStr);
  } catch (e) {
    if (process.env.NODE_ENV === 'development') {
      console.error('JSON parsing failed:', content);
    }
    return false;
  }
  
  // Normalize and check - handle whitespace and casing
  const sex = String(parsed.sex || '').trim().toUpperCase();
  
  // Only return true for explicit FEMALE, false for everything else
  return sex === 'FEMALE';
}

async function is_female(imageBuffer: Buffer, mimeType: string = 'image/jpeg'): Promise<boolean> {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY not set. Get your free key at https://makersuite.google.com/app/apikey');
    }
    
    return await is_female_gemini(imageBuffer, mimeType);
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Error in is_female:', error);
    }
    return false; // Safe default
  }
}

export async function POST(request: NextRequest) {
  try {
    // Rate limiting by IP (or use session/user ID)
    const clientId = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     'unknown';
    if (!checkRateLimit(clientId)) {
      return NextResponse.json<VerificationResponse>(
        { 
          success: false, 
          error: 'Rate limit exceeded. Please try again later.' 
        },
        { status: 429 }
      );
    }
    
    const formData = await request.formData();
    const imageFile = formData.get('image') as File;
    const imageId = formData.get('id') as string;
    
    if (!imageFile || !imageId) {
      return NextResponse.json<VerificationResponse>(
        { 
          success: false, 
          error: 'Missing required fields: image and id' 
        },
        { status: 400 }
      );
    }
    
    // Validate file type
    if (!ALLOWED_MIME_TYPES.includes(imageFile.type)) {
      return NextResponse.json<VerificationResponse>(
        { 
          success: false, 
          error: `Invalid file type. Allowed types: ${ALLOWED_MIME_TYPES.join(', ')}` 
        },
        { status: 400 }
      );
    }
    
    // Validate file size
    if (imageFile.size > MAX_FILE_SIZE) {
      return NextResponse.json<VerificationResponse>(
        { 
          success: false, 
          error: `File too large. Maximum size: ${MAX_FILE_SIZE / (1024 * 1024)}MB` 
        },
        { status: 400 }
      );
    }
    
    // Convert image file to buffer
    const imageBuffer = Buffer.from(await imageFile.arrayBuffer());
    
    // Additional safety check on buffer size
    if (imageBuffer.length > MAX_FILE_SIZE) {
      return NextResponse.json<VerificationResponse>(
        { 
          success: false, 
          error: 'File buffer exceeds maximum size' 
        },
        { status: 400 }
      );
    }
    
    // Step 1: Verify if the document shows female - pass actual MIME type
    const isFemale = await is_female(imageBuffer, imageFile.type);
    
    if (!isFemale) {
      return NextResponse.json<VerificationResponse>(
        { 
          success: false, 
          message: 'Verification failed: Document does not indicate female gender.' 
        },
        { status: 200 }
      );
    }
    
    // Step 2: Generate commitment, secret, and verification token
    const commitmentData = await generateCommitmentForVerification(imageId, isFemale);
    
    if (!commitmentData) {
      return NextResponse.json<VerificationResponse>(
        { 
          success: false, 
          error: 'Failed to generate commitment' 
        },
        { status: 500 }
      );
    }
    
    // Step 3: Generate ZK proof
    const zkProof = await generateZKProof(
      imageId,
      commitmentData.commitment,
      commitmentData.userSecret,
      imageId
    );
    
    return NextResponse.json<VerificationResponse>({
      success: true,
      proof: zkProof,
      commitment: commitmentData.commitment,
      verificationToken: commitmentData.verificationToken,
      message: 'Successfully generated zero-knowledge proof of female verification. Save the verification token to verify the proof later.'
    });
    
  } catch (error) {
    // Don't log full error in production to avoid PII leaks
    if (process.env.NODE_ENV === 'development') {
      console.error('Error processing verification:', error);
    }
    
    return NextResponse.json<VerificationResponse>(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Internal server error' 
      },
      { status: 500 }
    );
  }
}