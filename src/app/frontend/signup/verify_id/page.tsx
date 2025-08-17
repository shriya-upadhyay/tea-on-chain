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

    if (!idFile) return;

  const formData = new FormData();
  formData.append('image', idFile);  // The actual ID file
  formData.append('id', 'some-id'); // Ensure this key matches what the backend expects

  try {
    const response = await fetch('http://localhost:3000/api/verify-female', {
      method: 'POST',
      body: formData,  // Send the form data to the backend
    });

    const result = await response.json();

    if (result.success) {
      console.log('Verification successful:', result);
      router.push("/frontend/signup/onramp");
    } else {
      console.error('Verification failed:', result.message || result.error);
    }
  } catch (error) {
    console.error('Error submitting verification:', error);
  }

  };

  const disabled = !idFile;

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
          <div className="text-center mb-8 sm:mb-10">
            <h1 className="text-[#582A55] text-3xl sm:text-4xl tracking-tight"
            style={{ fontFamily: "'Inria Sans', sans-serif" }}
            >
              Verify your ID
            </h1>
              Set up your tea account - spill safely.
            <p className="mt-2 text-base sm:text-lg text-[#8B6F74]" style={{ fontFamily: "'Inria Sans', sans-serif" }}>
              Upload a photo of your ID. Files stay in memory for this step only.
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

            {/* Continue */}
            <div className="pt-2">
            <button
              onClick={handleVerify}
              disabled={disabled}
              className="w-full rounded-full bg-[#1B1B1B] hover:bg-[#2A2A2A]
                        text-white text-base sm:text-lg font-semibold py-3.5
                        shadow-lg shadow-black/10 transition-transform hover:scale-[1.02]
                        focus:outline-none focus:ring-2 focus:ring-[#FF2D91]/40
                        disabled:bg-[#1B1B1B] disabled:hover:bg-[#1B1B1B] disabled:opacity-100 disabled:cursor-not-allowed
                        [background-image:none]"
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
