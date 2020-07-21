<template>
  <div class="default-layout">
    <div class="container d-flex justify-content-center align-items-center">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Default'
};
</script>

<style lang="scss" scoped>
.default-layout {
  min-height: 100vh;
  .container {
    min-height: 100vh;
  }
}
</style>
