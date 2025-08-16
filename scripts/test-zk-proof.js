#!/usr/bin/env node

/**
 * Test script for ZK proof generation and verification
 * Run with: node scripts/test-zk-proof.js
 */

const fs = require('fs').promises;
const path = require('path');
const crypto = require('crypto');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

const log = {
  success: (msg) => console.log(`${colors.green}✓${colors.reset} ${msg}`),
  error: (msg) => console.log(`${colors.red}✗${colors.reset} ${msg}`),
  info: (msg) => console.log(`${colors.blue}ℹ${colors.reset} ${msg}`),
  warn: (msg) => console.log(`${colors.yellow}⚠${colors.reset} ${msg}`),
  section: (msg) => console.log(`\n${colors.cyan}═══ ${msg} ═══${colors.reset}`)
};

// Check if circuit files exist
async function checkCircuitFiles() {
  log.section('Checking Circuit Files');
  
  const requiredFiles = [
    'public/circuits/gender_verification_js/gender_verification.wasm',
    'public/circuits/circuit_final.zkey',
    'public/circuits/verification_key.json'
  ];
  
  let allExist = true;
  for (const file of requiredFiles) {
    try {
      await fs.access(path.join(process.cwd(), file));
      log.success(`Found: ${file}`);
    } catch {
      log.error(`Missing: ${file}`);
      allExist = false;
    }
  }
  
  if (!allExist) {
    log.warn('Run "npm run setup-circuit" to generate missing circuit files');
    return false;
  }
  
  return true;
}

// Test ZK proof generation directly
async function testDirectProofGeneration() {
  log.section('Testing Direct ZK Proof Generation');
  
  try {
    // Dynamic import for ES modules
    const { buildPoseidon } = await import('circomlibjs');
    const snarkjs = await import('snarkjs');
    
    // Build Poseidon
    const poseidon = await buildPoseidon();
    
    // Test data
    const genderCode = "1"; // Female
    const userSecret = "12345678901234567890"; // Test secret
    
    // Compute commitment
    const hash = poseidon([BigInt(genderCode), BigInt(userSecret)]);
    const commitment = poseidon.F.toString(hash);
    
    log.info(`Gender Code: ${genderCode}`);
    log.info(`User Secret: ${userSecret}`);
    log.info(`Commitment: ${commitment}`);
    
    // Prepare witness
    const witnessInput = {
      commitment: commitment,
      target_gender_code: "1",
      gender_code: genderCode,
      user_secret: userSecret
    };
    
    // Generate proof
    const wasmPath = path.join(process.cwd(), 'public/circuits/gender_verification_js/gender_verification.wasm');
    const zkeyPath = path.join(process.cwd(), 'public/circuits/circuit_final.zkey');
    
    log.info('Generating ZK proof...');
    const { proof, publicSignals } = await snarkjs.groth16.fullProve(
      witnessInput,
      wasmPath,
      zkeyPath
    );
    
    log.success('Proof generated successfully!');
    log.info(`Public Signals: [${publicSignals.join(', ')}]`);
    
    // Verify proof
    const vKeyPath = path.join(process.cwd(), 'public/circuits/verification_key.json');
    const vKey = JSON.parse(await fs.readFile(vKeyPath, 'utf-8'));
    
    log.info('Verifying proof...');
    const isValid = await snarkjs.groth16.verify(vKey, publicSignals, proof);
    
    if (isValid) {
      log.success('Proof verified successfully! ✨');
    } else {
      log.error('Proof verification failed!');
    }
    
    return { proof, publicSignals, isValid };
  } catch (error) {
    log.error(`Error: ${error.message}`);
    return null;
  }
}

