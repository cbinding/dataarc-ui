<template>
  <b-modal
    v-if="source && currentDataset"
    class="modal-dialog"
    :id="`results-details-${resultType}`"
    header-bg-variant="dark"
    header-text-variant="light"
    :hide-footer="true"
    size="xl"
  >
    <template class="modal-title" #modal-title>
      {{ `${resultType} Results: ${source.result.category}` }}
    </template>
    <template #default>
      <h4>{{ source.dataset }}</h4>
      <br>
      <div class="tab-content" id="results-source-tabContent">
        <div id="sead-content" class="tab-pane fade show active" role="tabpanel">
          <b-row>
            <b-col sm="4" class="source-table">
              <div id="results-details-table_wrapper" class="dataTables_wrapper container-fluid dt-bootstrap4 no-footer">
                <b-container fluid>
                  <b-col>
                    <b-row class="justify-content-between">
                      <div class="badge badge-light text-dark d-flex justify-content-start">
                        <div class="dataTables_info" id="results-details-table_info" role="status" aria-live="polite">
                          {{ getStart }} - {{ getNext }} of {{ rows }}
                        </div>
                      </div>
                      <div class="d-flex justify-content-end">
                        <b-input-group>
                          <b-input v-model="filter" placeholder="Filter..."></b-input>
                        </b-input-group>
                      </div>
                    </b-row>
                    <b-table @filtered="updatePagination" :busy="loading" :fields="fields" :filter="filter" :per-page="10" :current-page="currentPage" id="results-details-table" head-variant="light" table-variant="light" role="grid" dataTable striped bordered hover small :items="features">
                      <template v-slot:table-busy>
                        <div class="text-center my-2">
                          <b-spinner class="align-middle"></b-spinner>
                          <strong>Loading...</strong>
                        </div>
                      </template>
                      <template #table-colgroup="scope">
                        <col
                          v-for="field in scope.fields"
                          :key="field.key"
                          :style="{ width: field.key === 'view' || field.key === 'date' ? '80px' : '180px',  }"
                        >
                      </template>
                      <template v-slot:cell(view)="row" class="view">
                        <b-button variant="light" v-text="'View'" @click="feature = row.item"></b-button>
                      </template>
                    </b-table>
                    <b-row>
                      <div class="d-flex justify-content-end">
                        <b-pagination
                          size="sm"
                          v-model="currentPage"
                          :total-rows="rows"
                          :per-page="10"
                          :limit="4"
                          first-number
                          last-number
                        />
                      </div>
                    </b-row>
                  </b-col>
                </b-container>
              </div>
            </b-col>
            <b-col sm="8" class="source-details">
              <!-- <div class="chartjs-size-monitor" style="position: absolute; left: 0px; top: 0px; right: 0px; bottom: 0px; overflow: hidden; pointer-events: none; visibility: hidden; z-index: -1;">
                <div class="chartjs-size-monitor-expand" style="position:absolute;left:0;top:0;right:0;bottom:0;overflow:hidden;pointer-events:none;visibility:hidden;z-index:-1;">
                  <div style="position:absolute;width:1000000px;height:1000000px;left:0;top:0">
                  </div>
                </div>
                <div class="chartjs-size-monitor-shrink" style="position:absolute;left:0;top:0;right:0;bottom:0;overflow:hidden;pointer-events:none;visibility:hidden;z-index:-1;">
                  <div style="position:absolute;width:200%;height:200%;left:0; top:0">
                  </div>
                </div>
              </div> -->
              <b-col sm="12" v-if="!feature.title">
                <b-row v-if="currentDataset.description">
                  <strong>Description: </strong>
                  {{ currentDataset.description }}
                  <br>
                  <br>
                </b-row>
                <b-row v-if="currentDataset.citation">
                  <strong>Citation: </strong>
                  {{ currentDataset.citation }}
                  <br>
                  <br>
                </b-row>
                <b-row v-if="currentDataset.url">
                  <strong>Url: </strong>
                  <a :href="currentDataset.url">{{ currentDataset.url }}</a>
                </b-row>
              </b-col>
              <b-col sm="12" v-if="feature.title">
                <h3>{{feature.title}}</h3>
                <br>
                <b-row>
                  <b-col sm="6">
                    <div class="text-center">
                      <h4>Details</h4>
                      <br>
                    </div>
                    <b-jumbotron
                      border-variant="secondary"
                      bg-variant="light"
                      style="height:400px;overflow-y:auto;overflow-x:auto"
                    >
                      <div
                        v-html="
                          pug.render(feature.details, feature.properties)
                        "
                        lang="pug"
                      />
                    </b-jumbotron>
                  </b-col>
                  <b-col sm="6">
                    <div class="text-center">
                      <h4>Summary</h4>
                    </div>
                    <br>
                    <b-jumbotron
                      border-variant="secondary"
                      bg-variant="light"
                      style="height:400px;overflow-y:auto;overflow-x:auto"
                    >
                      <div
                        v-html="
                          pug.render(feature.summary, feature.properties)
                        "
                        lang="pug"
                      />
                    </b-jumbotron>
                  </b-col>
                </b-row>
              </b-col>
              <!-- <chart :feature="feature"></chart> -->
            </b-col>
          </b-row>
        </div>
      </div>
    </template>
  </b-modal>

