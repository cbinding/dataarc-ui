<template lang="html">
  <div id="app">
    <router-view />
  </div>
</template>

<script lang="js">
export default {
  name: 'App',
}
</script>

<style>
.text-archaeological {
  color: #6177aa !important;
}
.text-textual {
  color: #fc8d62 !important;
}
.text-environmental {
  color: #66c2a5 !important;
}
.bg-archaeological {
  background-color: #6177aa !important;
}
.bg-textual {
  background-color: #fc8d62 !important;
}
.bg-environmental {
  background-color: #66c2a5 !important;
}
.bg-matched {
  background-color: #f8f9fa !important;
}
.bg-related {
  background-color: #f0f1f4 !important;
}
.bg-contextual {
  background-color: #e8e9ef !important;
}
</style>
