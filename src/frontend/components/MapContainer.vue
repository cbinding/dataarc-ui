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
          <leaflet />
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import Leaflet from './map-components/LeafletContainer.vue'

export default {
  name: 'MapContainer',
  components: {
    Leaflet,
  },
}
</script>

<style>

</style>
