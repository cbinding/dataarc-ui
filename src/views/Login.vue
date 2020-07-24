<template>
  <div>
    <form
      class="login"
      @submit.prevent="login()"
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

      <p v-show="status">
        <ul class="help">
          {{ status }}
        </ul>
      </p>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      email: '',
      password: '',
      status: false,
    }
  },
  methods: {
    login() {
      const { email, password } = this

      axios
      .post(`${this.$baseUrl}/auth/local`, {
        identifier: email,
        password,
      })
      .then((response) => {
        // Handle success.
        const token = response.data.jwt
        localStorage.setItem('jwt', token)
        if (token) {
          this.$router.push('/')
        }
      })
      .catch((error) => {
        // Handle error.
        this.status = 'Email or Password is invalid.'
      })
    },
  },
}
</script>

<style lang="scss">
.help{
  color: #d9534f;
}
</style>
