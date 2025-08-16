import { groth16 } from 'snarkjs';
import crypto from 'crypto';
import path from 'path';
import fs from 'fs/promises';
import { buildPoseidon } from 'circomlibjs';
import { commitmentStore } from './commitment-store';

export interface ZKProof {
  proof: {
    pi_a: string[];
    pi_b: string[][];
    pi_c: string[];
    protocol: string;
    curve: string;
  };
  publicSignals: string[];
  commitment: string;
  verified: boolean;
  timestamp: number;
  metadata: {
    userId: string;
    verificationId: string;
  };
}

// Cache Poseidon instance (expensive to build)
let poseidonInstance: any = null;
async function getPoseidon() {
  if (!poseidonInstance) {
    poseidonInstance = await buildPoseidon();
  }
  return poseidonInstance;
}

// Generate field-compatible random secret
function generateUserSecret(): string {
  // Generate 31 bytes (to stay under field size)
  const bytes = crypto.randomBytes(31);
  const secret = BigInt('0x' + bytes.toString('hex'));
  // Ensure it's less than the field modulus (BN128 scalar field)
  const fieldModulus = BigInt('21888242871839275222246405745257275088548364400416034343698204186575808495617');
  if (secret >= fieldModulus) {
    return generateUserSecret(); // Retry if too large (extremely rare)
  }
  return secret.toString();
}

// Compute Poseidon hash
async function computeCommitment(genderCode: string, userSecret: string): Promise<string> {
  const poseidon = await getPoseidon();
  const hash = poseidon([BigInt(genderCode), BigInt(userSecret)]);
  return poseidon.F.toString(hash);
}

export async function generateCommitmentForVerification(
  userId: string,
  isFemale: boolean
): Promise<{ commitment: string; userSecret: string; verificationToken: string } | null> {
  if (!isFemale) {
    return null;
  }
  
  const genderCode = "1"; // 1 for female
  const userSecret = generateUserSecret();
  const commitment = await computeCommitment(genderCode, userSecret);
  
  // Store commitment and get verification token
  const verificationToken = commitmentStore.store(userId, commitment);
  
  return { commitment, userSecret, verificationToken };
}

export async function generateZKProof(
  userId: string,
  commitment: string,
  userSecret: string,
  verificationId: string
): Promise<ZKProof> {
  try {
    // Prepare witness inputs
    const witnessInput = {
      commitment: commitment,
      target_gender_code: "1", // Always 1 for female verification
      gender_code: "1",         // The actual gender code (1 since we only generate for females)
      user_secret: userSecret
    };
    
    // Paths to circuit files (pass paths directly, not buffers)
    const wasmPath = path.join(process.cwd(), 'public/circuits/gender_verification_js/gender_verification.wasm');
    const zkeyPath = path.join(process.cwd(), 'public/circuits/circuit_final.zkey');
    
    // Check if circuit files exist
    try {
      await fs.access(wasmPath);
      await fs.access(zkeyPath);
    } catch (error) {
      console.error('Circuit files not found. Please run: npm run setup-circuit');
      throw new Error('Circuit files not found');
    }
    
    // Generate the proof - pass file paths, NOT buffers
    const { proof, publicSignals } = await groth16.fullProve(
      witnessInput,
      wasmPath,  // Pass path string directly
      zkeyPath   // Pass path string directly
    );
    
    // Load verification key
    const vKeyPath = path.join(process.cwd(), 'public/circuits/verification_key.json');
    const vKey = JSON.parse(await fs.readFile(vKeyPath, 'utf-8'));
    
    // Verify the proof
    const verified = await groth16.verify(vKey, publicSignals, proof);
    
    if (!verified) {
      throw new Error('Generated proof failed self-verification');
    }
    
    // Format proof for output - keep signals as decimal strings for consistency
    const formattedProof: ZKProof = {
      proof: {
        pi_a: proof.pi_a,  // Keep as-is (already strings)
        pi_b: proof.pi_b,  // Keep as-is
        pi_c: proof.pi_c,  // Keep as-is
        protocol: "groth16",
        curve: "bn128"
      },
      publicSignals: publicSignals,  // Keep as decimal strings
      commitment: publicSignals[0],   // Commitment is the first public signal
      verified: true,
      timestamp: Date.now(),
      metadata: {
        userId: userId,
        verificationId: verificationId
      }
    };
    
    return formattedProof;
  } catch (error) {
    console.error('Error generating ZK proof:', error);
    throw error;
  }
}

export async function verifyZKProof(
  proof: ZKProof, 
  userId: string,
  verificationToken: string
): Promise<boolean> {
  try {
    const vKeyPath = path.join(process.cwd(), 'public/circuits/verification_key.json');
    const vKey = JSON.parse(await fs.readFile(vKeyPath, 'utf-8'));
    
    // No conversion needed - signals are already decimal strings
    const publicSignals = proof.publicSignals;
    
    // Step 1: Verify the cryptographic proof
    const cryptoValid = await groth16.verify(vKey, publicSignals, proof.proof);
    
    if (!cryptoValid) {
      console.log('Cryptographic verification failed');
      return false;
    }
    
    // Step 2: Verify the commitment matches what we stored and token is valid
    const commitment = publicSignals[0]; // Commitment is first public signal
    const commitmentValid = commitmentStore.verify(userId, commitment, verificationToken);
    
    if (!commitmentValid) {
      console.log('Commitment verification failed - invalid token, not found, or already used');
      return false;
    }
    
    // Step 3: Verify target gender code is 1 (female)
    const targetGenderCode = publicSignals[1]; // Second public signal
    if (targetGenderCode !== "1") {
      console.log('Invalid target gender code');
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error verifying proof:', error);
    return false;
  }
}