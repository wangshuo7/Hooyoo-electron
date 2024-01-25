import { createApp } from 'vue'
import Float from './Float.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
createApp(Float).use(ElementPlus).mount('#float')
