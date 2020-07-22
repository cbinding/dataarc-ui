<template>
	<div>
		<form class="login" @submit.prevent="login()">
			<h3>Sign In</h3>

			<div class="form-group">
				<label>Email address</label>
				<input required v-model="email" type="email" class="form-control form-control-lg" />
			</div>

			<div class="form-group">
				<label>Password</label>
				<input required v-model="password" type="password" class="form-control form-control-lg" />
			</div>

			<button type="submit" class="btn btn-dark btn-lg btn-block">
				Sign In
			</button>

			<p v-show="status">
        <li class="help">
          {{status}}
        </li>
      </p>
		</form>
	</div>
</template>

<script>
export default {
	data() {
		return {
			email: "",
			password: "",
			status: false,
		};
	},
	methods: {
		login: function() {
			const { email, password } = this;
			// Request API.
			axios
				.post("http://localhost:1337/auth/local", {
					identifier: email,
					password: password,
				})
				.then((response) => {
					// Handle success.
					let token = response.data.jwt;
					localStorage.setItem("jwt", token);
					if (token) {
						this.$router.push("/");
					}
				})
				.catch((error) => {
					// Handle error.
					this.status = "Email or Password is invalid.";
				});
		},
	},
};
</script>

<style lang="scss">
.help{
  color: #d9534f;
}
</style>
