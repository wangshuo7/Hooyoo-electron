import { createI18n } from 'vue-i18n'

const i18n = createI18n({
  locale: localStorage.getItem('lang') + '',
  // locale: 'zh', // 默认语言
  messages: {
    zh: {
      lang: '中文',
      setting: {
        title: '游戏设置',
        download_url: '下载地址',
        install_url: '安装地址',
        default: '恢复默认'
      },
      buttons: {
        confirm: '确定',
        cancel: '取消',
        modify: '修改'
      }
    },
    en: {
      lang: 'English',
      setting: {
        title: 'GAME SETTINGS',
        download_url: 'Download address',
        install_url: 'Installation address',
        default: 'Restore Default'
      },
      buttons: {
        confirm: 'Confirm',
        cancel: 'Cancel',
        modify: 'Modify'
      }
    },
    tw: {
      lang: '繁体',
      setting: {
        title: '遊戲設置',
        download_url: '下載地址',
        install_url: '安裝地址',
        default: '恢復默認'
      },
      buttons: {
        confirm: '確定',
        cancel: '取消',
        modify: '修改'
      }
    }
  }
})

export default i18n
