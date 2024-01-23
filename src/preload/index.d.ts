import { ElectronAPI } from '@electron-toolkit/preload'

declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      sendMessage: (message: string) => void
      minimize: () => void
      quit: () => void
      maximize: () => void
      reduction: () => void
      updateWinStatus: (callback: (status: boolean) => void) => void
      download: (id, downloadLink) => void
      downloadProgress: (callback: (progress: any) => void) => void
      launchGame: (callback: (id, path) => void) => void
      updateGameStatus: (callback: (id, status) => void) => void
      checkGame: (id, downloadLink: string) => void
      startGame: (id, name) => void
      startGameFailReply: (callback: () => void) => void
      mainCloseGame: (callback: () => void) => void
      closeGame: () => void
      startLive: (url: string) => void
      removeAllListeners: () => void
      openDialog: (type: string, options: any) => void
      getDownloadPath: (path) => void
      getInstallPath: (path) => void
      getPath: () => void
      getPathReply: (callback: (paths: any) => void) => void
      changeStore: (paths) => void
      settingDefault: () => void
      settingDefaultReply: (callback: (paths: any) => void) => void
      checkGameReply: (callback: (id: any) => void) => void
      initGameStatus: (callback: () => void) => void
      sendToken: (token: string) => void
    }
  }
}
