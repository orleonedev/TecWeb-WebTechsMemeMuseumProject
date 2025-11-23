import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // This is needed for Docker to expose the port correctly
    host: '0.0.0.0',
    port: 5173,
  }
})
