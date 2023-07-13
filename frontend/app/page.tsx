"use client"
import { ChakraProvider } from '@chakra-ui/react'

// 1. Import the extendTheme function
import { extendTheme } from '@chakra-ui/react'
import { ConnectButton } from '@rainbow-me/rainbowkit'

// 2. Extend the theme to include custom colors, fonts, etc
const colors = {
  brand: {
    900: '#1a365d',
    800: '#153e75',
    700: '#2a69ac',
  },
}

const theme = extendTheme({ colors })

export default function Home() {
  return (
    <ChakraProvider theme={theme}>
      <main >
        <h1>Hello, Next.js!</h1>
        <ConnectButton />
      </main>
    </ChakraProvider>
  )
}
