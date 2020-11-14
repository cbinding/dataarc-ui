<template>
  <section id="filter-section" class="bg-secondary text-white">
    <div class="call-to-action">
      <div class="container text-center">
        <h2 class="section-heading">Filters</h2>
        <hr />
        <div id="filters" class="row" v-if="filters">
          &nbsp;
          <div
            class="col-sm filters-container"
            id="filters-spatial"
            v-if="filters.box || filters.polygon"
          >
            <h3>Spatial</h3>
            <div
              class="p-3 mb-2 filter-spatial text-white"
              data-type="spatial"
              v-if="filters.box"
            >
              {{ filters.box }}
              <button
                type="button"
                class="close text-light filters-remove"
                @click="$emit('removed', 'box')"
                aria-label="Remove"
              >
                <span aria-hidden="true">×</span>
              </button>
            </div>
            <div
              class="p-3 mb-2 filter-spatial text-white"
              data-type="spatial"
              v-if="filters.polygon"
            >
              {{ filters.polygon }}
              <button
                type="button"
                class="close text-light filters-remove"
                @click="$emit('removed', 'polygon')"
                aria-label="Remove"
              >
                <span aria-hidden="true">×</span>
              </button>
            </div>
          </div>
          <div
            class="col-sm filters-container"
            id="filters-temporal"
            v-if="filters.temporal && filters.temporal.length > 0"
          >
            <h3>Temporal</h3>
            <div
              class="p-3 mb-2 filter-temporal text-white"
              data-type="temporal"
              v-for="(filter, index) in filters.temporal"
              :key="index"
            >
              <span>Range: {{ filter.start }} - {{ filter.end }} </span>
              <button
                type="button"
                class="close text-light filters-remove"
                @click="$emit('removed', 'temporal', index)"
                aria-label="Remove"
              >
                <span aria-hidden="true">×</span>
              </button>
            </div>
          </div>
          <div
            class="col-sm filters-container"
            id="filters-concepts"
            v-if="filters.conceptual && filters.conceptual.length"
          >
            <h3>Concepts</h3>
            <div
              class="p-3 mb-2 filter-concepts text-white"
              data-type="concepts"
              v-for="(filter, index) in filters.conceptual"
              :key="index"
            >
              {{ filter.label }}
              <button
                type="button"
                class="close text-light filters-remove"
                @click="$emit('removed', 'conceptual', index)"
                aria-label="Remove"
              >
                <span aria-hidden="true">×</span>
              </button>
            </div>
          </div>
          <div
            class="col-sm filters-container"
            id="filters-keywords"
            v-if="filters.keywords"
          >
            <h3>Keywords</h3>
            <div
              v-for="(filter, index) in filters.keywords"
              :key="index"
              class="p-3 mb-2 filter-concepts text-white"
              data-type="concepts"
            >
              {{ filter }}
              <button
                type="button"
                class="close text-light filters-remove"
                aria-label="Remove"
                @click="$emit('removed', 'keywords', index)"
              >
                <span aria-hidden="true">×</span>
              </button>
            </div>
          </div>
        </div>
        <a ref="downloadAnchor" :href="filterDownloadData" :download="downloadName" style="display:none"></a>
        <button id="filter-save" @click="saveSearchFilters" class="btn btn-primary">
          <i class="fa fa-bookmark sr-icons" /> Save Search
        </button>
        <button id="filter-share" class="btn btn-primary">
          <i class="fa fa-print sr-icons" /> Share Search
        </button>
        <input type="file"
          @change="readFile"
          style="display:none"
          ref="fileUpload"
        >
        <button id="filter-save" @click="startFileUpload" class="btn btn-primary">
          <i class="fa fa-bookmark sr-icons" /> Load Search From File
        </button>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  props: {
    filters: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      filterDownloadData: null,
      downloadName: 'filters.json'
    }
  },
  methods: {
    readFile(e) {
      const file = e.target.files[0]

      const reader = new FileReader()

      reader.readAsText(file)
      let _this = this
      reader.onload = function () {
        _this.loadPreviousSearch(reader.result)
      }

      reader.onerror = function () {
        console.log(reader.error)
      }
    },
    loadPreviousSearch(data) {
      this.$emit('filters-loaded', JSON.parse(data))
    },
    startFileUpload() {
      this.$refs.fileUpload.click()
    },
    saveSearchFilters() {
      this.filterDownloadData = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(this.filters))
      this.$refs.downloadAnchor.click()
      // dlAnchorElem.setAttribute("href", dataStr);
      // dlAnchorElem.setAttribute("download", "fitlers.json");
      // dlAnchorElem.click();
    }
  }
};
</script>

<style lang="scss">
#filters {
  margin-bottom: 40px;
  text-transform: capitalize;
}

#filters h3:first-letter {
  text-transform: capitalize;
}

/* filter type colors */
.filter-keywords {
  background-color: #777;
}
.filter-temporal {
  background-color: #555;
}
.filter-spatial {
  background-color: #444;
}
.filter-concepts {
  background-color: #666;
}
</style>
