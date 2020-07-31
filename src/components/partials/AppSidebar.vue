<template lang="html">
  <section class="app-sidebar">
    <nav
      id="sidebar"
      class="sidebar sidebar-offcanvas"
    >
      <ul class="nav">
        <li class="nav-item nav-profile">
          <div class="nav-link">
            <div class="profile-name">
              <p class="name">
                {{ user.username }}
              </p>
              <p class="designation">
                Role: {{ role.name }}
              </p>
            </div>
          </div>
        </li>
        <li
          v-for="route in compileRoutes"
          :key="route.name"
          class="nav-item"
        >
          <router-link
            class="nav-link"
            active-class="active"
            :to="route.path"
            exact
          >
            <img
              class="menu-icon"
              src="../../assets/images/menu_icons/01.png"
              alt="menu icon"
            ><span class="menu-title">{{ route.name }}</span>
          </router-link>
        </li>
      </ul>
    </nav>
  </section>
</template>

<script lang="js">

import { mapState } from 'vuex'

export default {
  name: 'AppSidebar',
  data() {
    return {

    }
  },
  computed: {
    ...mapState('account', ['user', 'role']),
    contributorRoutes() {
      return this.mapRoutes('contributor')
    },
    authenticatedRoutes() {
      return this.mapRoutes('administrator')
    },
    compileRoutes() {
      return [...this.contributorRoutes, ...this.authenticatedRoutes]
    },
  },
  mounted() {
    // console.log(this.user)
  },
  methods: {
    mapRoutes(roleValue) {
      if (this.role.type !== roleValue) return []
      const paths = this.$router.options.routes.filter((route) => {
        return route.name === roleValue
      })[0]
      if (paths.length > 0) {
        return paths[0].children.map((route) => {
          return { path: `${paths.path}/${route.path}`, name: route.name }
        })
      }
      return []
    },
  },
}
</script>

<style scoped lang="scss">
.app-sidebar {

}
</style>
