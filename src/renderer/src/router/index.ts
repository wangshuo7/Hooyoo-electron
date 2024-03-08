import { createRouter, createWebHashHistory } from 'vue-router'
import Layout from '../views/Layout/index.vue'
import { isLogin } from '../api/rc4'
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
  if (to.path === '/login') {
    next()
    return
  }
  try {
    const res: any = await isLogin()
    if (res.code === 200) {
      next()
    } else {
      next('/login')
    }
  } catch (error) {
    console.error('Error:', error)
    next('/login')
  }
})

export function useRouter() {
  return router
}
export function useRoute() {
  return router.currentRoute
}
export default router
