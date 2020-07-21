import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'Dashboard',
      component: () =>
        import(/* webpackChunkName: "dashboard" */ './pages/Dashboard.vue'),
      props: true,
      meta: {
        secure: false,
        layout: 'dashboard'
      }
    },
    {
      path: '/login',
      name: 'Login',
      component: () =>
        import(/* webpackChunkName: "login" */ './pages/Login.vue'),
      props: true,
      meta: {
        secure: false,
        layout: 'landing'
      }
    },
    {
      path: '/datasets',
      name: 'Datasets',
      component: () =>
        import(
          /* webpackChunkName: "datasets" */ './components/datasets/Datasets.vue'
        ),
      props: true,
      meta: {
        secure: false,
        layout: 'dashboard'
      }
    },
    {
      path: '/profie',
      name: 'Profile',
      component: () =>
        import(
          /* webpackChunkName: "profile" */ './components/auth/Profile.vue'
        ),
      props: true,
      meta: {
        secure: true,
        layout: 'dashboard'
      }
    }
  ]
});
