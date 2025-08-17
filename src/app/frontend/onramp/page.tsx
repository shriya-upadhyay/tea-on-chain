"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function OnRamp() {
  const router = useRouter();

  const handleOnramp = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/onramp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerId: 'your_test_customer_id'
        })
      });

      const result = await response.json();
      console.log('Onramp response:', result);
      
      // Handle the response here
      if (response.ok) {
        console.log('Onramp successful:', result);
        router.push("/frontend/feed");
      } else {
        console.error('Onramp failed:', result);
      }
    } catch (error) {
      console.error('Error calling onramp API:', error);
    }
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
        <div className="w-16 h-16 bg-gradient-to-br from-pink-400 to-purple-500 rounded-2xl mx-auto mb-4 flex items-center justify-center">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
        </div>

          {/* Onramp Button */}
            
            <div className="pt-2">
            <button
              onClick={handleOnramp}
              className="w-full rounded-full bg-[#1B1B1B] hover:bg-[#2A2A2A]
                        text-white text-base sm:text-lg font-semibold py-3.5
                        shadow-lg shadow-black/10 transition-transform hover:scale-[1.02]
                        focus:outline-none focus:ring-2 focus:ring-[#FF2D91]/40
                        [background-image:none]"
            >
              Onramp to Tea (via Fern)
            </button>

            </div>

          {/* ========================= NOTES / TODO =========================
            - Keep `idFile` and `selfieFile` in memory only (component state).
            - Add your verification call here (no storage). Example:
                await fetch('/api/verify', { method: 'POST', body: FormData(...) })
              Ensure the API only returns a pass/fail and discards the files.
            - On success: router.push('/frontend/signup/connect_wallet')
            - Consider basic client-side checks before calling:
                * file type (image/*), size limits, dimensions.
          ================================================================= */}
        </div>
      </div>
    </div>
  );
}
