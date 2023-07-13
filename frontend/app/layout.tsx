'use client'

import { Inter } from 'next/font/google'
import {
  mainnet,
  goerli,
  sepolia,
  hardhat
} from 'wagmi/chains';
import '@rainbow-me/rainbowkit/styles.css';
import {
  getDefaultWallets,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import { configureChains, createConfig, WagmiConfig } from 'wagmi';
import { publicProvider } from 'wagmi/providers/public';

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Sportfolio',
  description: 'Talent markeplace for investors',
}

const { chains, publicClient } = configureChains(
  [mainnet, goerli, sepolia, hardhat],
  [
    publicProvider()
  ]
);

const { connectors } = getDefaultWallets({
  appName: 'Sportfolio',
  projectId: '58c04492c719d703985bce45898088b9',
  chains
});

const wagmiConfig = createConfig({
  autoConnect: false,
  connectors,
  publicClient
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width" />
        <title>Sportfolio - Talent markeplace for investors</title>
      </head>
      <body className={inter.className}>
        <WagmiConfig config={wagmiConfig}>
          <RainbowKitProvider chains={chains}>
            {children}
          </RainbowKitProvider>
        </WagmiConfig>
      </body>
    </html>
  )
}
