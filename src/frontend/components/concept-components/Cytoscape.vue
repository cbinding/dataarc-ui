<template>
  <div>
    <div class="position-relative">
      <div
        class="position-absolute w-100"
        style="z-index:100;"
      >
        <b-row no-gutters>
          <b-col
            cols="auto"
            class="p-2 mr-auto"
          >
            <b-button-toolbar>
              <b-button-group class="border-0">
                <b-button
                  title="Zoom In"
                  variant="dark"
                  size="sm"
                  @click.prevent="zoomIn"
                >
                  <b-icon-zoom-in aria-hidden="true" />
                </b-button>
                <b-button
                  title="Zoom Out"
                  variant="dark"
                  size="sm"
                  @click.prevent="zoomOut"
                >
                  <b-icon-zoom-out aria-hidden="true" />
                </b-button>
                <b-button
                  title="Reset View"
                  variant="dark"
                  size="sm"
                  @click.prevent="fitAll"
                >
                  <b-icon-arrows-fullscreen aria-hidden="true" />
                </b-button>
                <b-button
                  v-show="currentNodeID !== 'all'"
                  title="Show All"
                  variant="danger"
                  size="sm"
                  @click.prevent="currentNodeID = 'all'"
                >
                  <b-icon-back aria-hidden="true" />
                </b-button>
                <b-button
                  v-show="currentNodeID !== 'all' && notInFilter"
                  title="Add Concept To Filter"
                  variant="success"
                  size="sm"
                  @click.prevent="addNodeToFilter"
                >
                  <b-icon-plus-circle-fill aria-hidden="true" />
                </b-button>
                <b-button
                  v-show="currentNodeID !== 'all' && !notInFilter"
                  title="Remove Concept From Filter"
                  variant="danger"
                  size="sm"
                  @click.prevent="removeNodeFromFilter"
                >
                  <b-icon-dash-circle-fill aria-hidden="true" />
                </b-button>
              </b-button-group>
            </b-button-toolbar>
          </b-col>
          <b-col
            cols="4"
            class="p-2 m-0"
          >
            <v-select
              v-model="currentNodeID"
              :options="nodesByLabel"
              :reduce="concept => concept.id"
              class="w-100 bg-light"
              @input="onNodeSelected"
            />
          </b-col>
        </b-row>
      </div>
    </div>
    <cytoscape
      ref="cy"
      :config="config"
      :pre-config="preConfig"
      class="bg-light position-absolute w-100 h-100"
      style=""
    />
    <div
      class="position-absolute w-100 p-2 text-right"
      style="bottom:0;"
    >
      <b-badge variant="dark">
        {{ totalCurrentNodes }} of {{ totalNodes }} nodes
      </b-badge>&nbsp;
      <b-badge variant="dark">
        {{ totalCurrentEdges }} of {{ totalEdges }} edges
      </b-badge>
    </div>
  </div>
</template>

<script>
import cola from 'cytoscape-cola'
import fcose from 'cytoscape-fcose'

