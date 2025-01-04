'use client';

import * as React from 'react';
import {
  RainbowKitProvider,
  getDefaultWallets,
  getDefaultConfig,
} from '@rainbow-me/rainbowkit';
import {
  trustWallet,
  ledgerWallet,
} from '@rainbow-me/rainbowkit/wallets';
import {
  sepolia,
  baseSepolia,
  arbitrumSepolia,
  optimismSepolia
} from 'wagmi/chains';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider, http, createConfig } from 'wagmi';
import { Provider as JotaiProvider } from 'jotai';
// import according to docs

export const localConfig = createConfig({
  chains: [
    sepolia,
    baseSepolia,
    arbitrumSepolia,
    optimismSepolia
  ],
  transports: {
    [sepolia.id]: http(),
    [baseSepolia.id]: http(),
    [arbitrumSepolia.id]: http(),
    [optimismSepolia.id]: http(),
  },
  ssr: true,
});

const { wallets } = getDefaultWallets();
// initialize and destructure wallets object

const config = getDefaultConfig({
  appName: "ETHUI", // Name your app
  projectId: "4677fc7e8805e5823c3ea097ee4f08a8", // Enter your WalletConnect Project ID here
  wallets: [
    ...wallets,
    {
      groupName: 'Other',
      wallets: [trustWallet, ledgerWallet],
    },
  ],
  chains: [
    sepolia,
    baseSepolia,
    arbitrumSepolia,
    optimismSepolia
  ],
  transports: {
    [sepolia.id]: http(),
    [baseSepolia.id]: http(),
    [arbitrumSepolia.id]: http(),
    [optimismSepolia.id]: http(),
  },
  ssr: true, // Because it is Nextjs's App router, you need to declare ssr as true
});

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <JotaiProvider>
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <RainbowKitProvider>
            {children}
          </RainbowKitProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </JotaiProvider>
  );
}
