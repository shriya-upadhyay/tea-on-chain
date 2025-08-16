/**
 * Unit tests for ZK proof functions
 * Run with: npm test
 */

import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import { 
  generateCommitmentForVerification, 
  generateZKProof, 
  verifyZKProof 
} from './zk-proof';
import { commitmentStore } from './commitment-store';
import path from 'path';
import fs from 'fs/promises';

// Mock environment for testing
const originalEnv = process.env.NODE_ENV;

describe('ZK Proof System', () => {
  
  beforeAll(() => {
    // process.env.NODE_ENV = 'test';
  });
  
  afterAll(() => {
    // process.env.NODE_ENV = originalEnv;
  });
  
  describe('generateCommitmentForVerification', () => {
    it('should generate commitment for female verification', async () => {
      const userId = 'test-user-1';
      const result = await generateCommitmentForVerification(userId, true);
      
      expect(result).not.toBeNull();
      expect(result?.commitment).toBeDefined();
      expect(result?.userSecret).toBeDefined();
      expect(result?.verificationToken).toBeDefined();
      expect(result?.commitment).toMatch(/^\d+$/); // Should be numeric string
      expect(result?.verificationToken).toMatch(/^[A-Za-z0-9_-]+$/); // Base64url format
    });
    
    it('should return null for non-female verification', async () => {
      const userId = 'test-user-2';
      const result = await generateCommitmentForVerification(userId, false);
      
      expect(result).toBeNull();
    });
    
    it('should generate different secrets for each call', async () => {
      const userId1 = 'test-user-3';
      const userId2 = 'test-user-4';
      
      const result1 = await generateCommitmentForVerification(userId1, true);
      const result2 = await generateCommitmentForVerification(userId2, true);
      
      expect(result1?.userSecret).not.toBe(result2?.userSecret);
      expect(result1?.commitment).not.toBe(result2?.commitment);
      expect(result1?.verificationToken).not.toBe(result2?.verificationToken);
    });
  });
  
  describe('Commitment Store', () => {
    it('should store and verify commitments', () => {
      const userId = 'test-user-5';
      const commitment = '12345678901234567890';
      
      const token = commitmentStore.store(userId, commitment);
      
      expect(token).toBeDefined();
      expect(token).toMatch(/^[A-Za-z0-9_-]+$/);
      
      const isValid = commitmentStore.verify(userId, commitment, token);
      expect(isValid).toBe(true);
    });
    
    it('should reject invalid tokens', () => {
      const userId = 'test-user-6';
      const commitment = '98765432109876543210';
      
      const isValid = commitmentStore.verify(userId, commitment, 'invalid-token');
      expect(isValid).toBe(false);
    });
    
    it('should prevent token reuse', () => {
      const userId = 'test-user-7';
      const commitment = '11111111111111111111';
      
      const token = commitmentStore.store(userId, commitment);
      
      // First verification should succeed
      const firstVerify = commitmentStore.verify(userId, commitment, token);
      expect(firstVerify).toBe(true);
      
      // Second verification with same token should fail
      const secondVerify = commitmentStore.verify(userId, commitment, token);
      expect(secondVerify).toBe(false);
    });
    
    it('should get latest commitment for user', () => {
      const userId = 'test-user-8';
      const commitment1 = '22222222222222222222';
      const commitment2 = '33333333333333333333';
      
      commitmentStore.store(userId, commitment1);
      const token2 = commitmentStore.store(userId, commitment2);
      
      const latest = commitmentStore.getLatest(userId);
      
      expect(latest).not.toBeNull();
      expect(latest?.commitment).toBe(commitment2);
      expect(latest?.token).toBe(token2);
    });
  });
  
  describe('ZK Proof Generation (requires circuit files)', () => {
    let hasCircuitFiles = false;
    
    beforeAll(async () => {
      // Check if circuit files exist
      try {
        const wasmPath = path.join(process.cwd(), 'public/circuits/gender_verification_js/gender_verification.wasm');
        const zkeyPath = path.join(process.cwd(), 'public/circuits/circuit_final.zkey');
        const vKeyPath = path.join(process.cwd(), 'public/circuits/verification_key.json');
        
        await fs.access(wasmPath);
        await fs.access(zkeyPath);
        await fs.access(vKeyPath);
        hasCircuitFiles = true;
      } catch {
        hasCircuitFiles = false;
      }
    });
    
    it('should generate valid ZK proof (if circuits available)', async () => {
      if (!hasCircuitFiles) {
        console.log('Skipping: Circuit files not found. Run "npm run setup-circuit" first.');
        return;
      }
      
      const userId = 'test-user-9';
      const commitmentData = await generateCommitmentForVerification(userId, true);
      
      if (!commitmentData) {
        throw new Error('Failed to generate commitment');
      }
      
      const proof = await generateZKProof(
        userId,
        commitmentData.commitment,
        commitmentData.userSecret,
        'test-verification-1'
      );
      
      expect(proof).toBeDefined();
      expect(proof.proof).toBeDefined();
      expect(proof.publicSignals).toBeDefined();
      expect(proof.commitment).toBe(commitmentData.commitment);
      expect(proof.verified).toBe(true);
      expect(proof.metadata.userId).toBe(userId);
    });
    
    it('should verify valid proof (if circuits available)', async () => {
      if (!hasCircuitFiles) {
        console.log('Skipping: Circuit files not found.');
        return;
      }
      
      const userId = 'test-user-10';
      const commitmentData = await generateCommitmentForVerification(userId, true);
      
      if (!commitmentData) {
        throw new Error('Failed to generate commitment');
      }
      
      const proof = await generateZKProof(
        userId,
        commitmentData.commitment,
        commitmentData.userSecret,
        'test-verification-2'
      );
      
      const isValid = await verifyZKProof(
        proof,
        userId,
        commitmentData.verificationToken
      );
      
      expect(isValid).toBe(true);
    });
    
    it('should reject proof with wrong token (if circuits available)', async () => {
      if (!hasCircuitFiles) {
        console.log('Skipping: Circuit files not found.');
        return;
      }
      
      const userId = 'test-user-11';
      const commitmentData = await generateCommitmentForVerification(userId, true);
      
      if (!commitmentData) {
        throw new Error('Failed to generate commitment');
      }
      
      const proof = await generateZKProof(
        userId,
        commitmentData.commitment,
        commitmentData.userSecret,
        'test-verification-3'
      );
      
      const isValid = await verifyZKProof(
        proof,
        userId,
        'wrong-token'
      );
      
      expect(isValid).toBe(false);
    });
  });
});

// Test helper to check if we're in a test environment
export function isTestEnvironment(): boolean {
  return process.env.NODE_ENV === 'test' || process.env.JEST_WORKER_ID !== undefined;
}