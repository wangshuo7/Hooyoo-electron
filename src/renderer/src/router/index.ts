import { createRouter, createWebHashHistory } from 'vue-router'
import Layout from '../views/Layout/index.vue'
// import { isLogin } from '../api/rc4'
// import { useAccountStore } from '../store/account'
// const accountStore = useAccountStore()
const routes = [
  {
    path: '/',
    name: 'Layout',
    component: Layout,
    redirect: '/home',
    children: [
      {
        path: '/mall',
        name: 'Mall',
        component: () => import('../views/Mall/index.vue')
      },
      {
        path: '/home',
        name: 'Home',
        component: () => import('../views/Home/index.vue')
      },
      {
        path: '/learn',
        name: 'Learn',
        component: () => import('../views/Learn/index.vue')
      },
      {
        path: '/develop',
        name: 'Develop',
        component: () => import('../views/Develop/index.vue')
      },
      {
        path: '/library',
        name: 'Library',
        component: () => import('../views/Library/index.vue')
      }
    ]
  }
  // {
  //   path: '/login',
  //   name: 'Login',
  //   component: () => import('../views/Login/index.vue')
  // }
]
const router = createRouter({
  history: createWebHashHistory(),
  routes
})

// router.beforeEach(async (to, _from, next) => {
//   if (to.path === '/login') {
//     next()
//     return
//   }
//   try {
//     const res: any = await isLogin()
//     if (res.code === 200) {
//       // accountStore.setIsLogin(true)
//       localStorage.setItem('is_login', 'true')
//       next()
//     } else {
//       // accountStore.setIsLogin(false)
//       // next('/login')
//       localStorage.setItem('is_login', 'false')
//       next()
//     }
//   } catch (error) {
//     console.error('Error:', error)
//     // next('/login')
//     // accountStore.setIsLogin(false)
//     localStorage.setItem('is_login', 'false')
//     next()
//   }
// })

export function useRouter() {
  return router
}
export function useRoute() {
  return router.currentRoute
}
export default router
