import { extendTheme } from '@chakra-ui/react'
import { Theme, lightTheme } from '@rainbow-me/rainbowkit';
import merge from 'lodash.merge';
import { defineStyle, defineStyleConfig } from '@chakra-ui/react'

export const colors = {
  brand: {
    background: "#edf2f7",
    primary: "#3b1b63",
    secondary: "#b01926",
    50: "#edf2f7",//"#eeeeee",
    100: "#3b1b63",
    200: "#b01926",
  }
}

const solid = defineStyle({
  background: colors.brand.primary,
  borderRadius: 20,
  color: colors.brand.background,
})

const outline = defineStyle({
  borderColor: colors.brand.secondary,
  background: colors.brand.background,
  borderRadius: 20,
  color: colors.brand.secondary,
})


export const buttonTheme = defineStyleConfig({
  variants: { solid, outline },
})

export const sportfolioTheme = extendTheme({ colors, components: { Button: buttonTheme }, })

export const navMaxHeight = '75px'

export const myRainbowKitTheme = merge(lightTheme(), {
  colors: {
    accentColor: colors.brand.primary,
    accentColorForeground: colors.brand.background
  },
  radii: {
    actionButton: '20px',
    connectButton: '20px',
    menuButton: '20px',
    modal: '20px',
    modalMobile: '20px',
  },
} as Theme);