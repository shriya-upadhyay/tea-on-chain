import { http, createConfig } from "wagmi";
import { mainnet, sepolia } from "wagmi/chains";
import { EthereumWalletConnectors } from '@dynamic-labs/ethereum';
import { DynamicWagmiConnector } from '@dynamic-labs/wagmi-connector';

export const config = createConfig({
  chains: [mainnet, sepolia],
  multiInjectedProviderDiscovery: false, // Dynamic implements this protocol itself
  ssr: true,
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
  },
});

declare module "wagmi" {
  interface Register {
    config: typeof config;
  }
}