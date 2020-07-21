<template>
    <div class="dashboard">
      <Navbar />
      <router-view />
    </div>
  </div>
</template>

<script>
import Navbar from '@/components/Navbar';
export default {
  name: 'Dashboard',
  components: {
    Navbar
  }
};
</script>

<style lang="scss">
.app {
}
</style>
