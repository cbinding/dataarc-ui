<template>
  <div ref="timeline">
    <div class="loader h-100 justify-content-center align-items-center">
      <h1><span class="fa fa-cog fa-spin fa-2x" /></h1>
    </div>
  </div>
</template>

<script>

import * as d3api from 'd3'
import * as d3Force from 'd3-force'
import * as d3Zoom from 'd3-zoom'
import * as d3Scale from 'd3-scale'
import * as d3Selection from 'd3-selection'
import * as d3Drag from 'd3-drag'
import * as d3Dispatch from 'd3-dispatch'
import * as d3ScaleChromatic from 'd3-scale-chromatic'
// import d3SelectionMulti from "d3-selection-multi";
const d3 = {
  ...d3api, ...d3Force, ...d3Zoom, ...d3Scale, ...d3Selection, ...d3Drag, ...d3Dispatch, ...d3ScaleChromatic,
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
  },
  data() {
    return {
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
      timelineData: [],
      opacities: [0.25, 0.5, 0.75, 1.0],
      buckets: 5,
      svg: null,
      labels: null,
      labelData: [],
    }
  },
  computed: {
    timeline() {
      return this.$refs.timeline
    },
    realRectHeight() {
      return (90 / this.categories.length)
    },
  },
  mounted() {
    this.parseData()
    this.createElements()
    this.createChart()
    this.restoreSelection()
  },
  methods: {
    parseData() {

    },
    createElements() {
      this.svg = d3
      .select(this.timeline)
      .data(this.labelData)
      .classed('timeline-container', true)
      .append('svg')
      .attr('preserveAspectRatio', 'xMinYMin meet')
      .attr('viewBox', `0 0 ${this.width} ${this.height}`)
      .classed('timeline-content', true)

      this.labels = this.svg
      .append('g')
      .selectAll('.label')
      .data(this.labelData)
      .enter().append('text')
      .text((d) => { return d.label })
      .attr('x', (d) => { return `${((d.id - 1) * this.realRectHeight) + 5}%` })
      .attr('y', '7%')
      .style('text-anchor', 'middle')
      .classed('label', true)
    },
    createChart() {

    },
    restoreSelection() {

    },
  },
}
</script>

<style>

</style>
