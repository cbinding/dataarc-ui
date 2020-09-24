<template>
  <b-container>
    <div class="panel panel-default">
      <div class="panel-heading">
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
</template>

<script>
import { mapState } from 'vuex'
import collectionMixin from '../../mixins/collectionMixin'

export default {
  mixins: [collectionMixin],
  data() {
    return {
      errors: [],
      submitted: false,
      schema: {
        fields: [
          {
            type: 'input',
            inputType: 'text',
            label: 'First Name',
            model: 'firstName',
            visible: true,
            required: false,
          },
          {
            type: 'input',
            inputType: 'text',
            label: 'Last Name',
            model: 'lastName',
            visible: true,
            required: false,
          },
          {
            type: 'input',
            inputType: 'text',
            label: 'Username',
            model: 'username',
            visible: true,
            required: false,
          },
          {
            type: 'input',
            inputType: 'email',
            label: 'Email*',
            model: 'email',
            visible: true,
            required: true,
          },
          {
            type: 'input',
            inputType: 'password',
            label: 'Password',
            model: 'password',
            visible: true,
            required: false,
          },
          {
            type: 'submit',
            buttonText: 'Submit',
            inputType: 'submit',
            visible: true,
            onSubmit: this.handleSubmit,
          },
        ]
      },
      formOptions: {
        validateAfterLoad: true,
        validateAfterChanged: true,
      },
      model: {
        firstName: '',
        lastName: '',
        username: '',
        email: '',
        password: '',
        provider: '',
      },
    }
  },
  computed: {
    ...mapState({
      account: (state) => state.account,
      user: (state) => state.users.user,
    }),
  },
  mounted() {
    this.model = this.account.user
  },
  methods: {
    validEmail(email) {
      const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      return re.test(email)
    },
    handleSubmit(e) {
      this.submitted = true
      this.errors = []

      if (!e.email) {
        this.errors.push('Email required.')
      } else if (!this.validEmail(e.email)) {
        this.errors.push('Valid email required.')
      }

      if (!this.errors.length) {
        e.type = 'Users'
        e.action = 'Update'
        this.setFormData(e)
      }
    },
  },
}
</script>
