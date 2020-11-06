<template>
  <div id="plotly" ref="plotly">

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
            mapbox: { style: "open-street-map", center: { lat: 62, lon: -18 }, zoom: 2 },
            margin: { r: 0, t: 0, b: 0, l: 0 }
          };

          Plotly.newPlot("plotly", data, layout).then(gd => {
            gd.on('plotly_click', (eventData) => {
              console.log('clicked');
              console.log(eventData);
            })
          })
        }
      )

    }
  }

}
</script>

<style>

</style>
