import Vue from 'vue'
import VueRouter from 'vue-router'
import LoginComp from '../components/LoginComp.vue'
import HomeComp from '../components/HomeComp.vue'
Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: LoginComp },
  { path: '/home', component: HomeComp }
]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  if (to.path === '/login') return next()
  const tokenStr = sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next()
})

export default router
