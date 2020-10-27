<template>
  <b-modal
    v-if="source"
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
                          1 - 3 of {{ source.count }}
                        </div>
                      </div>
                      <div class="d-flex justify-content-end">
                        <b-input-group>
                          <b-input v-model="filter" placeholder="Filter..."></b-input>
                        </b-input-group>
                      </div>
                    </b-row>
                    <b-table :fields="fields" :filter="filter" id="results-details-table" head-variant="light" table-variant="light" role="grid" dataTable striped bordered hover small :items="items">
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
                  </b-col>
                </b-container>
              </div>
            </b-col>
            <b-col sm="8">
                {{ source.description }}
            </b-col>
          </b-row>
        </div>
      </div>
    </template>
  </b-modal>

</template>

<script>

export default {
  name: 'ResultView',
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
      filter: '',
      fields: [
          { key: 'view', sortable: false },
          { key: 'date', sortable: true },
          { key: 'title', sortable: true },
      ],
      items: [
        {
          view: 'View',
          date: 'Date',
          title: 'Test 1',
        },
        {
          view: 'View',
          date: 'Date',
          title: 'Test 2',
        },
        {
          view: 'View',
          date: 'Date',
          title: 'Test 3',
        },
      ]
    }
  },
  watch: {
    source(newVal) {
      this.$bvModal.show(`results-details-${this.resultType}`)
    }
  },
  mounted() {
    this.$bvModal.show(`results-details-${this.resultType}`)
  },
  methods: {
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
