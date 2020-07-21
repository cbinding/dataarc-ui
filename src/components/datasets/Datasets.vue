<template>
  <v-container fluid grid-list-xl>
    <v-layout row wrap v-if="datasets.length > 0">
      <v-flex xs12 sm6 v-for="dataset in datasets" :key="dataset.id">
        <v-card class="mx-auto" max-width="344" outlined hover>
          <v-list-item three-line>
            <v-list-item-content>
              <div
                class="overline mb-4"
                v-if="dataset.category"
                :color="dataset.category.color"
              >
                {{ dataset.category.name }}
              </div>
              <v-list-item-title class="headline mb-1">{{
                dataset.name
              }}</v-list-item-title>
            </v-list-item-content>

            <v-list-item-avatar
              tile
              size="80"
              color="grey"
            ></v-list-item-avatar>
          </v-list-item>
          <v-card-text>
            {{ dataset.description }}
          </v-card-text>

          <v-card-actions>
            <v-btn text>Manage</v-btn>
            <v-btn text>Delete</v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { gql } from 'apollo-boost';
import moment from 'moment';

export default {
  name: 'Datasets',
  data() {
    return {
      datasets: [],
      showPostCreator: false
    };
  },
  apollo: {
    datasets: {
      query: gql`
        query {
          datasets {
            id
            name
            description
            category {
              name
              color
            }
            updatedAt
          }
        }
      `
    }
  },
  methods: {
    goTo(id) {
      this.$router.push(`/datasets/${id}`);
    },
    formatDate(date) {
      return moment(new Date(date)).format('ll');
    }
  }
};
</script>
