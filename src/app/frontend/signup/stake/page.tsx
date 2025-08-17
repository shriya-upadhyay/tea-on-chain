"use client";

import { useRouter } from "next/navigation";
import { StakingButton } from "../../components/StakingButton";
import { UnstakeButton } from "../../components/UnstakeButton";
import { CONTRACTS } from "../../lib/contracts";

export default function SignupStakePage() {
  const router = useRouter();

  const handleStakeSuccess = () => {
    // Staking was successful, redirect to feed
    router.push("/frontend/feed");
  };

  const handleUnstakeSuccess = () => {
    // Unstaking was successful, could redirect or show success message
    console.log("Unstaking successful!");
  };

  return (
    <div className="relative h-full w-full overflow-hidden">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/background.png')" }}
      />
      {/* Soft brand overlay */}
      <div
        className="absolute inset-0"
      />

      {/* Content */}
      <div className="relative z-10 h-full flex items-center justify-center px-4 sm:px-6">
        <div className="w-full sm:max-w-3xl bg-white/80 backdrop-blur-md border border-pink-200/70 rounded-3xl shadow-xl p-8 sm:p-12 text-center flex flex-col min-h-[520px] sm:min-h-[560px]">
          {/* Header */}
          <div className="mb-8 sm:mb-10">
            <h1
              className="text-3xl sm:text-4xl font-bold text-[#582A55] tracking-tight mb-4 sm:mb-5"
              style={{ fontFamily: "'Moirai One', cursive" }}
            >
              Stake USDC
            </h1>
            <p
              className="text-[#8B6F74] max-w-xl mx-auto"
              style={{ fontFamily: "'Inria Sans', sans-serif" }}
            >
              Stake 20 USDC to read and write posts. Earn each time your post is read.
            </p>
          </div>

          {/* Staking Buttons */}
          <div className="flex-1 flex items-center justify-center">
            <div className="w-full max-w-md space-y-4">
              <StakingButton
                onSuccess={handleStakeSuccess}
                tokenAddress={CONTRACTS.PYUSD}
                stakingContractAddress={CONTRACTS.STAKING}
              />
              
              {/* <UnstakeButton
                onSuccess={handleUnstakeSuccess}
                stakingContractAddress={CONTRACTS.STAKING}
              /> */}
               {/* uncomment this to add unstaking button */}
              
              <div className="text-xs text-[#8B6F74] text-center" style={{ fontFamily: "'Inria Sans', sans-serif" }}>
                Funds remain yours. Unstake anytime.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
