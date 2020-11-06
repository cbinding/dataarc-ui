<template>
  <b-container fluid>
    <router-view />
    <table-view-layout
      v-if="$route.name === 'ConceptMaps'"
      :fluid="true"
      :rows="rows"
      :component="component"
      :limits="limits"
      :current-page="currentPage"
      :per-page="perPage"
      @inputChanged="updateFilter"
      @change="updatePage"
      @deleteConfirmed="deleteItem(itemToDelete, 'ConceptMaps')"
      @limitUpdated="updateLimit"
    >
      <template v-slot:button>
        <b-button
          variant="primary"
          :to="{name: 'Create ConceptMap' }"
        >
          <b-icon-plus />Add new Concept Map
        </b-button>
      </template>
      <template v-slot:table>
        <b-table
          v-if="conceptMaps"
          id="conceptMaps"
          ref="conceptMaps"
          :busy="conceptMapsLoading"
          :per-page="perPage"
          :current-page="currentPage"
          :filter="filter"
          responsive
          table-variant="light"
          head-variant="light"
          :items="conceptMaps"
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
                {{ row.item.topics_count }}
              </b-badge>
            </div>
          </template>
          <template
            v-slot:cell(actions)="row"
            class="actions"
          >
            <b-button-group size="sm">
              <b-button
                variant="primary"
                :disabled="row.item.processing || !row.item.source"
                @click="process(row.item, component)"
                v-text="'Process'"
              />
              <b-button
                :disabled="row.item.processing"
                :to="{name: 'ConceptMap View', params: {id: row.item.id} }"
                variant="primary"
                v-text="'Edit'"
              />
              <b-button
                :disabled="row.item.active || row.item.processing"
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
      component: 'ConceptMaps',
      displayFields: [
        { key: 'actions', sortable: false },
        { key: 'title', sortable: true },
        { key: 'description', sortable: true },
        { key: 'citation', sortable: true },
        { key: 'url', sortable: true },
        { key: 'topics_count', sortable: true },
      ],
      conceptMapsLoading: true,
    }
  },
  watch: {
    conceptMaps(val) {
      if (val) {
        this.$emit('bv::refresh::table', 'conceptMaps')
        this.conceptMapsLoading = this.loadingState(val.length)
      }
    },
    $route(to, from) {
      if (to.name !== 'ConceptMaps') {
        this.$apollo.queries.allConceptMaps.skip = true
      }
      else if (from.name !== 'ConceptMaps') {
        this.$apollo.queries.allConceptMaps.skip = false
        this.$apollo.queries.allConceptMaps.refetch()
      }
    },
  },
  created() {
    this.$apollo.queries.allConceptMaps.skip = false
  },
}
</script>
