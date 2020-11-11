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
        <div class="col-lg-12">
          <div id="topicControls" class="btn-toolbar justify-content-between">
            <div class="btn-group">
              <button
                id="topicmapZoomIn"
                title="zoom in"
                class="btn btn-secondary"
              >
                <fa-icon icon="search-plus" />
              </button>
              <button
                id="topicmapZoomOut"
                title="zoom out"
                class="btn btn-secondary"
              >
                <fa-icon icon="search-minus" />
              </button>
              <button
                id="topicmapReset"
                title="reset"
                class="btn btn-secondary"
              >
                <fa-icon icon="redo" />
              </button>
              <button
                id="topicmapPause"
                title="pause"
                class="btn btn-secondary"
              >
                <fa-icon icon="pause" />
              </button>
              <button
                id="topicmapProceed"
                title="continue"
                class="btn btn-secondary"
              >
                <fa-icon icon="play" />
              </button>
              <button
                title="Label All Nodes"
                class="btn btn-secondary"
                :class="nodeTextBoolean ? 'active' : ''"
                @click.prevent="nodeTextBoolean = !nodeTextBoolean"
              >
                <fa-icon icon="font" />
              </button>
            </div>
            <div id="topicSearch" class="input-group">
              <vue-bootstrap-typeahead
                v-model="search"
                :data="nodes"
                :serializer="s => s.title"
                placeholder="Concept Search"
                @hit="selectedNode = $event"
              />
            </div>
          </div>
          <div id="conceptContainer" ref="topicmap" style="width: 100%">
            <div id="topicmap" style="padding:10px;">
              <network
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
              />
            </div>
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
    VueBootstrapTypeahead
  },
  data() {
    return {
      search: '',
      selectedNode: {},
      nodes: [],
      links: [],
      nodeTextBoolean: false,
      networkSizeSettings: {
        height: 600,
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
    getNodes() {
      this.$apollo
        .query({
          query: conceptMapQuery
        })
        .then(({ data }) => {
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
