import { type Config } from 'tailwindcss'
import defaultTheme from 'tailwindcss/defaultTheme'

export default {
  content: ['./src/**/*.{tsx,ts,js,jsx}'],
  corePlugins: { preflight: false }, // disable global reset to keep Chakra UI styles
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Be Vietnam Pro"', ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [],
} satisfies Config
