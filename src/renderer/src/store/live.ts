import { defineStore } from 'pinia'

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
    }
  }
})
