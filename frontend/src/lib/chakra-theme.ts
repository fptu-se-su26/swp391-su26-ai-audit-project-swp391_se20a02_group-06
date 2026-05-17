import { extendTheme, type ThemeConfig } from '@chakra-ui/react'

const config: ThemeConfig = {
  initialColorMode: 'dark',
  useSystemColorMode: false,
}

const theme = extendTheme({
  config,
  colors: {
    surface: {
      base: '#0A0A0A',
      raised: '#111111',
      strong: '#1A1A1A',
    },
    brand: {
      red: '#E03030',
    },
  },
  fonts: {
    heading: `'Be Vietnam Pro', sans-serif`,
    body: `'Be Vietnam Pro', sans-serif`,
  },
  fontSizes: {
    xs: '10px',
    sm: '11px',
    md: '12px',
    lg: '14px',
    xl: '15px',
    '2xl': '16px',
    '3xl': '18px',
    '4xl': '22px',
  },
  radii: {
    xs: '2px',
    sm: '32px',
    md: '9999px',
  },
  styles: {
    global: {
      body: {
        bg: 'surface.base',
        color: 'white',
      },
    },
  },
})

export default theme
