<template>
  <b-modal visible @hide="$emit('video-closed')" size="lg" :centered="true" id="video" :hide-footer="true">
    <div class="modal-content" >
      <video :src="require(`../../assets/vid/${fileName}`)" controls />
    </div>
  </b-modal>
</template>

<script>
export default {
  props: {
    fileName: {
      type: [String, Boolean],
      default: false,
    },
  }

}
</script>

<style>

</style>
