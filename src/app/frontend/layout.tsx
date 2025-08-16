import type { Metadata } from "next";
import Link from "next/link";
import { DynamicContextProvider } from '@dynamic-labs/sdk-react-core';
import { EthereumWalletConnectors } from '@dynamic-labs/ethereum';
export const metadata: Metadata = {
  title: "Tea on Chain - Frontend",
  description: "Tea on Chain application frontend",
};

export default function FrontendLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <DynamicContextProvider
      settings={{
        environmentId: process.env.NEXT_PUBLIC_DYNAMIC_ENVIRONMENT_ID || '858ed354-fd4f-462a-bdbe-834e4406a0d7',
        walletConnectors: [EthereumWalletConnectors],
      }}
    >
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-rose-100">
        {/* Navigation Header */}
        <nav className="bg-white/80 backdrop-blur-sm border-b border-pink-200 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <Link href="/frontend" className="text-2xl font-bold text-[#FF5884]">
                  🍵 Tea on Chain
                </Link>
              </div>
              <div className="hidden md:block">
                <div className="ml-10 flex items-baseline space-x-4">
                  <Link href="/frontend" className="text-[#FF5884] hover:text-[#E04A7A] px-3 py-2 rounded-md text-sm font-medium">
                    Home
                  </Link>
                  <Link href="/frontend/signup/connect_wallet" className="text-[#FF5884] hover:text-[#E04A7A] px-3 py-2 rounded-md text-sm font-medium">
                    Connect Wallet
                  </Link>
                  <Link href="/frontend/signup/info" className="text-[#FF5884] hover:text-[#E04A7A] px-3 py-2 rounded-md text-sm font-medium">
                    User Info
                  </Link>
                  <Link href="/frontend/signup/stake" className="text-[#FF5884] hover:text-[#E04A7A] px-3 py-2 rounded-md text-sm font-medium">
                    Stake
                  </Link>
                  <Link href="/frontend/feed" className="text-[#FF5884] hover:text-[#E04A7A] px-3 py-2 rounded-md text-sm font-medium">
                    Feed
                  </Link>
                </div>
              </div>
              <div className="md:hidden">
                <button className="text-[#FF5884] hover:text-[#E04A7A] p-2">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
      </div>
    </DynamicContextProvider>
  );
} 