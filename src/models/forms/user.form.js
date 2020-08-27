import Role from '@/models/Role';

export default class {
  constructor(rolesAndUsers) {
    this.roles = rolesAndUsers[0];
    this.users = rolesAndUsers[1];
  }

  get fields() {
    return [
      {
        type: 'input',
        inputType: 'text',
        label: 'Username*',
        model: 'username',
        visible: true,
        required: true
      },
      {
        type: 'input',
        inputType: 'email',
        label: 'Email*',
        model: 'email',
        visible: true,
        required: true
      },
      {
        type: 'input',
        inputType: 'password',
        label: 'Password*',
        model: 'password',
        visible: true,
        required: true
      },
      {
        type: 'input',
        inputType: 'text',
        label: 'Provider',
        model: 'provider',
        visible: true
      },
      {
        type: 'checkbox',
        label: 'Confirmed',
        model: 'confirmed',
        default: false
      },
      {
        type: 'checkbox',
        label: 'Blocked',
        model: 'blocked',
        default: false
      },
      {
        type: 'select',
        values: this.roles,
        label: 'Role',
        model: 'role',
        default: false
      }
    ];
  }
}
