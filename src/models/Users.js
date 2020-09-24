class Users {
  constructor(data) {
    this.id = data.id;
    this.username = data.username;
    this.firstName = data.firstName;
    this.lastName = data.lastName;
    this.email = data.email;
    if (data.password) {
      this.password = data.password;
    }
    this.provider = data.provider;
    this.confirmed = data.confirmed;
    this.blocked = data.blocked;
    this.role = data.role;
    this.createUrl = `${process.env.VUE_APP_API_URL}/auth/local/register`;
    this.editUrl = `${process.env.VUE_APP_API_URL}/users/${this.id}`;
    this.routeUrl = '/admin/users/index';
  }

  _create = async () => {
    try {
      const resp = await axios.post(this.createUrl, this);
      return resp;
    } catch (err) {
      console.log(err);
    }
  };

  _update = async () => {
    try {
      const resp = await axios.put(this.editUrl, this);
      return resp;
    } catch (err) {
      console.log(err);
    }
  };

  _delete = async () => {
    try {
      const resp = await axios.delete(
        `${process.env.VUE_APP_API_URL}/users/${this.id}`
      );
      return 'users';
    } catch (err) {
      console.log(err);
    }
  };
}

export default Users;
