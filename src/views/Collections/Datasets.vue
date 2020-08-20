<template>
  <div>
    <router-view/>
    <table-view-layout v-if="$route.name !== 'Dataset View'" :rows="rows" :component="component" :limits="limits" :currentPage="currentPage" :perPage="perPage" @change="updatePage" @deleteConfirmed="deleteItem(itemToDelete, 'Datasets')" @limitUpdated="updateLimit">
      <template v-slot:button>
        <b-button variant="primary" :to="{name: 'Create Dataset'}"><b-icon-plus></b-icon-plus>Add new Dataset</b-button>
      </template>
      <template v-slot:table>
        <b-table v-if="datasets" :responsive="true" table-variant="light" head-variant="light" :items="datasets" :fields="displayFields">
          <template v-slot:cell(description)="row" class="Description">
            <div class="w-200 text-truncate" style="max-width: 400px;" v-if="row.item.description">
              {{ row.item.description }}
            </div>
          </template>
          <template v-slot:cell(processing)="row" class="processing">
            <div>
              {{ row.item.processing }} <b-button size="sm" variant="primary" :disabled="row.item.processing" v-text="'Process'" @click="process(row.item)"></b-button>
            </div>
          </template>
          <template v-slot:cell(processedAt)="row" class="processedAt">
            <div>
              {{ row.item.processedAt }}
            </div>
          </template>
          <template v-slot:cell(actions)="row" class="actions">
            <b-link v-if="row.item" size="sm" class="mb-2" :to="{name: 'Dataset View', params: {id: row.item.id} }">
              <b-icon-pencil-square style="padding=50px;"></b-icon-pencil-square>
            </b-link>
            <b-link v-if="row.item" size="sm" class="mb-2" v-b-modal.deleteConfirmation @click="itemToDelete = row.item">
              <b-icon-trash></b-icon-trash>
            </b-link>
          </template>
        </b-table>
      </template>
    </table-view-layout>
  </div>
</template>

<script>
import gql from 'graphql-tag'
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
        'processing',
        'processedAt',
        'actions',
      ],
      processing: false,
    }
  },
  apollo: {
    datasets: {
      query: gql`
        query {
          datasets {
            id
            name
            title
            description
            citation
            processing
            processedAt
          }
        }
      `,
      skip: false,
    },
  },
  mounted() {
  },
  methods: {
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
      this.$apollo.queries.datasets.refetch()
    }
  },
}
</script>
