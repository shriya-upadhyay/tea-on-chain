"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function VerifyId() {
  const router = useRouter();

  // Temporary, in-memory files (not persisted)
  const [idFile, setIdFile] = useState<File | null>(null);
  const [selfieFile, setSelfieFile] = useState<File | null>(null);

  // Previews (Object URLs), also in-memory
  const [idPreview, setIdPreview] = useState<string | null>(null);
  const [selfiePreview, setSelfiePreview] = useState<string | null>(null);

  useEffect(() => {
    if (!idFile) return setIdPreview(null);
    const url = URL.createObjectURL(idFile);
    setIdPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [idFile]);

  useEffect(() => {
    if (!selfieFile) return setSelfiePreview(null);
    const url = URL.createObjectURL(selfieFile);
    setSelfiePreview(url);
    return () => URL.revokeObjectURL(url);
  }, [selfieFile]);

  const onSelectId = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setIdFile(file);
  };

  const onSelectSelfie = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setSelfieFile(file);
  };

  const clearId = () => setIdFile(null);
  const clearSelfie = () => setSelfieFile(null);

  const handleVerify = async () => {
    if (!idFile || !selfieFile) return;

    // ================== VERIFICATION PLACEHOLDER ==================
    // TODO: Add your ephemeral verification logic here WITHOUT storage.
    // - Access raw bytes via: await idFile.arrayBuffer(), await selfieFile.arrayBuffer()
    // - Call a serverless endpoint that returns a boolean (no persistence).
    // - Or run a client-side heuristic check (dimensions, blur detection, etc).
    // - If verified, navigate onward; else, show an inline error.
    // =============================================================

    // Example flow:
    // const ok = await checkVerification(idFile, selfieFile) // no storage, only a boolean result
    // if (ok) router.push("/frontend/signup/connect_wallet");
    // else setError("Couldn't verify. Try again.");

    router.push("/frontend/signup/connect_wallet");
  };

  const disabled = !idFile || !selfieFile;

  return (
    <div className="relative h-full w-full overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/background.png')" }}
        aria-hidden
      />
      <div className="absolute inset-0" aria-hidden />

      {/* Content */}
      <div className="relative z-10 h-full flex items-center justify-center px-4 sm:px-6">
        <div className="card w-full max-w-2xl">
          {/* Header */}
          <div className="text-center mb-8 sm:mb-10">
            <h1 className="text-[#582A55] text-3xl sm:text-4xl tracking-tight"
            style={{ fontFamily: "'Inria Sans', sans-serif" }}
            >
              Verify your ID
            </h1>
              Set up your tea account - spill safely.
            <p className="mt-2 text-base sm:text-lg text-[#8B6F74]" style={{ fontFamily: "'Inria Sans', sans-serif" }}>
              Upload a photo of your ID and a selfie. Files stay in memory for this step only.
            </p>
          </div>

          {/* Uploads */}
          <div className="space-y-6" style={{ fontFamily: "'Inria Sans', sans-serif" }}>
            {/* ID Upload */}
            <div>
              <label className="block text-sm font-medium text-[#582A55] mb-2">Government ID</label>

              <label
                htmlFor="id-upload"
                className="flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-pink-300/80 bg-white/60 px-4 py-8 text-center cursor-pointer hover:border-[#FF2D91] transition-colors"
              >
                {idPreview ? (
                  <img src={idPreview} alt="ID preview" className="max-h-40 rounded-xl object-contain" />
                ) : (
                  <>
                    <span className="text-2xl">📎</span>
                    <span className="text-sm text-[#8B6F74]">Click to upload a clear photo of your ID</span>
                    <span className="text-xs text-[#8B6F74]">JPG/PNG, up to ~10MB</span>
                  </>
                )}
              </label>
              <input id="id-upload" type="file" accept="image/*" onChange={onSelectId} className="hidden" />
              {idFile && (
                <div className="mt-2 flex items-center justify-between text-sm text-[#8B6F74]">
                  <span className="truncate">{idFile.name}</span>
                  <button onClick={clearId} className="underline hover:no-underline text-[#582A55]">
                    Remove
                  </button>
                </div>
              )}
            </div>

            {/* Selfie Upload */}
            <div>
              <label className="block text-sm font-medium text-[#582A55] mb-2">Selfie</label>

              <label
                htmlFor="selfie-upload"
                className="flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-pink-300/80 bg-white/60 px-4 py-8 text-center cursor-pointer hover:border-[#FF2D91] transition-colors"
              >
                {selfiePreview ? (
                  <img src={selfiePreview} alt="Selfie preview" className="max-h-40 rounded-xl object-contain" />
                ) : (
                  <>
                    <span className="text-2xl">🤳</span>
                    <span className="text-sm text-[#8B6F74]">Click to upload a selfie (no hat, good light)</span>
                    <span className="text-xs text-[#8B6F74]">JPG/PNG, up to ~10MB</span>
                  </>
                )}
              </label>
              <input
                id="selfie-upload"
                type="file"
                accept="image/*"
                capture="user" /* on mobile, suggests front camera */
                onChange={onSelectSelfie}
                className="hidden"
              />
              {selfieFile && (
                <div className="mt-2 flex items-center justify-between text-sm text-[#8B6F74]">
                  <span className="truncate">{selfieFile.name}</span>
                  <button onClick={clearSelfie} className="underline hover:no-underline text-[#582A55]">
                    Remove
                  </button>
                </div>
              )}
            </div>

            {/* Continue */}
            <div className="pt-2">
            <button
              onClick={handleVerify}
              disabled={disabled}
              className="w-full rounded-full bg-[#000000] hover:bg-[#2A2A2A]
                        text-white text-base sm:text-lg font-semibold py-3.5
                        shadow-lg shadow-black/10 transition-transform hover:scale-[1.02]
                        focus:outline-none focus:ring-2 focus:ring-[#FF2D91]/40
                        disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Verify & Continue
            </button>
            </div>
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
