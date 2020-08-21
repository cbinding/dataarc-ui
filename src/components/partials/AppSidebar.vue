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
                {{ user ? user.username : '' }}
              </p>
              <p class="designation">
                Role: {{ role ? role.name : '' }}
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
            v-if="route.name !== 'Dataset View'"
            class="nav-link"
            active-class="active"
            :to="route.path"
            exact
          >
            <img
              v-if="route.name !== 'Dataset View'"
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

import roleHandlerMixin from '@/router/role-handler.mixin'

export default {
  name: 'AppSidebar',
  mixins: [roleHandlerMixin],
  data() {
    return {

    }
  },
  computed: {
    compileRoutes() {
      return [...this.contributorRoutes, ...this.authenticatedRoutes]
    },
  },
  mounted() {
  },
}
</script>

<style scoped lang="scss">
.app-sidebar {

}
</style>
