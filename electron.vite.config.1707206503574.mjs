// electron.vite.config.ts
import { resolve } from "path";
import { defineConfig, externalizeDepsPlugin } from "electron-vite";
import vue from "@vitejs/plugin-vue";
import Path from "path";
var __electron_vite_injected_dirname = "F:\\Forest\\Hooyoo-electron";
var electron_vite_config_default = defineConfig({
  main: {
    publicDir: Path.join(__electron_vite_injected_dirname, "src", "main", "public"),
    plugins: [externalizeDepsPlugin()]
  },
  preload: {
    plugins: [externalizeDepsPlugin()]
  },
  renderer: {
    resolve: {
      alias: {
        "@": resolve("src/renderer/src")
      }
    },
    root: Path.join(__electron_vite_injected_dirname, "src", "renderer"),
    publicDir: Path.join(__electron_vite_injected_dirname, "src", "renderer", "src", "public"),
    server: {
      proxy: {
        "/api": {
          target: "http://box-server.huyouyun.cn",
          changeOrigin: true,
          // 允许跨域
          rewrite: (path) => path.replace(/^\/api/, "")
        }
      }
    },
    plugins: [vue()]
  }
});
export {
  electron_vite_config_default as default
};
