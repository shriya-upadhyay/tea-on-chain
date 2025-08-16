"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function InfoPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName,  setLastName]  = useState("");
  const [email,     setEmail]     = useState("");
  const router = useRouter();

  const handleContinue = () => {
    if (firstName.trim() && lastName.trim() && email.trim()) {
      router.push("/frontend/signup/verify_id");
    } else {
      alert("Please fill in first name, last name, and email");
    }
  };

  return (
    <div className="relative h-full w-full overflow-hidden">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/background.png')" }}
      />
      {/* Soft brand overlay to keep text readable */}
      <div className="absolute inset-0"/>

      {/* Content */}
      <div className="relative z-10 h-full flex items-center justify-center px-4 sm:px-6">
        <div className="w-full max-w-2xl bg-white/80 backdrop-blur-md border border-pink-200/70 rounded-3xl shadow-xl p-8 sm:p-12">
          {/* Header */}
          <div className="text-center mb-8 sm:mb-10">
            <h1
              className="text-3xl sm:text-4xl font-bold text-[#582A55] tracking-tight"
              style={{ fontFamily: "'Moirai One', cursive" }}
            >
              Create your private profile
            </h1>
            <p
              className="mt-2 text-base sm:text-lg text-[#8B6F74]"
              style={{ fontFamily: "'Inria Sans', sans-serif" }}
            >
              Set up your tea account - spill safely.
            </p>
          </div>

          {/* Form */}
          <div className="space-y-6" style={{ fontFamily: "'Inria Sans', sans-serif" }}>
            {/* First/Last */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div className="space-y-2">
                <label htmlFor="firstName" className="block text-sm font-medium text-[black]">
                  First name
                </label>
                <input
                  id="firstName"
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Jerimiah"
                  autoComplete="given-name"
                  required
                  className="w-full rounded-2xl border border-pink-200/80 bg-white/70 px-4 py-3 text-[#1B1B1B] placeholder-[#8B6F74]/60
                             focus:outline-none focus:ring-2 focus:ring-[#FF2D91] focus:border-transparent"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="lastName" className="block text-sm font-medium text-[black]">
                  Last name
                </label>
                <input
                  id="lastName"
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Fisher"
                  autoComplete="family-name"
                  required
                  className="w-full rounded-2xl border border-pink-200/80 bg-white/70 px-4 py-3 text-[#1B1B1B] placeholder-[#8B6F74]/60
                             focus:outline-none focus:ring-2 focus:ring-[#FF2D91] focus:border-transparent"
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-[black]">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="jermiahfisher@tea.app"
                autoComplete="email"
                required
                className="w-full rounded-2xl border border-pink-200/80 bg-white/70 px-4 py-3 text-[#1B1B1B] placeholder-[#8B6F74]/60
                           focus:outline-none focus:ring-2 focus:ring-[#FF2D91] focus:border-transparent"
              />
              <p className="text-xs text-[#8B6F74] mt-1">
                For secure access & recovery only. Never shown publicly.
              </p>
            </div>

            {/* CTA */}
            <div className="pt-2 flex justify-center">
              <button
                onClick={handleContinue}
                className="w-auto px-10 md:px-12 rounded-full bg-[#1B1B1B] hover:bg-[#2A2A2A]
                          text-white text-base md:text-lg font-semibold py-3.5
                          shadow-lg shadow-black/10 transition-transform hover:scale-[1.02]
                          focus:outline-none focus:ring-2 focus:ring-[#FF2D91]/40"
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
