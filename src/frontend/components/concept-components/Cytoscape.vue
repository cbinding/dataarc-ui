<template>
  <div>
    <div class="position-relative">
      <div class="position-absolute w-100" style="z-index:100;">
        <b-row no-gutters>
          <b-col cols="auto" class="p-2 mr-auto">
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
                  title="Show All"
                  variant="danger"
                  size="sm"
                  @click.prevent="currentNodeID = 'all'"
                  v-show="currentNodeID !== 'all'"
                  ><b-icon-back aria-hidden="true" />
                </b-button>
                <b-button
                  title="Add Concept To Filter"
                  variant="success"
                  size="sm"
                  @click.prevent="addNodeToFilter"
                  v-show="currentNodeID !== 'all'"
                  ><b-icon-plus-circle-fill aria-hidden="true" />
                </b-button>
              </b-button-group>
            </b-button-toolbar>
          </b-col>
          <b-col cols="4" class="p-2 m-0">
            <v-select
              v-model="currentNodeID"
              :options="nodesByLabel"
              :reduce="concept => concept.id"
              @input="onNodeSelected"
              class="w-100 bg-light"
            ></v-select>
          </b-col>
        </b-row>
      </div>
    </div>
    <cytoscape
      ref="cy"
      :config="config"
      :preConfig="preConfig"
      class="bg-light position-absolute w-100 h-100"
      style=""
    />
    <div class="position-absolute w-100 p-2 text-right" style="bottom:0;">
      <b-badge variant="dark">{{ totalCurrentNodes }} of {{ totalNodes }} nodes</b-badge>&nbsp;
      <b-badge variant="dark">{{ totalCurrentEdges }} of {{ totalEdges }} edges</b-badge>
    </div>
  </div>
</template>

<script>
import cola from 'cytoscape-cola';

