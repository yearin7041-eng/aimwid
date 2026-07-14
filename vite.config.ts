import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import {defineConfig, loadEnv} from 'vite';

// GitHub Pages has no SPA fallback: deep links like /aimwid/solution 404 because
// no file exists at that path. Emitting a 404.html copy of index.html makes Pages
// serve the app for any unknown route, and React Router (basename=/aimwid/) then
// renders the correct page client-side.
const spa404Fallback = () => ({
  name: 'spa-404-fallback',
  apply: 'build' as const,
  closeBundle() {
    const dist = path.resolve(__dirname, 'dist');
    const index = path.join(dist, 'index.html');
    if (fs.existsSync(index)) fs.copyFileSync(index, path.join(dist, '404.html'));
  },
});

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');
  return {
    base: '/aimwid/',
    plugins: [react(), tailwindcss(), spa404Fallback()],
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
    },
  };
});
