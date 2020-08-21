<template lang="html">
  <pre v-if="$DEBUG">
      <slot />
  </pre>
</template>

<script lang="js">
export default {
  name: 'Log',
}
</script>
