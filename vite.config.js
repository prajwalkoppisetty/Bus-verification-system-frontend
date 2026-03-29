import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import basicSsl from '@vitejs/plugin-basic-ssl'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
    basicSsl()
  ],
  server: {
    host: true, // Listen on all local IPs
    proxy: {
      '/api': {
        target: process.env.VITE_API_BASE_URL || 'https://bus-verification-system-backend.onrender.com',
        changeOrigin: true
      }
    }
  }
})
