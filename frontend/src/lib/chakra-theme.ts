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
      raised: '#141414',
      strong: '#1C1C1E',
    },
    brand: {
      red: '#E03030',
      redHover: '#C02A2A',
      border: '#262626',
      text: '#E2E1EB',
      textDim: '#8A8A93',
    },
    // Adding standard gray palette matching the dark obsidian aesthetic
    gray: {
      50: '#F4F4F5',
      100: '#E4E4E7',
      200: '#D4D4D8',
      300: '#A1A1AA',
      400: '#71717A',
      500: '#52525B',
      600: '#3F3F46',
      700: '#27272A',
      800: '#18181B',
      900: '#09090B',
    }
  },
  fonts: {
    heading: `'Be Vietnam Pro', sans-serif`,
    body: `'Be Vietnam Pro', sans-serif`,
  },
  fontSizes: {
    xs: '12px',
    sm: '13px',
    md: '14px',
    lg: '16px',
    xl: '18px',
    '2xl': '22px',
    '3xl': '28px',
    '4xl': '36px',
    '5xl': '48px',
  },
  radii: {
    xs: '4px',
    sm: '8px',
    md: '12px',
    lg: '24px',
    xl: '32px',
    full: '9999px',
  },
  styles: {
    global: {
      body: {
        bg: '#0A0A0A',
        color: '#E2E1EB',
        fontFamily: `'Be Vietnam Pro', sans-serif`,
      },
      '::-webkit-scrollbar': {
        width: '8px',
      },
      '::-webkit-scrollbar-track': {
        background: '#0A0A0A',
      },
      '::-webkit-scrollbar-thumb': {
        background: '#262626',
        borderRadius: '4px',
      },
      '::-webkit-scrollbar-thumb:hover': {
        background: '#333333',
      },
    },
  },
  components: {
    Button: {
      baseStyle: {
        fontWeight: '600',
        borderRadius: 'full',
        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        _active: {
          transform: 'scale(0.98)',
        },
      },
      variants: {
        solid: {
          bg: '#E03030',
          color: 'white',
          _hover: {
            bg: '#C02A2A',
            _disabled: {
              bg: '#E03030',
            },
          },
        },
        outline: {
          borderColor: '#262626',
          color: '#E2E1EB',
          bg: 'transparent',
          _hover: {
            bg: 'rgba(255, 255, 255, 0.05)',
            borderColor: '#333333',
          },
        },
        ghost: {
          color: '#8A8A93',
          _hover: {
            bg: 'rgba(255, 255, 255, 0.05)',
            color: '#E2E1EB',
          },
        },
      },
    },
    Input: {
      parts: ['field'],
      baseStyle: {
        field: {
          bg: '#0A0A0A',
          border: '1px solid',
          borderColor: '#262626',
          borderRadius: 'lg',
          color: '#E2E1EB',
          _placeholder: {
            color: '#8A8A93',
          },
          _hover: {
            borderColor: '#333333',
          },
          _focus: {
            borderColor: '#E03030',
            boxShadow: '0 0 0 1px #E03030',
          },
        },
      },
      sizes: {
        md: {
          field: {
            px: '4',
            py: '3',
            fontSize: 'md',
            h: '11',
          },
        },
      },
      defaultProps: {
        variant: null,
      },
    },
    Checkbox: {
      parts: ['control', 'label'],
      baseStyle: {
        control: {
          borderColor: '#8A8A93',
          borderRadius: 'xs',
          _checked: {
            bg: '#E03030',
            borderColor: '#E03030',
            _hover: {
              bg: '#C02A2A',
              borderColor: '#C02A2A',
            },
          },
          _focus: {
            boxShadow: 'none',
          },
        },
        label: {
          color: '#8A8A93',
          fontSize: 'sm',
        },
      },
    },
  },
})

export default theme
