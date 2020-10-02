<template>
  <b-container fluid>
    <router-view />
    <table-view-layout
      v-if="$route.name === 'Concepts'"
      :rows="rows"
      :component="component"
      :limits="limits"
      :current-page="currentPage"
      :per-page="perPage"
      @inputChanged="updateFilter"
      @change="updatePage"
      @deleteConfirmed="deleteItem(itemToDelete, 'Concepts')"
      @limitUpdated="updateLimit"
    >
      <template v-slot:button>
        <b-button
          variant="primary"
          :to="{name: 'Create Concept' }"
        >
          <b-icon-plus />Add new Concept
        </b-button>
      </template>
      <template v-slot:table>
        <b-table
          v-if="concepts"
          ref="concepts"
          :busy="conceptsLoading"
          :per-page="perPage"
          :current-page="currentPage"
          :filter="filter"
          responsive
          table-variant="light"
          head-variant="light"
          :items="concepts"
          :fields="displayFields"
          @filtered="updatePagination"
        >
          <template v-slot:table-busy>
            <div class="text-center my-2">
              <b-spinner class="align-middle" />
              <strong>Loading...</strong>
            </div>
          </template>
          <template v-slot:cell(title)="row">
            <div
              v-if="row.item.title"
              class="text-wrap"
              style="width: 200px; max-width: 200px;"
            >
              {{ row.item.title }}
            </div>
          </template>
          <template v-slot:cell(description)="row">
            <div
              v-if="row.item.description"
              class="text-wrap"
              style="width: 400px; max-width: 450px;"
            >
              {{ shorten(row.item.description) }}
            </div>
          </template>
          <template v-slot:head(combinators_count)="row">
            <div class="text-center">
              # Combinators
            </div>
          </template>
          <template v-slot:cell(combinators_count)="row">
            <div class="text-center">
              <b-badge
                pill
                variant="primary"
              >
                {{ row.item.combinators_count }}
              </b-badge>
            </div>
          </template>
          <template v-slot:head(topics_count)="row">
            <div class="text-center">
              # Topics
            </div>
          </template>
          <template v-slot:cell(topics_count)="row">
            <div class="text-center">
              <b-badge
                pill
                variant="primary"
              >
                {{ row.item.topics_count ? row.item.topics_count : 0 }}
              </b-badge>
            </div>
          </template>
          <template
            v-slot:cell(actions)="row"
            class="actions"
          >
            <b-button-group size="sm">
              <b-button
                :to="{name: 'Update Concept', params: {id: row.item.id} }"
                variant="primary"
                v-text="'Edit'"
              />
              <b-button
                v-b-modal.deleteConfirmation
                variant="primary"
                @click="itemToDelete = row.item"
                v-text="'Delete'"
              />
            </b-button-group>
          </template>
        </b-table>
      </template>
    </table-view-layout>
  </b-container>
</template>

<script>
import collectionMixin from '../../mixins/collectionMixin'
export default {
  mixins: [collectionMixin],
  data() {
    return {
      component: 'Concepts',
      displayFields: [
        { key: 'actions', sortable: false },
        { key: 'title', sortable: true },
        { key: 'description', sortable: true },
        { key: 'citation', sortable: true },
        { key: 'url', sortable: true },
        { key: 'group', sortable: true },
        { key: 'combinators_count', sortable: true },
        { key: 'topics_count', sortable: true },
        { key: 'created_by', sortable: true },
        { key: 'updated_by', sortable: true },
      ],
      conceptsLoading: true,
    }
  },
  watch: {
    concepts(val) {
      if (val && val.length) {
        this.$emit('bv::refresh::table', 'concepts')
        this.conceptsLoading = this.loadingState(val.length)
      }
    },
    $route(to, from) {
      if (to.name !== 'Concepts') {
        this.$apollo.queries.allConcepts.skip = true
      }
      else if (from.name !== 'Concepts') {
        this.$apollo.queries.allConcepts.skip = false
        this.$apollo.queries.allConcepts.refetch()
      }
    },
  },
  created() {
    this.$apollo.queries.allConcepts.skip = false
  },
}
</script>
