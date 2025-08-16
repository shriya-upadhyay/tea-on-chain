#!/bin/bash

# Fast circuit setup - uses pre-generated Powers of Tau for development
set -e

echo "Fast ZK circuit setup..."

# Create directories
mkdir -p public/circuits
mkdir -p build

# Add circom to PATH
export PATH="$HOME/.local/bin:$PATH"

# Compile circuit
echo "Compiling circuit..."
circom circuits/gender_verification.circom \
    --r1cs \
    --wasm \
    --sym \
    -o build

# Move wasm to public
echo "Moving WASM files..."
mv build/gender_verification_js public/circuits/

# Generate minimal Powers of Tau for testing
echo "Generating Powers of Tau..."
npx snarkjs powersoftau new bn128 12 pot12_0000.ptau -v
npx snarkjs powersoftau contribute pot12_0000.ptau pot12_0001.ptau --name="First" -e="random"
npx snarkjs powersoftau prepare phase2 pot12_0001.ptau pot12_final.ptau -v

# Generate zkey
echo "Generating zkey..."
npx snarkjs groth16 setup build/gender_verification.r1cs pot12_final.ptau circuit_0000.zkey

# Contribute to phase 2
echo "Contributing to phase 2..."
npx snarkjs zkey contribute circuit_0000.zkey circuit_final.zkey \
    --name="Dev contribution" -v -e="dev random entropy $(date +%s)"

# Export verification key
echo "Exporting verification key..."
npx snarkjs zkey export verificationkey circuit_final.zkey public/circuits/verification_key.json

# Move zkey to public
mv circuit_final.zkey public/circuits/

# Clean up
rm -f pot14_final.ptau
rm -f circuit_0000.zkey
rm -rf build

echo "✅ Circuit setup complete!"
echo "Files created:"
echo "  - public/circuits/gender_verification_js/gender_verification.wasm"
echo "  - public/circuits/circuit_final.zkey"
echo "  - public/circuits/verification_key.json"