<template>
  <div class="container-scroller">
    <app-header />
    <div class="container-fluid page-body-wrapper">
      <app-sidebar />
      <div class="main-panel">
        <div class="content-wrapper">
          <router-view />
        </div>
        <!-- content wrapper ends -->
        <app-footer />
      </div>
      <!-- main panel ends -->
    </div>
    <!-- page-body-wrapper ends -->
  </div>
</template>

<script>
import AppHeader from '@/components/partials/AppHeader'
import AppSidebar from '@/components/partials/AppSidebar'
import AppFooter from '@/components/partials/AppFooter'
export default {
  name: 'Dashboard',
  components: {
    AppHeader,
    AppSidebar,
    AppFooter,
  },
}

</script>

<style lang="scss">
.app {
}
</style>
