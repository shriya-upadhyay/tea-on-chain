"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useAccount, useDisconnect } from 'wagmi';

interface AuthContextType {
  isConnected: boolean;
  address: string | undefined;
  isLoading: boolean;
  connect: () => void;
  disconnect: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { address, isConnected } = useAccount();
  const { disconnect: wagmiDisconnect } = useDisconnect();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Set loading to false after initial mount
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleConnect = () => {
    // Dynamic handles connection through its widget
    // This function can be used to trigger the Dynamic modal if needed
  };

  const handleDisconnect = () => {
    wagmiDisconnect();
  };

  const value: AuthContextType = {
    isConnected,
    address,
    isLoading,
    connect: handleConnect,
    disconnect: handleDisconnect,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 