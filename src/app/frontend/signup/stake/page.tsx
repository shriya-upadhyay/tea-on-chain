"use client";

import { useRouter } from "next/navigation";

export default function SignupStakePage() {
  const router = useRouter();

  const handleStake = () => {
    // TODO: integrate staking flow; on success:
    router.push("/frontend/feed");
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
              Stake to read and write posts. Earn each time your post is read.
            </p>
          </div>

          {/* Middle spacer (room for stake inputs later) */}
          <div className="flex-1 flex items-center justify-center">
            {/* TODO: add stake amount / network selector here */}
          </div>

          {/* CTA */}
          <div className="pt-4">
            <button
              onClick={handleStake}
              className="w-full rounded-full bg-[#1B1B1B] hover:bg-[#2A2A2A]
                         text-white text-base sm:text-lg font-semibold py-3.5
                         shadow-lg shadow-black/10 transition-transform hover:scale-[1.02]
                         focus:outline-none focus:ring-2 focus:ring-[#FF2D91]/40"
              style={{ fontFamily: "'Inria Sans', sans-serif" }}
            >
              Stake USDC
            </button>

            <div className="mt-6 text-xs text-[#8B6F74]" style={{ fontFamily: "'Inria Sans', sans-serif" }}>
              Funds remain yours. Unstake anytime.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
