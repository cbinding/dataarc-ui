import Cookies from 'js-cookie';
import Vue from 'vue';
import VueRouter from 'vue-router';
import NotFound from '@/components/NotFound.vue';
import defaultLayout from '@/layouts/Default.vue';
import dashboardLayout from '@/layouts/Dashboard.vue';
import axios from 'axios';
import roles from './roles';
Vue.use(VueRouter);

const token = Cookies.get('jwt');
let rawUser = Cookies.get('user');
let user = rawUser ? JSON.parse(rawUser) : null;

if (token) {
  // store.commit('ADD NAME', token)
  axios.defaults.headers.common.Authorization = `Bearer ${token}`;
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
        name: 'blank',
        component: defaultLayout,
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
        path: 'datasets',
        name: 'Datasets',
        component: () => import('@/views/Collections/Datasets.vue'),
        props: true,
        children: [
          {
            path: 'create',
            name: 'Create Dataset',
            component: () =>
              import('@/views/Collections/CreateUpdateDelete.vue'),
            props: true,
          },
        ],
      },
      {
        path: 'combinators',
        name: 'Combinators',
        component: () => import('@/views/Collections/Combinators.vue'),
        props: true,
        children: [
          {
            path: 'create',
            name: 'Create Combinator',
            component: () =>
              import('@/views/Collections/CreateUpdateDelete.vue'),
            props: true,
          },
          {
            path: 'update/:id',
            name: 'Update Combinator',
            component: () =>
              import('@/views/Collections/CreateUpdateDelete.vue'),
            props: true,
          },
        ],
      },
      {
        path: 'dataset/:id',
        name: 'Dataset View',
        component: () => import('@/views/Collections/DatasetView.vue'),
        props: true,
        children: [
          {
            path: 'template',
            name: 'Update Templates',
            component: () => import('@/views/Collections/DatasetTemplates.vue'),
            props: true,
          },
        ],
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
        component: () => import('@/views/Collections/Container.vue'),
        redirect: 'users/index',
        children: [
          {
            path: 'index',
            name: 'View Users',
            component: () => import('@/views/Collections/Users-index.vue'),
          },
          {
            path: 'create',
            name: 'Create User',
            component: () =>
              import('@/views/Collections/CreateUpdateDelete.vue'),
            props: true,
          },
          {
            path: 'update/:id',
            name: 'Update User',
            component: () =>
              import('@/views/Collections/CreateUpdateDelete.vue'),
            props: true,
          },
        ],
      },
      {
        path: 'permissions',
        name: 'Permissions',
        component: () => import('@/views/Collections/Container.vue'),
        redirect: 'permissions/index',
        children: [
          {
            path: 'index',
            name: 'View Users',
            component: () => import('@/views/Collections/Users-index.vue'),
          },
          {
            path: 'create',
            name: 'Create User',
            component: () =>
              import('@/views/Collections/CreateUpdateDelete.vue'),
            props: true,
          },
          {
            path: 'update/:id',
            name: 'Update User',
            component: () =>
              import('@/views/Collections/CreateUpdateDelete.vue'),
            props: true,
          },
        ],
      },
      {
        path: 'roles',
        name: 'Roles',
        component: () => import('@/views/Collections/Roles.vue'),
        children: [
          {
            path: 'update/:id',
            name: 'Update Role',
            component: () => import('@/views/Collections/CreateUpdateDelete'),
            props: true,
          },
        ],
      },
      {
        path: 'map-layers',
        name: 'MapLayers',
        component: () => import('@/views/Collections/MapLayers.vue'),
        props: true,
        children: [
          {
            path: 'create',
            name: 'Create MapLayer',
            component: () =>
              import('@/views/Collections/CreateUpdateDelete.vue'),
            props: true,
          },
          {
            path: 'update/:id',
            name: 'Update MapLayer',
            component: () =>
              import('@/views/Collections/CreateUpdateDelete.vue'),
            props: true,
          },
        ],
      },
      {
        path: 'categories',
        name: 'Categories',
        component: () => import('@/views/Collections/Categories.vue'),
        props: true,
        children: [
          {
            path: 'create',
            name: 'Create Category',
            component: () =>
              import('@/views/Collections/CreateUpdateDelete.vue'),
            props: true,
          },
          {
            path: 'update/:id',
            name: 'Update Category',
            component: () =>
              import('@/views/Collections/CreateUpdateDelete.vue'),
            props: true,
          },
        ],
      },
    ],
    meta: {
      auth: true,
      role: 'administrator',
    },
  },
];

const router = new VueRouter({
  mode: 'history',
  routes,
});

router.beforeEach((to, from, next) => {
  if (to.name === 'home' && !user) return next('/login');
  if (to.name === 'home' && user) return next('/basic/home');

  const authRequired = to.matched.some((record) => record.meta.auth);
  // const rawUser = Cookies.get('user')
  // const loggedIn = rawUser ? JSON.parse(Cookies.get('user')) : null

  if (!authRequired) return next();

  if (authRequired && !user) {
    rawUser = Cookies.get('user');
    user = rawUser ? JSON.parse(rawUser) : null;
    if (!user) return next('/login');
  }

  const roleRestriction = to.matched.some((record) => {
    return roles[record.meta.role] >= roles[user.role.type];
  });

  if (!roleRestriction) {
    return next('/unauthorized');
  }
  // Are you contributor or above?
  next();
});

export default router;
