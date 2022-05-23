import Vue from 'vue'
import VueRouter from 'vue-router'
import LoginComp from '../components/LoginComp.vue'
import HomeComp from '../components/HomeComp.vue'
Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: LoginComp },
  {
    path: '/home',
    component: HomeComp,
    redirect: '/welcome',
    children: [
      { path: '/welcome', component: () => import('../components/WelcomeComp.vue') },
      { path: '/users', component: () => import('../components/user/UserList.vue') },
      { path: '/rights', component: () => import('../components/power/RightsComp.vue') },
      { path: '/roles', component: () => import('../components/power/RolesComp.vue') },
      { path: '/categories', component: () => import('../components/goods/CateComp.vue') },
      { path: '/params', component: () => import('../components/goods/ParamsComp.vue') },
      { path: '/goods', component: () => import('../components/goods/GoodsList.vue') },
      { path: '/goods/add', component: () => import('../components/goods/AddGoods.vue') }
    ]
  }
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
