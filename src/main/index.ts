import { app, shell, BrowserWindow, ipcMain, dialog } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import fs from 'fs'
import path from 'path'
import http from 'http'
import AdmZip from 'adm-zip'
import { spawn } from 'child_process'
import Store from 'electron-store'
// let authToken = ''
const store = new Store()
// store.set({
//   downloadPath: path.join(app.getPath('documents'), 'huyouyun_game_download'),
//   installPath: path.join(app.getPath('documents'), 'huyouyun_game_install')
// })
const gameStatus = {}

let mainWindow
function createWindow(): void {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    icon: join(__dirname, '../../public/huyou.ico'),
    // titleBarStyle: 'hidden',
    frame: false,
    titleBarOverlay: {
      color: '#121212',
      symbolColor: '121212',
      height: 60
    },
    width: is.dev ? 1800 : 1060,
    height: 1060,
    minWidth: 1060,
    minHeight: 580,
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

  // 加载首页后再创建窗口, 与mainWindow的show:false属性配合使用
  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.webContents.openDevTools() // 打开开发者工具
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
  // 最小化
  ipcMain.on('minimize', () => {
    mainWindow.minimize()
  })
  // 最大化
  ipcMain.on('maximize', () => {
    mainWindow.maximize()
  })
  // 还原
  ipcMain.on('reduction', () => {
    mainWindow.restore()
  })
  // 在窗口最大化和取消最大化时发送最新的窗口状态
  function sendMaximizeStatus() {
    const isMaximized = mainWindow.isMaximized()
    mainWindow.webContents.send('update-maximize-status', isMaximized)
  }
  // 监听窗口最大化事件
  mainWindow.on('maximize', sendMaximizeStatus)

  // 监听窗口取消最大化事件
  mainWindow.on('unmaximize', sendMaximizeStatus)
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

// 关闭
ipcMain.on('quit', () => {
  app.quit()
})
// 监听下载事件
ipcMain.on('download', (event, id, downloadLink) => {
  const downloadFolderPath = path.join(
    store.get('downloadPath') + '',
    `huyou_game${id}`
  )
  const installFolderPath = path.join(
    store.get('installPath') + '',
    `huyou_game${id}`
  )
  const filePath = path.join(downloadFolderPath, `main.zip`) // 替换为实际的文件名和扩展名
  const extractTo = installFolderPath
  // 创建文件夹
  fs.mkdirSync(downloadFolderPath, { recursive: true })
  // 更新游戏状态为[下载中]
  gameStatus[id] = 'downloading'
  mainWindow.webContents.send('update-game-status', id, gameStatus[id])

  // 下载文件
  const fileStream = fs.createWriteStream(filePath)
  const req = http.get(downloadLink, (response) => {
    const totalSize =
      parseInt(response?.headers['content-length'] + '', 10) || 0
    let downloadedSize = 0

    response.on('data', (chunk) => {
      downloadedSize += chunk.length
      const progress = (downloadedSize / totalSize) * 100 || 0

      // 发送下载进度到渲染进程
      mainWindow.webContents.send('download-progress', { id, progress })
      // 设置任务栏下载进度条
      // mainWindow.setProgressBar(progress / 100)
    })

    response.pipe(fileStream)

    fileStream.on('finish', () => {
      fileStream.close()
      event.reply('download-complete', filePath)
      // 下载完成后，重置任务栏下载进度条
      mainWindow.setProgressBar(-1)
      // 更新游戏状态为[已下载]
      // gameStatus[id] = 'downloaded'
      // 发送游戏状态更新消息到渲染进程
      mainWindow.webContents.send('update-game-status', id, gameStatus[id])
      // 解压文件
      const zip = new AdmZip(filePath)
      zip.extractAllTo(extractTo, true)
      // 更新游戏状态为[已解压]
      gameStatus[id] = 'unzipped'
      // 发送游戏状态更新消息到渲染进程
      mainWindow.webContents.send('update-game-status', id, gameStatus[id])
      // // 检查是否存在任何以 .exe 结尾的文件
      // const exeFiles = fs
      //   .readdirSync(extractTo)
      //   .filter((file) => /\.(exe)$/i.test(file) && !/Unity/i.test(file))

      // if (exeFiles.length > 0) {
      //   console.log('找到 .exe 文件:', exeFiles)
      //   mainWindow.webContents.send('launch-game', id, exeFiles[0])
      // } else {
      //   console.log('未找到 .exe 文件')
      // }
    })
  })
  req.on('error', (err) => {
    console.error(err.message)
    event.reply('download-error', err.message)
    // 下载失败时，重置任务栏下载进度条
    mainWindow.setProgressBar(-1)
    // 更新游戏状态为“下载失败”
    gameStatus[id] = 'download-failed'
    mainWindow.webContents.send('update-game-status', id, gameStatus[id])
  })
})
// 检查游戏是否存在
ipcMain.on('check-game', (event, id: any) => {
  // const gameFolderPath = `D:\\hooyoo\\game${id}`
  const gameFolderPath = path.join(
    store.get('installPath') + '',
    `huyou_game${id}`
  )
  // console.log(1234, gameFolderPath)
  // 先检查是否存在此文件夹
  if (fs.existsSync(gameFolderPath)) {
    // const exeFiles = fs
    //   .readdirSync(gameFolderPath)
    //   ?.filter((file) => file === 'main.exe')
    // if (exeFiles.length > 0) {
    gameStatus[id] = 'unzipped'
    mainWindow.webContents.send('update-game-status', id, gameStatus[id])
    // } else {
    //   event.reply('check-game-reply', id)
    // }
  } else {
    // 不存在文件夹
    event.reply('check-game-reply', id)
  }
})
// 启动项目
ipcMain.on('start-game', (event, id) => {
  // const gameFolderPath = `D:\\hooyoo\\game${id}`
  const gameFolderPath = path.join(
    store.get('installPath') + '',
    `huyou_game${id}`
  )
  const exeFiles = fs
    .readdirSync(gameFolderPath)
    ?.filter((file) => file === 'main.exe')

  if (exeFiles && exeFiles.length > 0) {
    const filePath = path.join(gameFolderPath, exeFiles[0])
    // 启动文件
    // spawn(filePath + ' ' + authToken, [], { detached: true, stdio: 'ignore' })
    spawn(filePath, [], { detached: true, stdio: 'ignore' })
  } else {
    // gameStatus[id] = 'noexist'
    // mainWindow.webContents.send('update-game-status', id, gameStatus[id])
    // console.log('event', event)
    event.sender.removeAllListeners('start-game-fail-reply')
    event.reply('start-game-fail-reply')
  }
})
// 打开对话框
ipcMain.on('open-dialog', (event, type, options) => {
  const selectedPaths: any = dialog.showOpenDialogSync(options)
  // console.log('sssss', selectedPaths)
  if (selectedPaths && type === 'download') {
    return event.reply('download-dialog-selection', selectedPaths[0])
  }
  if (selectedPaths && type === 'install') {
    return event.reply('install-dialog-selection', selectedPaths[0])
  }
})
ipcMain.on('get-paths', (event) => {
  if (!store.get('downloadPath')) {
    store.set(
      'downloadPath',
      path.join(app.getPath('documents'), 'huyouyun_game_download')
    )
  }
  if (!store.get('installPath')) {
    store.set(
      'installPath',
      path.join(app.getPath('documents'), 'huyouyun_game_install')
    )
  }
  const paths = {
    downloadPath: store.get('downloadPath'),
    installPath: store.get('installPath')
  }
  event.reply('get-paths-reply', paths)
})
ipcMain.on('change-store', (event, paths) => {
  store.set({
    downloadPath: paths.downloadPath,
    installPath: paths.installPath
  })
  event.reply('init-game-status')
})
// 恢复默认
ipcMain.on('setting-default', (event) => {
  // store.set({
  //   downloadPath: path.join(app.getPath('documents'), 'huyouyun_game_download'),
  //   installPath: path.join(app.getPath('documents'), 'huyouyun_game_install')
  // })
  const paths = {
    downloadPath: path.join(app.getPath('documents'), 'huyouyun_game_download'),
    installPath: path.join(app.getPath('documents'), 'huyouyun_game_install')
  }
  event.reply('setting-default-reply', paths)
})
// ipcMain.on('send-token', (_event, token: string) => {
//   authToken = token
// })
