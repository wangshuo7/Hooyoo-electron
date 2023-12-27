import { createRouter, createWebHashHistory } from 'vue-router'
import Layout from '../views/Layout/index.vue'
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
      },
      {
        path: '/detail/:id',
        name: 'Detail',
        component: () => import('../views/Detail/index.vue')
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

export function useRouter() {
  return router
}
export function useRoute() {
  return router.currentRoute
}
export default router
