import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const api = {
  uploadContent: (res: any) => ipcRenderer.send('upload-content', res),
  sendMessage: (message: string) => ipcRenderer.send('message', message),
  minimize: () => ipcRenderer.send('minimize'), // 最小
  quit: () => ipcRenderer.send('quit'), // 关闭
  maximize: () => ipcRenderer.send('maximize'), // 最大
  reduction: () => ipcRenderer.send('reduction'), // 还原
  updateWinStatus: (callback: (status: boolean) => void) => {
    ipcRenderer.on('update-maximize-status', (_event, status: boolean) => {
      callback(status)
    })
  },
  // 下载
  download: (id, downloadLink) => {
    ipcRenderer.send('download', id, downloadLink)
  },
  // 下载进度
  downloadProgress: (callback: (progress: any) => void) => {
    ipcRenderer.on('download-progress', (_event, progress) => {
      callback(progress)
    })
  },
  launchGame: (callback: (id: any, path: string) => void) => {
    ipcRenderer.on('launch-game', (_event, id, path) => {
      callback(id, path)
    })
  },
  updateGameStatus: (callback: (id, status) => void) => {
    ipcRenderer.on('update-game-status', (_event, id, status) => {
      callback(id, status)
    })
  },
  // 检查游戏是否存在
  checkGame: (id: any, downloadLink: string) =>
    ipcRenderer.send('check-game', id, downloadLink),
  checkGameReply: (callback: (id) => void) => {
    ipcRenderer.on('check-game-reply', (_event, id) => {
      callback(id)
    })
  },
  // 启动游戏
  startGame: (id: any, name: string, key: string) =>
    ipcRenderer.send('start-game', id, name, key),
  startGameFailReply: (callback: () => void) => {
    ipcRenderer.on('start-game-fail-reply', () => {
      callback()
    })
  },
  // 关闭游戏
  closeGame: () => ipcRenderer.send('close-game'),
  mainCloseGame: (callback: () => void) => {
    ipcRenderer.on('main-close-game', () => {
      callback()
    })
  },
  // 启动直播间
  startLive: (url: string) => ipcRenderer.send('start-live', url),
  // 关闭直播间
  mainCloseLive: (callback: () => void) => {
    ipcRenderer.on('main-close-live', () => {
      callback()
    })
  },
  // startFloat: (res: any) => ipcRenderer.send('start-float', res),
  removeAllListeners: () =>
    ipcRenderer.removeAllListeners('start-game-fail-reply'),
  // 打开对话框
  openDialog: (type: string, options: any) =>
    ipcRenderer.send('open-dialog', type, options),
  // 获取下载地址路径
  getDownloadPath: (callback: (path: string) => void) => {
    ipcRenderer.on('download-dialog-selection', (_event, path) => {
      callback(path)
    })
  },
  // 获取安装地址路径
  getInstallPath: (callback: (path: string) => void) => {
    ipcRenderer.on('install-dialog-selection', (_event, path) => {
      callback(path)
    })
  },
  getPath: () => ipcRenderer.send('get-paths'),
  getPathReply: (callback: (paths: any) => void) => {
    ipcRenderer.on('get-paths-reply', (_event, paths) => {
      callback(paths)
    })
  },
  // 修改store
  changeStore: (paths: any) => ipcRenderer.send('change-store', paths),
  // 恢复默认
  settingDefault: () => ipcRenderer.send('setting-default'),
  settingDefaultReply: (callback: (paths: any) => void) => {
    ipcRenderer.on('setting-default-reply', (_event, paths) => {
      callback(paths)
    })
  },
  // 重置游戏状态
  initGameStatus: (callback: () => void) => {
    ipcRenderer.on('init-game-status', () => {
      callback()
    })
  },
  // 发送token
  sendToken: (token: string) => ipcRenderer.send('send-token', token),
  // sendMsgToFloat: (message: string) =>
  //   ipcRenderer.send('send-msg-float', message)
  // 更新
  checkUpdates: () => ipcRenderer.send('check-updates-first'),
  // 打印
  printUpdaterMessage: (callback: (res: any) => void) => {
    ipcRenderer.on('print-updater-message', (_event, res) => {
      callback(res)
    })
  },
  // 有可用更新
  updateAvailable: (callback: (res: any) => void) => {
    ipcRenderer.on('update-available', (_event, res) => {
      callback(res)
    })
  },
  confirmUpdate: () => ipcRenderer.send('confirm-update'),
  edownloadProgress: (callback: (res: any) => void) => {
    ipcRenderer.on('e-download-progress', (_event, res) => {
      callback(res)
    })
  },
  updateDownloaded: (callback: (res: any) => void) => {
    ipcRenderer.on('update-downloaded', (_event, res) => {
      callback(res)
    })
  },
  updateNow: () => ipcRenderer.send('update-now'),
  updateError: (callback: (err: any) => void) => {
    ipcRenderer.on('update-error', (_event, err) => {
      callback(err)
    })
  },
  sendAnchorData: (callback: (res: any) => void) => {
    ipcRenderer.on('send-anchor-data', (_event, res) => {
      callback(res)
    })
  },
  getGift: (callback: (res: any) => void) => {
    ipcRenderer.on('get-gift', (_event, res) => {
      callback(res)
    })
  },
  getAnchorFail: (callback: (res: any) => void) => {
    ipcRenderer.on('get-anchor-fail', (_event, res) => {
      callback(res)
    })
  },
  // 渲染进程关闭游戏
  rendererCloseGame: () => ipcRenderer.send('renderer-close-game'),
  // 显示通知
  showNotification: (title: string, body: string) =>
    ipcRenderer.send('show-notification', title, body),
  // 测试工具
  sendBetaWs: (data: any) => ipcRenderer.send('send-beta-ws', data),
  // 游戏语言
  sendLanguage: (id: any) => ipcRenderer.send('send-language', id)
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
