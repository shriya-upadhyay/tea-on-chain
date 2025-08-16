#!/bin/bash

# Exit on error
set -e

echo "Setting up ZK circuit..."

# Create directories
mkdir -p public/circuits
mkdir -p build

# Check if circom is installed
if ! command -v circom &> /dev/null; then
    echo "circom not found. Please install it first:"
    echo "npm install -g circom"
    exit 1
fi

# Compile circuit
echo "Compiling circuit..."
export PATH="$HOME/.local/bin:$PATH"
circom circuits/gender_verification.circom \
    --r1cs \
    --wasm \
    --sym \
    -o build

# Move wasm to public
mv build/gender_verification_js public/circuits/

# Start Powers of Tau ceremony
echo "Starting Powers of Tau ceremony..."
npx snarkjs powersoftau new bn128 14 pot14_0000.ptau -v

# Contribute to ceremony (in production, have multiple parties contribute)
npx snarkjs powersoftau contribute pot14_0000.ptau pot14_0001.ptau \
    --name="First contribution" -v -e="random entropy 1234"

# Prepare phase 2
npx snarkjs powersoftau prepare phase2 pot14_0001.ptau pot14_final.ptau -v

# Generate zkey
echo "Generating zkey..."
npx snarkjs groth16 setup build/gender_verification.r1cs pot14_final.ptau circuit_0000.zkey

# Contribute to phase 2 (in production, have multiple parties contribute)
npx snarkjs zkey contribute circuit_0000.zkey circuit_final.zkey \
    --name="First contribution" -v -e="more random entropy 5678"

# Export verification key
echo "Exporting verification key..."
npx snarkjs zkey export verificationkey circuit_final.zkey public/circuits/verification_key.json

# Move zkey to public
mv circuit_final.zkey public/circuits/

# Clean up
rm -f pot14_*.ptau
rm -f circuit_0000.zkey
rm -rf build

echo "Circuit setup complete!"
echo "Files created:"
echo "  - public/circuits/gender_verification_js/gender_verification.wasm"
echo "  - public/circuits/circuit_final.zkey"
echo "  - public/circuits/verification_key.json"