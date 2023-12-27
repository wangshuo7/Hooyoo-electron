import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const api = {
  sendMessage: (message: string) => ipcRenderer.send('message', message),
  minimize: () => ipcRenderer.send('minimize'), // 最小
  quit: () => ipcRenderer.send('quit'), // 关闭
  maximize: () => ipcRenderer.send('maximize'), // 最大
  reduction: () => ipcRenderer.send('reduction'), // 还原
  updateWinStatus: (callback: (status: boolean) => void) => {
    ipcRenderer.on('update-maximize-status', (_event, status: boolean) => {
      callback(status)
    })
  }
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
