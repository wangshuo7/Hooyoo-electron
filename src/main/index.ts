import {
  app,
  shell,
  BrowserWindow,
  ipcMain,
  dialog,
  Notification
} from 'electron'
import { autoUpdater } from 'electron-updater'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import WebSocket from 'ws'
import icon from '../../resources/icon.png?asset'
import fs from 'fs'
import path from 'path'
import http from 'http'
import AdmZip from 'adm-zip'
import { spawn } from 'child_process'
import Store from 'electron-store'
import { simplifyObject } from './lib/webcastDataConverter'
import protobufjs from 'protobufjs'
import { promisify } from 'node:util'
import { unzip as zlibUnzip } from 'node:zlib'
import md5 from 'md5'
import { rc4Encrypt2 } from './public/rc4'
// import log4js from 'log4js'
// log4js.configure({
//   appenders: {
//     file: {
//       type: 'file',
//       filename: 'logs/app.log',
//       maxLogSize: 10485760,
//       backups: 3,
//       compress: true
//     },
//     console: {
//       type: 'console'
//     }
//   },
//   categories: {
//     default: {
//       appenders: ['file', 'console'],
//       level: 'debug'
//     }
//   }
// })
// const logger = log4js.getLogger()

/**
 * electron自动更新
 */
const appVersion = app.getVersion()

autoUpdater.setFeedURL('http://61.160.236.29:886/box/upload/dist')
autoUpdater.autoDownload = false
// 1. 渲染进程App.vue触发获取更新，开始进行更新流程
ipcMain.on('check-updates-first', () => {
  autoUpdater.checkForUpdates()
})
autoUpdater.on('error', (error) => {
  printUpdaterMessage('error')
  mainWindow.webContents.send('update-error', error)
})
// 2. 开始检查是否有更新
autoUpdater.on('checking-for-update', function () {
  printUpdaterMessage('checking')
})
// 3. 有更新时触发
autoUpdater.on('update-available', (info) => {
  printUpdaterMessage('updateAvailable')
  mainWindow.webContents.send('update-available', info)
})
// 7. 收到确认更新提示，执行下载
ipcMain.on('confirm-update', () => {
  autoUpdater.downloadUpdate()
})
autoUpdater.on('update-not-available', () => {
  printUpdaterMessage('updateNotAvailable')
})

// 8. 下载进度，包含进度百分比、下载速度、已下载字节、总字节等
autoUpdater.on('download-progress', (progressObj) => {
  printUpdaterMessage('downloadProgress')
  mainWindow.webContents.send('e-download-progress', progressObj)
})
// 10. 下载完成，是否立即执行更新安装操作
autoUpdater.on('update-downloaded', () => {
  mainWindow.webContents.send('update-downloaded')
  // 12.立即更新安装
  ipcMain.on('update-now', () => {
    autoUpdater.quitAndInstall()
  })
})
function printUpdaterMessage(arg: any) {
  const message = {
    error: '更新出错',
    checking: '正在检查更新',
    updateAvailable: '检测到新版本',
    downloadProgress: '下载中',
    updateNotAvailable: '无新版本'
  }
  mainWindow.webContents.send('print-updater-message', message[arg] ?? arg)
}
// 将 zlib.unzip 转换为 promisify(zlib.unzip)
const unzip = promisify(zlibUnzip)
let authToken = ''

