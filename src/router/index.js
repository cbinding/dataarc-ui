import Vue from 'vue';
import VueRouter from 'vue-router';

import NotFound from '@/components/NotFound.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '*',
    name: 'login',
    component: () => import('@/views/Login.vue')
  },
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/Home.vue'),
    meta: {
      auth: false
    }
  },
  {
    path: '/pug',
    name: 'pug',
    component: () => import('@/views/Pug.vue'),
    meta: {
      auth: false
    }
  },
  {
    path: '/categories',
    name: 'categories',
    component: () => import('@/views/Categories.vue'),
    meta: {
      auth: false
    }
  }
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
});

export default router;
