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
        <!-- links and link-text 注：先绘制边 -->
        <g>
          <g
            v-for="link in links"
            :key="link.index"
          >
            <line
              :class="`${link[linkTypeKey]} ${link.selected} link element`"
              :stroke="theme.linkStroke"
              :stroke-width="linkWidth"
            />
            <!-- dx dy 文字左下角坐标 -->
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
              :fill="nodeColor(node[nodeTypeKey])"
              :stroke-width="highlightNodes.indexOf(node.id) == -1? 3:10"
              :stroke="highlightNodes.indexOf(node.id) == -1? theme.nodeStroke: 'gold' "
              :class="`${node[nodeTypeKey]} ${node.showText?'selected' : ''} node element`"
              :r="nodeSize"
            />
            <text
              v-show="node.showText"
              :dx="nodeSize + 5"
              dy="0"
              class="node-text"
              :fill="theme.textFill"
              :font-size="nodeTextFontSize"
            >{{ node[nodeTextKey] }}</text>
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
// import * as d3ScaleChromatic from 'd3-scale-chromatic'
// import d3SelectionMulti from "d3-selection-multi";
const d3 = {
  ...d3api, ...d3Force, ...d3Zoom, ...d3Scale, ...d3Selection, ...d3Drag, ...d3Dispatch,
}
DOMTokenList.prototype.indexOf = Array.prototype.indexOf

export default {
  name: 'Network',
  props: {
    nodeList: Array,
    linkList: Array,

    nodeSize: {
      type: Number,
      default: 14,
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
      default: 2,
    },
    showLinkText: {
      type: Boolean,
      default: false,
    },
    linkTextKey: {
      type: String,
      default: 'value',
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
      default: 50,
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
    },
    bodyStrength: {
      type: Number,
      default: -150,
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
      pinned: [],
      force: null,
      zoom: d3.zoom(),
      transform: null,
      nodeColor: d3.scaleOrdinal(d3.schemeCategory10),
      linkTextVisible: false,
      linkTextPosition: {
        top: 0,
        left: 0,
      },
      linkTextContent: '',
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
          nodeStroke: 'white',
          linkStroke: 'lightgray',
          textFill: 'black',
        }
      }

      return {
        bgcolor: 'black',
        nodeStroke: 'white',
        linkStroke: 'rgba(200,200,200)',
        textFill: 'white',
      }
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
    console.log(d3)
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
      // .force('charge',
      //   d3
      //   .forceManyBody()
      //   .strength(_this.settings.gravity)
      //   .distanceMax(600)
      //   .distanceMin(100))
      .force('collide',
        d3
        .forceCollide(15)
        .strength(2)
        .iterations(50))
      .force(
        'center',
        d3.forceCenter(this.svgSize.width / 2, this.svgSize.height / 2),
      )
      // controls how long the animations run, default is 0.0228, closer to 1 means animation decays faster
      .alphaDecay(0.1)
    },
    initDragTickZoom() {
      d3.selectAll('.node').call(this.drag(this.force))
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


      this.zoom.scaleExtent([0.1, 7]).on('zoom', this.zoomed)

      this.transform = d3.zoomIdentity
      .translate(this.svgSize.width / 6, this.svgSize.height / 6)
      .scale(0.5)

      d3.select(this.$refs.svg)
      .call(this.zoom.transform, this.transform)
      .call(this.zoom.on('zoom', this.zoomed))
    },
    clickLink(e) {
      this.$emit('clickLink', e, e.target.__data__)
    },
    clickNode(e) {
      if (this.pinned.length === 0) {
        this.pinnedState(e)
      } else {
        d3.selectAll('.element').style('opacity', 0.2)
        this.pinned = []
      }
      this.$emit('clickNode', e, e.target.__data__)
    },
    clickEle(e) {
      if (e.target.tagName === 'circle') {
        this.clickNode(e)
      } else if (e.target.tagName === 'line') {
        this.clickLink(e)
      }
    },
    svgMouseover(e) {
      if (e.target.nodeName === 'circle') {
        if (this.pinned.length === 0) {
          this.selectedState(e)
        }

        this.$forceUpdate()
        this.$emit('hoverNode', e, e.target.__data__)
      } else if (e.target.nodeName === 'line') {
        this.linkTextPosition = {
          left: `${e.clientX}px`,
          top: `${e.clientY - 50}px`,
        }
        this.linkTextContent = e.target.__data__[this.linkTextKey]
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

        this.$forceUpdate()
      }
    },
    selectedState(e) {
      e.target.__data__.showText = true
      e.target.classList.add('selected')
      this.selection.nodes.push(e.target.__data__)

      this.lightNeibor(e.target.__data__)

      d3.selectAll('.element').style('opacity', 0.2)
    },
    noSelectedState(e) {
      e.target.__data__.showText = false


      this.darkenNerbor()

      d3.selectAll('.element').style('opacity', 1)
    },
    pinnedState(e) {
      this.pinned.push(e.target.__data__.index)
      d3.selectAll('.element').style('opacity', 0.05)
    },
    lightNeibor(node) {
      this.links.forEach((link) => {
        if (link.source.index === node.index) {
          link.selected = 'selected'
          this.selection.links.push(link)
          this.selection.nodes.push(link.target)
          this.lightNode(link.target)
        }
        if (link.target.index === node.index) {
          link.selected = 'selected'
          this.selection.links.push(link)
          this.selection.nodes.push(link.source)
          this.lightNode(link.source)
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
      console.log(d)
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
        if (!event.active) simulation.alphaTarget(0.3).restart()
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