const store = new Store()
// store.set({
//   downloadPath: path.join(app.getPath('documents'), 'huyouyun_game_download'),
//   installPath: path.join(app.getPath('documents'), 'huyouyun_game_install')
// })
const gameStatus = {}
let wsServer: any
let mainWindow: any
let liveRoom: any // 直播间
let connectKey: string
let gameId: string
let rc4Key: string
let lan: any
const default_download_path = path.join(
  app.getPath('documents'),
  'huyouyun_game_download'
)
const default_install_path = path.join(
  app.getPath('documents'),
  'huyouyun_game_install'
)
// let floatWin: any
// function reverseStr(str: string) {
//   return str?.split('')?.reverse()?.join('')
// }
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
    width: is.dev ? 1800 : 1600,
    height: 1000,
    minWidth: 1200,
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
      nodeIntegration: false // 禁用 Node.js 集成，以提高安全性
      // contextIsolation: false // 启用上下文隔离，提高安全性
    }
  })
  const server = new WebSocket.Server({ port: 8080 })
  server.on('connection', (socket: any) => {
    // console.log('socket', socket)
    wsServer = socket
    console.log('Client connected')
    // 监听来自客户端的消息
    socket.on('message', () => {})

    // 监听连接关闭事件
    socket.on('close', () => {
      console.log('Client disconnected')
    })
  })

  // 加载首页后再创建窗口, 与mainWindow的show:false属性配合使用
  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
    mainWindow.webContents.send('main-send-version', appVersion)
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
  // 刷新
  ipcMain.on('refresh', () => {
    mainWindow.reload()
  })
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
  electronApp.setAppUserModelId('com.electron')

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  createWindow()

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
// 保存图片
ipcMain.on('send-image', (_event, url: string) => {
  saveImage(url)
})
function saveImage(url) {
  dialog
    .showSaveDialog({
      defaultPath: url
    })
    .then((result: any) => {
      if (!result.canceled) {
        const fileName = path.basename(result.filePath)
        const file = fs.createWriteStream(result.filePath)
        http
          .get(url, (response) => {
            response.pipe(file)
            file.on('finish', () => {
              file.close(() => {
                console.log(`Image ${fileName} saved successfully`)
                mainWindow.webContents.send('save-image-result', 'success')
              })
            })
          })
          .on('error', (err) => {
            fs.unlink(result.filePath, () => {}) // 删除失败的文件
            console.error('Failed to download the image:', err)
            mainWindow.webContents.send('save-image-result', 'error')
          })
      }
    })
    .catch((err) => {
      console.error('Failed to show save dialog:', err)
    })
}
// 显示通知
ipcMain.on('show-notification', function (_event, head, message) {
  const notification = new Notification({
    title: head,
    body: message,
    silent: true,
    icon: join(__dirname, '../../public/huyou.ico')
  })
  notification.show()
})
ipcMain.on('message', (_event, message) => {
  console.log(message)
})
// 关闭
ipcMain.on('quit', () => {
  app.quit()
})
// 解压
function performPostDownloadOperations(id, filePath, extractTo) {
  gameStatus[id] = 'unzipping'
  mainWindow.webContents.send('update-game-status', id, gameStatus[id])
  // 解压文件
  const zip = new AdmZip(filePath)
  zip.extractAllTo(extractTo, true)

  // 更新游戏状态为[已解压]
  gameStatus[id] = 'unzipped'

  // 发送游戏状态更新消息到渲染进程
  mainWindow.webContents.send('update-game-status', id, gameStatus[id])
}
// 监听下载事件
ipcMain.on('download', (event, id, downloadLink) => {
  // 保存下载地址，以判断是否需要更新
  store.set(`game${id}`, downloadLink)
  // console.log('download', downloadLink)
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
      // 解压
      performPostDownloadOperations(id, filePath, extractTo)
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
ipcMain.on('check-game', (event, id: any, downloadLink: string) => {
  // store里存在此游戏下载地址 并且 保存的下载地址与新传来的下载地址不一样，则需要更新游戏
  if (store.get(`game${id}`) && store.get(`game${id}`) !== downloadLink) {
    gameStatus[id] = 'update'
    return mainWindow.webContents.send('update-game-status', id, gameStatus[id])
  }
  const gameFolderPath = path.join(
    store.get('installPath') + '',
    `huyou_game${id}`
  )
  // 先检查是否存在此文件夹
  if (fs.existsSync(gameFolderPath)) {
    gameStatus[id] = 'unzipped'
    mainWindow.webContents.send('update-game-status', id, gameStatus[id])
  } else {
    // 不存在文件夹
    event.reply('check-game-reply', id)
  }
})
let gameProcess: any
let jiami: any
// 启动项目
ipcMain.on('start-game', (event, id, lang, name, key, jm) => {
  gameId = id + ''
  lan = lang == 'zh' ? '11' : lang == 'en' ? '13' : '39'
  connectKey = key
  rc4Key = md5(`PojieSqj521${gameId}${connectKey}`) + authToken
  jiami = jm
  console.log('jm', jiami)
  // const gameFolderPath = `D:\\hooyoo\\game${id}`
  const gameFolderPath = path.join(
    store.get('installPath') + '',
    `huyou_game${id}`
  )
  const exeFiles = fs
    .readdirSync(gameFolderPath)
    ?.filter((file) => file === name)

  if (exeFiles && exeFiles.length > 0) {
    const filePath = path.join(gameFolderPath, exeFiles[0])
    // 启动文件
    // spawn(filePath + ' ' + authToken, [], { detached: true, stdio: 'ignore' })
    console.log(authToken)
    gameProcess = spawn(filePath, ['-token=' + authToken, '-lan=' + lan], {
      detached: true,
      stdio: 'ignore'
    })
    // 在游戏进程关闭时的处理
    gameProcess.on('close', () => {
      mainWindow.webContents.send('main-close-game')
      if (liveRoom) {
        closeLiveRoom()
        // closeWebsocketClient()
      }

      gameProcess = null // 清空引用
    })
  } else {
    // gameStatus[id] = 'noexist'
    // mainWindow.webContents.send('update-game-status', id, gameStatus[id])
    // console.log('event', event)
    event.sender.removeAllListeners('start-game-fail-reply')
    event.reply('start-game-fail-reply')
  }
})
// 关闭游戏进程
ipcMain.on('close-game', (event) => {
  if (gameProcess) {
    // 发送关闭信号到游戏进程
    gameProcess.kill()
    if (liveRoom) {
      closeLiveRoom()
      // closeWebsocketClient()
      event.reply('close-game-reply', true)
    } else {
      event.reply('close-game-reply', false)
    }
  }
})
// 打开对话框
ipcMain.on('open-dialog', (event, type, options) => {
  const selectedPaths: any = dialog.showOpenDialogSync(options)
  if (selectedPaths && type === 'download') {
    return event.reply('download-dialog-selection', selectedPaths[0])
  }
  if (selectedPaths && type === 'install') {
    return event.reply('install-dialog-selection', selectedPaths[0])
  }
})
ipcMain.on('get-paths', (event) => {
  if (!store.get('downloadPath')) {
    store.set('downloadPath', default_download_path)
  }
  if (!store.get('installPath')) {
    store.set('installPath', default_install_path)
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
    downloadPath: default_download_path,
    installPath: default_install_path
  }
  event.reply('setting-default-reply', paths)
})
ipcMain.on('renderer-close-game', () => {
  if (gameProcess) {
    gameProcess.kill()
  }
  mainWindow.webContents.send('main-close-game')
})

function closeLiveRoom() {
  liveRoom.close()
  mainWindow.webContents.send('main-close-live')
}
// function isWebSocketServiceAvailable() {
//   return new Promise((resolve) => {
//     const testSocket = new WebSocket('ws://localhost:8080')

//     testSocket.on('open', () => {
//       testSocket.close()
//       resolve(true)
//     })

//     testSocket.on('error', () => {
//       resolve(false)
//     })
//   })
// }
// 打开直播间
ipcMain.on('start-live', async (_event, url: string) => {
  liveRoom = new BrowserWindow()
  liveRoom.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })
  liveRoom.loadURL(url)
  liveRoom.webContents.on('dom-ready', () => {
    liveRoom.webContents
      .executeJavaScript(
        `
            const user = JSON.parse(document.getElementById("SIGI_STATE").innerText).LiveRoom.liveRoomUserInfo.user;
            user;
        `
      )
      .then((user) => {
        const info = user
        info['from'] = 'tiktok'
        mainWindow.webContents.send('send-anchor-data', info)
      })
      .catch((error) => {
        console.error('catch error123', error)
      })
  })
  const mouseID = setInterval(() => {
    if (liveRoom) {
      const { width, height } = liveRoom.getBounds()
      const newX = Math.floor(Math.random() * width)
      const newY = Math.floor(Math.random() * height)
      liveRoom.webContents.sendInputEvent({
        type: 'mouseMove',
        x: newX,
        y: newY
      })
    } else {
      // console.log('窗口不存在')
      // 以下代码放到直播间窗口console中运行以测试模拟鼠标位置
      // window.addEventListener('mousemove', (event) => {
      //   console.log('Mouse moved:', event.clientX, event.clientY)
      // })
    }
  }, 10 * 1000)
  liveRoom.on('closed', () => {
    liveRoom = null
    mainWindow.webContents.send('main-close-live')
    clearInterval(mouseID)
    // closeWebsocketClient()
  })
  try {
    liveRoom.webContents.debugger.attach('1.1')
  } catch (err) {
    // console.log('Debugger attach failed: 123456', err)
  }
  liveRoom.webContents.debugger.on('detach', (_event: any, reason: any) => {
    console.log('Debugger detached due to: 123456', reason)
  })
  liveRoom.webContents.debugger.on(
    'message',
    async (_event, method, params) => {
      if (method === 'Network.webSocketFrameReceived') {
        // console.log(event)
        // 处理 WebSocket 数据接收事件
        const payloadData = params.response.payloadData
        // 在这里处理弹幕数据 payloadData
        // console.log('WebSocket frame received: ', payloadData)
        const buff = Buffer.from(payloadData, 'base64')
        deserializeWebsocketMessage(buff)
      }
      if (method === 'Network.responseReceived') {
        //   if (
        //     params.response.url.includes('tiktok.com/webcast/room/enter/?aid=')
        //   ) {
        //     try {
        //       const response = await liveRoom.webContents.debugger.sendCommand(
        //         'Network.getResponseBody',
        //         {
        //           requestId: params.requestId
        //         }
        //       )
        //       const info = JSON.parse(response.body).data.user
        //       info['from'] = 'tiktok'
        //       mainWindow.webContents.send('send-anchor-data', info)
        //       // console.log('tiktok', info)
        //     } catch (error) {
        //       console.error('tiktok error:', error)
        //       mainWindow.webContents.send('get-anchor-fail')
        //       // closeLiveRoom()
        //     }
        //   }
        if (
          params.response.url.includes(
            'douyin.com/webcast/room/web/enter/?aid='
          )
        ) {
          try {
            const response = await liveRoom.webContents.debugger.sendCommand(
              'Network.getResponseBody',
              {
                requestId: params.requestId
              }
            )
            const info = JSON.parse(response.body).data.user
            info['from'] = 'douyin'
            mainWindow.webContents.send('send-anchor-data', info)
            // console.log('douyin', info)
          } catch (error) {
            console.error('douyin error:', error)
            // mainWindow.webContents.send('get-anchor-fail')
            // closeLiveRoom()
          }
        }
      }
    }
  )
  liveRoom.webContents.debugger.sendCommand('Network.enable')
})
ipcMain.on('send-token', (_event, token: string) => {
  authToken = token
})
// 模拟测试
ipcMain.on('send-beta-ws', (_event, data: any) => {
  sendWsData(data)
})
const tiktokSchemaPath = path.resolve(
  __dirname,
  '..',
  '..',
  'public',
  'proto',
  'tiktokSchema.proto'
)
let tiktokSchema: any
const config = {
  skipMessageTypes: []
}
//进行pb数据解析
function loadTikTokSchema() {
  if (!tiktokSchema) {
    tiktokSchema = protobufjs.loadSync(tiktokSchemaPath)
  }
}

