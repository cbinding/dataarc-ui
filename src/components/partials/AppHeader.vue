<template lang="html">
  <b-navbar
    class="fixed-top"
    toggleable="md"
    type="dark"
    variant="info"
  >
    <div class="text-center navbar-brand-wrapper d-flex align-items-top justify-content-center">
      <a
        class="navbar-brand brand-logo"
        href="/admin"
        style="color:#000000"
      >DataARC</a>
    </div>
    <div class="navbar-menu-wrapper d-flex align-items-center ml-auto ml-lg-0">
      <b-navbar-nav class="header-links d-none d-md-flex">
        <b-nav-item
          v-for="route in adminRoutes"
          :key="route.name"
          :href="'/admin/' + route.path"
        >
          <i class="mdi mdi-image-filter" />{{ route.name }}
        </b-nav-item>
      </b-navbar-nav>
      <!-- Right aligned nav items -->
      <b-navbar-nav class="ml-auto">
        <b-nav-item-dropdown
          right
          class="preview-list"
        >
          <template slot="button-content">
            <!-- <img
              src="../../assets/images/faces/face4.jpg"
              alt="profile image"
              class="img-xs rounded-circle"
            > -->
            <span>{{ user.email }}</span>
          </template>
          <b-dropdown-item
            href="#"
            class="preview-item flex-wrap"
          >
            Profile
          </b-dropdown-item>
          <b-dropdown-item
            href="#"
            class="preview-item flex-wrap"
            @click="handleLogout()"
          >
            Signout
          </b-dropdown-item>
        </b-nav-item-dropdown>
      </b-navbar-nav>
      <button
        class="navbar-toggler navbar-toggler-right align-self-center"
        type="button"
        @click="collapedMobileSidebar()"
      >
        <span class="mdi mdi-menu" />
      </button>
    </div>
  </b-navbar>
</template>

<script lang="js">
import { mapState, mapActions } from 'vuex'

export default {
  name: 'AppHeader',
  computed: {
    ...mapState('account', ['user', 'role']),
    adminRoutes() {
      if (this.role.type !== 'administrator') return []

      return this.$router.options.routes.filter((route) => {
        return route.name === 'administrators'
      })[0].children
    },
  },
  methods: {
    ...mapActions('account', ['login', 'logout']),
    collapedMobileSidebar: () => {
      document.querySelector('.sidebar').classList.toggle('active')
    },
    handleLogout() {
      this.logout()
      this.$router.push('/login')
    },
  },
}
</script>

<style scoped lang="scss">
.app-header {
}
</style>
