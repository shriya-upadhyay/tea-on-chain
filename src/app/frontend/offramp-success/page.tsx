"use client";

import { useRouter } from "next/navigation";

export default function OfframpSuccess() {
  const router = useRouter();

  const handleGoToFeed = () => {
    router.push("/frontend/feed");
  };

  const handleGoHome = () => {
    router.push("/frontend");
  };

  return (
    <div className="relative h-full w-full overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/background.png')" }}
      />
      <div className="absolute inset-0" aria-hidden />

      {/* Content */}
      <div className="relative z-10 h-full flex items-center justify-center px-4 sm:px-6">
        <div className="card w-full max-w-2xl">
          {/* Success Icon */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full mx-auto mb-6 flex items-center justify-center">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-[#582A55] text-3xl sm:text-4xl tracking-tight mb-4"
            style={{ fontFamily: "'Inria Sans', sans-serif" }}
            >
              Offramp Successful! 
            </h1>
            <p className="text-base sm:text-lg text-[#8B6F74]" style={{ fontFamily: "'Inria Sans', sans-serif" }}>
              Your funds have been successfully transferred to your external bank account
            </p>
          </div>

          {/* Transaction Details */}
          <div className="bg-gray-50 rounded-2xl p-6 mb-8">
            <h3 className="text-lg font-semibold text-[#582A55] mb-4 text-center">Transaction Details</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Amount:</span>
                <span className="font-medium">$100.00 USDC</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Network:</span>
                <span className="font-medium">ARBITRUM</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Status:</span>
                <span className="text-green-600 font-medium">✓ Completed</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Processing Time:</span>
                <span className="font-medium">1-3 business days</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4">
            
            <button
              onClick={handleGoHome}
              className="w-full rounded-full bg-white border-2 border-[#1B1B1B] hover:bg-gray-50
                        text-[#1B1B1B] text-base sm:text-lg font-semibold py-3.5
                        shadow-lg shadow-black/10 transition-transform hover:scale-[1.02]
                        focus:outline-none focus:ring-2 focus:ring-[#FF2D91]/40"
            >
              Go to Home
            </button>
          </div>

          {/* Additional Info */}
          <p className="text-center text-gray-500 text-sm mt-6">
            You'll receive a confirmation email with detailed transaction information
          </p>
        </div>
      </div>
    </div>
  );
}
