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
      proxy: {
        '/api': {
          target: 'http://test-box-server.huyouyun.cn',
          changeOrigin: true, // 允许跨域
          rewrite: (path) => path.replace(/^\/api/, '')
        }
      }
    },
    plugins: [vue()]
  }
})
