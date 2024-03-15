import { defineStore } from 'pinia'

export const useAccountStore = defineStore('account', {
  state: () => ({
    login_active: 'login',
    is_login: false,
    is_update: false,
    oem: {
      guanwang: '',
      hezigonggao: '',
      lianxifangshi: '',
      tiepai_icon: '',
      tiepai_name: ''
    }
  }),
  actions: {
    setActive(active: string) {
      this.login_active = active
    },
    setIsLogin(active: boolean) {
      this.is_login = active
    },
    setOem(data: any) {
      this.oem = data
    },
    setIsUpdate(active: boolean) {
      this.is_update = active
    }
  }
})
