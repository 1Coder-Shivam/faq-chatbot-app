import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
  },
  preview: {
    host: '0.0.0.0', // ✅ allow external traffic
    port: parseInt(process.env.PORT) || 4173, // ✅ dynamic port
    allowedHosts: ['faq-chatbot-app.onrender.com'],
  }
})
