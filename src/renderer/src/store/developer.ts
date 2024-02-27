import { defineStore } from 'pinia'

export const useDeveloperStore = defineStore('developer', {
  state: () => ({
    is_active: 'login',
    is_login: false
  }),
  actions: {
    setActive(active: string) {
      this.is_active = active
    },
    setLogin(data: boolean) {
      this.is_login = data
    }
  }
})
