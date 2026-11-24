import { resolve } from 'path'
import { readFileSync } from 'fs'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

/**
 * Build de la web app (`yarn dev:web` / `yarn build:web`). Comparte el renderer con
 * Electron (ver `electron.vite.config.ts`): mismos alias, mismo `index.html`.
 */
const { version: appVersion } = JSON.parse(readFileSync(resolve('package.json'), 'utf-8')) as {
  version: string
}

export default defineConfig({
  root: resolve('.'),
  base: './',
  resolve: {
    alias: {
      '@': resolve('src'),
      '@shared': resolve('shared')
    }
  },
  define: {
    __APP_VERSION__: JSON.stringify(appVersion)
  },
  plugins: [react()],
  server: { port: 5291, strictPort: true },
  build: {
    outDir: 'dist-web',
    emptyOutDir: true,
    sourcemap: false
  }
})
