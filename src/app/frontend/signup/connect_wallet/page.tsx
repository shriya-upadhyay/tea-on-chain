"use client";

import { useRouter } from "next/navigation";
import { DynamicWidget, useDynamicContext } from '@dynamic-labs/sdk-react-core';
import { useEffect } from 'react';
export default function ConnectWalletPage() {
  const router = useRouter();
  const { user } = useDynamicContext();

  useEffect(() => {
    if (user) {
      // Small delay to show the success state briefly
      const timer = setTimeout(() => {
        router.push('/frontend/signup/info');
      }, 1500);
      
      return () => clearTimeout(timer);
    }
  }, [user, router]);

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
            Log in your account
          </h1>
            {/* <p
              className="text-[#8B6F74]"
              style={{ fontFamily: "'Inria Sans', sans-serif" }}
            >
              Sign in with Dynamic or connect your wallet to continue.
            </p>
          </div> */}

          <div className="flex-1 flex items-center justify-center">
            <div className="w-full max-w-md">
              <DynamicWidget 
                buttonClassName="w-full bg-black hover:bg-gray-800 text-white font-semibold py-4 px-8 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#FF2D91]/40"
              />
            </div>
          </div>

          
          {/* Show redirect message when wallet is connected */}
          {user && (
            <div className="mt-6 pt-6 border-t border-pink-200 text-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#FF5884] mx-auto mb-2"></div>
              <p className="text-sm text-gray-600">Wallet connected! Redirecting to stake page...</p>
            </div>
          )}
          </div>
        </div>
      </div>
    </div>
  );
}
