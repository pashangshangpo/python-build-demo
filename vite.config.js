import { join } from 'path'
import { defineConfig } from 'vite'
import { dependencies } from './package.json'

export default defineConfig({
  resolve: {
    alias: {
      '@': join(__dirname, 'lib'),
    }
  },
  build: {
    outDir: 'build',
    lib: {
      entry: './index.mjs',
      formats: ['cjs'],
    },
    minify: 'terser',
    ssr: true,
    terserOptions: {
      compress: false,
      mangle: false
    },
  },
  ssr: {
    noExternal: Object.keys(dependencies)
  },
})
