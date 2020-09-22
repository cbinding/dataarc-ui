<template>
  <b-container fluid>
    <router-view/>
    <table-view-layout
      v-if="$route.name === 'TopicMaps'"
      :rows="rows"
      :component="component"
      :limits="limits"
      :current-page="currentPage"
      :per-page="perPage"
      @inputChanged="updateFilter"
      @change="updatePage"
      @deleteConfirmed="deleteItem(itemToDelete, 'TopicMaps')"
      @limitUpdated="updateLimit"
    >
      <template v-slot:button>
        <b-button
          variant="primary"
          :to="{name: 'Create TopicMap' }"
        >
          <b-icon-plus />Add new Topic Map
        </b-button>
      </template>
      <template v-slot:table>
        <b-table
          v-if="topicMaps"
          ref="topicMaps"
          id="topicMaps"
          :per-page="perPage"
          :current-page="currentPage"
          :filter="filter"
          responsive
          fixed
          table-variant="light"
          head-variant="light"
          :items="topicMaps"
          :fields="displayFields"
          @filtered="updatePagination"
        >
          <template v-slot:cell(title)="row">
            <div class="text-wrap" style="width: 200px; max-width: 200px;" v-if="row.item.title">
              {{ row.item.title }}
            </div>
          </template>
          <template v-slot:cell(description)="row">
            <div class="text-wrap" style="width: 400px; max-width: 450px;" v-if="row.item.description">
              {{ shorten(row.item.description) }}
            </div>
          </template>
          <template v-slot:head(topics_count)="row">
            <div class="text-center"># Topics</div>
          </template>
          <template v-slot:cell(topics_count)="row">
            <div class="text-center">
              <b-badge pill variant="primary">
                {{ row.item.topics_count }}
              </b-badge>
            </div>
          </template>
          <template v-slot:cell(actions)="row" class="actions">
            <b-button-group>
              <b-button size="sm" variant="primary" v-text="'Process'" @click="process(row.item, component)"></b-button>
              <b-button size="sm" :to="{name: 'Update TopicMap', params: {id: row.item.id} }" variant="primary" v-text="'Edit'"></b-button>
              <b-button size="sm" variant="primary" v-text="'Delete'" @click="itemToDelete = row.item" v-b-modal.deleteConfirmation></b-button>
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
      component: 'TopicMaps',
      displayFields: ['actions', 'title', 'description', 'citation', 'url', 'topics_count'],
    }
  },
  watch: {
    topicMaps(val) {
      if (val) {
        this.$emit('bv::refresh::table', 'topicMaps')
      }
    },
    $route(to, from) {
      if (to.name !== 'TopicMaps') {
        this.$apollo.queries.allTopicMaps.skip = true
      }
      else if (from.name !== 'TopicMaps') {
        this.$apollo.queries.allTopicMaps.skip = false
        this.$apollo.queries.allTopicMaps.refetch()
      }
    },
  },
  created() {
    this.$apollo.queries.allTopicMaps.skip = false
  },
}
</script>
