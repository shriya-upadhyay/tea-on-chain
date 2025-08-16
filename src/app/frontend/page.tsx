"use client";

import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  const handleFindTea = () => {
    router.push("/frontend/signup/info");
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-[#FF5884] mb-4">TEA OnChain</h1>
        <p className="text-xl text-[#FF5884] max-w-4xl mx-auto mb-8">
          An anonymous, onchain space to spill the tea about guys - red flags, receipts, and stories that help women protect each other
        </p>
        <button 
          onClick={handleFindTea}
          className="bg-[#FF5884] hover:bg-[#E04A7A] text-white px-8 py-3 rounded-lg font-semibold text-lg transition-colors"
        >
          Find Tea
        </button>
      </div>
    </div>
  );
} 