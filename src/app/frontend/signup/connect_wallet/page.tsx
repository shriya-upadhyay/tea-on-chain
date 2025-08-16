"use client";

import { useRouter } from "next/navigation";

export default function ConnectWalletPage() {
  const router = useRouter();

  const handleConnectWallet = async () => {
    // TODO: plug in actual wallet connect (wagmi/privy/rainbowkit/etc.)
    router.push("/frontend/signup/stake");
  };

  return (
    <div className="relative h-full w-full overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/background.png')" }}
      />
      <div
        className="absolute inset-0"
        aria-hidden
      />

      {/* Content */}
      <div className="relative z-10 h-full flex items-center justify-center px-4 sm:px-6">
        <div className="w-full sm:max-w-3xl bg-white/80 backdrop-blur-md border border-pink-200/70 rounded-3xl shadow-xl p-8 sm:p-12 flex flex-col min-h-[520px] sm:min-h-[560px]">
          {/* Header */}
          <div className="text-center mb-6 sm:mb-8">
          <h1
            className="text-3xl sm:text-4xl font-bold text-[#582A55] tracking-tight mb-4 sm:mb-5"
            style={{ fontFamily: "'Moirai One', cursive" }}
          >
            Connect your wallet
          </h1>
            <p
              className="text-[#8B6F74]"
              style={{ fontFamily: "'Inria Sans', sans-serif" }}
            >
              Sign in with Privy or connect your wallet to continue.
            </p>
          </div>

          {/* Middle: reserved space for providers */}
          <div className="flex-1 flex items-center justify-center">
            {/* TODO: add Privy / RainbowKit / WalletConnect UI here */}
          </div>

          {/* Bottom CTA */}
          <div className="pt-6">
            <button
              onClick={handleConnectWallet}
              className="w-full rounded-full bg-[#1B1B1B] hover:bg-[#2A2A2A]
                         text-white text-base sm:text-lg font-semibold py-3.5
                         shadow-lg shadow-black/10 transition-transform hover:scale-[1.02]
                         focus:outline-none focus:ring-2 focus:ring-[#FF2D91]/40"
              style={{ fontFamily: "'Inria Sans', sans-serif" }}
            >
              Connect Wallet
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
