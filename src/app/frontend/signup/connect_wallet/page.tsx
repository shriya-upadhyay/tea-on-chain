"use client";

import { WalletComponent } from "../../components/wallet";
import { useAuth } from "../../contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ConnectWalletPage() {
  const { isConnected, address } = useAuth();
  const router = useRouter();

  // Auto-redirect to stake page when wallet is connected
  useEffect(() => {
    if (isConnected && address) {
      // Small delay to show the success state briefly
      const timer = setTimeout(() => {
        router.push('/frontend/signup/stake');
      }, 1500);
      
      return () => clearTimeout(timer);
    }
  }, [isConnected, address, router]);

  return (
    <div className="space-y-8">
      <div className="max-w-md mx-auto">
        <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-pink-200 p-8">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-[#FF5884] mb-2">Sign Up</h1>
            <p className="text-[#FF5884]">Sign up with Privy or connect your wallet</p>
          </div>
          
          <WalletComponent />
          
          {/* Show redirect message when wallet is connected */}
          {isConnected && address && (
            <div className="mt-6 pt-6 border-t border-pink-200 text-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#FF5884] mx-auto mb-2"></div>
              <p className="text-sm text-gray-600">Redirecting to stake page...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 