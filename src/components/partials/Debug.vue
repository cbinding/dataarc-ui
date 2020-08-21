<template lang="html">
  <div class="bg-secondary mt-2 mb-2">
    <pre v-if="$DEBUG.NODE_ENV === 'development'">
      Debug Data:
      <slot />
  </pre>
  </div>
</template>

<script lang="js">
export default {
  name: 'Log',
}
</script>
