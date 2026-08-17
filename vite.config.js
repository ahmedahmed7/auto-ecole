import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/auth':        { target: 'http://localhsot:8080', changeOrigin: true },
      '/students':    { target: 'http://localhsot:8080', changeOrigin: true },
      '/instructors': { target: 'http://localhsot:8080', changeOrigin: true },
      '/lessons':     { target: 'http://localhsot:8080', changeOrigin: true },
      '/exams':       { target: 'http://localhsot:8080', changeOrigin: true },
      '/payments':    { target: 'http://localhsot:8080', changeOrigin: true },
      '/vehicules':   { target: 'http://localhsot:8080', changeOrigin: true },
    },
  },
});
