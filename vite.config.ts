import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Vite configuration for CIPHER SJEC Portal
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: false,
    host: true
  },
  build: {
    target: 'es2020',
    cssCodeSplit: true,
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom'],
          'vendor-motion': ['framer-motion'],
          'vendor-lenis': ['lenis'],
          'vendor-icons': ['lucide-react']
        }
      }
    }
  }
});

