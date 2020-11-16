<template>
  <div
    id="plotly"
    ref="plotly"
    class="d-flex w-100 h-100"
  >
    <div class="position-absolute p-2 text-left" style="top:0;">
      <b-badge v-if="filteredFeatures" variant="danger" class="mr-0" style="border-radius:0px;border-right:#FFFFFF 1px solid">
        {{ filteredFeatures.length }} &nbsp;
      </b-badge>
      <b-badge variant="dark" class="ml-0" style="border-radius:0px;">
        {{ featureCount }} 
        <span v-if="filteredFeatures">
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
      mutedColor: 'rgba(180, 180, 180, 0.2)',
      mainPlotlyReference: 'plotly',
      plotlyInstance: null,
      plotlyData: null,
      colorBins: [],
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
      this.collectColorBins()

      const data = this.plotlyData

      this.filteredFeatures.forEach((value, index) => {
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

              // eventData.points.forEach((pt) => {
              //   vm.colorBins[pt.pointNumber] = data[0].color[pt.pointNumber]
              // })

              // Plotly.restyle(gd, 'marker.color', [vm.colorBins], [0])
            }
          })
          gd.on('plotly_click', (eventData) => {
            if (eventData) {
              // console.log(data);
              // WORKING EXAMPLE BELOW ON HOW TO COLORIZE CHART POINTS
              // var active = [
              //   '5fb05de59966e02a444509dd',
              //   '5faaf29809924644bc92778c',
              //   '5fb05de59966e02a444508dc',
              //   '5faaf29809924644bc927caa',
              //   '5faaf29809924644bc928899',
              //   '5faaf29809924644bc9275b9',
              //   '5faaf29809924644bc9278d8',
              //   '5faaf29809924644bc92830b',
              //   '5faaf29809924644bc9288ba',
              //   '5faac9a794c20d2de0de5c8d',
              //   '5faaf29909924644bc929218',
              //   '5faaf29909924644bc9295d1',
              //   '5faac9a794c20d2de0de5b08',
              //   '5faaf29809924644bc92882b',
              //   '5fb05826d8d8cf26ca190f20',
              //   '5faaf29809924644bc927590',
              //   '5faac9a794c20d2de0de5860',
              //   '5faaf29809924644bc927584',
              //   '5faaf29809924644bc92811f',
              //   '5faaf29809924644bc92844b',
              //   '5faaf29809924644bc927c8f',
              //   '5faaf29809924644bc928c69',
              //   '5faac9a794c20d2de0de6592',
              //   '5faaf29809924644bc927e7f',
              //   '5fb05826d8d8cf26ca190eba',
              //   '5fb05826d8d8cf26ca191152',
              //   '5faac9a794c20d2de0de5af0',
              //   '5fb05826d8d8cf26ca19168f',
              //   '5faac9a794c20d2de0de5fbe',
              //   '5faaf29809924644bc928c31',
              //   '5fb05826d8d8cf26ca1917db',
              //   '5fb05826d8d8cf26ca1917fb',
              //   '5fb05de59966e02a4444fd98',
              //   '5faac9a794c20d2de0de530a',
              //   '5faac9a794c20d2de0de7059',
              //   '5faac9a794c20d2de0de5e6b',
              //   '5faaf29809924644bc927701',
              //   '5faac9a794c20d2de0de6d6e',
              //   '5faac9a794c20d2de0de5da2',
              //   '5faaf29809924644bc927f7f',
              //   '5faaf29809924644bc9286d9',
              //   '5faaf29809924644bc928811',
              //   '5faaf29909924644bc92956d',
              //   '5faac9a894c20d2de0de72e1',
              //   '5fb05826d8d8cf26ca190ebc',
              //   '5fb05de59966e02a4444fef9',
              //   '5faac9a794c20d2de0de55ae',
              //   '5fb05de59966e02a4445009c',
              //   '5fb05de59966e02a44450119',
              //   '5faaf29809924644bc927b2b',
              //   '5faac9a794c20d2de0de54b5',
              //   '5faac9a794c20d2de0de6ff1',
              //   '5faaf29809924644bc928a2b',
              //   '5faaf29809924644bc9285b3',
              //   '5faaf29809924644bc928247',
              //   '5fb05826d8d8cf26ca191390',
              //   '5faac9a794c20d2de0de63e8',
              //   '5faac9a794c20d2de0de609b',
              //   '5faaf29909924644bc92972c',
              //   '5fb05de59966e02a4444ffaa',
              //   '5fb05de59966e02a44450932',
              //   '5faac9a794c20d2de0de5b2d',
              //   '5faac9a794c20d2de0de6551',
              //   '5faac9a794c20d2de0de5fd7',
              //   '5faaf29909924644bc9296cc',
              //   '5fb05826d8d8cf26ca1910e9',
              //   '5fb05826d8d8cf26ca191a4e',
              //   '5faaf29809924644bc9281d3',
              //   '5faaf29909924644bc9296aa',
              //   '5fb05de59966e02a44450695',
              //   '5faaf29809924644bc9286e2',
              //   '5faac9a794c20d2de0de620d',
              //   '5faac9a794c20d2de0de59dd',
              //   '5faaf29809924644bc927cf7',
              //   '5faaf29909924644bc9292fe',
              //   '5faac9a794c20d2de0de595b',
              //   '5faaf29809924644bc9279a8',
              //   '5fb05826d8d8cf26ca191454',
              //   '5faaf29909924644bc929153',
              //   '5faaf29909924644bc9291ac',
              //   '5fb05826d8d8cf26ca191157',
              //   '5faaf29809924644bc927807',
              //   '5fb05de59966e02a444504f5',
              //   '5fb05de59966e02a4444fc88',
              //   '5faac9a794c20d2de0de6fc3',
              //   '5fb05de59966e02a444503c1',
              //   '5faaf29809924644bc928324',
              //   '5fb05de59966e02a44450613',
              //   '5faaf29809924644bc928a58',
              //   '5faac9a794c20d2de0de6407',
              //   '5fb05de59966e02a44450471',
              //   '5fb05826d8d8cf26ca191609',
              //   '5fb05de59966e02a4444fc6b',
              //   '5faaf29809924644bc928989',
              //   '5faaf29809924644bc9286b5',
              //   '5faaf29809924644bc928e91',
              //   '5faaf29909924644bc9296bf',
              //   '5faaf29909924644bc929847',
              //   '5fb05de59966e02a44450139',
              //   '5fb05826d8d8cf26ca191b19'
              // ];
              // // for loop
              // for (let i = 0; i < data[0].ids.length; i++) {
              //   if (!active.includes(data[0].ids[i])) {
              //     data[0].marker.color[i] = 'lightslategray';
              //     data[0].marker.opacity[i] = 0.5;
              //     data[0].marker.size[i] = 3;
              //   }
              // }
              // Plotly.newPlot('plotly', data, layout, config);
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
          console.log(point)
          array.push(point)
        })
      }
      this.$emit('filtered', array)
    },
  },
}
</script>

<style></style>
