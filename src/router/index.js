import Cookies from 'js-cookie'
import Vue from 'vue'
import VueRouter from 'vue-router'
import NotFound from '@/components/NotFound.vue'
import defaultLayout from '@/layouts/Default.vue'
import dashboardLayout from '@/layouts/Dashboard.vue'
import axios from 'axios'
Vue.use(VueRouter)

const token = Cookies.get('jwt')
const rawUser = Cookies.get('user')
const user = rawUser ? JSON.parse(rawUser) : null

if (token) {
  // store.commit('ADD NAME', token)
  axios.defaults.headers.common.Authorization = `Bearer ${token}`
}

const routes = [
  {
    path: '*',
    name: 'not-found',
    component: NotFound,
    meta: { layout: defaultLayout },
  },
  {
    path: '/',
    name: 'home',
    component: defaultLayout,
    children: [
      {
        path: 'login',
        name: 'login',
        component: () => import('@/views/Login.vue'),
      },
      {
        path: 'register',
        name: 'register',
        component: () => import('@/views/Pages/Register.vue'),
      },
      {
        path: 'unauthorized',
        name: 'Unauthorized',
        component: () => import('@/views/Pages/Error401.vue'),
      },
    ],
    meta: {
      auth: false,
      role: 'public',
    },
  },

  {
    path: '/basic',
    name: 'authenticated',
    component: dashboardLayout,
    children: [
      {
        path: '',
        name: 'Dashboard',
        component: () => import('@/views/Home.vue'),
      },
      {
        path: 'about',
        name: 'About',
        component: () => import('@/views/About.vue'),
      },
      {
        path: 'pug',
        name: 'Pug',
        component: () => import('@/views/Pug.vue'),
      },
    ],
    meta: {
      auth: true,
      role: 'authenticated',
    },
  },

  {
    path: '/contributor',
    name: 'contributors',
    component: dashboardLayout,
    children: [
      {
        path: 'categories',
        name: 'Categories',
        component: () => import('@/views/Categories.vue'),
      },
      {
        path: 'maplayers',
        name: 'Map Layers',
        component: () => import('@/views/MapLayers.vue'),
      },
      {
        path: 'actions/update',
        name: 'CRUD',
        component: () => import('@/views/CreateUpdateDelete.vue'),
        props: true,
      },
    ],
    meta: {
      auth: true,
      role: 'contributor',
    },
  },

  {
    path: '/admin',
    name: 'administrator',
    component: dashboardLayout,
    children: [
      {
        path: 'users',
        name: 'Users',
        component: () => import('@/views/Home.vue'),
      },
      {
        path: 'about',
        name: 'Permissions',
        component: () => import('@/views/About.vue'),
      },
      {
        path: 'roles',
        name: 'Roles',
        component: () => import('@/views/Pug.vue'),
      },
    ],
    meta: {
      auth: true,
      role: 'administrator',
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
  // const rawUser = Cookies.get('user')
  // const loggedIn = rawUser ? JSON.parse(Cookies.get('user')) : null
  console.log('USER')
  console.log(user)
  if (!authRequired) return next()

  if (authRequired && !user) return next('/login')

  const roleRestriction = to.matched.some((record) => {
    return record.meta.role === user.role.type
  })

  if (!roleRestriction) {
    return next('/unauthorized')
  }
  // Are you contributor or above?
  next()
})

export default router
