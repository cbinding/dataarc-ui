<template>
  <section
    id="spatial-section"
    class="bg-light"
  >
    <div class="container call-to-action">
      <div class="row">
        <div class="col-lg-12 text-center">
          <h2 class="section-heading">
            Map<sup><a
              href="http://www.data-arc.org/space/"
              class="text-dark"
              target="_blank"
              data-toggle="tooltip"
              title="How dataarc thinks about space and place"
            ><i class="fa fa-info-circle" /></a></sup>
          </h2>
          <hr class="primary">
          <div class="legend justify-content-md-center">
            <ul class="list-inline">
              <li class="list-inline-item">
                <img
                  src="img/icons/archaeological.png"
                  class="mx-auto"
                  alt="Archaeological Source Icon"
                >
                <mark class="typetip">Archaeological</mark> Sources
              </li>
              <li class="list-inline-item">
                <img
                  src="img/icons/textual.png"
                  class="mx-auto"
                  alt="Textual Source Icon"
                >
                <mark class="typetip">Textual</mark> Sources
              </li>
              <li class="list-inline-item">
                <img
                  src="img/icons/environmental.png"
                  class="mx-auto"
                  alt="Environmental Source Icon"
                >
                <mark class="typetip">Environmental</mark> Sources
              </li>
            </ul>
          </div>
          <open-layers />
          <!-- <leaflet :features="features" /> -->
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import gql from 'graphql-tag'
import BatchLoader from '@/workers/apollo-batch-loader.worker.js'
import Leaflet from './map-components/LeafletContainer.vue'
import OpenLayers from './map-components/OpenLayersContainer'

const featuresQuery = gql`
  query featureCollection ($limit: Int!, $start: Int!) {
    features (limit: $limit, start: $start) {
      id
      latitude
      longitude
    }
  }
`

const featuresCountQuery = gql`
  query {
    countFeatures
  }
`

export default {
  name: 'MapContainer',
  components: {
    Leaflet,
    OpenLayers,
  },
  data() {
    return {
      limit: 100,
      start: 0,
      features: [],
      featuresCount: 0,
      getPromises: [],
      step: 5000,
    }
  },
  mounted() {
    this.$apollo.query({
      query: featuresCountQuery,
    }).then(({ data }) => {
      this.featuresCount = data.countFeatures
      this.loadFeatures()
    })
  },
  methods: {
    loadFeatures() {
      if (this.start >= this.featuresCount) return
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
  },
}
</script>

<style>

</style>
