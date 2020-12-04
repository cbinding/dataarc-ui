<template>
  <section
    class="bg-white"
  >
    <b-container class="text-center pt-5 pb-5">
      <b-row>
        <b-col>
          <h3>
            Searches
          </h3>
          <hr class="primary">
        </b-col>
      </b-row>
      <b-row class="justify-content-center">
        <b-col class="mt-3 mb-3">
          <b-card no-body class="shadow">
            <b-table head-variant="light" :fields="fields" :items="searches">
              <template v-slot:cell(actions)="row" class="actions">
                <b-button variant="primary" v-text="'Request Download'" @click="download = row.item"></b-button>
                <b-button variant="primary" v-text="'Download'" :disabled="true" @click="download = row.item"></b-button>
              </template>
            </b-table>
          </b-card>
        </b-col>
      </b-row>
    </b-container>
  </section>
</template>

<script>
import gql from 'graphql-tag'

const searchesQuery = gql`
  query searches($id: ID!) {
    searches(where: { user: $id }) {
      id
      title
      description
      filters
    }
    countSearches
  }
`

export default {
  props: {
    userId: {
      type: String,
      required: true
    },
  },
  data() {
    return {
      searches: [],
      count: 0,
      fields: [
        { key: 'actions', sortable: false },
        { key: 'title', sortable: true },
        { key: 'description', sortable: true },
        { key: 'filters', sortable: false },
      ],
      download: {}
    }
  },
  watch: {
    userId(val) {
      if (val) {
        this.getSearches()
      }
    }
  },
  mounted() {

  },
  methods: {
    getSearches() {
      this.$apollo
      .query({
        query: searchesQuery,
        variables: {
          id: this.userId,
        },
      })
      .then(({ data }) => {
        this.searches = data.searches
        this.count = data.countSearches
      })
    }
  }

}
</script>

<style>

</style>
