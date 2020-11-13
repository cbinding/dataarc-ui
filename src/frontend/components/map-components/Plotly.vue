<template>
  <div id="plotly" ref="plotly" class="d-flex w-100 h-100"></div>
</template>

<script>
import Plotly from 'plotly.js-mapbox-dist';

export default {
  mounted() {
    this.loadMap();
  },
  methods: {
    loadMap() {
      const vm = this
      Plotly.d3.csv(`${this.$apiUrl}/query/features`, function(err, rows) {
        function unpack(rows, key) {
          return rows.map(function(row) {
            return row[key];
          });
        }

        var data = [
          {
            type: 'scattermapbox',
            text: unpack(rows, 'title'),
            lon: unpack(rows, 'lon'),
            lat: unpack(rows, 'lat'),
            marker: { color: unpack(rows, 'color'), size: 5 },
            hovertemplate: '%{text}<extra></extra>'
          }
        ];

        var layout = {
          autosize: true,
          dragmode: 'zoom',
          mapbox: {
            style: 'carto-positron',
            center: { lat: 62, lon: -18 },
            zoom: 2
          },
          margin: { r: 0, t: 0, b: 0, l: 0 },
          hoverlabel: {
            font: {
              color: 'white'
            },
            padding: 2,
            bordercolor: 'white'
          }
        };

        var config = {
          // displayModeBar: false
        };

        Plotly.newPlot('plotly', data, layout, config).then(gd => {
          gd.on('plotly_selected', eventData => {
            if (eventData) {
              vm.addSelectionToFilter(eventData)
            }
          });
        });
      });
    },
    addSelectionToFilter(eventData) {
      var type = eventData.range ? 'box' : 'polygon'
      var array = []
      if (type === 'box') {
        array.push(eventData.range.mapbox[0])
        array.push(eventData.range.mapbox[1])
      }
      else {
        eventData.lassoPoints.mapbox.forEach((point) => {
          console.log(point);
          array.push(point)
        })
      }
      this.$emit('filtered', type, array);
    },
  }
};
</script>

<style></style>
