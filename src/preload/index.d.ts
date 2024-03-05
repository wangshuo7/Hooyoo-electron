import { ElectronAPI } from '@electron-toolkit/preload'

declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      sendAnchor: (data: any) => void
      mainSendVersion: (Callback: (version) => void) => void
      saveImage: (url: string) => void
      saveImageResult: (callback: (type) => void) => void
      uploadContent: (res: any) => void
      sendMessage: (message: string) => void
      refreshWindow: () => void
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
      startGame: (id, lang, name, key, jm) => void
      startGameFailReply: (callback: () => void) => void
      mainCloseGame: (callback: () => void) => void
      closeGame: () => void
      startLive: (url: string) => void
      mainCloseLive: (callback: () => void) => void
      // startFloat: (res: any) => void
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
      // sendMsgToFloat: (message: string) => void
      checkUpdates: () => void
      printUpdaterMessage: (callback: (res: any) => void) => void
      updateAvailable: (callback: (res: any) => void) => void
      confirmUpdate: () => void
      edownloadProgress: (callback: (res: any) => void) => void
      updateDownloaded: (callback: () => void) => void
      updateNow: () => void
      updateError: (callback: (err: any) => void) => void
      sendAnchorData: (callback: (res: any) => void) => void
      getGift: (callback: (res: any) => void) => void
      getAnchorFail: (callback: (res: any) => void) => void
      rendererCloseGame: () => void
      showNotification: (title: string, body: string) => void
      sendBetaWs: (data: any) => void
      sendLanguage: (id: any) => void
      mainSendLog: (callback: (res: any) => void) => void
      sendBetaObj: (obj: any) => void
    }
  }
}
