<template>
  <div
    id="plotly"
    ref="plotly"
    class="w-100 h-100"
  >
    <div class="position-absolute p-2 text-left" style="top:0;">
      <b-badge v-if="filteredFeaturesCount" variant="danger" class="mr-0" style="border-radius:0px;border-right:#FFFFFF 1px solid">
        {{ filteredFeaturesCount }} &nbsp;
      </b-badge>
      <b-badge variant="dark" class="ml-0" style="border-radius:0px;">
        {{ featureCount }}
        <span v-if="filteredFeaturesCount">
          (filtered)
        </span>
        <span v-else>
          total
        </span>
      </b-badge>
    </div>
  </div>
</template>

<script>
import Plotly, { feature } from 'plotly.js-mapbox-dist'

export default {
  props: {
    filteredFeatures: {
      type: [Array, Boolean],
      default: false,
    },
  },
  data() {
    return {
      featureCount: 0,
      mutedColor: 'rgba(180, 180, 180, 0)',
      mainPlotlyReference: 'plotly',
      plotlyInstance: null,
      plotlyData: null,
      colorBins: [],
      filteredFeaturesCount: null,
    }
  },
  watch: {
    filteredFeatures(newValue, oldValue) {
      if (newValue) {
        this.setFilteredFeatures()
      } else {
        this.clearFilteredFeatures()
      }
    },
  },
  mounted() {
    this.collectColorBins()
    this.loadMap()
  },
  methods: {
    collectColorBins() {
      this.colorBins = []
      for (let i = 0; i < this.featureCount; i++) this.colorBins.push(this.mutedColor)
    },
    clearFilteredFeatures() {
      Object.values(this.plotlyData).forEach((value, index) => {
        this.colorBins[value[0]] = value[1]
      })
      Plotly.restyle(this.plotlyInstance, 'marker.color', [this.colorBins], [0])
    },
    setFilteredFeatures() {
      this.filteredFeaturesCount = 0
      this.collectColorBins()

      const data = this.plotlyData

      this.filteredFeatures.forEach((value, index) => {
        const pointById = data[value]
        if (pointById == null) return
        this.filteredFeaturesCount += 1
        const pointLocation = data[value][0]
        const pointColor = data[value][1]
        this.colorBins[pointLocation] = pointColor
      })

      Plotly.restyle(this.plotlyInstance, 'marker.color', [this.colorBins], [0])
    },
    loadMap() {
      const vm = this
      Plotly.d3.csv(`${this.$apiUrl}/query/features`, (err, parsedRows) => {
        const rows = parsedRows.sort((a, b) => {
          const idA = a.id
          const idB = b.id
          if (idA < idB) return -1
          if (idA > idB) return 1
          return 0
        })
        vm.featureCount = rows.length
        vm.collectColorBins()

        function unpack(items, key) {
          return items.map((row) => {
            return row[key]
          })
        }

        const data = [
          {
            type: 'scattermapbox',
            ids: unpack(rows, 'id'),
            text: unpack(rows, 'text'),
            lon: unpack(rows, 'lon'),
            lat: unpack(rows, 'lat'),
            color: unpack(rows, 'color'),
            marker: {
              color: unpack(rows, 'color'),
              opacity: Array(rows.length).fill(0.6),
              size: Array(rows.length).fill(8),
              allowoverlap: true,
            },
            hovertemplate: '%{text}<extra></extra>',
          },
        ]

        const layout = {
          autosize: true,
          dragmode: 'zoom',
          mapbox: {
            style: 'carto-positron',
            center: { lat: 62, lon: -18 },
            zoom: 2,
          },
          margin: {
            r: 0, t: 0, b: 0, l: 0,
          },
          hoverlabel: {
            font: {
              color: 'white',
            },
            padding: 2,
            bordercolor: 'white',
          },
        }

        const config = {
          responsive: true,
          displaylogo: false,
          // displayModeBar: false
        }

        Plotly.newPlot(vm.mainPlotlyReference, data, layout, config).then((gd) => {
          vm.plotlyInstance = gd
          vm.plotlyData = {}
          data[0].ids.forEach((value, index) => {
            vm.plotlyData[value] = [index, data[0].color[index]]
          })

          gd.on('plotly_selected', (eventData) => {
            if (eventData) {
              vm.addSelectionToFilter(eventData)
            }
          })
        })
      })
    },
    addSelectionToFilter(eventData) {
      const type = eventData.range ? 'box' : 'polygon'
      const array = []
      if (type === 'box') {
        const corner1X = eventData.range.mapbox[0][0]
        const corner1Y = eventData.range.mapbox[0][1]
        const corner2X = eventData.range.mapbox[1][0]
        const corner2Y = eventData.range.mapbox[1][1]
        array.push([corner1X, corner1Y])
        array.push([corner2X, corner1Y])
        array.push([corner2X, corner2Y])
        array.push([corner1X, corner2Y])
      } else {
        eventData.lassoPoints.mapbox.forEach((point) => {
          array.push(point)
        })
      }
      this.$emit('filtered', array)
    },
  },
}
</script>

<style></style>
