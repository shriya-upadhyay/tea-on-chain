
pragma circom 2.1.0;

include "../circomlib/circuits/poseidon.circom";

template GenderVerification() {
    // Public inputs
    signal input commitment;           // Public commitment to verify against
    signal input target_gender_code;   // Expected gender code (1 for female)
    
    // Private inputs
    signal input gender_code;          // Actual gender code from verification
    signal input user_secret;          // Secret nonce for this verification
    
    // Enforce that gender_code matches target (must be 1 for female)
    signal gender_diff;
    gender_diff <== gender_code - target_gender_code;
    gender_diff === 0;
    
    // Verify commitment matches Poseidon(gender_code, user_secret)
    component hasher = Poseidon(2);
    hasher.inputs[0] <== gender_code;
    hasher.inputs[1] <== user_secret;
    
    // Enforce the commitment matches
    signal commitment_diff;
    commitment_diff <== hasher.out - commitment;
    commitment_diff === 0;
}

component main {public [commitment, target_gender_code]} = GenderVerification();