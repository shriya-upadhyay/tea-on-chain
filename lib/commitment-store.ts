import crypto from 'crypto';

// Simple in-memory store for commitments (use Redis/DB in production)
interface StoredCommitment {
  commitment: string;
  userId: string;
  verificationToken: string;
  timestamp: number;
  verified: boolean;
  expiresAt: number;
}

class CommitmentStore {
  private commitments: Map<string, StoredCommitment> = new Map();
  private tokenToCommitment: Map<string, string> = new Map();
  private readonly TOKEN_TTL = 15 * 60 * 1000; // 15 minutes
  private readonly COMMITMENT_TTL = 60 * 60 * 1000; // 1 hour
  
  store(userId: string, commitment: string): string {
    // Generate a secure verification token
    const verificationToken = crypto.randomBytes(32).toString('base64url');
    const key = `${userId}-${commitment}`;
    const now = Date.now();
    
    const stored: StoredCommitment = {
      commitment,
      userId,
      verificationToken,
      timestamp: now,
      verified: false,
      expiresAt: now + this.TOKEN_TTL
    };
    
    this.commitments.set(key, stored);
    this.tokenToCommitment.set(verificationToken, key);
    
    // Clean up expired commitments
    this.cleanup();
    
    return verificationToken;
  }
  
  verify(userId: string, commitment: string, verificationToken: string): boolean {
    const key = this.tokenToCommitment.get(verificationToken);
    
    if (!key) {
      console.log('Invalid verification token');
      return false;
    }
    
    const stored = this.commitments.get(key);
    
    if (!stored) {
      console.log('Commitment not found for token');
      return false;
    }
    
    // Check if token has expired
    if (Date.now() > stored.expiresAt) {
      console.log('Verification token has expired');
      this.remove(key, verificationToken);
      return false;
    }
    
    // Verify all parameters match
    if (stored.userId !== userId || 
        stored.commitment !== commitment || 
        stored.verificationToken !== verificationToken ||
        stored.verified) {
      console.log('Commitment verification failed - mismatch or already used');
      return false;
    }
    
    // Mark as used and remove token mapping
    stored.verified = true;
    this.tokenToCommitment.delete(verificationToken);
    
    return true;
  }
  
  private remove(key: string, token: string): void {
    this.commitments.delete(key);
    this.tokenToCommitment.delete(token);
  }
  
  private cleanup(): void {
    const now = Date.now();
    const expiredThreshold = now - this.COMMITMENT_TTL;
    
    for (const [key, stored] of this.commitments.entries()) {
      // Remove if expired or too old
      if (stored.timestamp < expiredThreshold || now > stored.expiresAt) {
        this.remove(key, stored.verificationToken);
      }
    }
  }
  
  getLatest(userId: string): { commitment: string; token: string } | null {
    let latest: StoredCommitment | null = null;
    
    for (const stored of this.commitments.values()) {
      if (stored.userId === userId && 
          !stored.verified && 
          Date.now() < stored.expiresAt) {
        if (!latest || stored.timestamp > latest.timestamp) {
          latest = stored;
        }
      }
    }
    
    return latest ? {
      commitment: latest.commitment,
      token: latest.verificationToken
    } : null;
  }
}

export const commitmentStore = new CommitmentStore();