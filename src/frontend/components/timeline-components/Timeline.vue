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
    <transition name="fade">
      <timeline-svg
        v-if="loaded"
        :labels="timelineData[initialPeriod][0].periods"
        :data="timelineData[initialPeriod]"
        :rect-height="realRectHeight(timelineData[initialPeriod])"
        :period-name="'century'"
        :collapsed="activePeriod !== 'millenium'"
        @range-selected="setTimeline"
      />
    </transition>
    <transition name="fade">
      <timeline-svg
        v-if="activePeriod !== 'millenium'"
        :labels="timelineData[initialPeriod][0].periods"
        :data="timelineData[initialPeriod]"
        :rect-height="realRectHeight(timelineData[initialPeriod])"
        :period-name="'decade'"
        :collapsed="activePeriod === 'decade'"
        @range-selected="setTimeline"
      />
    </transition>
    <transition name="fade">
      <timeline-svg
        v-if="activePeriod === 'decade'"
        :labels="timelineData[initialPeriod][0].periods"
        :data="timelineData[initialPeriod]"
        :rect-height="realRectHeight(timelineData[initialPeriod])"
        :period-name="'decade'"
        @range-selected="setTimeline"
      />
    </transition>
  </div>
</template>

<script>

import * as d3api from 'd3'
import * as d3Selection from 'd3-selection'

import TimelineSvg from './TimelineSvg.vue'
// const d3 = {
//   ...d3api, ...d3Selection,
// }

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
      activePeriod: 'millenium',
      loaded: false,
      initialPeriod: 'millenium',
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
      initialStartDate: -7000,
      buckets: 5,
      timelineData: {},
      sampleTimelineData: [
        {
          category: 'ARCHAEOLOGICAL',
          label: 'Archaeological',
          categoryId: 0,
          color: category_colors[0],
          periods: [-7000, -6000, -5000, -4000, -3000, -2000, -1000, 0, 1000, 2000],
          counts: [0, 36, 0, 0, 45, 23, 34, 53, 45, 0],
        },
        {
          category: 'TEXTUAL',
          categoryId: 1,
          label: 'Textual',
          color: category_colors[1],
          periods: [-7000, -6000, -5000, -4000, -3000, -2000, -1000, 0, 1000, 2000],
          counts: [0, 36, 0, 0, 45, 23, 34, 53, 45, 0],
        },
        {
          category: 'ENVIRONMENTAL',
          categoryId: 2,
          label: 'Environmental',
          color: category_colors[2],
          periods: [-7000, -6000, -5000, -4000, -3000, -2000, -1000, 0, 1000, 2000],
          counts: [0, 36, 0, 0, 45, 23, 34, 53, 45, 0],
        },
      ],
    }
  },
  mounted() {
    this
    .getTimelineDataByPeriod(
      this.initialPeriod,
      this.initialStartDate,
    )
  },
  methods: {
    setTimeline(rangeData) {
      this.getTimelineDataByPeriod(rangeData.period, rangeData.startDate)
    },
    realRectHeight(timelineDataValue) {
      return (90 / timelineDataValue.length)
    },
    getTimelineDataByPeriod(period, startDate) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          // This will need to be changed
          // Here just imitating a wait on the return
          resolve(this.sampleTimelineData)
        }, 1000)
      }).then(() => {
        this.timelineData[period] = this.sampleTimelineData
        this.activePeriod = period
        this.loaded = true
      })
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

.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
