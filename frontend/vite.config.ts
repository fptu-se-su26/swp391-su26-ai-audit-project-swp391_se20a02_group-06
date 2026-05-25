import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react()],
  base:
    mode === 'production'
      ? '/swp391-su26-ai-audit-project-swp391_se20a02_group-06/'
      : '/',
}))
