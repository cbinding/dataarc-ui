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
    <svg
      v-show="loaded"
      ref="svg"
      xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink"
      class="timeline-content"
      preserveAspectRatio="xMinYMin meet"
      :viewBox="'0 0 1000 ' + height"
    >
      <g id="label-container">
        <text
          v-for="(label, key) in labelData"
          :key="key"
          class="label"
          :x="_calcLabelX(label)"
          :y="_calcLabelY(label)"
          style="text-anchor:middle"
        >
          {{ label.label }}
        </text>
      </g>
      <g
        id="period-container"
        ref="periodContainer"
      >
        <rect
          v-for="data in timelineData"
          :key="`${data.category}.${data.period}`"
          class="period bordered"
          :data-category="data.category"
          :data-period="data.period"
          :x="_calcRectX(data)"
          :y="_calcRectY(data)"
          :width="rectWidth + '%'"
          :height="realRectHeight + '%'"
          :style="rectStyle(data)"
          @mouseover.prevent="rectMouseover"
          @mouseout="rectMouseout"
          @click="rectClick"
        >
          <title>{{ data.value }}</title>
        </rect>
      </g>
      <rect
        v-show="activeRect > -1"
        :x="`${(activeRect * rectWidth) + 0.25}%`"
        :y="`${labelHeight + 1}%`"
        :width="`${rectWidth - 0.5}%`"
        :height="`${(realRectHeight * 3) - 2}%`"
        class="highlighted"
      />
    </svg>
  </div>
</template>

<script>

import * as d3api from 'd3'
import * as d3Selection from 'd3-selection'
import * as d3Drag from 'd3-drag'
import * as d3Dispatch from 'd3-dispatch'
const d3 = {
  ...d3api, ...d3Selection, ...d3Drag, ...d3Dispatch,
}

const category_colors = ['#6177aa', '#fc8d62', '#66c2a5', '#54278f', '#a63603']