</template>

<script>
import gql from 'graphql-tag'
import Chart from './ResultChart.vue'

const datasetQuery = gql`
  query datasets($id: ID!) {
    datasets(where: { id: $id }) {
      id
      title
      description
      citation
      url
      features_count
    }
  }
`
const featuresQuery = gql`
  query features($id: ID!, $start: Int!, $limit: Int!) {
    features(where: { dataset: $id }, start: $start, limit: $limit) {
      id
      title
      summary
      details
      properties
    }
  }
`
export default {
  name: 'ResultView',
  components: {
    Chart
  },
  props: {
    filters: {
      type: Object,
      required: true,
    },
    source: {
      type: Object,
      required: true,
    },
    resultType: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      pug: require('pug'),
      loading: true,
      filter: '',
      feature: {},
      features: [],
      currentDataset: {},
      currentDatasetId: '',
      currentPage: 1,
      start: 0,
      limit: 100,
      rows: 10,
      fields: [
        { key: 'view', sortable: false },
        { key: 'date', sortable: true },
        { key: 'title', sortable: true },
      ],
    }
  },
  computed: {
    getStart() {
      return this.firstPage ? 1 : ((this.currentPage - 1) * 10) + 1
    },
    getNext() {
      return this.getStart + 9 > this.rows ? this.rows : this.nextVal
    },
    nextVal() {
      return this.firstPage ? 10 : (this.currentPage * 10)
    },
    firstPage() {
      return this.currentPage === 1
    },
  },
  watch: {
    source(newVal) {
      this.currentDatasetId = this.source.dataset_id
      this.rows = this.source.total
      this.$bvModal.show(`results-details-${this.resultType}`)
      this.features = []
      this.feature = {}
    },
    currentDatasetId(val) {
      this.start = 0
      this.getDataset()
      this.getFeatures()
    },
    features(val) {
      this.loading = this.loadingState(val.length)
    }
  },
  mounted() {
    this.$bvModal.show(`results-details-${this.resultType}`)
    this.currentDatasetId = this.source.dataset_id
    this.rows = this.source.total
  },
  methods: {
    getDataset() {
      this.currentDataset = {}
      this.$apollo.query({
        query: datasetQuery,
        variables: {
          id: this.currentDatasetId,
        },
      }).then(({ data }) => {
        [this.currentDataset] = data.datasets
      })
    },
    getFeatures() {
      this.$apollo.query({
        query: featuresQuery,
        variables: {
          id: this.currentDatasetId,
          start: this.start,
          limit: this.limit,
        },
      }).then(({ data }) => {
        this.features = [...this.features, ...data.features]
        if (this.features.length < this.rows) {
          this.start += 100
          this.getFeatures()
        }
      })
    },
    updatePage(val) {
      this.currentPage = val
    },
    updatePagination(array, val) {
      this.currentPage = 1
      this.rows = val
    },
    loadingState(length) {
      if (length === 0) {
        return false
      }
      return ((this.currentPage * 10) - 9) > length
    },
  },
}
</script>

<style>

.modal-header {
}

.modal-title {
	line-height: inherit;
	text-transform: capitalize;
}

.modal-body {
	margin-top: 10px;
	padding: 0;
}

.source-details {
	overflow: auto;
}

.dataTables_wrapper {
	padding: 0;
}
.dataTables_wrapper .badge {
	background: none;
	font-weight: normal;
}
</style>
