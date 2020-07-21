<template>
  <div class="apollo">
    <h3>Categories</h3>
    <ul>
      <li v-for="category in categories" :key="category.id">
        {{ category.name }}
      </li>
    </ul>
  </div>
</template>

<script>
import gql from 'graphql-tag';

export default {
  data() {
    return {
      categories: []
    };
  },
  apollo: {
    categories: gql`
      query {
        categories {
          id
          name
        }
      }
    `
  }
};
</script>
