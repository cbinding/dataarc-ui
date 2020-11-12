<template>
  <div :style="{ width: svgSize.width + 'px' }">
    <b-card no-body class="shadow">
      <!--concept selector-->
      <b-input-group class="px-2 pt-2">
        <b-input-group-prepend>
          <label class="input-group-text" for="conceptSelect"
            ><b-icon-tag class="mr-1" /> Concept</label
          >
        </b-input-group-prepend>
        <b-form-select
          id="conceptSelect"
          v-model="currentNodeID"
          class="form-control"
        >
          <option value="all" title="Show All Concepts" selected="true"
            >All Concepts</option
          >
          <option
            v-for="(node, index) in nodesByLabel"
            :key="index"
            :value="node.id"
            :title="node.concept"
          >
            <span>{{ node.label }}</span>
          </option>
        </b-form-select>
        <b-input-group-append>
          <b-button
            @click.prevent="currentNodeID = 'all'"
            v-show="currentNodeID !== 'all'"
            variant="outline-dark"
            ><b-icon-arrow-left-circle-fill class="mr-2" /> Show All
            Concepts</b-button
          >
          <b-button
            @click.prevent="addNodeToFilter"
            v-show="currentNodeID !== 'all'"
            variant="success"
            ><b-icon-plus-circle-fill class="mr-2" /> Add Filter</b-button
          >
        </b-input-group-append>
      </b-input-group>

      <div class="position-relative">
        <div
          id="legend"
          class="card text-secondary p-0 mx-2 mt-2 position-absolute shadow-sm"
          style="{ top: 0; left: 0; z-index: 100; }"
        >
          <div v-b-toggle.legendItems class="card-header px-3 py-1">
            <b-icon-key class="mr-2" />Key
          </div>
          <b-collapse id="legendItems" class="card-body m-0 px-3 py-1">
            <b-list-group flush class="bg-light">
              <b-list-group-item
                v-for="(item, index) in legendItems"
                :key="index"
                class="m-0 p-0 border-0"
              >
                <svg height="14" width="14">
                  <circle
                    cx="6"
                    cy="6"
                    r="5"
                    stroke="black"
                    stroke-width="1"
                    :fill="item.fill"
                  />
                </svg>
                <span class="ml-1">{{ item.label }}</span>
              </b-list-group-item>
            </b-list-group>
          </b-collapse>
        </div>
      </div>

      <div class="position-relative">
        <div
          class="p-0 mx-2 position-absolute"
          style="{ top: 0; right: 0; z-index: 100; }"
        >
          <div class="text-right">
            <b-badge variant="secondary"
              >{{ totalCurrentNodes }} of {{ totalNodes }} nodes</b-badge
            >&nbsp;
            <b-badge variant="secondary"
              >{{ totalCurrentEdges }} of {{ totalEdges }} edges</b-badge
            >
          </div>
        </div>
      </div>

      <!--cytoscape graph-->
      <cytoscape
        ref="cy"
        :config="config"
        :preConfig="preConfig"
        class="bg-white"
      />
    </b-card>
  </div>
</template>

<script>
import cola from 'cytoscape-cola';
//import dagre from 'cytoscape-dagre'
//import DartConceptExpansionList from '@/components/DartConceptExpansionList.vue'

