"use client";

import { useAuth } from '../contexts/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

// Define unrestricted routes - these are the ONLY routes that don't require authentication
const UNRESTRICTED_ROUTES = [
  '/frontend',
  '/frontend/signup/info',
  '/frontend/signup/connect_wallet'
];

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isConnected, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [shouldRender, setShouldRender] = useState(false);

  // Debug logging
  useEffect(() => {
    console.log('ProtectedRoute Debug:', {
      pathname,
      isConnected,
      isLoading,
      shouldRender
    });
  }, [pathname, isConnected, isLoading, shouldRender]);

  useEffect(() => {
    // Don't do anything while loading
    if (isLoading) return;

    // Check if current route is unrestricted
    const isUnrestricted = UNRESTRICTED_ROUTES.some(route => 
      pathname === route || pathname.startsWith(route + '/')
    );

    console.log(`Route check: ${pathname} - Unrestricted: ${isUnrestricted}, Connected: ${isConnected}`);

    // If route is restricted and user is not connected, redirect immediately
    if (!isUnrestricted && !isConnected) {
      console.log(`🚫 ACCESS DENIED to ${pathname} - redirecting to connect wallet`);
      router.replace('/frontend/signup/connect_wallet');
      return;
    }

    // If we get here, either the route is unrestricted OR the user is connected
    console.log(`✅ Access granted to ${pathname}`);
    setShouldRender(true);
  }, [isConnected, isLoading, pathname, router]);

  // Show loading state while checking authentication
  if (isLoading) {
    console.log('🔄 Loading state...');
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF5884]"></div>
      </div>
    );
  }

  // Check if current route is unrestricted
  const isUnrestricted = UNRESTRICTED_ROUTES.some(route => 
    pathname === route || pathname.startsWith(route + '/')
  );

  // If route is restricted and user is not connected, show access denied
  if (!isUnrestricted && !isConnected) {
    console.log(`🚫 Blocking access to ${pathname} - user not connected`);
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF5884] mx-auto mb-4"></div>
          <p className="text-gray-600">Access denied. Redirecting to connect wallet...</p>
          <button 
            onClick={() => router.push('/frontend/signup/connect_wallet')}
            className="mt-4 px-4 py-2 bg-[#FF5884] text-white rounded-lg hover:bg-[#E04A7A]"
          >
            Go to Connect Wallet
          </button>
        </div>
      </div>
    );
  }

  // Only render children if we should render
  if (!shouldRender) {
    console.log('⏳ Waiting for render permission...');
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF5884]"></div>
      </div>
    );
  }

  console.log(`✅ Rendering content for ${pathname}`);
  return <>{children}</>;
} 