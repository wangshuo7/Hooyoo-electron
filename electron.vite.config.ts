import { resolve } from 'path'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import vue from '@vitejs/plugin-vue'
import Path from 'path'
export default defineConfig({
  main: {
    publicDir: Path.join(__dirname, 'src', 'main', 'public'),
    plugins: [externalizeDepsPlugin()]
  },
  preload: {
    plugins: [externalizeDepsPlugin()]
  },
  renderer: {
    resolve: {
      alias: {
        '@': resolve('src/renderer/src')
      }
    },
    root: Path.join(__dirname, 'src', 'renderer'),
    publicDir: Path.join(__dirname, 'src', 'renderer', 'src', 'public'),
    server: {
      port: 8080
    },
    plugins: [vue()]
  }
})
