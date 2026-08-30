import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    esbuild: {
      jsx: 'automatic',
    },
    server: {
      port: 5173,
      proxy: {
        '/api': {
          target: 'http://localhost:5000',
          changeOrigin: true,
        },
      },
    },
    define: {
      // Expose VITE_API_URL to client code (set in Vercel env vars)
      'import.meta.env.VITE_API_URL': JSON.stringify(env.VITE_API_URL || ''),
    },
  };
});