export default {
  name: 'Timeline',
  props: {
    width: {
      type: Number,
      default: 1000,
    },
    height: {
      type: Number,
      default: 200,
    },
    labelHeight: {
      type: Number,
      default: 10,
    },
    rectWidth: {
      type: Number,
      default: 10,
    },
    rectHeight: {
      type: Number,
      default: 30,
    },
    transitionDuration: {
      type: Number,
      default: 1000,
    },
    categoryType: {
      type: String,
      default: 'millennium',
    },
    timelineBase: {
      type: Number,
      default: -7000,
    },
  },
  data() {
    return {
      loaded: false,
      elements: {
        svg: null,
        divContainer: null,
      },
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
      ranges: { millennium: 1000, century: 100, decade: 10 },
      opacities: [0.25, 0.5, 0.75, 1.0],
      buckets: 5,
      svg: null,
      labels: null,
      labelData: {},
      rangeCount: 10,
      timelineData: [],
      activeRect: -1,
      timelineDataCounts: {
        ARCHAEOLOGICAL: {
          millennium: {
            '-5000': 4,
            '-1000': 2,
            '1000': 4,
            '2000': 5,
            '4000': 6,
          },
          century: {
            '-500': 4,
            '-100': 2,
            '100': 4,
            '200': 5,
            '400': 6,
          },
        },
        TEXTUAL: {
          millennium: {
            '-5000': 4,
            '-1000': 2,
            '1000': 4,
            '2000': 5,
            '4000': 6,
          },
          century: {
            '-100': 4,
            '-500': 2,
            '100': 4,
            '200': 5,
            '400': 6,
          },
          decade: {
            '-10': 4,
            '-50': 2,
            '10': 4,
            '20': 5,
            '40': 6,
          },
        },
        ENVIRONMENTAL: {
          millennium: {
            '-4000': 4,
            '-1000': 10,
            '1000': 3,
            '2000': 76,
          },
          decade: {
            '-10': 4,
            '-50': 2,
            '10': 4,
            '20': 5,
            '40': 6,
          },
        },
      },
    }
  },
  computed: {
    realRectHeight() {
      return (90 / this.categories.length)
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.parseData()
      this.createElements()
      this.createChart()
      this.restoreSelection()
      this.loaded = true
    })
  },
  methods: {
    _calcLabelX(label) {
      return `${((label.id - 1) * this.rectWidth) + 5}%`
    },
    _calcLabelY(label) {
      return '7%'
    },
    _calcRectX(rectData) {
      return `${(rectData.period - 1) * this.rectWidth}%`
    },
    _calcRectY(rectData) {
      return `${(rectData.category - 1) * this.realRectHeight + this.labelHeight}%`
    },
    parseData() {
      const collectedEntries = []
      let values = []
      this.categories.forEach((category) => {
        for (let i = 0; i < this.rangeCount; i++) {
          const id = i + 1
          const period = `${i * this.ranges[this.categoryType] + this.timelineBase}`
          this.labelData[i] = { id, key: period, label: period }

          // Get the value
          let value = 0
          if (this.timelineDataCounts[category.key]) {
            if (this.timelineDataCounts[category.key][this.categoryType]) {
              values = [
                ...values,
                ...Object.values(this.timelineDataCounts[category.key][this.categoryType])]
              if (this.timelineDataCounts[category.key][this.categoryType][period]) {
                value = this.timelineDataCounts[category.key][this.categoryType][period]
                values.push(value)
              }
            }
          }
          collectedEntries.push({
            category: category.id,
            period: id,
            value,
            label: period,
          })
        }
      })
      // Break the values into quantiles and set the opacity according to the value
      const opacityQuantile = d3
      .scaleQuantile()
      .domain([0, this.buckets - 1, d3.max(values)])
      .range(this.opacities)

      // Calculate the opacity for each
      this.timelineData = collectedEntries.map((entry) => {
        entry.opacity = entry.value ? opacityQuantile(entry.value) : 0.05
        return entry
      })
    },
    createElements() {
      this.svg = d3
      .select('svg')

      this.labels = this.svg
      .selectAll('.label')
    },
    rectMouseover(e) {
      this.rectHover(e.target)
    },
    rectHover(rect) {
      this.activeRect = rect.dataset.period - 1
    },
    rectMouseout(e) {
      this.activeRect = -1
    },
    rectClick(e) {
      console.log('Clicked')
      console.log(e)
      // this.shrink(d)
    },
    rectStyle(rectData) {
      return {
        'fill': this.categories[rectData.category - 1].color,
        'fill-opacity': rectData.opacity,
      }
    },
    createChart() {
      // const period = this.svg
      // .append('g')
      // .selectAll('.period')
      // .data(this.timelineData, (d) => { return `${d.category}:${d.period}` })

      const period = this.svg
      .select('.label-container')
      .enter()

      const rect = period
      .selectAll('.period')
      // .attr('class', (d, i) => { return 'bordered' })
      // .attr('data-category', (d, i) => { return d.category })
      // .attr('data-period', (d, i) => { return d.period })
      // .attr('x', (d) => { return `${(d.period - 1) * this.rectWidth}%` })
      // .attr('y', (d) => { return `${(d.category - 1) * this.realRectHeight + this.labelHeight}%` })
      // .attr('width', (d) => { return `${this.rectWidth}%` })
      // .attr('height', (d) => { return `${this.realRectHeight}%` })

      // .on('mouseover', (d, i) => {
      //   this.hover(d)
      // })
      // .on('mouseout', (d, i) => {
      //   this.hoverRect.remove()
      // })
      // .on('click', (d, i) => {
      //   this.shrink(d)
      // })
      .transition()
      .duration(this.transitionDuration)
      // .style('fill', (d, i) => { return this.categories[d.category - 1].color })
      // .style('fill-opacity', (d, i) => { return d.opacity })

      period
      .exit()
      .remove()
    },
    restoreSelection() {

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
