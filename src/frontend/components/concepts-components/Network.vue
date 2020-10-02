<template>
  <div
    id="network"
    :style="{width: svgSize.width +'px', height: svgSize.height+'px'}"
  >
    <div
      v-show="linkTextVisible"
      class="linkText"
      :style="linkTextPosition"
      v-text="linkTextContent"
    />
    <svg
      ref="svg"
      xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink"
      :width="svgSize.width"
      :height="svgSize.height"
      :style="{'background-color': theme.bgcolor}"
      @click="clickEle"
      @mouseover.prevent="svgMouseover"
      @mouseout="svgMouseout"
    >
      <g id="container">
        <g>
          <g
            v-for="link in links"
            :key="link.index"
          >
            <line
              :class="`${link[linkTypeKey]} ${link.selected} link element`"
              :stroke="link.pinned ? 'blue' : theme.linkStroke"
              :stroke-width="linkWidth"
            />
            <text
              v-if="showLinkText"
              dx="0"
              dy="0"
              class="link-text"
              :fill="theme.textFill"
              :font-size="linkTextFrontSize"
            >{{ link[linkTextKey] }}</text>
          </g>
        </g>

        <!-- node and node-text -->
        <g id="node-group">
          <g
            v-for="node in nodes"
            :key="node.index"
          >
            <circle
              :fill="node.selected ? 'blue' : nodeColor(node[nodeTypeKey])"
              :stroke-width="highlightNodes.indexOf(node.id) == -1? 3:10"
              :stroke="highlightNodes.indexOf(node.id) == -1? theme.nodeStroke: 'gold' "
              :class="`${node[nodeTypeKey]} ${node.showText?'selected' : ''} node element`"
              :r="nodeSize"
              :cy="svgSize.height / 2"
              :cx="svgSize.width / 2"
            />
            <text
              v-show="showNodeText || node.showText"
              :dx="nodeSize + 5"
              dy="0"
              class="node-text boundary"
              :class="(!node.showText) && ((pinned.length && !node.showText) || (hoveredNode && hoveredNode.id !== node.id)) ? 'mute-not-selected' : ''"
              :fill="theme.textFill"
              :font-size="nodeTextFontSize"
            >{{ node.label }}</text>
          </g>
          <g />
        </g>
      </g>
    </svg>
  </div>
  <!-- </div> -->
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
DOMTokenList.prototype.indexOf = Array.prototype.indexOf

