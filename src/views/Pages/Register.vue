<template>
  <div>
    <div v-if="alert && alert.message && alert.message[0]" :class="`alert ${alert.type}`">{{alert.message[0].messages[0].message}}</div>
    <h2>Register</h2>
    <form @submit.prevent="handleSubmit">
      <p v-if="errors.length">
        <b>Please correct the following error(s):</b>
        <ul>
          <li v-for="error in errors">{{ error }}</li>
        </ul>
      </p>
      <div class="form-group">
        <label for="username">Username</label>
        <input type="text" v-model="user.username" name="username" class="form-control"/>
      </div>
      <div class="form-group">
        <label for="email">Email</label>
        <input type="text" v-model="user.email" name="email" class="form-control"/>
      </div>
      <div class="form-group">
        <label htmlFor="password">Password</label>
        <input type="password" v-model="user.password" name="password" class="form-control"/>
      </div>
      <div class="form-group">
        <button class="btn btn-primary" :disabled="status.registering">Register</button>
        <img v-show="status.registering" src="data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA==" />
        <router-link to="/login" class="btn btn-link">Cancel</router-link>
      </div>
    </form>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import collectionMixin from '../../mixins/collectionMixin'
import userService from '../../api/user.service'

export default {
  mixins: [collectionMixin],
  data () {
    return {
      user: {
        username: '',
        email: '',
        password: '',
      },
      errors: [],
      submitted: false,
      users: [],
    }
  },
  computed: {
    ...mapState('account', ['status'], {alert: state => state.alert}),
  },
  watch: {
    $route(to, from) {
      // clear alert on location change
      this.clearAlert()
    },
  },
  methods: {
    ...mapActions('account', ['register'], {clearAlert: 'alert/clear'}),
    validEmail(email) {
      const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      return re.test(email)
    },
    handleSubmit(e) {
      this.submitted = true
      this.errors = []

      if (!this.user.username) {
        this.errors.push('Username required.')
      }
      if (!this.user.email) {
        this.errors.push('Email required.')
      } else if (!this.validEmail(this.user.email)) {
        this.errors.push('Valid email required.')
      }
      if (!this.user.password) {
        this.errors.push('Password required.')
      }

      if (!this.errors.length) {
        this.register(this.user)
      }
    },
  },
}
</script>
