"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useAccount, useConnect, useDisconnect } from 'wagmi';

interface AuthContextType {
  isConnected: boolean;
  address: string | undefined;
  isLoading: boolean;
  connect: (connector: any) => Promise<void>;
  disconnect: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { address, isConnected, isConnecting } = useAccount();
  const { connect, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Set loading to false after initial mount and when connection state is stable
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000); // Give wagmi time to initialize

    return () => clearTimeout(timer);
  }, []);

  // Also update loading state when connection state changes
  useEffect(() => {
    if (!isConnecting && !isPending) {
      setIsLoading(false);
    }
  }, [isConnecting, isPending]);

  const handleConnect = async (connector: any) => {
    try {
      setIsLoading(true);
      await connect({ connector });
    } catch (error) {
      console.error('Connection error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisconnect = () => {
    disconnect();
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