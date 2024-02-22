import { defineStore } from 'pinia'
import { getLanguage, getCategory, getPlatform, getConfig } from '../api/global'

export const useGlobalStore = defineStore('global', {
  state: () => ({
    language: null,
    category: null,
    platform: null,
    ratio: null,
    guildId: ''
  }),
  actions: {
    async setLanguage() {
      const res: any = await getLanguage({})
      this.language = res.data.list
    },
    async setCategory() {
      const res: any = await getCategory({})
      this.category = res.data.list
    },
    async setPlatform() {
      const res: any = await getPlatform({})
      this.platform = res.data.list
    },
    async getRatio() {
      const res: any = await getConfig()
      this.ratio = res?.data?.one?.jifenbili
    },
    setGuildId(id: any) {
      this.guildId = id
    }
  }
})
