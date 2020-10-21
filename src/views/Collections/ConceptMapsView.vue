<template>
  <b-container fluid>
<!-- Update Concept Map -->
    <router-view/>
    <br>
<!-- Concepts View -->
    <table-view-layout :rows="rows" component="Concepts" :limits="limits" :currentPage="currentPage" @inputChanged="updateFilter" :perPage="perPage" @change="updatePage" @limitUpdated="updateLimit">
      <template v-slot:table>
        <b-table v-if="topics" :filter="filter" :busy="conceptsLoading" :per-page="perPage" :current-page="currentPage" responsive table-variant="light" head-variant="light" :items="topics" :fields="fields" @filtered="updatePagination">
          <template v-slot:table-busy>
            <div class="text-center my-2">
              <b-spinner class="align-middle"></b-spinner>
              <strong>Loading...</strong>
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
      topics: [],
      fields: [
        { key: 'title', sortable: true },
        { key: 'description', sortable: true },
        { key: 'citation', sortable: true },
      ],
      conceptsLoading: true,
    }
  },
  mixins: [collectionMixin],
  watch: {
    topics(val) {
      if (val) {
        this.conceptsLoading = this.loadingState(val.length)
      }
    },
  },
  mounted() {
    this.currentId = this.$route.params.id
    this.$apollo.queries.getTopics.skip = false
  },

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
