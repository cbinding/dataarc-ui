<template>
  <div
    id="timeline"
    ref="timeline"
    class="timeline-container"
  >
    <div
      v-show="!loaded"
      class="loader h-100 justify-content-center align-items-center"
    >
      <h1><span class="fa fa-cog fa-spin fa-2x" /></h1>
    </div>
    <timeline-svg
      v-for="timeline in timelines"
      v-show="loaded"
      :key="timeline.id"
      :items="timeline"
      :rect-height="realRectHeight"
    />
  </div>
</template>

<script>

import * as d3api from 'd3'
import * as d3Selection from 'd3-selection'

import TimelineSvg from './TimelineSvg.vue'
const d3 = {
  ...d3api, ...d3Selection,
}

const category_colors = ['#6177aa', '#fc8d62', '#66c2a5', '#54278f', '#a63603']

export default {
  name: 'Timeline',
  components: {
    TimelineSvg,
  },
  props: {
    width: {
      type: Number,
      default: 1000,
    },
    height: {
      type: Number,
      default: 200,
    },
    timelineBase: {
      type: Number,
      default: -7000,
    },
  },
  data() {
    return {
      loaded: false,
      categories: [
        {
          id: 1, key: 'ARCHAEOLOGICAL', label: 'Archaeological', color: category_colors[0],
        },
        {
          id: 2, key: 'TEXTUAL', label: 'Textual', color: category_colors[1],
        },
        {
          id: 3, key: 'ENVIRONMENTAL', label: 'Environmental', color: category_colors[2],
        },
      ],
      svg: null,
      labels: null,
      timelines: {},
      ranges: { millennium: 1000, century: 100, decade: 10 },
      rangeCount: 10,
      opacities: [0.25, 0.5, 0.75, 1.0],
      buckets: 5,
      sampleTimelineData: [
        {
          category: 'ARCHAEOLOGICAL',
          counts: [
            {
              period: -2000,
              count: 20,
            },
            {
              period: -1000,
              count: 45,
            },
            {
              period: 0,
              count: 3,
            },
            {
              period: 1000,
              count: 24,
            },
            {
              period: 2000,
              count: 87,
            },
            {
              period: -6000,
              count: 6,
            },
            {
              period: -5000,
              count: 567,
            },
            {
              period: -4000,
              count: 620,
            },
          ],
        },
        {
          category: 'TEXTUAL',
          counts: [
            {
              period: -2000,
              count: 20,
            },
            {
              period: -1000,
              count: 45,
            },
            {
              period: 0,
              count: 3,
            },
            {
              period: 1000,
              count: 24,
            },
            {
              period: 2000,
              count: 87,
            },
            {
              period: -6000,
              count: 6,
            },
            {
              period: -5000,
              count: 567,
            },
            {
              period: -4000,
              count: 620,
            },
          ],
        },
        {
          category: 'ENVIRONMENTAL',
          counts: [
            {
              period: -2000,
              count: 20,
            },
            {
              period: -1000,
              count: 45,
            },
            {
              period: 0,
              count: 3,
            },
            {
              period: 1000,
              count: 24,
            },
            {
              period: 2000,
              count: 87,
            },
            {
              period: -6000,
              count: 6,
            },
            {
              period: -5000,
              count: 567,
            },
            {
              period: -4000,
              count: 620,
            },
          ],
        },
      ],
      // timelineData: {
      //   ARCHAEOLOGICAL: {
      //     millennium: {
      //       '-5000': 4,
      //       '-1000': 2,
      //       '1000': 4,
      //       '2000': 5,
      //       '4000': 6,
      //     },
      //     century: {
      //       '-500': 4,
      //       '-100': 2,
      //       '100': 4,
      //       '200': 5,
      //       '400': 6,
      //     },
      //   },
      //   TEXTUAL: {
      //     millennium: {
      //       '-5000': 4,
      //       '-1000': 2,
      //       '1000': 4,
      //       '2000': 5,
      //       '4000': 6,
      //     },
      //     century: {
      //       '-100': 4,
      //       '-500': 2,
      //       '100': 4,
      //       '200': 5,
      //       '400': 6,
      //     },
      //     decade: {
      //       '-10': 4,
      //       '-50': 2,
      //       '10': 4,
      //       '20': 5,
      //       '40': 6,
      //     },
      //   },
      //   ENVIRONMENTAL: {
      //     millennium: {
      //       '-4000': 4,
      //       '-1000': 10,
      //       '1000': 3,
      //       '2000': 76,
      //     },
      //     decade: {
      //       '-10': 4,
      //       '-50': 2,
      //       '10': 4,
      //       '20': 5,
      //       '40': 6,
      //     },
      //   },
      // },
    }
  },
  computed: {
    realRectHeight() {
      return (90 / this.categories.length)
    },
  },
  mounted() {
    this
    .getTimelineDataByPeriod(
      this.initialPeriod,
      this.initialStartDate,
    )
    .then(({ data }) => {
      this.timelines[this.initialPeriod] = this.parseData(data)
      this.timelines[this.initialPeriod].loaded = true
    })
  },
  methods: {
    getTimelineDataByPeriod(period, startDate) {
      return Promise((resolve, reject) => {
        setTimeout(() => {
          console.log({ startDate })
          // This will need to be changed
          // Here just imitating a wait on the return
          resolve(
            this.parseData(period, startDate, this.sampleTimelineData),
          )
        }, 250)
      })
    },
    parseData(period, startDate, dataFromApi) {
      const labels = []
      const buckets = []
      const values = []
      const step = this.ranges[period]
      for

      const categories = Object.keys(this.timelineData)
      categories.forEach((category) => {
        if (Object.prototype.hasOwnProperty.call(timelineData, period)) {
          parsedData.values.push(timelineData[period])
        }
      })
    },
    collectTimeLineData(category) {
      const parsedData = {
        labels: {},
        values: [],
      }

      const collectedEntries = []
      let values = []

      //   this.categories.forEach((category) => {
      for (let i = 0; i < this.rangeCount; i++) {
        // const id = i + 1
        // const period = `${i * this.ranges[this.categoryType] + this.timelineBase}`
        // parsedData.labels[i] = { id, key: period, label: period }

        // Get the value
        let value = 0
        if (this.timelineData[category.key]) {
          if (this.timelineData[category.key][this.categoryType]) {
            values = [
              ...values,
              ...Object.values(this.timelineData[category.key][this.categoryType])]
            if (this.timelineData[category.key][this.categoryType][period]) {
              value = this.timelineData[category.key][this.categoryType][period]
              values.push(value)
            }
          }
        }
        collectedEntries.push({
          category: category.id,
          value,
          color: category.color,
        })
      }

      const min = window._.min(values)
      const step = this.ranges[category]

      //   })
      // Break the values into quantiles and set the opacity according to the value
      const opacityQuantile = d3
      .scaleQuantile()
      .domain([0, this.buckets - 1, d3.max(values)])
      .range(this.opacities)



      // Calculate the opacity for each
      parsedData.values = collectedEntries.map((entry, index) => {
        entry.opacity = entry.value ? opacityQuantile(entry.value) : 0.05
        entry.label = index + 1 * step + (Math.round(min / step) * step)
        entry.id = index + 1
        return entry
      })

      return parsedData
    },
  },
}
</script>

<style>
#timeline {
  display: inline-block;
  position: relative;
  width: 100%;
  vertical-align: top;
  overflow: hidden;
}

#timeline svg {
  padding-bottom: 2em;
}

#timeline .label {
  height: 50px;
  transition: opacity 0.5s linear;
}

#timeline .label.hidden {
  opacity: 0;
}

#timeline rect.bordered {
  fill: #fafafa;
  stroke: #fff;
  stroke-width: 2px;
}

#timeline rect.highlighted {
  stroke: #4a4a4a;
  stroke-opacity: 1;
  fill-opacity: 0;
  fill: none;
  stroke-width: 2px;
}


</style>
