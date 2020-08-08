<template>
  <table-view-layout :rows.sync="rows" :component="component" :limits="limits" :currentPage.sync="currentPage" :perPage.sync="perPage" @change="updatePage" @deleteConfirmed="deleteItem(itemToDelete, 'combinators')" @limitUpdated="updateLimit">
    <template v-slot:button>
      <b-button variant="primary" :to="{name: 'createCombinator', params: {action:'Create', collectionType: 'Combinators'} }"><b-icon-plus></b-icon-plus>Add new Combinator</b-button>
    </template>
    <template v-slot:table>
      <b-table v-if="combinators" :per-page="perPage" :current-page="currentPage" :responsive="true" table-variant="light" head-variant="light" :items="combinators" :fields="displayFields">
        <template v-slot:cell(description)="row" class="Description">
          <div class="w-200 text-truncate" style="max-width: 400px;" v-if="row.item.description">
            {{ row.item.description }}
          </div>
        </template>
        <template v-slot:cell(citation)="row" class="Citation">
          <div class="w-200 text-truncate" style="max-width: 400px;" v-if="row.item.citation">
            {{ row.item.citation }}
          </div>
        </template>
        <template v-slot:cell(actions)="row" class="actions">
          <b-link v-if="row.item" size="sm" class="mb-2" :to="{name: 'editCombinator', params: {id: row.item.id, item: row.item, action:'Update', collectionType: 'Combinators'} }">
            <b-icon-pencil-square style="padding=50px;"></b-icon-pencil-square>
          </b-link>
          <b-link v-if="row.item" size="sm" class="mb-2" v-b-modal.deleteConfirmation @click="itemToDelete = row.item.id">
            <b-icon-trash></b-icon-trash>
          </b-link>
        </template>
      </b-table>
    </template>
  </table-view-layout>
</template>

<script>
import collectionMixin from '../../mixins/collectionMixin'
export default {
  data() {
    return {
      component: 'Combinators',
      displayFields: ['id', 'name', 'title', 'description', 'citation', 'actions'],
    }
  },
  mixins: [collectionMixin],
  watch: {
    $route(to, from) {
      this.$asyncComputed.combinators.update()
    },
  },
}
</script>
