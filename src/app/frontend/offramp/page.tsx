"use client";

import { useRouter } from "next/navigation";

export default function OffRamp() {
  const router = useRouter();

  const handleOfframp = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/offramp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerId: "cust_12345",
          cryptoWallet: { paymentAccountId: "crypto_abc123" },
          bankAccountData: { paymentAccountId: "bank_67890" },
          amount: "100.00",
          cryptoCurrency: "USDC",
          chain: "ARBITRUM"
        })
      });

      const result = await response.json();
      console.log('Offramp response:', result);
      
      if (response.ok) {
        console.log('Offramp successful:', result);
        router.push("/frontend/offramp-success");
      } else {
        console.error('Offramp failed:', result);
      }
    } catch (error) {
      console.error('Error calling offramp API:', error);
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
          {/* Header */}
          <div className="text-center mb-4 sm:mb-3">
            <h1 className="text-[#582A55] text-3xl sm:text-4xl tracking-tight"
            style={{ fontFamily: "'Inria Sans', sans-serif" }}
            >
              We're sad to see you go :(
            </h1>
            <p className="mt-2 text-base sm:text-lg text-[#8B6F74]" style={{ fontFamily: "'Inria Sans', sans-serif" }}>
              Your Tea on Chain journey will be missed
            </p>
          </div>

          {/* Offramp Button */}
          <div className="pt-0 mb-2">
            <button
              onClick={handleOfframp}
              className="w-full rounded-full bg-[#1B1B1B] hover:bg-[#2A2A2A]
                        text-white text-base sm:text-lg font-semibold py-3.5
                        shadow-lg shadow-black/10 transition-transform hover:scale-[1.02]
                        focus:outline-none focus:ring-2 focus:ring-[#FF2D91]/40
                        [background-image:none]"
            >
              Offramp funds to your external bank account
            </button>
          </div>

          {/* Subtitle */}
          <p className="text-center text-gray-400 text-sm mt-2">
            Funds will be transferred immediately to your external bank account.
          </p>
        </div>
      </div>
    </div>
  );
}