export default {
  name: 'Network',
  components: { },
  props: {
    topicmap: {
      type: Object,
      required: true,
    },
    conceptID: {
      type: String,
      required: false,
    },
    filteredIds: {
      type: [Array, Boolean],
      default: false,
    },
    filters: {
      type: Object,
      required: true,
    }
  },
  data() {
    return {
      fcoseSettings: {
        name: 'fcose',
        // 'draft', 'default' or 'proof'
        // - "draft" only applies spectral layout
        // - "default" improves the quality with incremental layout (fast cooling rate)
        // - "proof" improves the quality with incremental layout (slow cooling rate)
        quality: 'default',
        // Use random node positions at beginning of layout
        // if this is set to false, then quality option must be "proof"
        randomize: true,
        // Whether or not to animate the layout
        animate: true,
        // Duration of animation in ms, if enabled
        animationDuration: 1000,
        // Easing of animation, if enabled
        animationEasing: undefined,
        // Fit the viewport to the repositioned nodes
        fit: true,
        // Padding around layout
        padding: 30,
        // Whether to include labels in node dimensions. Valid in "proof" quality
        nodeDimensionsIncludeLabels: false,
        // Whether or not simple nodes (non-compound nodes) are of uniform dimensions
        uniformNodeDimensions: false,
        // Whether to pack disconnected components - valid only if randomize: true
        packComponents: true,

        /* spectral layout options */

        // False for random, true for greedy sampling
        samplingType: true,
        // Sample size to construct distance matrix
        sampleSize: 45,
        // Separation amount between nodes
        nodeSeparation: 75,
        // Power iteration tolerance
        piTol: 0.0000002,

        /* incremental layout options */

        // Node repulsion (non overlapping) multiplier
        nodeRepulsion: 7000,
        // Ideal edge (non nested) length
        idealEdgeLength: 300,
        // Divisor to compute edge forces
        edgeElasticity: 0.45,
        // Nesting factor (multiplier) to compute ideal edge length for nested edges
        nestingFactor: 0.1,
        // Maximum number of iterations to perform
        numIter: 2500,
        // For enabling tiling
        tile: true,
        // Represents the amount of the vertical space to put between the zero degree members during the tiling operation(can also be a function)
        tilingPaddingVertical: 10,
        // Represents the amount of the horizontal space to put between the zero degree members during the tiling operation(can also be a function)
        tilingPaddingHorizontal: 10,
        // Gravity force (constant)
        gravity: 0.35,
        // Gravity range (constant) for compounds
        gravityRangeCompound: 1.5,
        // Gravity force (constant) for compounds
        gravityCompound: 1.0,
        // Gravity range (constant)
        gravityRange: 3.8,
        // Initial cooling factor for incremental layout
        initialEnergyOnIncremental: 0.3,
      },
      container: 'cy',
      currentNodeID: 'all',
      currentNode: null,
      currentElements: {},
      legendItems: [
        { label: 'Selected', fill: '#5cb85c' },
        { label: 'Related', fill: '#f0ad4e' },
        { label: 'Contextual', fill: '#d9534f' },
      ],
      layout: {
        name: 'cola',
        animate: true,
        refresh: 2,
        convergenceThreshold: 0.01,
        maxSimulationTime: 4000,
      },
      config: {
        style: [
          {
            selector: 'node',
            style: {
              'width': '15px',
              'height': '15px',
              'background-color': 'dimgray',
              'border-color': 'gray',
              'border-width': '1px',
              'label': 'data(label)',
              'font-size': '0.8em',
              'text-valign': 'top',
              'text-halign': 'center',
              'color': 'dimgray',
              'shape': 'ellipse',
            },
          },
          {
            selector: `node.contextual`,
            style: {
              'background-color': '#d9534f',
              'width': '20px',
              'height': '20px',
              'shape': 'ellipse',
            },
          },
          {
            selector: `node.related`,
            style: {
              'background-color': '#f0ad4e',
              'width': '20px',
              'height': '20px',
              'shape': 'triangle',
            },
          },
          {
            selector: `node.matched`,
            style: {
              'background-color': '#5cb85c',
              'font-weight': 'bold',
              'width': '25px',
              'height': '25px',
              'shape': 'star',
            },
          },
          {
            selector: `node.not-matched`,
            style: {
              'background-color': 'lightgray',
              'border-color': 'lightgray',
              'color': 'lightgray',
            },
          },
          {
            selector: 'edge',
            style: {
              'width': 1,
              'line-color': 'gainsboro',
              'target-arrow-color': 'gainsboro',
              'target-arrow-shape': 'triangle',
              'curve-style': 'haystack',
              'label': 'data(label)',
              'font-size': '0.5em',
              'color': 'darkgray',
              'text-rotation': 'autorotate',
              'text-background-opacity': 0.5,
              'text-background-color': 'whitesmoke',
            },
          },
        ],
        cyInstance: null,
      },
    }
  },
  computed: {
    notInFilter() {
      return !_.includes(this.filters.concept, this.currentNodeID)
    },
    tm() {
      return this.topicmap || {}
    },
    title() {
      return this.tm.title || ''
    },
    currentConceptID() {
      return this.node2concept.get(this.currentNodeID)
    },
    totalNodes() {
      return this.nodes.length
    },
    totalEdges() {
      return this.edges.length
    },
    totalCurrentNodes() {
      return ((this.currentElements || {}).nodes || []).length
    },
    totalCurrentEdges() {
      return ((this.currentElements || {}).edges || []).length
    },
    nodes() {
      const cleanNodes = (this.tm.nodes || []).map((n) => {
        const id = this.clean(n.id)
        return {
          id,
          label: this.clean(n.title).replace(/_/g, ' '),
          concept: this.node2concept.get(id),
        }
      })
      const uniqueNodes = new Map()
      for (const n of cleanNodes) {
        if (!uniqueNodes.has(n.id)) {
          uniqueNodes.set(n.id, n)
        }
      }
      return [...uniqueNodes.values()]
    },
    edges() {
      // get unique node IDs
      const nodeids = new Map()
      for (const n of this.nodes) {
        if (!nodeids.has(n.id)) nodeids.set(n.id, true)
      }
      // clean edges
      const cleanEdges = (this.tm.edges || [])
      .map((e) => {
        const source = this.clean(e.source)
        const target = this.clean(e.target)
        // remove all underscores from label
        const label = this.clean(e.title).replace(/_/g, ' ')
        // only edges where source & target nodes exists
        if (nodeids.has(source) && nodeids.has(target)) {
          return {
            id: `${source}-${target}`,
            source,
            target,
            label,
          }
        } return null
      })
      .filter((e) => e) // filter out any null values

      // ensure uniqueness
      const uniqueEdges = new Map()
      for (const e of cleanEdges) {
        if (!uniqueEdges.has(e.id)) {
          uniqueEdges.set(e.id, e)
        }
      }
      return [...uniqueEdges.values()]
    },
    nodesByLabel() {
      return this.nodes.slice().sort((a, b) => a.label.localeCompare(b.label))
    },
    elements() {
      // formatted for cytoscape
      const cynodes = this.nodes.map((n) => {
        return { group: 'nodes', data: n }
      })
      const cyedges = this.edges.map((e) => {
        return { group: 'edges', data: e }
      })
      return [].concat(cynodes).concat(cyedges)
    },
    node2concept() {
      const n2c = new Map();
      (this.tm.topics || []).forEach((t) => {
        const nid = this.clean(t.identifier)
        const cid = this.clean(t.concept)
        if (cid !== '' && !n2c.has(nid)) n2c.set(nid, cid)
      })
      return n2c
    },
    concept2node() {
      const c2n = new Map();
      (this.tm.topics || []).forEach((t) => {
        const nid = this.clean(t.identifier)
        const cid = this.clean(t.concept)
        if (cid !== '' && !c2n.has(cid)) c2n.set(cid, nid)
      })
      return c2n
    },
  },
  watch: {
    topicmap() {
      if (!this.currentNodeID || this.currentNodeID === 'all') {
        this.resetNetwork()
      }
    },
    conceptID(newValue) {
      this.currentNodeID = this.concept2node.get(newValue)
    },
    currentNodeID() {
      if (this.currentNodeID === 'all') {
        this.resetNetwork()
      } else {
        this.showNeighbours()
      }
    },
    filteredIds() {
      this.resetNetwork()
    },
  },
  mounted() {
    this.cyInstance = this.$refs.cy.instance
    const self = this
    this.cyInstance.on('click tap', 'node', (evt) => {
      self.currentNodeID = evt.target.id()
    })
  },
  methods: {
    zoomIn() {
      this.cyInstance.zoom({
        level: this.cyInstance.zoom() * 1.25,
        position: {
          x: Math.round(
            (this.cyInstance.extent().x1 + this.cyInstance.extent().x2) / 2,
          ),
          y: Math.round(
            (this.cyInstance.extent().y1 + this.cyInstance.extent().y2) / 2,
          ),
        },
      })
    },
    zoomOut() {
      this.cyInstance.zoom({
        level: this.cyInstance.zoom() * 0.75,
        position: {
          x: Math.round(
            (this.cyInstance.extent().x1 + this.cyInstance.extent().x2) / 2,
          ),
          y: Math.round(
            (this.cyInstance.extent().y1 + this.cyInstance.extent().y2) / 2,
          ),
        },
      })
    },
    fitAll() {
      this.cyInstance.fit()
    },
    clean: (s) => (s || '').toString().trim(),
    addNodeToFilter() {
      const concept = this.currentElements.nodes.filter((node) => {
        return node.data.id === this.currentNodeID
      })
      this.$emit('concept-filter', concept.pop().data, 'add')
    },
    removeNodeFromFilter() {
      this.$emit('concept-filter', this.currentNodeID, 'remove')
    },
    resetNetwork() {
      // reset cytoscape elements
      this.cyInstance.elements().remove()
      this.cyInstance.add(this.elements)
      this.cyInstance.layout(this.fcoseSettings).run()
      const vm = this
      if (vm.filteredIds && vm.filteredIds.length > 0) {
        this.cyInstance.filter((ele, i, eles) => {
          return vm.filteredIds.indexOf(ele.data('id')) === -1
        }).map((node, index) => {
          node.addClass('not-matched')
          return node
        })
      }
      this.currentElements = this.cyInstance.json().elements
      this.cyInstance.resize()
      if (this.currentNodeID && this.currentNodeID !== 'all') {
        this.showNeighbours()
      }
    },

    onNodeSelected(nodeID) {
      if (nodeID == null) this.currentNodeID = 'all'
      else if (this.currentNodeID !== nodeID) this.currentNodeID = nodeID
    },

    preConfig(cytoscape) {
      cytoscape.use(cola)
      cytoscape.use(fcose)
    },

    showNeighbours() {
      // reset cytoscape elements
      this.cyInstance.elements().remove()
      this.cyInstance.add(this.elements)

      // get expansion for current concept
      const node = this.cyInstance.$id(this.currentNodeID) // root node
      const eles1 = node.neighborhood() // 1 step away
      const eles2 = eles1.neighborhood() // 2 steps away

      // add classes for level styling
      node.addClass('matched')
      eles1.map((e) => e.addClass('related'))
      eles2.map((e) => e.addClass('contextual'))

      // display the expanded elements
      this.cyInstance.elements().remove()
      this.cyInstance.add(node)
      this.cyInstance.add(eles1)
      this.cyInstance.add(eles2)
      this.cyInstance.layout(this.layout).run()
      this.currentElements = this.cyInstance.json().elements
    },
  },
}
</script>

<style>
#cytoscape-div {
  height: 100%;
}
#cytoscape-div canvas {
  margin-left: -50%;
}
</style>
