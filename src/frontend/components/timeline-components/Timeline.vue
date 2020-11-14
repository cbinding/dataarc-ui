<template>
  <div id="timeline" ref="timeline" class="timeline-container">
    <div
      v-show="!loaded"
      class="loader h-100 justify-content-center align-items-center"
    >
      <h1><span class="fa fa-cog fa-spin fa-2x" /></h1>
    </div>
    <transition name="fade">
      <timeline-svg
        v-if="loaded"
        :labels="millennia[0].periods"
        :data="millennia"
        :rect-height="realRectHeight(millennia)"
        :period-name="'centuries'"
        :collapsed="false"
        @range-selected="setTimeline"
      />
    </transition>
    <transition name="fade">
      <timeline-svg
        v-if="activePeriod !== 'millennia' && centuries.length > 0"
        :labels="centuries[0].periods"
        :data="centuries"
        :rect-height="realRectHeight(centuries)"
        :period-name="'decades'"
        :collapsed="false"
        @range-selected="setTimeline"
      />
    </transition>
    <transition name="fade">
      <timeline-svg
        v-if="activePeriod === 'decades' && decades.length"
        :labels="decades[0].periods"
        :data="decades"
        :rect-height="realRectHeight(decades)"
        :period-name="'none'"
        :collapsed="false"
        @range-selected="setTimeline"
      />
    </transition>
  </div>
</template>

<script>
import * as d3api from 'd3';
import * as d3Selection from 'd3-selection';

import TimelineSvg from './TimelineSvg.vue';
// const d3 = {
//   ...d3api, ...d3Selection,
// }

const category_colors = ['#6177aa', '#fc8d62', '#66c2a5', '#54278f', '#a63603'];

export default {
  name: 'Timeline',
  components: {
    TimelineSvg
  },
  props: {
    width: {
      type: Number,
      default: 1000
    },
    height: {
      type: Number,
      default: 200
    },
    timelineBase: {
      type: Number,
      default: -7000
    }
  },
  computed: {
    // decades() {
    //   if ('decades' in this.timelineData) {
    //     return this.timelineDatadecades;
    //   }
    //   return false;
    // }
  },
  watch: {
    'timelineData.centuries'() {
      this.centuries = this.timelineData.centuries;
    },
    'timelineData.decades'() {
      this.decades = this.timelineData.decades;
    },
    'timelineData.millennia'() {
      this.millennia = this.timelineData.millennia;
    }
  },
  data() {
    return {
      centuries: [],
      millennia: [],
      decades: [],
      activePeriod: 'millennia',
      loaded: false,
      initialPeriod: 'millennia',
      categories: [
        {
          id: 1,
          key: 'ARCHAEOLOGICAL',
          label: 'Archaeological',
          color: category_colors[0]
        },
        {
          id: 2,
          key: 'TEXTUAL',
          label: 'Textual',
          color: category_colors[1]
        },
        {
          id: 3,
          key: 'ENVIRONMENTAL',
          label: 'Environmental',
          color: category_colors[2]
        }
      ],
      svg: null,
      labels: null,
      timelines: {},
      ranges: { millennia: 1000, centuries: 100, decades: 10 },
      rangeCount: 10,
      opacities: [0.25, 0.5, 0.75, 1.0],
      initialStartDate: -7000,
      buckets: 5,
      timelineData: {
        centuries: [],
        decades: [],
        millennia: []
      },
      sampleTimelineData: [
        {
          category: 'ARCHAEOLOGICAL',
          label: 'Archaeological',
          categoryId: 0,
          color: category_colors[0],
          periods: [
            -7000,
            -6000,
            -5000,
            -4000,
            -3000,
            -2000,
            -1000,
            0,
            1000,
            2000
          ],
          counts: [0, 36, 0, 0, 45, 23, 34, 53, 45, 0]
        },
        {
          category: 'TEXTUAL',
          categoryId: 1,
          label: 'Textual',
          color: category_colors[1],
          periods: [
            -7000,
            -6000,
            -5000,
            -4000,
            -3000,
            -2000,
            -1000,
            0,
            1000,
            2000
          ],
          counts: [0, 36, 0, 0, 45, 23, 34, 53, 45, 0]
        },
        {
          category: 'ENVIRONMENTAL',
          categoryId: 2,
          label: 'Environmental',
          color: category_colors[2],
          periods: [
            -7000,
            -6000,
            -5000,
            -4000,
            -3000,
            -2000,
            -1000,
            0,
            1000,
            2000
          ],
          counts: [0, 36, 0, 0, 45, 23, 34, 53, 45, 0]
        }
      ]
    };
  },
  mounted() {
    this.getTimelineDataByPeriod(this.initialPeriod, this.initialStartDate);
  },
  methods: {
    setTimeline(rangeData) {
      this.getTimelineDataByPeriod(rangeData.period, rangeData.startDate);
      console.log(rangeData.period)
      let multiplier = 10
      let period = rangeData.period
      if (rangeData.period === 'none') {
        multiplier = 1
        period = 'decades'
      }
      this.$emit('input', {
        start: rangeData.startDate,
        end: rangeData.startDate + this.ranges[period] * multiplier
      })
    },
    realRectHeight(timelineDataValue) {
      return 90 / timelineDataValue.length;
    },
    getTimelineDataByPeriod(period, startDate) {
      let url = `${this.$apiUrl}/query/timeline`;
      if (period === 'none') return
      return axios
        .post(url, {
          // filter: {},
          start: parseInt(startDate),
          type: period
        })
        .then(({ data }) => {
          this.timelineData[period] = data;
          this.activePeriod = period;
          this.loaded = true;
        });
      // return new Promise((resolve, reject) => {
      //   setTimeout(() => {
      //     // This will need to be changed
      //     // Here just imitating a wait on the return
      //     resolve(this.sampleTimelineData)
      //   }, 1000)
      // }).then(() => {
      //   this.timelineData[period] = this.sampleTimelineData
      //   this.activePeriod = period
      //   this.loaded = true
      // })
    }
  }
};
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

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
