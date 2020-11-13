<template>
  <section id="spatial-section" class="bg-light">
    <div class="container call-to-action">
      <div class="row">
        <div class="col-lg-12 text-center">
          <h2 class="section-heading">
            Map<sup
              ><a
                href="http://www.data-arc.org/space/"
                class="text-dark"
                target="_blank"
                data-toggle="tooltip"
                title="How dataarc thinks about space and place"
                ><fa-icon icon="info-circle"/></a
            ></sup>
          </h2>
          <hr class="primary" />
          <p>Use the map to examine how data is distributed spatially.</p>
          <div class="legend justify-content-md-center">
            <ul class="list-inline">
              <li class="list-inline-item">
                <span class="legend-item legend-item-one">&nbsp;&nbsp;</span>
                <mark class="typetip">Archaeological</mark> Sources
              </li>
              <li class="list-inline-item">
                <span class="legend-item legend-item-two">&nbsp;&nbsp;</span>
                <mark class="typetip">Textual</mark> Sources
              </li>
              <li class="list-inline-item">
                <span class="legend-item legend-item-three">&nbsp;&nbsp;</span>
                <mark class="typetip">Environmental</mark> Sources
              </li>
            </ul>
          </div>
          <div class="card shadow">
            <plotly @filtered="addToFilter"/>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import Vue from 'vue';
import gql from 'graphql-tag';
import BatchLoader from '@/workers/apollo-batch-loader.worker.js';
import Plotly from './map-components/PlotlyContainer.vue';
import VuePapaParse from 'vue-papa-parse';
Vue.use(VuePapaParse);
const featuresQuery = gql`
  query featureCollection($limit: Int!, $start: Int!) {
    features(limit: $limit, start: $start) {
      id
      latitude
      longitude
    }
  }
`;

const featuresCountQuery = gql`
  query {
    countFeatures
  }
`;

export default {
  name: 'MapContainer',
  components: {
    Plotly
  },
  data() {
    return {
      limit: 100,
      start: 0,
      features: [],
      featuresCount: 0,
      getPromises: [],
      step: 5000
    };
  },
  mounted() {
    this.$apollo
      .query({
        query: featuresCountQuery
      })
      .then(({ data }) => {
        this.featuresCount = data.countFeatures;
        this.loadFeatures();
      });
  },
  methods: {
    loadFeatures() {
      // window.axios.get(`${this.$apiUrl}/query/features`).then(({ data }) => {
      //   this.features = this.$papa.parse(data, {header: true}).data
      // })
      // if (this.start >= this.featuresCount) return
      // while (this.start <= this.featuresCount) {
      //   this.getPromises.push(
      //     window.axios.get(`${this.$apiUrl}/features?_limit=${this.step}&_start=${this.start}`).then(({ data }) => {
      //       this.features = [...this.features, ...data.filter((feature) => {
      //         return feature.latitude && feature.longitude
      //       })]
      //       console.log(this.features)
      //     }),
      //   )
      //   this.start += this.step
      // }
      // this.$apollo.query({
      //   query: featuresQuery,
      //   variables: {
      //     start: this.start,
      //     limit: this.limit,
      //   },
      // }).then(({ data }) => {
      //   this.features = [...this.features, ...data.features]
      //   this.start += 100
      //   this.loadFeatures()
      // })
    },
    addToFilter(type, payload) {
      // console.log(type);
      // console.log(payload);
      this.$emit('filtered', type, payload)
    }
  }
};
</script>

<style></style>
