<template>
  <div>
    <b-container>
      <div class="panel panel-default">
        <div class="panel-heading">
          Update Role
          <br>
        </div>
        <div class="panel-body">
          <p v-if="errors.length">
            <b>Please correct the following error(s):</b>
            <ul>
              <li v-for="error in errors">
                {{ error }}
              </li>
            </ul>
          </p>
          <vue-form-generator
            :schema="schema"
            :model="model"
            :options="formOptions"
          />
        </div>
      </div>
    </b-container>
  </div>
</template>


<script>

import Role from '@/models/Role'

export default {
  data() {
    return {
      internalModel: Role,
      errors: [],
      schema: {},
      model: {},
      formOptions: {
        validateAfterLoad: true,
        validateAfterChanged: true,
      },
    }
  },
  mounted() {
    this.internalModel.withApollo(this.$apollo)
    .makeSchema()
    .then((schema) => {
      this.schema = schema
    })
  },
}

</script>
