<template>
  <b-card no-body id="timeline" ref="timeline" class="mt-2 mb-5 shadow text-center bg-white timeline-container">
    <transition name="fade">
      <b-row>
        <b-col md="11">
          <timeline-svg
            v-if="loaded"
            :labels="millennia[0].periods"
            :data="millennia"
            :rect-height="realRectHeight(millennia)"
            :period-name="'centuries'"
            :collapsed="false"
            :sample-rect="sampleRect"
            @range-selected="setTimeline"
          />
        </b-col>
        <b-col sm="1">
          <b-row>
            <strong><small>Millennium</small></strong>
          </b-row>
        </b-col>
      </b-row>
    </transition>
    <transition name="fade">
      <b-row v-if="activePeriod !== 'millennia' && centuries.length > 0">
        <b-col md="11">
          <timeline-svg
            :labels="centuries[0].periods"
            :data="centuries"
            :rect-height="realRectHeight(centuries)"
            :period-name="'decades'"
            :collapsed="false"
            @range-selected="setTimeline"
          />
        </b-col>
        <b-col sm="1">
          <b-row>
            <strong><small>Century</small></strong>
          </b-row>
        </b-col>
      </b-row>
    </transition>
    <transition name="fade">
      <b-row v-if="activePeriod === 'decades' && decades.length">
        <b-col md="11">
          <timeline-svg
            :labels="decades[0].periods"
            :data="decades"
            :rect-height="realRectHeight(decades)"
            :period-name="'none'"
            :collapsed="false"
            @range-selected="setTimeline"
          />
        </b-col>
        <b-col sm="1">
          <b-row >
            <strong><small>Decade</small></strong>
          </b-row>
        </b-col>
      </b-row>
    </transition>
  </b-card>
</template>

<script>
import * as d3api from 'd3';
import * as d3Selection from 'd3-selection';

import TimelineSvg from './TimelineSvg.vue';

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
    },
    filters: {
      type: [Object, Boolean],
      default: false,
    },
    triggers: {
      type: [Number, Boolean],
      default: false,
    },
    sampleRect: {
      type: [Number, Boolean],
      default: false,
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
  watch: {
    'timelineData.centuries'() {
      this.centuries = this.timelineData.centuries;
    },
    'timelineData.decades'() {
      this.decades = this.timelineData.decades;
    },
    'timelineData.millennia'() {
      this.millennia = this.timelineData.millennia;
    },
    triggers: {
      handler(newValue, oldValue) {
        this.reloadTimelineData()
      },
      deep: true,
    },
  },
  mounted() {
    this.getTimelineDataByPeriod(this.initialPeriod, this.initialStartDate);
  },
  methods: {
    reloadTimelineData() {
      const currentActivePeriod = this.activePeriod

      const promises = []
      if (this.decades && this.decades.length > 0) {
        promises.push(
          this.getTimelineDataByPeriod('decades', this.decades[0].periods[0])
        )
      }
      if (this.centuries && this.centuries.length > 0) {
        promises.push(
          this.getTimelineDataByPeriod('centuries', this.centuries[0].periods[0])
        )
      }
      if (this.millennia && this.millennia.length > 0) {
        promises.push(
          this.getTimelineDataByPeriod('millennia', this.millennia[0].periods[0])
        )
      }
      Promise.all(promises).then(() => {
        this.activePeriod = currentActivePeriod
      })
    },
    setTimeline(rangeData) {
      this.getTimelineDataByPeriod(rangeData.period, rangeData.startDate);
      let multiplier = 10
      let period = rangeData.period
      if (rangeData.period === 'none') {
        multiplier = 1
        period = 'decades'
      }
      this.$emit('input', {
        begin: rangeData.startDate,
        end: rangeData.startDate + this.ranges[period] * multiplier
      })
    },
    realRectHeight(timelineDataValue) {
      return 90 / timelineDataValue.length;
    },
    getTimelineDataByPeriod(period, startDate) {
      let url = `${this.$apiUrl}/query/timeline`;
      if (period === 'none') return

      const postObject = {
        start: parseInt(startDate),
        type: period,
      }

      if (this.filters && Object.keys(this.filters).length > 0) {
        Object.assign(postObject, this.filters)
      }

      return axios
      .post(url, postObject)
      .then(({ data }) => {
        let result = data
        if (result.length === 0) {
          const counts = []
          for (let i = 0; i < 10; i++) counts.push(0)
          const periods = []
          let start = startDate
          for (let i = 0; i < 10; i++) {
            periods.push(start)
            start += this.ranges[period]
          }
          result = [
            {
              color: '#d3d3d3',
              periods,
              counts,
            },
          ]
        }
        this.timelineData[period] = result;
        this.activePeriod = period;
        this.loaded = true;
      })
    }
  }
};
</script>

<style>
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
