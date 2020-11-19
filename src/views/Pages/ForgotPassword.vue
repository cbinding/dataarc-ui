<template>
  <div>
    <div
      v-if="submitted && !status.loggedIn && status.error"
      class="alert alert-danger mt-2"
      role="alert"
    >
      >
      {{ status.error.message }}
    </div>
    <form
      class="forgotPassword"
      @submit.prevent="handleSubmit()"
    >
      <div class="form-group">
        <label>Email address</label>
        <input
          v-model="email"
          required
          type="email"
          class="form-control form-control-lg"
        >
      </div>
      <br>
      <button
        type="submit"
        class="btn btn-dark btn-lg btn-block"
      >
        Request Password Reset
      </button>
    </form>
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
      email: '',
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
    ...mapActions('account', ['forgotPassword']),

    handleSubmit() {
      this.submitted = true
      const { email} = this
      if (email) {
        this.forgotPassword( email )
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
