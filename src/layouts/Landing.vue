<template>
  <v-app id="inspire">
    <v-app-bar app clipped-left>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title class="mr-12 align-center">
        <span class="title">DataARC Admin</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
    </v-app-bar>

    <v-main>
      <v-container class="fill-height">
        <transition name="fade">
          <router-view />
        </transition>

        <v-snackbar
          v-model="message.snackbar"
          :multi-line="message.multiLine"
          :timeout="message.timeout"
        >
          {{ message.text }}
          <template v-slot:action="{ attrs }">
            <v-btn
              color="red"
              text
              v-bind="attrs"
              @click="message.snackbar = false"
            >
              Close
            </v-btn>
          </template>
        </v-snackbar>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
export default {
  props: {
    source: String
  },
  data: () => ({
    drawer: null,
    message: {
      multiLine: true,
      snackbar: false,
      text: '',
      timeout: 5000
    }
  }),
  created() {
    this.$vuetify.theme.dark = false;
  },
  watch: {
    user(newValue, oldValue) {
      if (oldValue === null) {
        this.message.text = 'Welcome to DataARC Admin!';
        this.message.snackbar = true;
      }
    },
    authError(value) {
      if (value !== null) {
        this.message.text = 'There was a problem with authentication.';
        this.message.snackbar = true;
      }
    }
  }
};
</script>
