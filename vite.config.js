import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// La API key NO debe inyectarse en el bundle del navegador.
// Vive solo en el backend (api/chat.js) vía process.env.OPENROUTER_API_KEY.
export default defineConfig({
  plugins: [react()],
})
