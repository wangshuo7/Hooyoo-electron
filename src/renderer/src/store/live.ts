import { defineStore } from 'pinia'
import { getPersonalInfo } from '../api/wallet'

export const useLiveStore = defineStore('live', {
  state: () => ({
    state: '未开播',
    diamond: ''
  }),
  actions: {
    setState(state: string) {
      this.state = state
    },
    setDiamond(num: any) {
      this.diamond = num
    },
    async getDiamong() {
      const res: any = await getPersonalInfo()
      this.diamond = res.data.one.jifen
    }
  }
})
