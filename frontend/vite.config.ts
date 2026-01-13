import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import autoprefixer from 'autoprefixer';
import tailwindcssPlugin from '@tailwindcss/postcss'; 

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173,
  },
  css: {
    postcss: {
      plugins: [
        tailwindcssPlugin(), 
        autoprefixer(),       
      ],
    },
  },
})
