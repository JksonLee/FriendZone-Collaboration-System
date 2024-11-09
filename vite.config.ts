import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],

  // vite.config.ts or vite.config.js
  server: {
    host: '0.0.0.0',  // Makes the app accessible on all local network devices
    port: 5173,       // Optional: You can change the port if needed
  }
})