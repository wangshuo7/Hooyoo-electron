import { createApp } from 'vue'
import App from './App.vue'
import router from './router' // 引用 router
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
// 引入 pinia
import { createPinia } from 'pinia'
// import { isLogin } from './api/rc4'
const pinia = createPinia()
// router.beforeEach(async (to, _from, next) => {
//   const res: any = await isLogin()
//   if (to.path === '/login') {
//     if (res.code === 200) {
//       next('/mall')
//     } else {
//       next()
//     }
//   } else {
//     if (res.code !== 200) {
//       next('/login')
//     } else {
//       next()
//     }
//   }
// })

createApp(App).use(router).use(ElementPlus).use(pinia).mount('#app')
