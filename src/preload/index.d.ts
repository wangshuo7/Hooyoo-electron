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
    }
  }
}
