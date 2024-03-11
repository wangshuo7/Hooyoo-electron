import { defineStore } from 'pinia'

export const useAccountStore = defineStore('account', {
  state: () => ({
    login_active: 'login',
    is_login: false
  }),
  actions: {
    setActive(active: string) {
      this.login_active = active
    },
    setIsLogin(active: boolean) {
      this.is_login = active
    }
  }
})
