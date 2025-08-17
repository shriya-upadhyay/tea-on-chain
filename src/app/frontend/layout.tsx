// app/frontend/layout.tsx
import Link from "next/link";
import { DynamicContextProvider } from '@dynamic-labs/sdk-react-core';
import { EthereumWalletConnectors } from '@dynamic-labs/ethereum';
export const metadata = {
  title: "Tea on Chain - Frontend",
  description: "Tea on Chain application frontend",
};

export default function FrontendLayout({ children }: { children: React.ReactNode }) {
  return (
    <DynamicContextProvider
      settings={{
        environmentId: process.env.NEXT_PUBLIC_DYNAMIC_ENVIRONMENT_ID || '858ed354-fd4f-462a-bdbe-834e4406a0d7',
        walletConnectors: [EthereumWalletConnectors],
      }}
    >
    <div className="bg-gradient-to-br from-pink-50 to-rose-100 min-h-dvh grid grid-rows-[auto_1fr]">

      {/* NAV */}
      <nav className="sticky top-0 z-50 h-16 bg-white border-b border-pink-200/80 shadow-sm">
        <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <Link href="/frontend" className="text-2xl font-bold text-[#582A55] h1-brand">
            🍵 Tea OnChain
          </Link>
          <div className="hidden md:flex items-center gap-2" style={{ fontFamily: "'Inria Sans', sans-serif" }}>
            <Link href="/frontend" className="px-3 py-2 rounded-full text-sm text-[#582A55]/85 hover:text-[#582A55] hover:bg-[#FFF5F8]">
              Home
            </Link>
            <Link href="/frontend/signup/info" className="px-3 py-2 rounded-full text-sm text-[#582A55]/85 hover:text-[#582A55] hover:bg-[#FFF5F8]">
              User Info
            </Link>
            <Link href="/frontend/signup/connect_wallet" className="px-3 py-2 rounded-full text-sm text-[#582A55]/85 hover:text-[#582A55] hover:bg-[#FFF5F8]">
              Connect Wallet
            </Link>
            <Link href="/frontend/signup/stake" className="px-3 py-2 rounded-full text-sm text-[#582A55]/85 hover:text-[#582A55] hover:bg-[#FFF5F8]">
              Stake
            </Link>
            <Link href="/frontend/feed" className="px-3 py-2 rounded-full text-sm text-[#582A55]/85 hover:text-[#582A55] hover:bg-[#FFF5F8]">
              Feed
            </Link>
          </div>
        </div>
      </nav>

      {/* MAIN fills the rest; your pages use h-full inside */}
      <main className="h-full overflow-hidden">{children}</main>
    </div>
    </DynamicContextProvider>
  );
}
