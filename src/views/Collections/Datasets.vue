<template>
  <div>
    <router-view/>
    <table-view-layout v-if="$route.name !== 'Dataset View'" :rows="rows" :component="component" :limits="limits" :currentPage="currentPage" :perPage="perPage" @inputChanged="updateFilter" @change="updatePage" @deleteConfirmed="deleteItem(itemToDelete, 'Datasets')" @limitUpdated="updateLimit">
      <template v-slot:button>
        <b-button variant="primary" :to="{name: 'Create Dataset'}"><b-icon-plus></b-icon-plus>Add new Dataset</b-button>
      </template>
      <template v-slot:table>
        <b-table v-if="datasets" :filter="filter" :per-page="perPage" :current-page="currentPage" responsive table-variant="light" head-variant="light" :items="datasets" :fields="displayFields" @filtered="updatePagination">
          <template v-slot:cell(description)="row" class="Description">
            <div class="w-200 text-truncate" style="max-width: 400px;" v-if="row.item.description">
              {{ row.item.description }}
            </div>
          </template>
          <template v-slot:cell(fields_count)="row" class="fieldsCount" >
            {{ fieldsCount[row.index] ? fieldsCount[row.index] : 0 }}
          </template>
          <template v-slot:cell(features_count)="row" class="featuresCount" >
            {{ featuresCount[row.index] ? featuresCount[row.index] : 0 }}
          </template>
          <template v-slot:cell(combinators_count)="row" class="combinatorsCount" >
            {{ combinatorsCount[row.index] ? combinatorsCount[row.index] : 0 }}
          </template>
          <template v-slot:cell(state)="row" class="state">
            <div>
              <b-badge :variant="status(row.item.state)">
                {{ row.item.state ? row.item.state : 'pending' }}
              </b-badge>
            </div>
          </template>
          <template v-slot:cell(state_at)="row" class="state_at">
            <div>
              {{ getDate(row.item.state_at) }}
            </div>
          </template>
          <template v-slot:cell(actions)="row" class="actions">
            <b-button-group>
              <b-button size="sm" variant="primary" :disabled="row.item.state === 'processing'" v-text="'Process'" @click="process(row.item)"></b-button>
              <router-link :to="{name: 'Dataset View', params: {id: row.item.id} }">
                <b-button size="sm" variant="primary" :disabled="row.item.state === 'processing'" v-text="'Edit'"></b-button>
              </router-link>
              <b-button size="sm" variant="primary" :disabled="row.item.state === 'processing'" v-text="'Delete'" @click="itemToDelete = row.item" v-b-modal.deleteConfirmation></b-button>
            </b-button-group>
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
        'name',
        'title',
        'description',
        'citation',
        'fields_count',
        'features_count',
        'combinators_count',
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
      fieldsCount: [],
      featuresCount: [],
      combinatorsCount: [],
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
    async getFieldsCount(val) {
      const fetchString = {
        query: gql`
          query datasetFieldsCount($id: ID!) {
            datasetFieldsCount(where: {dataset: $id})
          }
        `,
        variables: {
          id: val,
        },
      }
      const fields = await this.$apollo.query(fetchString).then(({ data, loading }) => {
        if (!loading && data && data.datasetFieldsCount) {
          return data.datasetFieldsCount
        }
      })
      if (fields) {
        return fields
      }
    },
    async getFeaturesCount(val) {
      const fetchString = {
        query: gql`
          query featuresCount($id: ID!) {
            featuresCount(where: {dataset: $id})
          }
        `,
        variables: {
          id: val,
        },
      }
      const features = await this.$apollo.query(fetchString).then(({ data, loading }) => {
        if (!loading && data && data.featuresCount) {
          return data.featuresCount
        }
      })
      if (features) {
        return features
      }
    },
    async getCombinatorsCount(val) {
      const fetchString = {
        query: gql`
          query combinatorsCount($id: ID!) {
            combinatorsCount(where: {dataset: $id})
          }
        `,
        variables: {
          id: val,
        },
      }
      const combinators = await this.$apollo.query(fetchString).then(({ data, loading }) => {
        if (!loading && data && data.combinatorsCount) {
          return data.combinatorsCount
        }
      })
      if (combinators) {
        return combinators
      }
    },
  },
  mixins: [collectionMixin],
  watch: {
    $route(to, from) {
      this.$apollo.queries.allDatasets.refetch()
    },
    datasets: async function(val) {
      if (val) {
        let promises = []
        let fields = []
        let features = []
        let combinators = []
        for(let i = 0; i < val.length; i++) {
          if(!fields[i]){
            promises.push(
              this.getFieldsCount(val[i].id).then((response) => {
                fields[i] = response ? response : 0
              })

            )
            promises.push(
              this.getFeaturesCount(val[i].id).then((response) => {
                features[i] = response ? response : 0
              })
            )
            promises.push(
              this.getCombinatorsCount(val[i].id).then((response) => {
                combinators[i] = response ? response : 0
              })
            )
          }
        }
        Promise.all(promises).then((data) => {
          for(let i = 0; i < fields.length; i++) {
            this.$set(this.fieldsCount, i, fields[i])
          }
          for(let i = 0; i < features.length; i++) {
            this.$set(this.featuresCount, i, features[i])
          }
          for(let i = 0; i < combinators.length; i++) {
            this.$set(this.combinatorsCount, i, combinators[i])
          }
        })
      }
    }
  },
}
</script>

<style scoped>
a.disabled {
  pointer-events: none;
}
</style>
