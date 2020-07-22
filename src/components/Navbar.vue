<template>
	<div>
		<b-navbar toggleable="lg" type="dark" variant="dark">
			<b-container>
				<b-navbar-brand href="/">DataARC Admin</b-navbar-brand>
				<b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
				<b-collapse id="nav-collapse" is-nav>
					<b-navbar-nav class="ml-auto">
						<b-navbar-nav>
							<b-nav-item to="/">Home</b-nav-item>
							<b-nav-item to="/about">About</b-nav-item>
							<b-nav-item to="/pug">Pug</b-nav-item>
							<b-nav-item to="/categories">Categories</b-nav-item>
							<b-nav-item v-if="user" @click="logout">Logout</b-nav-item>
							<b-nav-item v-if="!user" to="/login">Login</b-nav-item>
						</b-navbar-nav>
					</b-navbar-nav>
				</b-collapse>
			</b-container>
		</b-navbar>
	</div>
</template>
<script>
import VueJwtDecode from "vue-jwt-decode";
export default {
	data() {
		return {
			user: {},
		};
	},
	methods: {
		getUserDetails() {
			let token = localStorage.getItem("jwt");
			if (token) {
				let decoded = VueJwtDecode.decode(token);
				this.user = decoded;
      }
      else{
        this.user = null;
      }
		},
		logout() {
			localStorage.removeItem("jwt");
			this.$router.push("/login");
		},
	},
	created() {
		this.getUserDetails();
	},
};
</script>
