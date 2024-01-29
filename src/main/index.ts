import { app, shell, BrowserWindow, ipcMain, dialog } from 'electron'
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
import { rc4Encrypt } from './public/rc4'

// 将 zlib.unzip 转换为 promisify(zlib.unzip)
const unzip = promisify(zlibUnzip)
let authToken = ''

const store = new Store()
// store.set({
//   downloadPath: path.join(app.getPath('documents'), 'huyouyun_game_download'),
//   installPath: path.join(app.getPath('documents'), 'huyouyun_game_install')
// })
const gameStatus = {}
let wsClient: any
let mainWindow: any
let liveRoom: any
let connectKey: string
let gameId: string
let rc4Key: string
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
  const server = new WebSocket.Server({ port: 8080 })
  server.on('connection', (socket) => {
    wsClient = socket
    console.log('Client connected')
    // 监听来自客户端的消息
    socket.on('message', (message) => {
      // console.log(`Received: ${message}`)
      // console.log('bbbbbbbbbbbb', message)

      mainWindow.webContents.send('send-data-ws', JSON.parse(message))

      // 向客户端发送消息
      const rc4Key = md5(`PojieSqj521${gameId}${connectKey}`) + authToken

      console.log(123, JSON.parse(message))

      const danmuJson = {
        hello: 'world'
      }
      // console.log('ahhahaha', message.toString('utf-8'))

      const encrypt = rc4Encrypt(rc4Key, JSON.stringify(danmuJson))
      const bufferData: Buffer = Buffer.from(encrypt, 'hex')

      socket.send(bufferData, {
        binary: true
      })

      // socket.send(rc4Encrypt(rc4Key, JSON.stringify(message)), {
      //   binary: true
      // })
    })

    // 监听连接关闭事件
    socket.on('close', () => {
      console.log('Client disconnected')
    })
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
function sendDanmu(obj) {
  const encrypt = rc4Encrypt(rc4Key, JSON.stringify(obj))
  const bufferData = Buffer.from(encrypt, 'hex')
  return bufferData
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
  if (process.platform !== 'darwin') {
    app.quit()
  }
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
// 启动项目
ipcMain.on('start-game', (event, id, name, key) => {
  gameId = id + ''
  connectKey = key
  rc4Key = md5(`PojieSqj521${gameId}${connectKey}`) + authToken

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
    gameProcess = spawn(filePath, ['-token=' + authToken], {
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
// 打开浮层
// ipcMain.on('start-float', (_event, res) => {
//   console.log(res)
//   floatWin = new BrowserWindow({
//     width: 200,
//     height: 50,
//     frame: false,
//     resizable: false,
//     transparent: true,
//     alwaysOnTop: true,
//     hasShadow: false,
//     skipTaskbar: true,
//     backgroundColor: 'rgba(0, 0, 0, 0.5)',
//     webPreferences: {
//       nodeIntegration: true
//       // devTools: false
//     }
//   })
//   floatWin.webContents.on('did-finish-load', () => {
//     floatWin.webContents.send('upload-content', res)
//   })
//   floatWin.loadFile(join(__dirname, '..', 'renderer', 'float', 'index.html'))
//   floatWin.on('closed', () => {
//     floatWin = null
//   })
//   floatWin.setAlwaysOnTop(true)
//   const mainScreen = screen.getPrimaryDisplay()
//   const { width } = mainScreen.workAreaSize
//   const windowWidth = floatWin.getSize()[0]
//   floatWin.setPosition(Math.floor((width - windowWidth) / 2), 0)
// })
// ipcMain.on('send-msg-float', (_event, message: string) => {
//   if (floatWin) {
//     floatWin.webContents.send('update-content', message)
//   }
// })
// 关闭ws
// function closeWebsocketClient() {
//   wsClient = null
// }
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
  // const res = await isWebSocketServiceAvailable()
  // if (!res) {
  //   return console.log(2222222, res)
  // }

  liveRoom = new BrowserWindow()
  // wsClient = new WebSocket('ws://127.0.0.1:8080')
  // // console.log('wsClient', wsClient)
  // // 监听连接打开事件
  // wsClient.on('open', () => {
  //   // console.log('WebSocket 连接已打开')
  //   // 在连接打开后，发送消息到服务器
  //   const messageToSend = {
  //     type: 'chat',
  //     content: 'Hello, WebSocket Server!'
  //   }

  //   // 将消息对象转为字符串，并发送到服务器
  //   wsClient.send(JSON.stringify(messageToSend))
  // })

  // // 监听接收消息事件
  // wsClient.on('message', () => {
  //   // console.log('收到服务器消息:', data)
  //   // 在这里处理接收到的消息
  //   // 你可以通过 ipcMain 发送消息到渲染进程
  //   // 例如： mainWindow.webContents.send('server-message', data);
  // })

  // // 监听连接关闭事件
  // wsClient.on('close', () => {
  //   // console.log('WebSocket 连接已关闭')
  // })
  liveRoom.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })
  liveRoom.loadURL(url)
  liveRoom.on('closed', () => {
    liveRoom = null
    mainWindow.webContents.send('main-close-live')
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
  liveRoom.webContents.debugger.on('message', (_event, method, params) => {
    if (method === 'Network.webSocketFrameReceived') {
      // console.log(event)
      // 处理 WebSocket 数据接收事件
      const payloadData = params.response.payloadData
      // 在这里处理弹幕数据 payloadData
      // console.log('WebSocket frame received: ', payloadData)
      const buff = Buffer.from(payloadData, 'base64')
      deserializeWebsocketMessage(buff)
      // const pbData = deserializeWebsocketMessage(buff)
      // console.log('--------------------', pbData)
      // liveRoom.webContents.send('danmu-message', payloadData)
    }
  })

  liveRoom.webContents.debugger.sendCommand('Network.enable')
})
ipcMain.on('send-token', (_event, token: string) => {
  authToken = token
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
function pb2json(this: any, pbData: any) {
  try {
    const webcastResponse = deserializeMessage('WebcastResponse', pbData)
    // console.log('消息解码成功')
    webcastResponse.messages
      .filter((x) => x.decodedData)
      .forEach((message) => {
        const simplifiedObj = simplifyObject(message.decodedData)
        // console.log(
        //   'ControlEvents.DECODEDDATA',
        //   message.type,
        //   simplifiedObj,
        //   message.binary
        // )
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
            // console.log('MessageEvents.ROOMUSER', simplifiedObj)
            wsClient?.send(sendDanmu(simplifiedObj), { binary: true })
            break
          case 'WebcastChatMessage':
            //console.log("MessageEvents.CHAT", simplifiedObj);
            // console.log('3', simplifiedObj)
            wsClient?.send(
              sendDanmu(simplifiedObj),
              { binary: true },
              (data) => {
                console.log(3333333, data)
              }
            )
            break
          case 'WebcastMemberMessage':
            //console.log("MessageEvents.MEMBER", simplifiedObj);
            // console.log('1', simplifiedObj)
            wsClient?.send(sendDanmu(simplifiedObj), { binary: true })
            break
          case 'WebcastGiftMessage':
            // Add extended gift info if option enabled //TODO:待修复礼物问题
            /*  if (Array.isArray(this.#availableGifts) && simplifiedObj.giftId) {
                  simplifiedObj.extendedGiftInfo = this.#availableGifts.find((x) => x.id === simplifiedObj.giftId);
                }*/
            //console.log("MessageEvents.GIFT", simplifiedObj);
            // console.log('4', simplifiedObj)
            wsClient?.send(sendDanmu(simplifiedObj), { binary: true })
            break
          case 'WebcastSocialMessage':
            // console.log('MessageEvents.SOCIAL', simplifiedObj)
            if (simplifiedObj.displayType?.includes('follow')) {
              //console.log("CustomEvents.FOLLOW", simplifiedObj);
              // console.log('5', simplifiedObj)
              wsClient?.send(sendDanmu(simplifiedObj), { binary: true })
            }
            if (simplifiedObj.displayType?.includes('share')) {
              // console.log('CustomEvents.SHARE', simplifiedObj)
              wsClient?.send(sendDanmu(simplifiedObj), { binary: true })
            }
            break
          case 'WebcastLikeMessage':
            //console.log("MessageEvents.LIKE", simplifiedObj);
            // console.log('2', simplifiedObj)
            wsClient?.send(sendDanmu(simplifiedObj), { binary: true })
            break
          case 'WebcastQuestionNewMessage':
            // console.log('MessageEvents.QUESTIONNEW', simplifiedObj)
            wsClient?.send(sendDanmu(simplifiedObj), { binary: true })
            break
          case 'WebcastLinkMicBattle':
            // console.log('MessageEvents.LINKMICBATTLE', simplifiedObj)
            wsClient?.send(sendDanmu(simplifiedObj), { binary: true })
            break
          case 'WebcastLinkMicArmies':
            // console.log('MessageEvents.LINKMICARMIES', simplifiedObj)
            wsClient?.send(sendDanmu(simplifiedObj), { binary: true })
            break
          case 'WebcastLiveIntroMessage':
            // console.log('MessageEvents.LIVEINTRO', simplifiedObj)
            wsClient?.send(sendDanmu(simplifiedObj), { binary: true })
            break
          case 'WebcastEmoteChatMessage':
            // console.log('MessageEvents.EMOTE', simplifiedObj)
            wsClient?.send(sendDanmu(simplifiedObj), { binary: true })
            break
          case 'WebcastEnvelopeMessage':
            // console.log('MessageEvents.ENVELOPE', simplifiedObj)
            wsClient?.send(sendDanmu(simplifiedObj), { binary: true })
            break
          case 'WebcastSubNotifyMessage':
            // console.log('MessageEvents.SUBSCRIBE', simplifiedObj)
            wsClient?.send(sendDanmu(simplifiedObj), { binary: true })
            break
        }
      })
  } catch (err) {
    //console.log("消息解码失败");
  }
}
