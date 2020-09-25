<template>
  <div id="map">
    <v-map
      ref="map"
      :max-zoom="15"
      :zoom="2"
    />
  </div>
</template>

<script>

import { control as LControl } from 'leaflet'
import { LMap } from 'vue2-leaflet'
import baseMaps from './basemaps'


export default {
  components: {
    'v-map': LMap,
  },
  data() {
    return {
      baseMaps,
      mapObject: null,
      baseMapGroup: [],
      defaultBaseMap: 'ESRI Topographic',
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.mapObject = this.$refs.map.mapObject
      this._initMap()
    })
  },
  methods: {
    _initMap() {
      this._initBaseMaps()
      this._setupMapControls()
      this.$emit('map-ready', this.mapObject)
    },
    _initBaseMaps() {
      this.mapObject.addLayer(this.baseMaps[this.defaultBaseMap])
    },
    _setupMapControls(map) {
      const controlLayers = LControl.layers(this.baseMaps)
      this.mapObject.addControl(controlLayers)
    },
  },
}
</script>

<style>

@import '../../../../node_modules/leaflet/dist/leaflet.css';
@import '../../scss/geography.scss';

</style>
