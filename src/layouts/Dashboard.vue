<template>
  <v-app id="inspire">
    <v-navigation-drawer v-model="drawer" app clipped>
      <v-list dense>
        <v-list-item
          v-for="item in navLinks"
          :key="item.text"
          :to="item.link"
          link
        >
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>
              {{ item.text }}
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-subheader class="mt-4 grey--text text--darken-1"
          >EMAIL@DATA-ARC.ORG</v-subheader
        >
        <v-list>
          <v-list-item
            v-for="item in userLinks"
            :key="item.text"
            :to="item.link"
            link
          >
            <v-list-item-action>
              <v-icon color="grey darken-1">{{ item.icon }}</v-icon>
            </v-list-item-action>
            <v-list-item-title class="grey--text text--darken-1">{{
              item.text
            }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-list>
    </v-navigation-drawer>

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
import { mapGetters } from 'vuex';

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
    },
    navLinks: [
      { icon: 'mdi-view-dashboard', text: 'Dashboard', link: '/' },
      { icon: 'mdi-database', text: 'Datasets', link: '/datasets' }
    ],
    userLinks: [
      {
        icon: 'mdi-account-settings',
        text: 'Account Settings',
        link: '/profile'
      },
      { icon: 'mdi-key', text: 'Sign Out', link: '/signout' }
    ],
    adminLinks: []
  }),
  created() {
    this.$vuetify.theme.dark = false;
    if (this.user.role.type == 'admin') {
      this.data.adminLinks = [
        { icon: 'mdi-account', text: 'Manage Users', link: '/users' }
      ];
    }
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
    },
    userFavorites(value) {
      if (value) {
        this.badgeAnimated = true;
        setTimeout(() => (this.badgeAnimated = false), 1000);
      }
    }
  },
  computed: {
    ...mapGetters(['searchResults', 'authError', 'user', 'userFavorites'])
  },
  methods: {
    handleLogoutUser() {
      this.$store.dispatch('logoutUser');
    },
    formatDescription(desc) {
      return desc.length > 30 ? `${desc.slice(0, 30)}...` : desc;
    },
    checkIfUserFavorite(resultId) {
      return (
        this.userFavorites &&
        this.userFavorites.some(fave => fave.id === resultId)
      );
    }
  }
};
</script>
