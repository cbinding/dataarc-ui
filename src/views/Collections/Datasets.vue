<template>
  <table-view-layout :rows="rows" :component="component" :limits="limits" :currentPage="currentPage" :perPage="perPage" @change="updatePage" @deleteConfirmed="deleteItem(itemToDelete, 'datasets')" @limitUpdated="updateLimit">
    <template v-slot:button>
      <b-button variant="primary" :to="{name: 'createDataset', params: {action:'Create', collectionType: 'Datasets'} }"><b-icon-plus></b-icon-plus>Add new Dataset</b-button>
    </template>
    <template v-slot:table>
      <b-table v-if="datasets" :responsive="true" table-variant="light" head-variant="light" :items="datasets" :fields="displayFields">
        <template v-slot:cell(description)="row" class="Description">
          <div class="w-200 text-truncate" style="max-width: 400px;" v-if="row.item.description">
            {{ row.item.description }}
          </div>
        </template>
        <template v-slot:cell(actions)="row" class="actions">
          <b-link v-if="row.item" size="sm" class="mb-2" :to="{name: 'editDataset', params: {id: row.item.id, item: row.item, action:'Update', collectionType: 'Datasets'} }">
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
      component: 'Datasets',
      displayFields: [
        'id',
        'name',
        'title',
        'description',
        'citation',
        'actions',
      ],
    }
  },
  mixins: [collectionMixin],
  watch: {
    $route(to, from) {
      this.$asyncComputed.datasets.update()
    }
  },
}
</script>
