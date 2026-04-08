import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/auth':        { target: 'http://148.230.124.150:8080', changeOrigin: true },
      '/students':    { target: 'http://148.230.124.150:8080', changeOrigin: true },
      '/instructors': { target: 'http://148.230.124.150:8080', changeOrigin: true },
      '/lessons':     { target: 'http://148.230.124.150:8080', changeOrigin: true },
      '/exams':       { target: 'http://148.230.124.150:8080', changeOrigin: true },
      '/payments':    { target: 'http://148.230.124.150:8080', changeOrigin: true },
      '/vehicules':   { target: 'http://148.230.124.150:8080', changeOrigin: true },
    },
  },
});
