<template>
  <div>
    <form
      class="resetPassword"
      @submit.prevent="handleSubmit()"
    >
      <h3>Reset Password</h3>

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
      <button
        type="submit"
        class="btn btn-dark btn-lg btn-block"
      >
        Reset Password
      </button>
    </form>
    <div
      v-if="submitted && !status.loggedIn && status.error"
      class="alert alert-danger mt-2"
      role="alert"
    >
      >
      {{ status.error.message }}
    </div>
    <debug>
      Status: {{ status }}
    </debug>
  </div>
</template>

<script>

import { mapState, mapActions } from 'vuex'

export default {
  data() {
    return {
      code: '',
      email: '',
      password: '',
      passwordConfirmation: '',
      submitted: false,
    }
  },
  computed: {
    ...mapState('account', ['status']),
  },
  created() {
    // reset the login status when you reach the login page
  },
  methods: {
    ...mapActions('account', ['resetPassword']),

    handleSubmit() {
      this.submitted = true
      const { code, password, passwordConfirmation } = this
      if (code && password && passwordConfirmation) {
        this.resetPassword( code, password, passwordConfirmation )
      }
    },
  },
}
</script>

<style lang="scss">
.help{
  color: #d9534f;
}
</style>
