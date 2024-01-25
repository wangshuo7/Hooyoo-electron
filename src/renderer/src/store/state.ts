import { defineStore } from 'pinia'

export const useStateStore = defineStore('state', {
  state: () => ({
    state: {
      success: '',
      message: ''
    }
  }),
  actions: {
    setState(res: any) {
      this.state = res
    }
  }
})
