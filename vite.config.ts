import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Static-only build: `npm run build` emits a fully static site into dist/.
// Nothing here requires a Node/Express server at runtime, so the output can be
// served directly by Cloudflare Pages.
export default defineConfig({
  plugins: [react()],
  build: {
    target: 'es2019',
    outDir: 'dist',
    assetsDir: 'assets',
    cssCodeSplit: true,
    sourcemap: false,
    reportCompressedSize: true,
    rollupOptions: {
      output: {
        // Split vendor code so the initial paint is small and cacheable.
        manualChunks: {
          react: ['react', 'react-dom'],
          motion: ['framer-motion'],
          icons: ['lucide-react'],
        },
      },
    },
  },
});
