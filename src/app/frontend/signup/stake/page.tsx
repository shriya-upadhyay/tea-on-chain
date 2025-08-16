"use client";

import { useRouter } from "next/navigation";

export default function SignupStakePage() {
  const router = useRouter();

  const handleStake = () => {
    router.push("/frontend/feed");
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-[#FF5884] mb-4">Stake USDC</h1>
        <p className="text-[#FF5884] mb-6 max-w-md mx-auto">
          Stake to read and write posts. You will receive funds each time your post is read.
        </p>
        <button 
          onClick={handleStake}
          className="bg-[#FF5884] hover:bg-[#E04A7A] text-white font-semibold py-3 px-8 rounded-lg transition-colors text-lg"
        >
          Stake USDC
        </button>
      </div>
    </div>
  );
} 