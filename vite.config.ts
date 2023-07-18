import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from "@vitejs/plugin-vue-jsx";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(),vueJsx()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./v2', import.meta.url))
    }
  },
  build:{
    outDir:'docs',
  },
  base: './'
})
