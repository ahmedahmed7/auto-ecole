import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/auth':        { target: 'http://localhost:8080', changeOrigin: true },
      '/students':    { target: 'http://localhost:8080', changeOrigin: true },
      '/instructors': { target: 'http://localhost:8080', changeOrigin: true },
      '/lessons':     { target: 'http://localhost:8080', changeOrigin: true },
      '/exams':       { target: 'http://localhost:8080', changeOrigin: true },
      '/payments':    { target: 'http://localhost:8080', changeOrigin: true },
      '/vehicules':   { target: 'http://localhost:8080', changeOrigin: true },
    },
  },
});
