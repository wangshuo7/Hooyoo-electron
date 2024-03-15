import { createApp } from 'vue'
import App from './App.vue'
import axios from 'axios'
import router from './router' // 引用 router
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
// 引入 vue-toastification
import Toast from 'vue-toastification'
import 'vue-toastification/dist/index.css'
// 引入 Vue3Marquee
import Vue3Marquee from 'vue3-marquee'
import { TostOptions } from './utils/toast'
// 引入 vue-i18n
import i18n from './utils/i18n'
// 引入 pinia
import pinia from './store/store'
import './utils/request'
const app = createApp(App)
app.config.globalProperties.$axios = axios

app
  .use(pinia)
  .use(router)
  .use(Toast, TostOptions)
  .use(Vue3Marquee)
  .use(ElementPlus)
  .use(i18n)
  .mount('#app')
