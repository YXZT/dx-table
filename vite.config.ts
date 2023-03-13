import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import ElementPlus from 'unplugin-element-plus/vite'
const path = require('path')

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(),ElementPlus({
    useSource: true
  })],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  build:{
    outDir:'docs',
    assetsDir:path.resolve(__dirname, './docs'),
  }
})
