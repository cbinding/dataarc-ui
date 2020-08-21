<template>
  <b-container fluid v-if="form">
    <h3>Editing: {{form.title}} Templates</h3>
    <b-row>
      <b-col sm="7">
        <b-form @submit="update">
          Title
          <b-col sm="12">
            <b-form-textarea v-model="form.title_layout" size="lg" no-auto-shrink></b-form-textarea>
          </b-col>
          <br>
          Link
          <b-col sm="12">
            <b-form-textarea v-model="form.link_layout" size="lg" no-auto-shrink></b-form-textarea>
          </b-col>
          <br>
          Details
          <b-col sm="12">
            <b-row>
              <b-col sm="5">
                <b-form-textarea rows="25" v-model="form.details_layout" size="lg" no-auto-shrink></b-form-textarea>
                <b-button class="float-right" type="button" @click="toggleDetails">Render</b-button>
              </b-col>
              <b-col sm="7">
                <b-jumbotron border-variant="secondary" style="height:350px;overflow-y:auto;overflow-x:auto">
                  <div v-if="renderDetails" v-html="pug.render(form.details_layout)" lang="pug">
                  </div>
                </b-jumbotron>
              </b-col>
            </b-row>
          </b-col>
          <br>
          Summary
          <b-col sm="12">
            <b-row>
              <b-col sm="5">
                <b-form-textarea rows="25" v-model="form.summary_layout" size="lg" no-auto-shrink></b-form-textarea>
                <b-button class="float-right" type="button" @click="toggleSummary">Render</b-button>
              </b-col>
              <b-col sm="7">
                <b-jumbotron border-variant="secondary" style="height:350px;overflow-y:auto;overflow-x:auto">
                  <div v-if="renderSummary" v-html="pug.render(form.summary_layout)" lang="pug">
                  </div>
                </b-jumbotron>
              </b-col>
            </b-row>
          </b-col>
          <br>
          <b-button type="submit" variant="primary">Save</b-button>
        </b-form>
      </b-col>
      <b-col sm="5">
        <b-container>
          <b-row>
            <b-col sm>
              <h2>Fields</h2>
            </b-col>
            <b-col sm>
              Sort By: <b-dropdown :text="sort">
                <div v-for="item in sortList" :key="item">
                  <b-dropdown-item @click="sort = item">
                    {{item}}
                  </b-dropdown-item>
                </div>
              </b-dropdown>
            </b-col>
          </b-row>
          <b-list-group style="max-height:950px;overflow-y:auto;" horizontal class="d-flex flex-wrap">
            <div v-for="field in sorted(form.fields)" :key="field.id">
              <b-list-group-item flex-fill>
                {{field.path ? field.path : field.name}}
                <b-badge :variant="type(field.type)">{{field.type}}</b-badge>
              </b-list-group-item>
            </div>
          </b-list-group>
        </b-container>
      </b-col>
    </b-row>
    <br>
  </b-container>
</template>

<script>
import collectionMixin from '../../mixins/collectionMixin'

export default {
  data() {
    return {
      component: 'Dataset Templates',
      form: {},
      string: 'primary',
      number: 'secondary',
      boolean: 'success',
      array: 'danger',
      url: 'warning',
      start_date: 'info',
      end_date: 'light',
      text_date: 'dark',
      action: 'Update',
      pug: require('pug'),
      renderDetails: false,
      renderSummary: false,
      sort: 'Path',
      sortList: ['Path', 'Type'],
      randomFeature: {},
    }
  },
  methods: {
    sorted(fields) {
      if (fields) {
        const sortBy = this.sort.toLowerCase()
        return fields.slice().sort(function (a, b) {
          if (a[sortBy] < b[sortBy]) {
            return -1;
          }
          if (a[sortBy] > b[sortBy]) {
            return 1;
          }
          // a must be equal to b
          return 0;
        })
      }
    },
    type(val) {
      return this[val]
    },
    update(val) {
      val.preventDefault()
      this.setFormData(this.form)
    },
    toggleDetails() {
      this.randomFeature = _.sample(this.form.features)
      this.renderDetails = !this.renderDetails
    },
    toggleSummary() {
      this.randomFeature = _.sample(this.form.features)
      this.renderSummary = !this.renderSummary
    },
  },
  mixins: [collectionMixin],
  watch: {
    currentDataset(val) {
      if (val) {
        this.form = val
        this.form.type = 'Datasets'
        this.form.action = 'Update'
        this.form.goBack = true
      }
    }
  },
  mounted() {
    this.currentId = this.$route.params.id
    this.$apollo.queries.dataset.skip = false
  }
}
</script>
