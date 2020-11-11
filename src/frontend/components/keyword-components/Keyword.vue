<template>
  <div class="container text-center">
    <b-form-input v-model="value" type="text" debounce="500"></b-form-input>
    <!-- <div class="mt-2">Keywords: "{{ value }}"</div> -->
  </div>
</template>

<script>
export default {
  data() {
    return {
      value: ''
    };
  }
};
</script>

<style></style>
