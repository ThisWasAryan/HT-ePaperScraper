import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import https from 'node:https'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: process.env.GITHUB_ACTIONS && !process.env.VERCEL ? '/HT-ePaperScraper/' : '/',
  server: {
    proxy: {
      '/api': {
        target: 'https://epaper.hindustantimes.com',
        changeOrigin: true,
        secure: false,
        agent: new https.Agent({ family: 4 }),
      },
    },
  },
})
