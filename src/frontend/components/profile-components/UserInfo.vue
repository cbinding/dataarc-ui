<template>
  <section
    class="bg-white"
  >
    <b-container class="pt-5 pb-5">
      <b-row>
        <b-col class="text-center">
          <h3>
            User Info
          </h3>
          <hr class="primary">
        </b-col>
      </b-row>
      <b-row class="justify-content-center">
        <b-col sm="6" class="mt-3 mb-3">
          <b-card class="shadow">
            <form
              @submit.prevent="handleSubmit"
            >
              <div class="form-group">
                <label>First Name</label>
                <input
                  v-model="form.firstName"
                  class="form-control form-control-lg"
                >
              </div>
              <div class="form-group">
                <label>Last Name</label>
                <input
                  v-model="form.lastName"
                  class="form-control form-control-lg"
                >
              </div>
              <div class="form-group">
                <label>Username</label>
                <input
                  v-model="form.username"
                  class="form-control form-control-lg"
                >
              </div>

              <div class="form-group">
                <label>Email address</label>
                <input
                  v-model="form.email"
                  required
                  type="email"
                  class="form-control form-control-lg"
                >
              </div>
              <b-row class="justify-content-md-center">
                <b-col sm="6">
                  <b-button
                    type="submit"
                    class="btn btn-dark btn-lg btn-block"
                  >
                    Update Info
                  </b-button>
                </b-col>
              </b-row>
              <p v-if="errors.length">
                <b>Please correct the following error(s):</b>
                <ul>
                  <li v-for="error in errors">
                    {{ error }}
                  </li>
                </ul>
              </p>
              <br>
            </form>
            <form
              @submit.prevent="resetPasswordSubmit"
            >
              <div class="form-group">
                <input
                  v-model="code"
                  hidden
                >
                </input>
              </div>
              <div class="form-group">
                <label>Password</label>
                <input
                  v-model="password"
                  required
                  type="password"
                  class="form-control form-control-lg"
                >
              </div>
              <div class="form-group">
                <label>Confirm Password</label>
                <input
                  v-model="passwordConfirmation"
                  required
                  type="password"
                  class="form-control form-control-lg"
                >
              </div>

              <b-row class="justify-content-md-center">
                <b-col sm="6">
                  <b-button
                    type="submit"
                    class="btn btn-dark btn-lg btn-block"
                  >
                    Update Password
                  </b-button>
                </b-col>
              </b-row>
            </form>
            <p v-if="passwordErrors.length">
              <b>Please correct the following error(s):</b>
              <ul>
                <li v-for="error in passwordErrors">
                  {{ error }}
                </li>
              </ul>
            </p>
          </b-card>
        </b-col>
      </b-row>
    </b-container>
  </section>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import gql from 'graphql-tag'
export default {

  data() {
    return {
      errors: [],
      passwordErrors: [],
      code: '',
      password: '',
      passwordConfirmation: '',
      form: {
        firstName: '',
        lastName: '',
        email: '',
        username: '',
      }
    }
  },
  computed: {
    ...mapState('account', ['user', 'role', 'status']),
  },
  mounted() {
    this.form = this.user
  },
  methods: {
    ...mapActions('account', ['update', 'resetPassword'], { clearAlert: 'alert/clear' }),
    validEmail(email) {
      const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      return re.test(email)
    },
    handleSubmit(e) {
      this.submitted = true
      this.errors = []

      if (!this.form.email) {
        this.errors.push('Email required.')
      } else if (!this.validEmail(this.form.email)) {
        this.errors.push('Valid email required.')
      }

      if (!this.errors.length) {
        this.update(this.form)
      }
    },
    resetPasswordSubmit() {
      this.submitted = true
      const { code, password, passwordConfirmation } = this
      this.passwordErrors = []

      if (!password) {
        this.passwordErrors.push('Password required.')
      } else if (!passwordConfirmation) {
        this.passwordErrors.push('Confirmation Password required.')
      } else if (password !== passwordConfirmation) {
        this.passwordErrors.push('Passwords must match.')
      } else if (code && password && passwordConfirmation) {
        this.resetPassword( { code, password, passwordConfirmation })
      }
    },
  }
}
</script>

<style>

</style>
