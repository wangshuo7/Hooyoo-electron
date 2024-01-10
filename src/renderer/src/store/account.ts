import { defineStore } from 'pinia'

export const useAccountStore = defineStore('account', {
  state: () => ({
    login_active: 'login'
  }),
  actions: {
    setActive(active: string) {
      this.login_active = active
    }
  }
})
