import { gql } from 'apollo-boost';

/* User Queries */
export const GET_CURRENT_USER = gql`
  query {
    me {
      email
    }
  }
`;

/* User Mutations */
export const LOGIN_USER = gql`
  mutation Login($identifier: String!, $password: String!, $provider: String!) {
    login(
      input: {
        identifier: $identifier
        password: $password
        provider: $provider
      }
    ) {
      jwt
      user {
        id
        email
        confirmed
        blocked
        role {
          id
          name
          description
          type
        }
      }
    }
  }
`;

export const CREATE_USER = gql`
  mutation($name: String!, $email: String!, $password: String!) {
    createUser(name: $name, email: $email, password: $password, role: "USER") {
      login
    }
  }
`;
