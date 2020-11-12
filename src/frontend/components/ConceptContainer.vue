<template>
  <section id="concept-section" class="bg-white">
    <div class="container call-to-action">
      <div class="row">
        <div class="col-lg-12 text-center">
          <h2 class="section-heading">
            Concepts<sup
              ><a
                href="http://www.data-arc.org/conceptmapping/"
                class="text-dark"
                target="_blank"
                data-toggle="tooltip"
                title="How to use dataarc concepts in your search"
                ><fa-icon icon="info-circle"/></a
            ></sup>
          </h2>
          <hr class="primary" />
        </div>
        <div id="conceptContainer" ref="topicmap" style="width: 100%">
          <div id="topicmap" style="padding:10px;">
            <!-- <network
              v-if="networkSizeSettings.width > 0"
              :selectedNode="selectedNode"
              :node-list="nodes"
              :link-list="links"
              :svg-size="networkSizeSettings"
              svg-theme="light"
              :show-node-text="nodeTextBoolean"
              @clickNode="nodeSelected"
              @clickLink="linkSelected"
              @nodeAdded="addNodeToFilter"
            /> -->
            <cytoscape-network
              :topicmap="conceptMap"
              :svg-size="networkSizeSettings"
              @concept-filter="handleConceptFilter"
            />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import gql from 'graphql-tag';
import VueBootstrapTypeahead from 'vue-bootstrap-typeahead';

import Network from './concept-components/Network.vue';

import CytoscapeNetwork from './concept-components/Cytoscape.vue';

const conceptMapQuery = gql`
  query {
    conceptMaps(where: { active: true }) {
      name
      nodes
      edges
    }
  }
`;

export default {
  components: {
    Network,
    VueBootstrapTypeahead,
    CytoscapeNetwork
  },
  data() {
    return {
      search: '',
      selectedNode: {},
      nodes: [],
      conceptMap: {},
      links: [],
      nodeTextBoolean: false,
      networkSizeSettings: {
        height: 700,
        width: 0
      }
    };
  },
  mounted() {
    this.getNodes();
    this.$nextTick(() => {
      this.networkSizeSettings.width = this.$refs.topicmap.clientWidth - 20;
    });
  },
  methods: {
    handleConceptFilter(concept) {
      this.$emit('filtered', 'conceptual', concept);
    },
    getNodes() {
      this.$apollo
        .query({
          query: conceptMapQuery
        })
        .then(({ data }) => {
          this.conceptMap = data.conceptMaps[0];
          this.nodes = data.conceptMaps[0].nodes;
          this.links = data.conceptMaps[0].edges;
        });
    },
    nodeSelected({ node }) {
      console.log(node);
    },
    linkSelected({ link }) {
      console.log(link);
    },
    test(search) {
      console.log(search);
    },
    addNodeToFilter(node) {
      this.$emit('filtered', 'conceptual', node);
    }
  }
};
</script>

<style lang="scss">
.input-group {
  min-width: 274px !important;
}

.form-control {
  min-width: 274px !important;
}

@import '../scss/concepts';
</style>
