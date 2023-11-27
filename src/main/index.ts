import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'

function createWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    icon: join(__dirname, '../../public/hoo.ico'),
    width: 2000,
    height: 1000,
    show: false, // 窗口是否在创建时显示
    // fullscreen: true, // 窗口是否全屏
    // hasShadow: false, // 窗口阴影
    autoHideMenuBar: true, // 自动隐藏菜单栏
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      // 指定 preload 脚本的路径, preload 脚本在渲染进程运行之前执行
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false, // 禁用沙箱环境，默认为true
      nodeIntegration: false, // 禁用 Node.js 集成，以提高安全性
      contextIsolation: false // 启用上下文隔离，提高安全性
    }
  })
  mainWindow.webContents.openDevTools() // 打开开发者工具

  // 加载首页后再创建窗口, 与mainWindow的show:false属性配合使用
  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  createWindow()

  app.on('activate', function () {
    // 监听 activate 事件，在 macOS 上点击 dock 图标时重新创建窗口
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// 监听 window-all-closed 事件，在所有窗口关闭时退出应用程序
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

ipcMain.on('message', (_event, message) => {
  console.log(message)
})
