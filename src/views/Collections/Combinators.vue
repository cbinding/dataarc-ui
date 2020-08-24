<template>
  <b-container fluid>
    <router-view/>
    <table-view-layout :rows.sync="rows" :component="component" :limits="limits" :currentPage.sync="currentPage" :perPage.sync="perPage" @change="updatePage" @deleteConfirmed="deleteItem(itemToDelete, 'Combinators')" @limitUpdated="updateLimit">
      <template v-slot:button>
        <b-button variant="primary" :to="{name: 'Create Combinator' }"><b-icon-plus></b-icon-plus>Add new Combinator</b-button>
      </template>
      <template v-slot:table>
        <b-table v-if="combinators" :per-page="perPage" :current-page="currentPage" responsive table-variant="light" head-variant="light" :items="combinators" :fields="displayFields">
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
            <b-button-group>
              <router-link :to="{name: 'Update Combinator', params: {id: row.item.id} }">
                <b-button size="sm" variant="primary" :disabled="row.item.state === 'running'" v-text="'Edit'"></b-button>
              </router-link>
              <b-button size="sm" variant="primary" :disabled="row.item.state === 'running'" v-text="'Delete'" @click="itemToDelete = row.item" v-b-modal.deleteConfirmation></b-button>
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
  data() {
    return {
      component: 'Combinators',
      displayFields: ['name', 'title', 'description', 'citation', 'actions'],
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
