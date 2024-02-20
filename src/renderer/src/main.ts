import { createApp } from 'vue'
import App from './App.vue'
import router from './router' // 引用 router
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
// 引入 vue-i18n
import i18n from './utils/i18n'
// 引入 pinia
import { createPinia } from 'pinia'

const pinia = createPinia()
createApp(App).use(router).use(ElementPlus).use(pinia).use(i18n).mount('#app')
