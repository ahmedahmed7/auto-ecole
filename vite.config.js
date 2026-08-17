import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/auth':        { target: 'http://186.241.21.210:8080', changeOrigin: true },
      '/students':    { target: 'http://186.241.21.210:8080', changeOrigin: true },
      '/instructors': { target: 'http://186.241.21.210:8080', changeOrigin: true },
      '/lessons':     { target: 'http://186.241.21.210:8080', changeOrigin: true },
      '/exams':       { target: 'http://186.241.21.210:8080', changeOrigin: true },
      '/payments':    { target: 'http://186.241.21.210:8080', changeOrigin: true },
      '/vehicules':   { target: 'http://186.241.21.210:8080', changeOrigin: true },
    },
  },
});
