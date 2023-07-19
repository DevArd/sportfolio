'use client'

import { Inter } from 'next/font/google'
import {
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
import { ChakraProvider, } from '@chakra-ui/react';
import { myRainbowKitTheme, sportfolioTheme } from '../utils/sportfolioTheme';
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { infuraProvider } from 'wagmi/providers/infura'
import App from './app';
require("dotenv").config();

library.add(fas)

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Sportfolio',
  description: 'Talent markeplace for investors',
}

const { chains, publicClient } = configureChains(
  [goerli, sepolia, hardhat],
  [
    publicProvider(),
    infuraProvider({ apiKey: `${process.env.INFURA_API_KEY}` }),
  ]
);

const { connectors } = getDefaultWallets({
  appName: 'Sportfolio',
  projectId: '58c04492c719d703985bce45898088b9',
  chains
});

const wagmiConfig = createConfig({
  autoConnect: true,
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
          <RainbowKitProvider chains={chains} theme={myRainbowKitTheme}>
            <ChakraProvider theme={sportfolioTheme}>
              <App>{children}</App>
            </ChakraProvider>
          </RainbowKitProvider>
        </WagmiConfig>
      </body>
    </html>
  )
}

