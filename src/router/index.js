import Vue from 'vue';
import VueRouter from 'vue-router';

import NotFound from '@/components/NotFound.vue';
import defaultLayout from '@/layouts/Default.vue';
import dashboardLayout from '@/layouts/Dashboard.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '*',
    name: 'not-found',
    component: NotFound,
    meta: { layout: defaultLayout }
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/Login.vue'),
    meta: {
      auth: false,
      layout: defaultLayout
    }
  },
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/Home.vue'),
    meta: {
      auth: false,
      layout: dashboardLayout
    }
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('@/views/About.vue'),
    meta: {
      auth: false,
      layout: dashboardLayout
    }
  },
  {
    path: '/pug',
    name: 'pug',
    component: () => import('@/views/Pug.vue'),
    meta: {
      auth: false,
      layout: dashboardLayout
    }
  },
  {
    path: '/categories',
    name: 'categories',
    component: () => import('@/views/Categories.vue'),
    meta: {
      auth: false,
      layout: dashboardLayout
    }
  }
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
});

export default router;
