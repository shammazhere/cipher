import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Vite configuration for CIPHER SJEC Portal
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: false,
    host: true
  }
});
