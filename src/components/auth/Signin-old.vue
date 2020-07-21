<template>
  <v-container text-xs-center mt-5 pt-5>
    <!-- Signin Title -->
    <v-layout row wrap>
      <v-flex xs12 sm6 offset-sm3>
        <h1>Welcome Back!</h1>
      </v-flex>
    </v-layout>

    <!-- Error Alert -->
    <v-layout v-if="error" row wrap>
      <v-flex xs12 sm6 offset-sm3>
        <form-alert :message="error.message"></form-alert>
      </v-flex>
    </v-layout>

    <!-- Signin Form -->
    <v-layout row wrap>
      <v-flex xs12 sm6 offset-sm3>
        <v-card color="secondary" dark>
          <v-container>
            <v-form v-model="isFormValid" lazy-validation ref="form" @submit.prevent="handleLoginUser">
              <v-layout row>
                <v-flex xs12>
                  <v-text-field
                    :rules="emailRules"
                    v-model="email"
                    prepend-icon="face"
                    label="Email"
                    type="text"
                    required
                  ></v-text-field>
                </v-flex>
              </v-layout>

              <v-layout row>
                <v-flex xs12>
                  <v-text-field
                    :rules="passwordRules"
                    v-model="password"
                    prepend-icon="extension"
                    label="Password"
                    type="password"
                    required
                  ></v-text-field>
                </v-flex>
              </v-layout>

              <v-layout row>
                <v-flex xs12>
                  <v-btn :loading="loading" :disabled="!isFormValid || loading" color="accent" type="submit">
                    <span slot="loader" class="custom-loader">
                      <v-icon light>cached</v-icon>
                    </span>
                    Signin</v-btn
                  >
                  <h3>
                    Don't have an account?
                    <router-link to="/signup">Signup</router-link>
                  </h3>
                </v-flex>
              </v-layout>
            </v-form>
          </v-container>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { mapGetters } from "vuex"

export default {
  name: "Signin",
  data() {
    return {
      isFormValid: true,
      email: "",
      password: "",
      emailRules: [
        // Check if email in input
        (email) => !!email || "Email is required",
      ],
      passwordRules: [
        (password) => !!password || "Password is required",
        // Make sure password is at least 7 characters
        (password) => password.length >= 8 || "Password must be at least 8 characters",
      ],
    }
  },
  computed: {
    ...mapGetters(["loading", "error", "user"]),
  },
  watch: {
    user(value) {
      // if user value changes, redirect to home page
      if (value) {
        this.$router.push("/")
      }
    },
  },
  methods: {
    handleLoginUser() {
      if (this.$refs.form.validate()) {
        this.$store.dispatch("loginUser", {
          identifier: this.email,
          password: this.password,
          provider: "local",
        })
      }
    },
  },
}
</script>

<style>
.custom-loader {
  animation: loader 1s infinite;
  display: flex;
}
@-moz-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@-webkit-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@-o-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
