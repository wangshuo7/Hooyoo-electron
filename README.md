# Vue3 + Vite + Electron + Element Plus + Webpack

# 注意事项

- node版本推荐使用21.2.0
- 第一次执行 npm install，如失败推荐使用 watt toolkit(steam++)开启加速
- windows端打包不会自增版本号，需手动自增 npm run version -- -z(y,x)

## Recommended IDE Setup

- [VSCode](https://code.visualstudio.com/) + [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) + [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) + [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin)

## Project Setup

### 安装

```bash
$ npm install
```

### 启动开发

```bash
$ npm run dev
```

### 打包
- 需先视情况增加版本号后再执行打包操作
 - 自增修订版本号 npm run version -- -z
 - 自增次版本号 npm run version -- -y
 - 自增主版本号 npm run version -- -x
- 目前暂无后台配置，更新内容需在 component/Update.vue 里手动输入

```bash
# For windows
$ npm run build:win

# For macOS
$ npm run build:mac

# For Linux
$ npm run build:linux
```


