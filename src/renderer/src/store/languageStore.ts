import { defineStore } from 'pinia'

export const useLanguageStore = defineStore('language', {
  state: () => ({
    locale: localStorage.getItem('lang') || 'zh' // zh、en、tw
  }),
  actions: {
    setLocale(newLocale: string) {
      this.locale = newLocale
    }
  }
})
