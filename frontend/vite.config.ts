import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { fileURLToPath, URL } from 'node:url'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  server: {
    port: 5173,
    // In development, /api calls go to the NestJS backend
    proxy: {
      '/api': { target: process.env.VITE_DEV_API_TARGET || 'http://localhost:3000', changeOrigin: true },
    },
  },
})