async function deserializeWebsocketMessage(binaryMessage: any) {
  if (binaryMessage.length < 2) {
    return
  }
  const decodedWebsocketMessage = deserializeMessage(
    'WebcastWebsocketMessage',
    binaryMessage
  )
  if (decodedWebsocketMessage.type === 'msg') {
    const binary = decodedWebsocketMessage.binary
    if (
      binary &&
      binary.length > 2 &&
      binary[0] === 0x1f &&
      binary[1] === 0x8b &&
      binary[2] === 0x08
    ) {
      decodedWebsocketMessage.binary = await unzip(binary)
      pb2json(decodedWebsocketMessage.binary)
    }
  } else {
    pb2json(decodedWebsocketMessage.binary)
  }
}

function deserializeMessage(protoName, binaryMessage) {
  loadTikTokSchema()
  // console.log(protoName, binaryMessage.length)
  const webcastData = tiktokSchema
    .lookupType(`TikTok.${protoName}`)
    .decode(binaryMessage)
  if (protoName === 'WebcastResponse' && Array.isArray(webcastData.messages)) {
    // Contains different object structures depending on the type field
    webcastData.messages.forEach((message) => {
      if ((config.skipMessageTypes as string[]).includes(message.type)) {
        return
      }
      switch (message.type) {
        case 'WebcastControlMessage':
        case 'WebcastRoomUserSeqMessage':
        case 'WebcastChatMessage':
        case 'WebcastMemberMessage':
        case 'WebcastGiftMessage':
        case 'WebcastSocialMessage':
        case 'WebcastLikeMessage':
        case 'WebcastQuestionNewMessage':
        case 'WebcastLinkMicBattle':
        case 'WebcastLinkMicArmies':
        case 'WebcastLiveIntroMessage':
        case 'WebcastEmoteChatMessage':
        case 'WebcastEnvelopeMessage':
        case 'WebcastSubNotifyMessage':
          message.decodedData = tiktokSchema
            .lookupType(`TikTok.${message.type}`)
            .decode(message.binary)
          break
      }
    })
  }
  return webcastData
}
// 磁盘日志
// function writeToLog(message) {
//   logger.info(message)
// }
// 发给客户端
function sendWsData(data: any) {
  const msgData = JSON.stringify(data)
  const encoder = new TextEncoder()
  const utf8Encoded = encoder.encode(msgData)
  const utf8Buffer = Buffer.from(utf8Encoded)
  if (jiami == 1) {
    // 加密
    wsServer?.send(Buffer.from(rc4Encrypt2(rc4Key, utf8Buffer), 'hex'), {
      binary: true
    })
  } else {
    // 不加密
    wsServer?.send(msgData)
  }
  // 生成日志
  mainWindow.webContents.send('main-send-log', msgData)
}
ipcMain.on('send-beta-obj', (_event, obj: any) => {
  console.log(JSON.parse(obj))
  initGiftData(JSON.parse(obj))
})
// 进房
function initMemberData(obj: any) {
  const send_data = {
    type: 'live_member',
    data: [
      {
        msg_id: obj.msgId,
        nickname: obj.nickname,
        sec_openid: obj.userId,
        avatar_url: obj.userDetails.profilePictureUrls[2],
        timestamp: new Date().getTime()
      }
    ]
  }
  sendWsData(send_data)
}
// 礼物
function initGiftData(obj: any) {
  const giftCount = computedGiftNum(obj)
  const send_data = {
    type: 'live_gift',
    data: [
      {
        msg_id: obj.msgId,
        sec_openid: obj.userId,
        avatar_url: obj.userDetails.profilePictureUrls[2],
        nickname: obj.nickname,
        timestamp: new Date().getTime(),
        sec_gift_id: obj.giftId,
        gift_num: giftCount, // 数量 -> 需要计算
        gift_value: obj.diamondCount * giftCount
      }
    ]
  }
  if (giftCount) {
    sendWsData(send_data)
    mainWindow.webContents.send('get-gift', send_data.data[0])
  }
  // writeToLog(JSON.stringify(obj).toString())
  // writeToLog(JSON.stringify(send_data).toString())
  // writeToLog('==================================')
}
// 分享
function initShareData(obj: any) {
  const send_data = {
    type: 'live_share',
    data: [
      {
        msg_id: obj.msgId,
        sec_openid: obj.userId,
        avatar_url: obj.userDetails.profilePictureUrls[2],
        nickname: obj.nickname,
        timestamp: new Date().getTime()
      }
    ]
  }
  sendWsData(send_data)
}
// 弹幕
function initChatData(obj: any) {
  const send_data = {
    type: 'live_comment',
    data: [
      {
        msg_id: obj.msgId,
        sec_openid: obj.userId,
        content: obj.comment,
        avatar_url: obj.userDetails.profilePictureUrls[2],
        nickname: obj.nickname,
        timestamp: new Date().getTime()
      }
    ]
  }
  // console.log(obj)
  sendWsData(send_data)
}
// 关注
function initFollowData(obj: any) {
  const send_data = {
    type: 'live_follow',
    data: [
      {
        msg_id: obj.msgId,
        sec_openid: obj.userId,
        avatar_url: obj.userDetails.profilePictureUrls[2],
        nickname: obj.nickname,
        timestamp: new Date().getTime()
      }
    ]
  }
  sendWsData(send_data)
}
// 点赞
function initLikeData(obj: any) {
  const send_data = {
    type: 'live_like',
    data: [
      {
        msg_id: obj.msgId,
        nickname: obj.nickname,
        sec_openid: obj.userId,
        avatar_url: obj.userDetails.profilePictureUrls[2],
        like_num: obj.likeCount,
        timestamp: new Date().getTime()
      }
    ]
  }
  sendWsData(send_data)
}

