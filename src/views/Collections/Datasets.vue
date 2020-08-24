<template>
  <div>
    <router-view/>
    <table-view-layout v-if="$route.name !== 'Dataset View'" :rows="rows" :component="component" :limits="limits" :currentPage="currentPage" :perPage="perPage" @change="updatePage" @deleteConfirmed="deleteItem(itemToDelete, 'Datasets')" @limitUpdated="updateLimit">
      <template v-slot:button>
        <b-button variant="primary" :to="{name: 'Create Dataset'}"><b-icon-plus></b-icon-plus>Add new Dataset</b-button>
      </template>
      <template v-slot:table>
        <b-table v-if="datasets" :per-page="perPage" :current-page="currentPage" responsive table-variant="light" head-variant="light" :items="datasets" :fields="displayFields">
          <template v-slot:cell(description)="row" class="Description">
            <div class="w-200 text-truncate" style="max-width: 400px;" v-if="row.item.description">
              {{ row.item.description }}
            </div>
          </template>
          <template v-slot:cell(state)="row" class="state">
            <div>
              <b-badge :variant="status(row.item.state)">
                {{ row.item.state ? row.item.state : 'pending' }}
              </b-badge>
            </div>
          </template>
          <template v-slot:cell(actions)="row" class="actions">
            <b-button size="sm" variant="primary" :disabled="row.item.state === 'processing'" v-text="'Process'" @click="process(row.item)"></b-button>
            <b-link v-if="row.item" :disabled="row.item.state === 'processing'" size="sm" class="mb-2" :to="{name: 'Dataset View', params: {id: row.item.id} }">
              <b-icon-pencil-square style="padding=50px;"></b-icon-pencil-square>
            </b-link>
            <b-link v-if="row.item" :disabled="row.item.state === 'processing'" size="sm" class="mb-2" v-b-modal.deleteConfirmation @click="itemToDelete = row.item">
              <b-icon-trash></b-icon-trash>
            </b-link>
          </template>
        </b-table>
      </template>
    </table-view-layout>
  </div>
</template>

<script>
import collectionMixin from '../../mixins/collectionMixin'
export default {
  data() {
    return {
      component: 'Datasets',
      displayFields: [
        'name',
        'title',
        'description',
        'citation',
        'state',
        'state_msg',
        'state_at',
        'actions',
      ],
      pending: 'warning',
      processing: 'info',
      updating: 'info',
      failed: 'danger',
      done: 'success',
    }
  },
  created() {
    this.$apollo.queries.allDatasets.skip = false
  },
  methods: {
    status(val) {
      if (val) {
        return this[val]
      }
      return 'secondary'
    },
    update(val) {
      const temp = []
      temp.fieldType = val.type
      temp.id = val.id
      temp.title = val.title
      temp.type = 'DatasetFields'
      temp.action = 'Update'
      this.setFormData(temp)
    },
  },
  mixins: [collectionMixin],
  watch: {
    $route(to, from) {
      // if (from.name !== 'Datasets') {
        this.$apollo.queries.allDatasets.refetch()
      // }
    }
  },
}
</script>

<style scoped>
a.disabled {
  pointer-events: none;
}
</style>
