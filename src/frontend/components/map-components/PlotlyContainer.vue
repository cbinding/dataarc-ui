<template>
  <div id="plotly">

  </div>
</template>

<script>
import Plotly from 'plotly.js-mapbox-dist'


export default {
  mounted() {
    this.loadMap()
  },
  methods: {
    loadMap() {
      Plotly.d3.csv(
        "http://localhost:1337/query/features",
        function(err, rows) {
          function unpack(rows, key) {
            return rows.map(function(row) {
              return row[key];
            });
          }

          var data = [
            {
              type: "scattermapbox",
              text: unpack(rows, "id"),
              lon: unpack(rows, "lon"),
              lat: unpack(rows, "lat"),
              marker: { color: unpack(rows, "color"), size: 5},
            }
          ];

          var layout = {
            dragmode: "zoom",
            mapbox: { style: "open-street-map", center: { lat: 38, lon: -90 }, zoom: 3 },
            margin: { r: 0, t: 0, b: 0, l: 0 }
          };

          Plotly.newPlot("plotly", data, layout);
        }
      )
    }
  }

}
</script>

<style>

</style>
