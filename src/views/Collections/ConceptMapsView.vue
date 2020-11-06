<template>
  <b-container fluid>
<!-- Update Concept Map -->
    <router-view/>
    <br>
    <b-col sm="2">
      <b-alert
        variant="success"
        dismissible
        fade
        :show="dismissCountDown"
        @dismiss-count-down="countDownChanged"
      >
        Saved
      </b-alert>
    </b-col>
<!-- Concepts View -->
    <table-view-layout :fluid="false" :rows="rows" component="ConceptTopics" :limits="limits" :currentPage="currentPage" @inputChanged="updateFilter" :perPage="perPage" @change="updatePage" @limitUpdated="updateLimit">
      <template v-slot:table>
        <b-table v-if="conceptTopics" :filter="filter" :busy="conceptTopicsLoading" :per-page="perPage" :current-page="currentPage" responsive table-variant="light" head-variant="light" :items="conceptTopics" :fields="fields" @filtered="updatePagination">
          <template v-slot:table-busy>
            <div class="text-center my-2">
              <b-spinner class="align-middle"></b-spinner>
              <strong>Loading...</strong>
            </div>
          </template>
          <template v-slot:cell(concept)="row" class="Concept">
            <div style="max-width: 400px;">
              <b-dropdown :text="row.item.concept ? row.item.concept.title : ''">
                <b-dropdown-group v-for="concepts in groupedConcepts" :key="concepts.group">
                  <h4><strong>{{concepts.group}}</strong></h4>
                  <b-dropdown-divider></b-dropdown-divider>
                  <b-dropdown-item-button v-for="concept in concepts.values" :key="concept.id" v-model="row.item.concept" @click="updateConceptTopic(row.item, concept); row.item.concept = concept">
                    {{concept.title}}
                  </b-dropdown-item-button>
                  <br>
                </b-dropdown-group>
              </b-dropdown>
            </div>
          </template>
        </b-table>
      </template>
    </table-view-layout>
  </b-container>
</template>

<script>
import collectionMixin from '../../mixins/collectionMixin'
export default {
  data() {
    return {
      component: 'ConceptMap View',
      action: 'Update',
      conceptTopics: [],
      dismissSecs: 3,
      dismissCountDown: 0,
      fields: [
        { key: 'title', sortable: true },
        { key: 'concept', sortable: true },
      ],
      conceptTopicsLoading: true,
    }
  },
  mixins: [collectionMixin],
  watch: {
    conceptTopics(val) {
      if (val) {
        this.conceptTopicsLoading = this.loadingState(val.length)
      }
    },
  },
  mounted() {
    this.currentId = this.$route.params.id
    this.$apollo.queries.allConceptTopics.skip = false
    this.$apollo.queries.allConcepts.skip = false
  },
  methods: {
    updateConceptTopic(val, concept) {
      const temp = val
      temp.concept = concept.id
      temp.type = 'ConceptTopics'
      temp.action = 'Update'
      this.setFormData(temp)
    },
    countDownChanged(dismissCountDown) {
      this.dismissCountDown = dismissCountDown
    },
    showAlert() {
      this.dismissCountDown = this.dismissSecs
    },
  }

}
</script>

<style>
.form-control {
  padding-top: 0.35rem;
}

.table td {
  padding: 0.8rem;
  padding-right: 0rem;
}

.btn-sm, .btn-group-sm > .btn{
  padding: 0.3rem;
}
</style>