export default {
  name: 'Network',
  props: {
    nodeList: {
      type: Array,
      required: true,
    },
    linkList: {
      type: Array,
      required: true,
    },

    nodeSize: {
      type: Number,
      default: 10,
    },
    nodeTextKey: {
      type: String,
      default: 'id',
    },
    nodeTypeKey: {
      type: String,
      default: 'group',
    },
    nodeTextFontSize: {
      type: Number,
      default: 14,
    },

    linkWidth: {
      type: Number,
      default: 5,
    },
    showLinkText: {
      type: Boolean,
      default: false,
    },
    linkTextKey: {
      type: String,
      default: 'label',
    },
    linkTypeKey: {
      type: String,
      default: 'type',
    },
    linkTextFrontSize: {
      type: Number,
      default: 10,
    },
    linkDistance: {
      type: Number,
      default: 40,
    },
    showNodeText: {
      type: Boolean,
      default: false,
    },
    svgSize: {
      type: Object,
      default: () => {
        return {
          width: window.innerWidth,
          height: window.innerHeight,
        }
      },
    },
    svgTheme: {
      type: String,
      default: 'light',
    },
    bodyStrength: {
      type: Number,
      default: -150,
    },
    breadthDepth: {
      type: Number,
      default: 3,
    },
    highlightNodes: {
      type: Array,
      default: () => {
        return []
      },
    },
  },
  data() {
    return {
      selection: {
        links: [],
        nodes: [],
      },
      minZoom: 0.1,
      maxZoom: 7,
      pinned: [],
      force: null,
      zoom: d3.zoom(),
      transform: null,
      nodeColor: d3.scaleOrdinal(d3.interpolateSpectral),
      linkTextVisible: false,
      linkTextPosition: {
        top: 0,
        left: 0,
      },
      linkTextContent: '',
      hoveredNode: null,
    }
  },
  computed: {
    nodes() {
      let nodes = this.nodeList.slice()
      const nodeIds = []
      nodes = nodes.filter((node) => {
        if (nodeIds.indexOf(node.id) === -1) {
          nodeIds.push(node.id)
          return true
        }
        return false
      })
      return nodes
    },
    links() {
      return this.linkList
    },
    theme() {
      if (this.svgTheme === 'light') {
        return {
          bgcolor: 'white',
          // nodeStroke: 'white',
          linkStroke: 'lightgray',
          textFill: 'black',
        }
      }

      return {
        bgcolor: 'black',
        // nodeStroke: 'white',
        linkStroke: 'rgba(200,200,200)',
        textFill: 'white',
      }
    },
    svg() {
      return d3.select(this.$refs.svg)
    },
  },
  watch: {
    bodyStrength() {
      this.initData()
      this.$nextTick(function () {
        this.initDragTickZoom()
      })
    },
    linkDistance() {
      this.initData()
      this.$nextTick(function () {
        this.initDragTickZoom()
      })
    },
    nodes() {
      this.initData()
      this.$nextTick(function () {
        this.initDragTickZoom()
      })
    },
  },
  created() {
    this.initData()
  },
  mounted() {
    this.initDragTickZoom()
  },
  methods: {
    initData() {
      this.force = d3
      .forceSimulation(this.nodes)
      .force(
        'link',
        d3
        .forceLink(this.links)
        .id((d) => d.id)
        .distance(this.linkDistance),
      )
      .force('charge',
        d3
        .forceManyBody()
        .strength(-100)
        .distanceMax(800)
        .distanceMin(100))
      .force('collide',
        d3
        .forceCollide(15)
        .strength(2)
        .iterations(50))
      // controls how long the animations run, default is 0.0228, closer to 1 means animation decays faster
      .force(
        'center',
        d3.forceCenter(this.svgSize.width / 2, this.svgSize.height / 2),
      )
      .alphaDecay(0.2)
    },
    initDragTickZoom() {
      d3
      .selectAll('.node')
      .call(
        this.drag(this.force),
      )

      this.force.on('tick', () => {
        d3.selectAll('.link')
        .data(this.links)
        .attr('x1', (d) => d.source.x)
        .attr('y1', (d) => d.source.y)
        .attr('x2', (d) => d.target.x)
        .attr('y2', (d) => d.target.y)

        d3.selectAll('.node')
        .data(this.nodes)
        .attr('cx', (d) => d.x)
        .attr('cy', (d) => d.y)

        d3.selectAll('.node-text')
        .data(this.nodes)
        .attr('x', (d) => d.x)
        .attr('y', (d) => d.y)

        d3.selectAll('.link-text')
        .data(this.links)
        .attr('x', (d) => (d.source.x + d.target.x) / 2)
        .attr('y', (d) => (d.source.y + d.target.y) / 2)
      })


      this.zoom.scaleExtent(
        [
          this.minZoom,
          this.maxZoom,
        ],
      )
      .on('zoom', this.zoomed)

      this.transform = d3.zoomIdentity
      .translate(this.svgSize.width / 6, this.svgSize.height / 6)
      .scale(0.5)

      this.svg
      .call(this.zoom.transform, this.transform)
      .call(this.zoom.on('zoom', this.zoomed))
    },
    clickLink(e) {
      this.pinned.forEach((node) => {
        node.target.__data__.selected = false
        node.target.__data__.pinned = false
      })
      this.pinned = []
      e.target.__data__.pinned = true
      this.pinned.push(e)
      this.$emit('clickLink', { e, link: e.target.__data__ })
    },
    clickNode(e) {
      if (this.pinned.length === 0) {
        this.pinnedState(e)
      } else {
        d3.selectAll('.element').style('opacity', 0.2)
        this.pinned.forEach((node) => {
          node.target.__data__.selected = false
          node.target.__data__.pinned = false
        })
        this.pinned = []
      }
      this.$emit('clickNode', { e, node: e.target.__data__ })
    },
    clickEle(e) {
      if (e.target.tagName === 'circle') {
        this.clickNode(e)
      } else if (e.target.tagName === 'line') {
        this.clickLink(e)
      } else {
        this.clearSelected()
      }
    },
    clearSelected() {
      this.pinned.forEach((node) => {
        node.target.__data__.selected = false
        node.target.__data__.pinned = false
      })
      this.pinned = []
      this.darkenNerbor()
      d3.selectAll('.element').style('opacity', 1)
    },
    svgMouseover(e) {
      if (e.target.nodeName === 'circle') {
        if (this.pinned.length === 0) {
          this.selectedState(e)
        }

        this.$forceUpdate()
        this.hoveredNode = e.target.__data__

        this.$emit('hoverNode', e, e.target.__data__)
      } else if (e.target.nodeName === 'line') {
        this.linkTextPosition = {
          left: `0px`,
          bottom: `0px`,
        }
        this.linkTextContent = `From: ${e.target.__data__.source.label} To: ${e.target.__data__.target.label}`
        this.linkTextVisible = true
        this.$emit('hoverLink', e, e.target.__data__)
      }
    },
    svgMouseout(e) {
      this.linkTextVisible = false
      if (e.target.nodeName === 'circle') {
        if (this.pinned.length === 0) {
          this.noSelectedState(e)
        }
        this.hoveredNode = null
        this.$forceUpdate()
      }
    },
    selectedState(e) {
      e.target.__data__.showText = true
      e.target.classList.add('selected')
      this.selection.nodes.push(e.target.__data__)

      this.highlightNeighbors(e.target.__data__)

      d3.selectAll('.element').style('opacity', 0.2)
    },
    noSelectedState(e) {
      e.target.__data__.showText = false
      e.target.__data__.selected = false

      this.darkenNerbor()

      d3.selectAll('.element').style('opacity', 1)
    },
    pinnedState(e) {
      this.pinned.push(e)
      if (e.target.nodeName === 'circle') {
        e.target.__data__.selected = true
      }
      d3.selectAll('.element').style('opacity', 0.05)
    },
    highlightNeighbors(node, iteration = 0) {
      this.links.forEach((link) => {
        if (link.source.index === node.index) {
          link.selected = 'selected'
          this.selection.links.push(link)
          this.selection.nodes.push(link.target)
          this.lightNode(link.target)
          if (iteration < this.breadthDepth) {
            this.highlightNeighbors(link.target, iteration + 1)
          }
        }
        if (link.target.index === node.index) {
          link.selected = 'selected'
          this.selection.links.push(link)
          this.selection.nodes.push(link.source)
          this.lightNode(link.source)
          if (iteration < this.breadthDepth) {
            this.highlightNeighbors(link.source, iteration + 1)
          }
        }
      })
    },
    lightNode(selectedNode) {
      this.nodes.forEach((node) => {
        if (node.index === selectedNode.index) {
          node.showText = true
        }
      })
    },
    darkenNerbor() {
      this.links.forEach((link) => {
        this.selection.links.forEach((selectedLink) => {
          if (selectedLink.id === link.id) {
            link.selected = ''
          }
        })
      })
      this.nodes.forEach((node) => {
        this.selection.nodes.forEach((selectednode) => {
          if (selectednode.id === node.id) {
            node.showText = false
          }
        })
      })

      this.selection.nodes = []
      this.selection.links = []
    },
    zoomed(event, d) {
      d3.select('#container').attr(
        'transform',
        `translate(${
          event.transform.x
        },${
          event.transform.y
        }) scale(${
          event.transform.k
        })`,
      )
    },
    drag(simulation) {
      function dragstarted(event, d) {
        if (!event.active) simulation.alphaTarget(0.05).restart()
        d.fx = d.x
        d.fy = d.y
      }

      function dragged(event, d) {
        d.fx = event.x
        d.fy = event.y
      }

      function dragended(event, d) {
        if (!event.active) simulation.alphaTarget(0)
        d.fx = null
        d.fy = null
      }

      return d3
      .drag()
      .on('start', dragstarted)
      .on('drag', dragged)
      .on('end', dragended)
    },
  },
}
</script>

<style scoped>
svg {
  /* border-radius: 5px; */
}

.element {
  transition: opacity 0.5s ease;
}
.selected {
  opacity: 1 !important;
}

.mute-not-selected {
  opacity: 0.2 !important
}
.node,
.link {
  cursor: pointer;
}
.linkText {
  position: absolute;
  z-index: 10;
  background-color: rgba(75, 75, 75, 0.596);
  border-radius: 10px;
  color: white;
  padding: 10px;
}
</style>
