import { defineStore } from 'pinia'

export const useAccountStore = defineStore('account', {
  state: () => ({
    login_active: 'login',
    developer_active: 'login',
    developer_login: false
  }),
  actions: {
    setActive(active: string) {
      this.login_active = active
    },
    setDeveloperActive(active: string) {
      this.developer_active = active
    },
    setDeveloperLogin(data: boolean) {
      this.developer_login = data
    }
  }
})
