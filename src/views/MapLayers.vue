<template>
  <div class="apollo">
    <h3>Map Layers</h3>
    <ul>
      <li
        v-for="mapLayer in mapLayers"
        :key="mapLayer.id"
      >
        {{ mapLayer.name }}
      </li>
    </ul>
  </div>
</template>

<script>
import gql from 'graphql-tag'

export default {
  data() {
    return {
      mapLayers: [],
    }
  },
  apollo: {
    mapLayers: gql`
      query {
        mapLayers {
          id
          name
        }
      }
    `,
  },
}
</script>
