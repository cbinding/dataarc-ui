<template>
  <div>
    <form
      class="login"
      @submit.prevent="handleSubmit()"
    >
      <h3>Sign In</h3>

      <div class="form-group">
        <label>Email address</label>
        <input
          v-model="email"
          required
          type="email"
          class="form-control form-control-lg"
        >
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

      <button
        type="submit"
        class="btn btn-dark btn-lg btn-block"
      >
        Sign In
      </button>
    </form>
    <router-link
      to="/register"
      class="btn btn-dark btn-lg btn-block mt-2"
    >
      Register
    </router-link>
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
      password: '',
      submitted: false,
    }
  },
  computed: {
    ...mapState('account', ['status']),
  },
  created() {
    // reset the login status when you reach the login page
    this.logout()
  },
  methods: {
    ...mapActions('account', ['login', 'logout']),

    handleSubmit() {
      this.submitted = true
      const { email, password } = this
      if (email && password) {
        const identifier = email
        this.login({ identifier, password })
      }
    },
  },
  mounted() {
    console.log(this)
  },
}
</script>

<style lang="scss">
.help{
  color: #d9534f;
}
</style>
