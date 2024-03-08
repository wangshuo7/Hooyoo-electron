import { createApp } from 'vue'
import Learn from './Learn.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'

createApp(Learn).use(ElementPlus).mount('#learn')
