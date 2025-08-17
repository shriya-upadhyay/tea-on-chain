"use client";

import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();
  const handleFindTea = () => router.push("/frontend/signup/connect_wallet");

  return (
    <div className="grid h-full grid-cols-1 md:grid-cols-2">
      {/* LEFT: hero art */}
      <div
        className="h-full bg-[#FF4F7A] bg-no-repeat bg-left-bottom bg-[length:70%]"
        style={{ backgroundImage: "url('/omg-girl.png')" }}
      />

      {/* RIGHT: content */}
      <div className="h-full bg-white flex items-center justify-center">
        <div className="text-center max-w-2xl px-10 md:px-12 space-y-8 md:space-y-10">
        <h1
          className="h1-brand text-[#582A55] text-6xl md:text-7xl leading-tight font-extrabold tracking-tight"
          style={{
            WebkitTextStroke: "0.45px #582A55",   // subtle outline = visually thicker
            paintOrder: "stroke fill",            // draw stroke first, then fill
          }}
        >
          Tea OnChain
        </h1>


          <p
            className="text-xl md:text-2xl text-[#1B1B1B] leading-relaxed max-w-xl mx-auto"
            style={{ fontFamily: "'Inria Sans', sans-serif" }}
          >
            An anonymous, onchain space to spill the tea about guys — red flags, receipts,
            and stories that help women protect each other.
          </p>

          <div className="pt-2">
          <button
            onClick={handleFindTea}
            className="w-auto px-10 md:px-12 rounded-full bg-[#1B1B1B] hover:bg-[#2A2A2A]
                      text-white text-base md:text-lg font-semibold py-3.5
                      shadow-lg shadow-black/10 transition-transform hover:scale-[1.02]
                      focus:outline-none focus:ring-2 focus:ring-[#FF2D91]/40"
          >
            Find Tea
          </button>
        </div>

        </div>
      </div>
    </div>
  );
}
