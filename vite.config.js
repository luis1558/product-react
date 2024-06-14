import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://sgemvite-back-turso-cqbp8f01j-luis-castanedas-projects-c59586f9.vercel.app/equipos', // URL base del backend
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '/equipos')
      }
    }
  }
});