// 计算礼物数量
const filterGift = {}
function computedGiftNum(data: any) {
  const tempId = `${data.userId}_${data.giftId}_${data.groupId}`

  // 第一种情况--高价礼物单点
  if (data.groupId == '0') {
    return data.repeatCount
  }
  console.log(2)
  if (filterGift[tempId]) {
    // 之前记录的比这次大，返回0
    if (data.repeatCount <= filterGift[tempId]) {
      filterGift[tempId] = data.repeatCount
      console.log(4)
      return 0
    }
    // 之前记录过，求差
    const count = data.repeatCount - filterGift[tempId]
    filterGift[tempId] = data.repeatCount
    console.log(5)
    return count
  }
  // 之前没记录过，取值
  console.log(3)
  filterGift[tempId] = data.repeatCount
  return data.repeatCount
}

function pb2json(this: any, pbData: any) {
  try {
    const webcastResponse = deserializeMessage('WebcastResponse', pbData)
    webcastResponse.messages
      .filter((x) => x.decodedData)
      .forEach((message) => {
        const simplifiedObj = simplifyObject(message.decodedData)
        let action
        switch (message.type) {
          case 'WebcastControlMessage':
            // Known control actions:
            // 3 = Stream terminated by user
            // 4 = Stream terminated by platform moderator (ban)
            action = message.decodedData.action
            if ([3, 4].includes(action)) {
              // console.log('ControlEvents.STREAMEND', { action })
              this.disconnect()
            }
            break
          case 'WebcastRoomUserSeqMessage':
            // 前三观众
            break
          case 'WebcastChatMessage':
            // 弹幕信息
            initChatData(simplifiedObj)
            break
          case 'WebcastMemberMessage':
            // 进入直播间（来了）
            initMemberData(simplifiedObj)
            break
          case 'WebcastGiftMessage':
            // 礼物
            initGiftData(simplifiedObj)
            break
          case 'WebcastSocialMessage':
            if (simplifiedObj.displayType?.includes('follow')) {
              // 关注
              initFollowData(simplifiedObj)
            }
            if (simplifiedObj.displayType?.includes('share')) {
              // 分享
              initShareData(simplifiedObj)
            }
            break
          case 'WebcastLikeMessage':
            // 点赞
            initLikeData(simplifiedObj)
            break
          case 'WebcastQuestionNewMessage':
            // 未知
            // console.log('MessageEvents.QUESTIONNEW', simplifiedObj)
            break
          case 'WebcastLinkMicBattle':
            // 未知
            // console.log('MessageEvents.LINKMICBATTLE', simplifiedObj)
            break
          case 'WebcastLinkMicArmies':
            // 未知
            break
          case 'WebcastLiveIntroMessage':
            // 未知
            break
          case 'WebcastEmoteChatMessage':
            // 未知
            break
          case 'WebcastEnvelopeMessage':
            // 未知
            break
          case 'WebcastSubNotifyMessage':
            // 未知
            break
        }
      })
  } catch (err) {
    //console.log("消息解码失败");
  }
}
