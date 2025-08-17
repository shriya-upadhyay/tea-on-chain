import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { isEthereumWallet } from "@dynamic-labs/ethereum";
import { PublicClient, WalletClient } from "viem";

export const usePublicClient = (): PublicClient | null => {
  const { primaryWallet } = useDynamicContext();
  
  if (!primaryWallet || !isEthereumWallet(primaryWallet)) {
    return null;
  }

  // Note: This is a hook that returns a function, not the actual client
  // The actual client needs to be fetched when needed
  return null;
};

export const useWalletClient = (): WalletClient | null => {
  const { primaryWallet } = useDynamicContext();
  
  if (!primaryWallet || !isEthereumWallet(primaryWallet)) {
    return null;
  }

  // Note: This is a hook that returns a function, not the actual client
  // The actual client needs to be fetched when needed
  return null;
};

export const getPublicClient = async (primaryWallet: any): Promise<PublicClient | null> => {
  if (!primaryWallet || !isEthereumWallet(primaryWallet)) {
    return null;
  }

  try {
    return await primaryWallet.getPublicClient();
  } catch (error) {
    console.error('Error getting public client:', error);
    return null;
  }
};

export const getWalletClient = async (primaryWallet: any): Promise<WalletClient | null> => {
  if (!primaryWallet || !isEthereumWallet(primaryWallet)) {
    return null;
  }

  try {
    return await primaryWallet.getWalletClient();
  } catch (error) {
    console.error('Error getting wallet client:', error);
    return null;
  }
};

export const useClients = () => {
  const { primaryWallet } = useDynamicContext();
  
  const getPublicClientAsync = async () => {
    if (!primaryWallet || !isEthereumWallet(primaryWallet)) {
      return null;
    }
    return await getPublicClient(primaryWallet);
  };

  const getWalletClientAsync = async () => {
    if (!primaryWallet || !isEthereumWallet(primaryWallet)) {
      return null;
    }
    return await getWalletClient(primaryWallet);
  };

  return {
    primaryWallet,
    isEthereumWallet: primaryWallet ? isEthereumWallet(primaryWallet) : false,
    getPublicClient: getPublicClientAsync,
    getWalletClient: getWalletClientAsync,
  };
};

// Main hook for getting both clients - this is the recommended approach
export const useWalletClients = () => {
  const { primaryWallet } = useDynamicContext();
  
  if (!primaryWallet || !isEthereumWallet(primaryWallet)) {
    return {
      primaryWallet: null,
      isEthereumWallet: false,
      getPublicClient: null,
      getWalletClient: null,
    };
  }

  const getPublicClientAsync = async (): Promise<PublicClient | null> => {
    try {
      return await primaryWallet.getPublicClient();
    } catch (error) {
      console.error('Error getting public client:', error);
      return null;
    }
  };

  const getWalletClientAsync = async (): Promise<WalletClient | null> => {
    try {
      return await primaryWallet.getWalletClient();
    } catch (error) {
      console.error('Error getting wallet client:', error);
      return null;
    }
  };

  return {
    primaryWallet,
    isEthereumWallet: true,
    getPublicClient: getPublicClientAsync,
    getWalletClient: getWalletClientAsync,
  };
};
