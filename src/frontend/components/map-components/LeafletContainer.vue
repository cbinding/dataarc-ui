<template>
  <div id="map">
    <v-map
      ref="map"
      :max-zoom="15"
      :zoom="2"
    >
      <v-marker-cluster v-if="features">
        <v-marker
          v-for="feature in features"
          :key="feature._id"
          :lat-lng="[feature.latitude, feature.longitude]"
        />
      </v-marker-cluster>
    </v-map>
  </div>
</template>

<script>
import { control as LControl } from 'leaflet'
import { LMap, LMarker, LPopup } from 'vue2-leaflet'
import Vue2LeafletMarkerCluster from 'vue2-leaflet-markercluster'

import baseMaps from './basemaps'

export default {
  components: {
    'v-map': LMap,
    'v-marker': LMarker,
    'v-popup': LPopup,
    'v-marker-cluster': Vue2LeafletMarkerCluster,
  },
  props: {
    features: {
      type: [Boolean, Array],
      default: false,
    },
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
@import "~leaflet/dist/leaflet.css";
@import "~leaflet.markercluster/dist/MarkerCluster.css";
@import "~leaflet.markercluster/dist/MarkerCluster.Default.css";

#map {
  height: 600px;
  border: 1px solid #ccc;
}

.leaflet-control-layers-list{
  text-align: left;
}

/* @import "../../scss/geography.scss"; */
</style>
