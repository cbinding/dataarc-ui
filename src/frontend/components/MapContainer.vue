<template>
  <section
    id="map-section"
    class="bg-light"
  >
    <b-container class="text-center pt-5 pb-5">
      <b-row>
        <b-col>
          <h2>
            Map
            <sup><a
              href="http://www.data-arc.org/space/"
              title="How dataarc thinks about space and place"
              class="text-dark"
              target="_blank"
              data-toggle="tooltip"
            ><b-icon-info-circle-fill /></a></sup>
          </h2>
          <hr class="primary">
          <p>Use the map to examine how data is distributed spatially.</p>
        </b-col>
      </b-row>
      <b-row class="justify-content-md-center">
        <b-col
          align-self="center"
          md="auto"
        >
          <b-icon-circle-fill class="text-archaeological" />
          <mark class="typetip">Archaeological</mark> Sources
        </b-col>
        <b-col
          align-self="center"
          md="auto"
        >
          <b-icon-circle-fill class="text-textual" />
          <mark class="typetip">Textual</mark> Sources
        </b-col>
        <b-col
          align-self="center"
          md="auto"
        >
          <b-icon-circle-fill class="text-environmental" />
          <mark class="typetip">Environmental</mark> Sources
        </b-col>
      </b-row>
      <b-row>
        <b-col class="mt-3 mb-3">
          <b-card
            no-body
            class="shadow"
          >
            <b-aspect aspect="16:9">
              <plotly
                :filtered-features="features"
                @filtered="addToFilter"
              />
            </b-aspect>
          </b-card>
        </b-col>
      </b-row>
    </b-container>
  </section>
</template>

<script>
import gql from 'graphql-tag'
import Plotly from './map-components/Plotly.vue'

// const featuresQuery = gql`
//   query featureCollection($limit: Int!, $start: Int!) {
//     features(limit: $limit, start: $start) {
//       id
//       latitude
//       longitude
//     }
//   }
// `

const featuresCountQuery = gql`
  query {
    countFeatures
  }
`

export default {
  name: 'MapContainer',
  components: {
    Plotly,
  },
  props: {
    filters: {
      type: [Object, Boolean],
      default: false,
    },
  },
  data() {
    return {
      limit: 100,
      start: 0,
      features: false,
      featuresCount: 0,
      getPromises: [],
      step: 5000,
    }
  },
  watch: {
    filters() {
      this.loadFeatures()
    },
  },
  mounted() {
    this.$apollo
    .query({
      query: featuresCountQuery,
    })
    .then(({ data }) => {
      this.featuresCount = data.countFeatures
      this.loadFeatures()
    })
  },
  methods: {
    loadFeatures() {
      if (Object.keys(this.filters).length < 1) {
        this.features = false
        return
      }
      window.axios.post(
        `${this.$apiUrl}/query/features`,
        this.filters,
      ).then(({ data }) => {
        this.features = data.sort((a, b) => {
          if (a < b) return -1
          if (a > b) return 1
          return 0
        })
      })
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
    },
  },
}
</script>

<style></style>
