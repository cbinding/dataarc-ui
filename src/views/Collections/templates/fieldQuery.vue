<template>
  <div>
    <b-form v-model="schema.value">
      <b-row>
        <b-col>
          <b-input-group v-for="query in totalQueries" :key="query" size="lg" class="mb-3">
            <b-input-group-prepend>
              <b-dropdown :text="form[query] ? form[query]['property'] : 'Select Field'" variant="outline-secondary" aria-placeholder="Select Field">
                <div v-for="value in schema.values" :key="value.id">
                  <b-dropdown-item @click="setField(query, 'property', value.path, value.type)">{{ value.path }}</b-dropdown-item>
                </div>
              </b-dropdown>
              <b-dropdown :text="(form[query] && form[query]['operator']) ? form[query]['operator'] : 'equals'" variant="outline-secondary">
                <div v-if="value[query] && value[query].type">
                  <div v-for="operator in getOperators(value[query].type)" :key="operator.value">
                    <b-dropdown-item @click="setField(query, 'operator', operator.value)">{{ operator.type }}</b-dropdown-item>
                  </div>
                </div>
                <div v-else v-for="operator in operators" :key="operator.value">
                  <b-dropdown-item @click="setField(query, 'operator', operator.value)">{{ operator.type }}</b-dropdown-item>
                </div>
              </b-dropdown>
              <b-form-input variant="outline-secondary" v-model="values[query]" @input="setField(query, 'value', values[query])" placeholder="Text Input">

              </b-form-input>
            </b-input-group-prepend>
            <b-input-group-append>
              <b-row>
                <b-col>
                  <b-button-group>
                    <b-button variant="light" size="sm" v-if="query !== 1" @click="decrement(query)">
                      -
                    </b-button>
                    <b-button variant="light" size="sm" v-if="query === totalQueries" @click="increment">
                      <b-icon-plus-circle-fill></b-icon-plus-circle-fill>
                    </b-button>
                  </b-button-group>
                </b-col>
              </b-row>
            </b-input-group-append>
          </b-input-group>
        </b-col>

      </b-row>
    </b-form>
  </div>
</template>

<script>
import { abstractField } from 'vue-form-generator'
export default {
  data() {
    return {
      form: {},
      operators: [
        {type: 'Equals', value: 'equals'},
        {type: 'Not Equals', value: 'not_equals' },
        {type: 'Contains', value: 'contains'},
        {type: 'Not Contains', value: 'not_contains'},
        {type: 'Greater Than', value: 'greater_than'},
        {type: 'Less Than', value: 'less_than'},
      ],
      number: [
        {type: 'Equals', value: 'equals'},
        {type: 'Not Equals', value: 'not_equals' },
        {type: 'Greater Than', value: 'greater_than'},
        {type: 'Less Than', value: 'less_than'},
      ],
      string: [
        {type: 'Equals', value: 'equals'},
        {type: 'Not Equals', value: 'not_equals' },
        {type: 'Contains', value: 'contains'},
        {type: 'Not Contains', value: 'not_contains'},
      ],
      boolean: [
        {type: 'Equals', value: 'equals'},
        {type: 'Not Equals', value: 'not_equals' },
      ],
      totalQueries: 1,
      queries: {},
      values: {},
    }
  },
  watch: {
    form: function(val) {
      if(val) {
        this.queries = val
        this.model.queries = this.queries
      }
    },
    model: function(val) {
      if(val && val.queries) {
        this.totalQueries = 0
        for(let i = 0; i < val.queries.length; i++) {
          this.form[i + 1] = val.queries[i]
          this.values[i + 1] = this.form[i + 1].value
          this.totalQueries += 1
        }
        if(this.totalQueries === 0) {
          this.totalQueries = 1
        }
      }
    },
  },
  mixins: [abstractField],
  methods: {
    getOperators(val) {
      if (val) {
        return this[val]
      }
      return this.operators
    },
    increment() {
      this.totalQueries += 1
    },
    decrement(int) {
      let tempForm = {}
      const length = Object.keys(this.form).length
      Object.assign(tempForm, this.form)
      for (let i = int; i <= length; i++) {
        if (this.form[i + 1]) {
          tempForm[i] = this.form[i + 1]
          tempForm[i].count = i
          this.$delete(this.form, (i + 1))
          this.values[i] = tempForm[i].value
          this.$delete(this.values, (i + 1))
        }
        else {
          this.$delete(tempForm, i)
          this.$delete(this.values, i)
        }
      }
      this.form = {}
      Object.assign(this.form, tempForm)
      this.totalQueries -= 1
    },
    setField(int, field, val, type) {
      if (!this.form[int]) {
        this.$set(this.form, int, {})
      }
      if (!this.form[int].count) {
        this.$set(this.form[int], 'count', int)
        if(!this.form[int]['operator']) {
          this.$set(this.form[int], 'operator', 'equals')
        }
      }
      if (field === 'value') {
        this.$set(this.form[int], field, this.values[int])
      }
      if (field === 'property') {
        this.$set(this.form[int], field, val)
        this.$set(this.form[int], 'type', type)
      }
      else {
        this.$set(this.form[int], field, val)
      }
    },
  },

}
</script>

<style>

</style>
