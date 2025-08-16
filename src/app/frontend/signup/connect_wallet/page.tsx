"use client";

import { useRouter } from "next/navigation";

export default function ConnectWalletPage() {
  const router = useRouter();

  const handleConnectWallet = () => {
    router.push("/frontend/signup/stake");
  };

  return (
    <div className="space-y-8">
      <div className="max-w-md mx-auto">
        <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-pink-200 p-8">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-[#FF5884] mb-2">Sign Up</h1>
            <p className="text-[#FF5884]">Sign up with Privy or connect your wallet</p>
          </div>
          
          <button 
            onClick={handleConnectWallet}
            className="w-full bg-[#FF5884] hover:bg-[#E04A7A] text-white font-semibold py-3 px-4 rounded-lg transition-colors"
          >
            Connect Wallet
          </button>
        </div>
      </div>
    </div>
  );
} 