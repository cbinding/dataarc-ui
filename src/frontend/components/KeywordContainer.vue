<template>
  <section
    id="keyword-section"
    class="bg-light"
  >
    <div class="call-to-action">
      <div class="container">
        <div class="row">
          <div class="col-lg-8 mx-auto text-center">
            <h2 class="section-heading">
              Keyword<sup>
                <a
                  href="http://www.data-arc.org/keywords/"
                  class="text-dark"
                  target="_blank"
                  data-toggle="tooltip"
                  title="How dataarc thinks about keywords"
                >
                  <fa-icon icon="info-circle" />
                </a>
              </sup>
            </h2>
            <hr class="primary" />
            <p>Use the keyword box to add keyword filters to the results.</p>
            <keyword v-model="keywords" />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import Keyword from './keyword-components/Keyword.vue'
export default {
  name: 'KeywordContainer',
  components: {
    Keyword,
  },
  data() {
    return {
      keywords: '',
    }
  },
  watch: {
    keywords() {
      this.$emit('input', this.keywords)
    },
  },
}
</script>

<style></style>
