/**
 * MOCK ENDPOINT FOR TESTING ONLY
 * This endpoint allows testing ZK proof generation without real image verification
 * DO NOT USE IN PRODUCTION
 */

export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import { 
  generateCommitmentForVerification, 
  generateZKProof, 
  type ZKProof 
} from '@/lib/zk-proof';

interface MockVerificationRequest {
  mockGender: 'female' | 'male' | 'unknown';
  userId: string;
}

interface VerificationResponse {
  success: boolean;
  proof?: ZKProof;
  commitment?: string;
  verificationToken?: string;
  error?: string;
  message?: string;
  mock: true;
}

export async function POST(request: NextRequest) {
  // Only allow in development
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json(
      { error: 'Mock endpoint not available in production' },
      { status: 403 }
    );
  }
  
  try {
    const body: MockVerificationRequest = await request.json();
    const { mockGender, userId } = body;
    
    if (!mockGender || !userId) {
      return NextResponse.json<VerificationResponse>(
        { 
          success: false, 
          error: 'Missing required fields: mockGender and userId',
          mock: true
        },
        { status: 400 }
      );
    }
    
    console.log(`[MOCK] Testing with gender: ${mockGender} for user: ${userId}`);
    
    // Mock the is_female result based on input
    const isFemale = mockGender === 'female';
    
    if (!isFemale) {
      return NextResponse.json<VerificationResponse>(
        { 
          success: false, 
          message: `Mock verification: Document indicates ${mockGender} gender.`,
          mock: true
        },
        { status: 200 }
      );
    }
    
    // Generate real ZK proof for female case
    const commitmentData = await generateCommitmentForVerification(userId, true);
    
    if (!commitmentData) {
      return NextResponse.json<VerificationResponse>(
        { 
          success: false, 
          error: 'Failed to generate commitment',
          mock: true
        },
        { status: 500 }
      );
    }
    
    const zkProof = await generateZKProof(
      userId,
      commitmentData.commitment,
      commitmentData.userSecret,
      `mock-verification-${Date.now()}`
    );
    
    return NextResponse.json<VerificationResponse>({
      success: true,
      proof: zkProof,
      commitment: commitmentData.commitment,
      verificationToken: commitmentData.verificationToken,
      message: `[MOCK] Successfully generated ZK proof for ${mockGender} verification.`,
      mock: true
    });
    
  } catch (error) {
    console.error('[MOCK] Error:', error);
    return NextResponse.json<VerificationResponse>(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Internal server error',
        mock: true
      },
      { status: 500 }
    );
  }
}