<template>
  <section
    id="concept-section"
    class="bg-white"
  >
    <div class="container call-to-action">
      <div class="row">
        <div class="col-lg-12 text-center">
          <h2 class="section-heading">
            Concepts<sup><a
              href="http://www.data-arc.org/conceptmapping/"
              class="text-dark"
              target="_blank"
              data-toggle="tooltip"
              title="How to use dataarc concepts in your search"
            ><i class="fa fa-info-circle" /></a></sup>
          </h2>
          <hr class="primary">
        </div>
        <div class="col-lg-12">
          <div
            id="topicControls"
            class="btn-toolbar justify-content-between"
          >
            <div class="btn-group">
              <button
                id="topicmapZoomIn"
                title="zoom in"
                class="btn btn-secondary"
              >
                <span class="fa fa-search-plus" />
              </button>
              <button
                id="topicmapZoomOut"
                title="zoom out"
                class="btn btn-secondary"
              >
                <span class="fa fa-search-minus" />
              </button>
              <button
                id="topicmapReset"
                title="reset"
                class="btn btn-secondary"
              >
                <span class="fa fa-repeat" />
              </button>
              <button
                id="topicmapPause"
                title="pause"
                class="btn btn-secondary"
              >
                <span class="fa fa-pause" />
              </button>
              <button
                id="topicmapProceed"
                title="continue"
                class="btn btn-secondary"
              >
                <span class="fa fa-play" />
              </button>
            </div>
            <div
              id="topicSearch"
              class="input-group"
            />
          </div>
          <div
            id="conceptContainer"
            ref="topicmap"
            style="width: 100%"
          >
            <div
              id="topicmap"
            >
              <network
                :node-list="nodes"
                :link-list="links"
                :svg-size="networkSizeSettings"
                svg-theme="light"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>

import gql from 'graphql-tag'
import TopicMapsJSON from './topicmap.json'

import Network from './concepts-components/Network.vue'

const topicMapQuery = gql`
  query {
    topicMaps(where:{name:"topic_map_2020"}) {
      name
      nodes
      edges
    }
  }
`
console.log(TopicMapsJSON.data)
export default {
  apollo: {
    topicMaps: topicMapQuery,
  },
  components: {
    Network,
  },
  data() {
    return {
      nodes: TopicMapsJSON.data.topicMaps[0].nodes,
      links: TopicMapsJSON.data.topicMaps[0].edges,
      networkSizeSettings: {
        height: 600,
        width: 800,
      },
    }
  },
  mounted() {
    this.networkSizeSettings.height = this.$refs.topicmap.clientHeight
    this.networkSizeSettings.width = this.$refs.topicmap.clientWidth
  },
}
</script>

<style>

</style>
