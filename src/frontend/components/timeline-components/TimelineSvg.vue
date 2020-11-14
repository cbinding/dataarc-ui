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
        :x="_calcLabelX(key)"
        :y="_calcLabelY(key)"
        style="text-anchor:middle"
      >
        {{ label }}
      </text>
    </g>
    <g v-for="(category, categoryIndex) in data" :key="categoryIndex">
      <rect
        v-for="(count, countIndex) in category.counts"
        :key="countIndex"
        class="period bordered"
        :data-category="categoryIndex"
        :data-period="countIndex"
        :x="_calcRectX(countIndex)"
        :y="_calcRectY(categoryIndex)"
        :width="rectWidth + '%'"
        :height="rectHeight + '%'"
        :style="rectStyle(category.color, count)"
        @mouseover.prevent="rectMouseover"
        @mouseout="rectMouseout"
        @click="rectClick"
      >
        <title>{{ count }}</title>
      </rect>
    </g>
    <rect
      v-show="activeRect > -1"
      :x="`${activeRect * rectWidth + 0.25}%`"
      :y="`${labelHeight + 1}%`"
      :width="`${rectWidth - 0.5}%`"
      :height="`${rectHeight * Object.keys(data).length - 2}%`"
      class="highlighted"
    />
    <rect
      v-show="selectedRect > -1"
      :x="`${selectedRect * rectWidth + 0.25}%`"
      :y="`${labelHeight + 1}%`"
      :width="`${rectWidth - 0.5}%`"
      :height="`${rectHeight * Object.keys(data).length - 2}%`"
      class="highlighted"
    />
  </svg>
</template>

<script>
import * as d3api from 'd3';
import * as d3Selection from 'd3-selection';
import * as d3Drag from 'd3-drag';
import * as d3Dispatch from 'd3-dispatch';

const d3 = {
  ...d3api,
  ...d3Selection,
  ...d3Drag,
  ...d3Dispatch
};

export default {
  name: 'TimelineSvg',
  props: {
    collapsed: {
      type: Boolean,
      default: false
    },
    width: {
      type: Number,
      default: 1000
    },
    height: {
      type: Number,
      default: 200
    },
    data: {
      type: Array,
      required: true
    },
    labels: {
      type: Array,
      required: true
    },
    transitionDuration: {
      type: Number,
      default: 1000
    },
    rectWidth: {
      type: Number,
      default: 10
    },
    rectHeight: {
      type: Number,
      default: 30
    },
    labelHeight: {
      type: Number,
      default: 10
    },
    periodName: {
      type: String,
      default: 'millennia'
    }
  },
  data() {
    return {
      activeRect: -1,
      selectedRect: -1,
      opacityBins: 5,
      opacitySteps: [0.25, 0.5, 0.75, 1.0],
      opacityByQuantileGenerator: null
    };
  },
  watch: {
    data() {
      this.selectedRect = -1
    },
    collapsed() {
      if (this.collapsed) {
        this.collapseContainer();
      } else {
        this.expandContainer();
      }
    }
  },
  mounted() {
    this.opacityByQuantileGenerator = d3
      .scaleQuantile()
      .domain([
        0,
        this.opacityBins,
        window._.max(
          this.data.map(category => {
            return window._.max(category.counts);
          })
        )
      ])
      .range(this.opacitySteps);
    this.$nextTick(() => {
      this.createElements();
      this.createChart();
    });
  },
  methods: {
    opacityByQuantile(count) {
      if (this.opacityByQuantileGenerator) {
        return this.opacityByQuantileGenerator(count);
      }
    },
    _calcLabelX(index) {
      return `${index * this.rectWidth + 5}%`;
    },
    _calcLabelY(index) {
      return '7%';
    },
    _calcRectX(index) {
      return `${index * this.rectWidth}%`;
    },
    _calcRectY(index) {
      return `${index * this.rectHeight + this.labelHeight}%`;
    },
    createElements() {
      this.svg = d3.select(this.$refs.svg);

      this.rects = d3.select('rect');
      this.rects.transition().duration(this.transitionDuration);
    },
    rectMouseover(e) {
      this.rectHover(e.target);
    },
    rectHover(rect) {
      this.activeRect = rect.dataset.period;
    },
    rectMouseout(e) {
      this.activeRect = -1;
    },
    rectClick(e) {
      this.selectedRect = this.activeRect
      this.$emit('range-selected', {
        startDate: this.data[e.target.dataset.category].periods[
          e.target.dataset.period
        ],
        period: this.periodName
      });

      // this.collapseContainer();

      // this.shrink(d)
    },
    rectStyle(color, count) {
      return {
        fill: color,
        'fill-opacity': this.opacityByQuantile(count)
      };
    },
    collapseContainer() {
      this.svg
        .transition('shrink')
        .duration(this.transitionDuration)
        .attr('viewBox', `0 0 1000 ${this.height / 3}`);
      this.svgCollapsed = true;
    },
    expandContainer() {
      this.svg
        .transition('shrink')
        .duration(this.transitionDuration)
        .attr('viewBox', `0 0 1000 ${this.height}`);
      this.svgCollapsed = false;
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
    }
  }
};
</script>

<style></style>