export default {
  name: 'Network',
  components: { },
  props: {
    topicmap: {
      type: Object,
      required: true
    },
    conceptID: {
      type: String,
      required: false
    }
  },
  mounted: function() {
    this.cyInstance = this.$refs.cy.instance;
    let self = this;
    this.cyInstance.on('click tap', 'node', function(evt) {
      self.currentNodeID = evt.target.id();
    });
    this.resetNetwork();
  },
  data: function() {
    return {
      container: 'cy',
      currentNodeID: 'all',
      currentNode: null,
      currentElements: {},
      legendItems: [
        { label: 'Selected', fill: '#5cb85c' },
        { label: 'Related', fill: '#f0ad4e' },
        { label: 'Contextual', fill: '#d9534f' }
      ],
      layout: {
        name: 'cola',
        animate: true,
        refresh: 2,
        convergenceThreshold: 0.01,
        maxSimulationTime: 4000
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
              'shape': 'ellipse'
            }
          },
          {
            selector: `node.contextual`,
            style: {
              'background-color': '#d9534f',
              'width': '20px',
              'height': '20px',
              'shape': 'ellipse'
            }
          },
          {
            selector: `node.related`,
            style: {
              'background-color': '#f0ad4e',
              'width': '20px',
              'height': '20px',
              'shape': 'triangle'
            }
          },
          {
            selector: `node.matched`,
            style: {
              'background-color': '#5cb85c',
              'font-weight': 'bold',
              'width': '25px',
              'height': '25px',
              'shape': 'star'
            }
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
              'text-background-color': 'whitesmoke'
            }
          }
        ],
        cyInstance: null
      }
    };
  },
  watch: {
    topicmap: function() {
      if (!this.currentNodeID || this.currentNodeID === 'all') {
        this.resetNetwork();
      }
    },
    conceptID: function(newValue) {
      this.currentNodeID = this.concept2node.get(newValue);
    },
    currentNodeID: function() {
      if (this.currentNodeID === 'all') {
        this.resetNetwork();
      } else {
        this.showNeighbours();
      }
    }
  },
  computed: {
    tm: function() {
      return this.topicmap || {};
    },
    title: function() {
      return this.tm.title || '';
    },
    currentConceptID: function() {
      return this.node2concept.get(this.currentNodeID);
    },
    totalNodes: function() {
      return this.nodes.length;
    },
    totalEdges: function() {
      return this.edges.length;
    },
    totalCurrentNodes: function() {
      return ((this.currentElements || {}).nodes || []).length;
    },
    totalCurrentEdges: function() {
      return ((this.currentElements || {}).edges || []).length;
    },
    nodes: function() {
      let cleanNodes = (this.tm.nodes || []).map(n => {
        let id = this.clean(n.id);
        return {
          id: id,
          label: this.clean(n.title).replace(/_/g, ' '),
          concept: this.node2concept.get(id)
        };
      });
      const uniqueNodes = new Map();
      for (const n of cleanNodes) {
        if (!uniqueNodes.has(n.id)) {
          uniqueNodes.set(n.id, n);
        }
      }
      return [...uniqueNodes.values()];
    },
    edges: function() {
      // get unique node IDs
      const nodeids = new Map();
      for (const n of this.nodes) {
        if (!nodeids.has(n.id)) nodeids.set(n.id, true);
      }
      // clean edges
      let cleanEdges = (this.tm.edges || [])
        .map(e => {
          let source = this.clean(e.source);
          let target = this.clean(e.target);
          // remove all underscores from label
          let label = this.clean(e.title).replace(/_/g, ' ');
          // only edges where source & target nodes exists
          if (nodeids.has(source) && nodeids.has(target)) {
            return {
              id: `${source}-${target}`,
              source: source,
              target: target,
              label: label
            };
          } else return null;
        })
        .filter(e => e); // filter out any null values

      // ensure uniqueness
      const uniqueEdges = new Map();
      for (const e of cleanEdges) {
        if (!uniqueEdges.has(e.id)) {
          uniqueEdges.set(e.id, e);
        }
      }
      return [...uniqueEdges.values()];
    },
    nodesByLabel: function() {
      return this.nodes.slice().sort((a, b) => a.label.localeCompare(b.label));
    },
    elements: function() {
      // formatted for cytoscape
      let cynodes = this.nodes.map(n => {
        return { group: 'nodes', data: n };
      });
      let cyedges = this.edges.map(e => {
        return { group: 'edges', data: e };
      });
      return [].concat(cynodes).concat(cyedges);
    },
    node2concept: function() {
      const n2c = new Map();
      (this.tm.topics || []).forEach(t => {
        let nid = this.clean(t.identifier);
        let cid = this.clean(t.concept);
        if (cid !== '' && !n2c.has(nid)) n2c.set(nid, cid);
      });
      return n2c;
    },
    concept2node: function() {
      const c2n = new Map();
      (this.tm.topics || []).forEach(t => {
        let nid = this.clean(t.identifier);
        let cid = this.clean(t.concept);
        if (cid !== '' && !c2n.has(cid)) c2n.set(cid, nid);
      });
      return c2n;
    }
  },
  methods: {
    zoomIn() {
      this.cyInstance.zoom({
        level: this.cyInstance.zoom() * 1.25,
        position: {
          x: Math.round(
            (this.cyInstance.extent().x1 + this.cyInstance.extent().x2) / 2
          ),
          y: Math.round(
            (this.cyInstance.extent().y1 + this.cyInstance.extent().y2) / 2
          )
        }
      });
    },
    zoomOut() {
      this.cyInstance.zoom({
        level: this.cyInstance.zoom() * 0.75,
        position: {
          x: Math.round(
            (this.cyInstance.extent().x1 + this.cyInstance.extent().x2) / 2
          ),
          y: Math.round(
            (this.cyInstance.extent().y1 + this.cyInstance.extent().y2) / 2
          )
        }
      });
    },
    fitAll() {
      this.cyInstance.fit();
    },
    clean: s => (s || '').toString().trim(),
    addNodeToFilter() {
      let concept = this.currentElements.nodes.filter(node => {
        return node.data.id === this.currentNodeID;
      });
      this.$emit('concept-filter', concept.pop().data);
    },
    resetNetwork() {
      // reset cytoscape elements
      this.cyInstance.elements().remove();
      this.cyInstance.add(this.elements);
      this.cyInstance.layout(this.layout).run();
      this.currentElements = this.cyInstance.json().elements;
      this.cyInstance.resize();
    },

    onNodeSelected(nodeID) {
      if (nodeID == null) this.currentNodeID = 'all';
      else if (this.currentNodeID !== nodeID) this.currentNodeID = nodeID;
    },

    preConfig(cytoscape) {
      cytoscape.use(cola);
    },

    showNeighbours: function() {
      // reset cytoscape elements
      this.cyInstance.elements().remove();
      this.cyInstance.add(this.elements);

      // get expansion for current concept
      let node = this.cyInstance.$id(this.currentNodeID); // root node
      let eles1 = node.neighborhood(); // 1 step away
      let eles2 = eles1.neighborhood(); // 2 steps away

      // add classes for level styling
      node.addClass('matched');
      eles1.map(e => e.addClass('related'));
      eles2.map(e => e.addClass('contextual'));

      // display the expanded elements
      this.cyInstance.elements().remove();
      this.cyInstance.add(node);
      this.cyInstance.add(eles1);
      this.cyInstance.add(eles2);
      this.cyInstance.layout(this.layout).run();
      this.currentElements = this.cyInstance.json().elements;
    }
  }
};
</script>

<style>
#cytoscape-div {
  height: 100%;
}
#cytoscape-div canvas {
  margin-left: -50%;
}
</style>
