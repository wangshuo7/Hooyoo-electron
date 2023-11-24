import { createRouter, createWebHashHistory } from 'vue-router'
import Layout from '../views/Layout/index.vue'
const routes = [
  {
    path: '/',
    name: 'Layout',
    component: Layout
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
