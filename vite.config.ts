import { defineConfig, splitVendorChunkPlugin as vendor } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  esbuild: {
    exclude: ['**/*.test.{js,jsx,cjs,mjs,ts,tsx}'],
  },
  build: {
    rollupOptions: {
      external: /^.+\.test\.(js|jsx|cjs|mjs|ts|tsx)$/,
    },
  },
  // optimizeDeps: {
  //   exclude: ['**/*.test.*'],
  // },
  server: {
    open: '/',
  },
  plugins: [
    react({
      babel: {
        // presets: [...],
        // // Your plugins run before any built-in transform (eg: Fast Refresh)
        // plugins: [...],
        // Use .babelrc files
        babelrc: true,
        // // Use babel.config.js files
        // configFile: true,
      },
    }),
    vendor(),
  ],
  resolve: { alias: { '@': '/src' } },
})
