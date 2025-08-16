export const runtime = 'nodejs'; // Force Node.js runtime for snarkjs

import { NextRequest, NextResponse } from 'next/server';
import { verifyZKProof, type ZKProof } from '@/lib/zk-proof';

interface VerifyRequest {
  proof: ZKProof;
  userId: string;
  verificationToken: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: VerifyRequest = await request.json();
    const { proof, userId, verificationToken } = body;
    
    if (!proof || !proof.proof || !proof.publicSignals || !userId || !verificationToken) {
      return NextResponse.json(
        { 
          valid: false, 
          error: 'Invalid request format. Required: proof, userId, and verificationToken' 
        },
        { status: 400 }
      );
    }
    
    // Verify both cryptographic proof AND commitment binding with token
    const isValid = await verifyZKProof(proof, userId, verificationToken);
    
    return NextResponse.json({
      valid: isValid,
      commitment: proof.commitment,
      timestamp: proof.timestamp,
      metadata: proof.metadata,
      message: isValid 
        ? 'Proof successfully verified: Document gender field was FEMALE' 
        : 'Proof verification failed - invalid proof, token, or already used'
    });
    
  } catch (error) {
    console.error('Error verifying proof:', error);
    return NextResponse.json(
      { 
        valid: false, 
        error: 'Failed to verify proof' 
      },
      { status: 500 }
    );
  }
}