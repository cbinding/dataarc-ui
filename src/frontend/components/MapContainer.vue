<template>
  <section id="map-section" class="bg-light">
    <b-container class="text-center pt-5 pb-5">
      <b-row>
        <b-col>
          <h2>
            Map
            <sup><a href="http://www.data-arc.org/space/" title="How dataarc thinks about space and place" class="text-dark" target="_blank" data-toggle="tooltip" ><b-icon-info-circle-fill /></a></sup>
          </h2>
          <hr class="primary">
          <p>Use the map to examine how data is distributed spatially.</p>
        </b-col>
      </b-row>
      <b-row class="justify-content-md-center">
        <b-col align-self="center" md="auto">
          <b-icon-circle-fill class="text-archaeological"/>
          <mark class="typetip">Archaeological</mark> Sources
        </b-col>
        <b-col align-self="center" md="auto">
          <b-icon-circle-fill class="text-textual"/>
          <mark class="typetip">Textual</mark> Sources
        </b-col>
        <b-col align-self="center" md="auto">
          <b-icon-circle-fill class="text-environmental"/>
          <mark class="typetip">Environmental</mark> Sources
        </b-col>
      </b-row>
      <b-row>
        <b-col class="mt-3 mb-3">
          <b-card no-body class="shadow">
            <b-aspect aspect="16:9">
              <plotly />
            </b-aspect>
          </b-card>
        </b-col>
      </b-row>
    </b-container>
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
    }
  }
};
</script>

<style></style>
