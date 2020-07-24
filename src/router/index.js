import Vue from 'vue'
import VueRouter from 'vue-router'
import NotFound from '@/components/NotFound.vue'
import defaultLayout from '@/layouts/Default.vue'
import dashboardLayout from '@/layouts/Dashboard.vue'
import axios from 'axios'
Vue.use(VueRouter)

const token = localStorage.getItem('jwt')
if (token) {
  // store.commit('ADD NAME', token)
  axios.defaults.headers.common.Authorization = `Bearer: ${token}`
}

const routes = [
  {
    path: '*',
    name: 'not-found',
    component: NotFound,
    meta: { layout: defaultLayout },
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/Login.vue'),
    meta: {
      auth: false,
      layout: defaultLayout,
    },
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('@/views/Pages/Register.vue'),
    meta: {
      auth: false,
    },
  },
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/Home.vue'),
    meta: {
      auth: true,
      layout: dashboardLayout,
    },
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('@/views/About.vue'),
    meta: {
      auth: true,
      layout: dashboardLayout,
    },
  },
  {
    path: '/pug',
    name: 'pug',
    component: () => import('@/views/Pug.vue'),
    meta: {
      auth: true,
      layout: dashboardLayout,
    },
  },
  {
    path: '/categories',
    name: 'categories',
    component: () => import('@/views/Categories.vue'),
    meta: {
      auth: true,
      layout: dashboardLayout,
    },
  },
  {
    path: '/maplayers',
    name: 'maplayers',
    component: () => import('@/views/MapLayers.vue'),
    meta: {
      auth: true,
      layout: dashboardLayout,
    },
  },
  {
    path: '/actions/create',
    name: 'create',
    component: () => import('@/views/Create.vue'),
    meta: {
      auth: true,
      layout: dashboardLayout,
    },
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
})

router.beforeEach((to, from, next) => {
  const authRequired = to.matched.some((record) => record.meta.auth)
  const loggedIn = localStorage.getItem('user')

  if (authRequired && !loggedIn) return next('/login')

  next()
})

export default router
