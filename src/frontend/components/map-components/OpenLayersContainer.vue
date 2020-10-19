<template>
  <div id="map">
    <div id="mapRoot" ref="map-root" style="width: 100%; height: 100%">
    </div>
  </div>
</template>

<script>
import Feature from 'ol/Feature';
import View from 'ol/View'
import Map from 'ol/Map'
import TileLayer from 'ol/layer/Tile'
import Point from 'ol/geom/Point';
import OSM from 'ol/source/OSM'
import WebGLPointsLayer from 'ol/layer/WebGLPoints';
import {Vector} from 'ol/source';

require('ol/ol.css');

export default {
  name: 'OpenLayersContainer',
  props: {

  },
  data() {
    return {

    }
  },
  mounted() {
    new Map({
      // the map will be created using the 'map-root' ref
      target: this.$refs['map-root'],
      layers: [
        // adding a background tiled layer
        new TileLayer({
          source: new OSM() // tiles are served by OpenStreetMap
        }),
      ],

      // the map view will initially show the whole world
      view: new View({
        zoom: 0,
        center: [0, 0],
        constrainResolution: true
      }),
    })

  },
}
</script>

<style>

#map {
  height: 600px;
  border: 1px solid #ccc;
}
</style>