export default {
  name: 'CytoscapeNetwork',
  components: {
    //nodeHtmlLabel,
    //DartConceptExpansionList
  },
  props: {
    topicmap: {
      type: Object,
      required: true
    },
    conceptID: {
      type: String,
      required: false
    },
    svgSize: {
      type: Object,
      default: () => {
        return {
          width: window.innerWidth,
          height: window.innerHeight
        };
      }
    }
  },
  mounted: function() {
    this.cyInstace = this.$refs.cy.instance;
    let self = this;
    this.cyInstace.on('click tap', 'node', function(evt) {
      self.currentNodeID = evt.target.id();
      //console.log( 'clicked ' + evt.target.id() );
    });
    this.resetNetwork();
  },
  data: function() {
    return {
      currentNodeID: 'all', //this.conceptID, // wrong...
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
        maxSimulationTime: 8000
      },

      config: {
        style: [
          {
            selector: 'node',
            style: {
              width: '15px',
              height: '15px',
              'background-color': '#d9534f',
              'border-color': '#292b2c',
              'border-width': '1px',
              label: 'data(label)',
              'font-size': '0.8em',
              'text-valign': 'top',
              'text-halign': 'center',
              shape: 'ellipse'
            }
          },
          {
            selector: `node.level1`,
            style: {
              'background-color': '#f0ad4e',
              width: '20px',
              height: '20px',
              shape: 'triangle'
            }
          },
          {
            selector: `node.level0`,
            style: {
              'background-color': '#5cb85c',
              'font-weight': 'bold',
              width: '25px',
              height: '25px',
              shape: 'star'
            }
          },
          {
            selector: 'edge',
            style: {
              width: 1,
              'line-color': '#bbc3c7',
              'target-arrow-color': '#bbc3c7',
              'target-arrow-shape': 'triangle',
              'curve-style': 'haystack',
              label: 'data(label)',
              'font-size': '0.5em',
              color: '#292b2c',
              'text-rotation': 'autorotate',
              'text-background-opacity': 0.5,
              'text-background-color': 'white'
            }
          }
        ],
        layout: this.layout,
        cyInstace: null
      }
    };
  },
  watch: {
    topicmap: function() {
      // set current node ID to a random value if not already set
      if (!this.currentNodeID || this.currentNodeID === 'all') {
        this.resetNetwork();
        // let nodeCount = this.nodes.length;
        // let randomIndex = Math.floor(Math.random() * nodeCount);
        // this.currentNodeID = this.nodes[randomIndex].id;
      }
    },

    conceptID: function(newValue) {
      this.currentNodeID = this.concept2node.get(newValue);
      console.log('new conceptID: ' + newValue);
      //this.showNeighbours()
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
      // get mapping from node IDs to concept IDs
      /*let node2concept = new Map();
            (this.tm.topics || []).forEach(t => {
                let nodeid = this.clean(t.identifier)
                let conceptid = this.clean(t.concept)
                if(!node2concept.has(nodeid))
                    node2concept.set(nodeid, conceptid)
            }) */

      let cleanNodes = (this.tm.nodes || []).map(n => {
        //let id = this.clean(n.id)
        //let label = this.clean(n.title).replace(/_/g, " ")
        //let concept = null
        //if(this.node2concept.has(id)) {
        //concept = this.node2concept.get(id)
        // }
        let id = this.clean(n.id);
        return {
          id: id,
          label: this.clean(n.title).replace(/_/g, ' '),
          concept: this.node2concept.get(id)
        };
      });
      // ensure uniqueness
      const uniqueNodes = new Map();
      for (const n of cleanNodes) {
        if (!uniqueNodes.has(n.id)) {
          uniqueNodes.set(n.id, n);
        }
      }
      return [...uniqueNodes.values()];
      //return Array.from(uniqueNodes.values())
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
      return [...uniqueEdges.values()]; // Array.from( uniqueEdges.values() )
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
    // mapping between node id and concept id
    node2concept: function() {
      const n2c = new Map();
      (this.tm.topics || []).forEach(t => {
        let nid = this.clean(t.identifier);
        let cid = this.clean(t.concept);
        if (cid !== '' && !n2c.has(nid)) n2c.set(nid, cid);
      });
      return n2c;
    },
    // mapping between concept id and node id
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
    clean: s => (s || '').toString().trim(),

    addNodeToFilter() {
      let concept = this.currentElements.nodes.filter(node => {
        return node.data.id === this.currentNodeID;
      });
      this.$emit('concept-filter', concept.pop().data);
    },

    resetNetwork() {
      // reset cytoscape elements
      this.cyInstace.elements().remove();
      this.cyInstace.add(this.elements);
      this.cyInstace.layout(this.layout).run();
      this.currentElements = this.cyInstace.json().elements;
    },

    onNodeSelected(nodeID) {
      //document.getElementById("conceptSelect").value = nodeID
      if (this.currentNodeID !== nodeID) {
        this.currentNodeID = nodeID;
        //this.showNeighbours()
      }
    },

    preConfig(cytoscape) {
      cytoscape.use(cola);
    },

    showNeighbours: function() {
      // reset cytoscape elements
      this.cyInstace.elements().remove();
      this.cyInstace.add(this.elements);

      // get expansion for current concept
      let node = this.cyInstace.$id(this.currentNodeID); // root node
      let eles1 = node.neighborhood(); // 1 step away
      let eles2 = eles1.neighborhood(); // 2 steps away

      // todo - prune edges pointing back if we already have them?
      // (don't want to display bidirectional links?)
      // issue hidden for now using haystack lines...

      // add classes for level styling
      node.addClass('level0');
      eles1.map(e => e.addClass('level1'));
      eles2.map(e => e.addClass('level2'));

      // display the expanded elements
      this.cyInstace.elements().remove();
      this.cyInstace.add(node);
      this.cyInstace.add(eles1);
      this.cyInstace.add(eles2);
      this.cyInstace.layout(this.layout).run();
      this.currentElements = this.cyInstace.json().elements;
    }
  }
};
</script>

<style scoped></style>