// Test with mock server endpoints
async function testMockEndpoints() {
  log.section('Testing Mock Endpoints');
  
  // Create a simple test server
  const express = require('express');
  const app = express();
  app.use(express.json());
  
  // Mock is_female function for testing
  const mockIsFemale = (testCase) => {
    return testCase === 'female';
  };
  
  // Test endpoint that accepts a test case
  app.post('/test/verify-female', async (req, res) => {
    const { testCase, userId } = req.body;
    
    log.info(`Testing with case: ${testCase}`);
    
    const isFemale = mockIsFemale(testCase);
    
    if (!isFemale) {
      return res.json({
        success: false,
        message: 'Test case: Not female'
      });
    }
    
    // Generate mock proof data
    const mockProof = {
      success: true,
      message: 'Test case: Female verified',
      testCase: testCase,
      commitment: crypto.randomBytes(32).toString('hex'),
      verificationToken: crypto.randomBytes(32).toString('base64url')
    };
    
    res.json(mockProof);
  });
  
  const server = app.listen(3001, () => {
    log.info('Test server running on port 3001');
  });
  
  // Run test cases
  const testCases = [
    { testCase: 'female', userId: 'test-1', expected: true },
    { testCase: 'male', userId: 'test-2', expected: false },
    { testCase: 'unknown', userId: 'test-3', expected: false }
  ];
  
  for (const test of testCases) {
    try {
      const response = await fetch('http://localhost:3001/test/verify-female', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(test)
      });
      
      const result = await response.json();
      const passed = result.success === test.expected;
      
      if (passed) {
        log.success(`Test "${test.testCase}": PASSED (expected: ${test.expected})`);
      } else {
        log.error(`Test "${test.testCase}": FAILED (expected: ${test.expected}, got: ${result.success})`);
      }
    } catch (error) {
      log.error(`Test "${test.testCase}": ERROR - ${error.message}`);
    }
  }
  
  server.close();
}

// Test API integration
async function testAPIIntegration() {
  log.section('Testing API Integration');
  
  // Check if dev server is running
  try {
    const response = await fetch('http://localhost:3000/api/verify-female', {
      method: 'POST'
    });
    
    if (response.status === 400) {
      log.success('API endpoint is responding correctly (400 for missing data)');
    }
  } catch (error) {
    log.warn('Dev server not running. Start it with "npm run dev"');
    return;
  }
  
  // Test with mock form data
  log.info('Testing with mock image upload...');
  
  // Create a mock image buffer (1x1 transparent PNG)
  const mockPNG = Buffer.from(
    '89504e470d0a1a0a0000000d494844520000000100000001080600000001f15c4890000000114944415478da62f8ffffff3f0300060005a705a1cd0b1f0000000049454e44ae426082',
    'hex'
  );
  
  const FormData = require('form-data');
  const formData = new FormData();
  formData.append('image', mockPNG, {
    filename: 'test.png',
    contentType: 'image/png'
  });
  formData.append('id', 'test-user-123');
  
  try {
    const response = await fetch('http://localhost:3000/api/verify-female', {
      method: 'POST',
      body: formData,
      headers: formData.getHeaders()
    });
    
    const result = await response.json();
    
    if (result.error && result.error.includes('GEMINI_API_KEY')) {
      log.warn('Gemini API key not configured. Add GEMINI_API_KEY to .env file');
    } else if (result.success === false) {
      log.info(`API Response: ${result.message || result.error}`);
    } else {
      log.success('API integration test completed');
    }
  } catch (error) {
    log.error(`API test error: ${error.message}`);
  }
}

// Main test runner
async function runTests() {
  console.log(`
${colors.cyan}╔════════════════════════════════════════╗
║     ZK Proof System Test Suite         ║
╚════════════════════════════════════════╝${colors.reset}
`);
  
  // Check prerequisites
  const hasCircuits = await checkCircuitFiles();
  
  if (hasCircuits) {
    // Run direct proof generation test
    await testDirectProofGeneration();
  }
  
  // Test mock endpoints
  try {
    await testMockEndpoints();
  } catch (error) {
    log.warn('Mock endpoint tests require express: npm install express');
  }
  
  // Test API integration if server is running
  await testAPIIntegration();
  
  log.section('Test Summary');
  log.info('Tests completed. Check output above for results.');
  
  if (!hasCircuits) {
    console.log(`
${colors.yellow}Next steps:
1. Run: npm run setup-circuit
2. Add your GEMINI_API_KEY to .env
3. Run tests again: node scripts/test-zk-proof.js${colors.reset}
`);
  }
}

// Run tests
runTests().catch(console.error);