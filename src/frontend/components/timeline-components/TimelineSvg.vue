<template>
  <svg
    ref="svg"
    xmlns="http://www.w3.org/2000/svg"
    xmlns:xlink="http://www.w3.org/1999/xlink"
    class="timeline-content"
    preserveAspectRatio="xMinYMin meet"
    :viewBox="'0 0 1000 ' + height"
  >
    <g id="label-container">
      <text
        v-for="(label, key) in labels"
        v-show="!collapsed"
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
      ref="periodContainer"
    >
      <rect
        v-for="value in values"
        :key="`${value.category}.${value.period}`"
        class="period bordered"
        :data-category="value.category"
        :data-period="value.period"
        :x="_calcRectX(value)"
        :y="_calcRectY(value)"
        :width="rectWidth + '%'"
        :height="rectHeight + '%'"
        :style="rectStyle(value)"
        @mouseover.prevent="rectMouseover"
        @mouseout="rectMouseout"
        @click="rectClick"
      >
        <title>{{ value.value }}</title>
      </rect>
    </g>
    <rect
      v-show="activeRect > -1"
      :x="`${(activeRect * rectWidth) + 0.25}%`"
      :y="`${labelHeight + 1}%`"
      :width="`${rectWidth - 0.5}%`"
      :height="`${(rectHeight * 3) - 2}%`"
      class="highlighted"
    />
  </svg>
</template>

<script>

import * as d3api from 'd3'
import * as d3Selection from 'd3-selection'
import * as d3Drag from 'd3-drag'
import * as d3Dispatch from 'd3-dispatch'

const d3 = {
  ...d3api, ...d3Selection, ...d3Drag, ...d3Dispatch,
}


export default {
  name: 'TimelineSvg',
  props: {
    collapsed: {
      type: Boolean,
      default: false,
    },
    width: {
      type: Number,
      default: 1000,
    },
    height: {
      type: Number,
      default: 200,
    },
    values: {
      type: Array,
      required: true,
    },
    labels: {
      type: Array,
      required: true,
    },
    transitionDuration: {
      type: Number,
      default: 1000,
    },
    rectWidth: {
      type: Number,
      default: 10,
    },
    rectHeight: {
      type: Number,
      default: 30,
    },
    labelHeight: {
      type: Number,
      default: 10,
    },
  },
  data() {
    return {
      activeRect: -1,
    }
  },
  mounted() {
    this.$nextTick(() => {
    //   this.parseData()
      this.createElements()
      this.createChart()
      //   this.restoreSelection()
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
    createElements() {
      this.svg = d3
      .select('svg.timeline-content')
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

      this.svgCollapsed = true

      this.svg
      .transition('shrink')
      .duration(this.transitionDuration)
      .attr('viewBox', `0 0 1000 ${this.height / 3}`)
      // this.shrink(d)
    },
    rectStyle(rectData) {
      return {
        'fill': rectData.color,
        'fill-opacity': rectData.opacity,
      }
    },
    createChart() {
    //   const period = this.svg
    //   .select('.label-container')
    //   .enter()
    //   .transition()
    //   .duration(this.transitionDuration)

    //   period
    //   .exit()
    //   .remove()
    },
  },
}
</script>

<style>

</style>
