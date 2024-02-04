import { createRouter, createWebHashHistory } from 'vue-router'
import Layout from '../views/Layout/index.vue'
import { isLogin } from '../api/rc4'
const routes = [
  {
    path: '/',
    name: 'Layout',
    component: Layout,
    redirect: '/login',
    children: [
      {
        path: '/mall',
        name: 'Mall',
        component: () => import('../views/Mall/index.vue')
      },
      {
        path: '/library',
        name: 'Library',
        component: () => import('../views/Library/index.vue')
      }
    ]
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login/index.vue')
  }
]
const router = createRouter({
  history: createWebHashHistory(),
  routes
})

router.beforeEach(async (to, _from, next) => {
  const res: any = await isLogin()
  if (to.path === '/login') {
    if (res.code === 200) {
      next('/mall')
    } else {
      next()
    }
  } else {
    if (res.code !== 200) {
      next('/login')
    } else {
      next()
    }
  }
})

export function useRouter() {
  return router
}
export function useRoute() {
  return router.currentRoute
}
export default router
