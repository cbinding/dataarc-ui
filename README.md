# DataARC Admin Interface

This admin interface is a work in progress.

## Getting Started

These instructions will get you up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

This software requires the following to be insalled:

- dataarc-api >= 1.0.0
- Node.js >= 12.x
- npm >= 6.x
- yarn >= 1.22.x

### Installing

Clone project and enter in folder:

```bash
cd dataarc-admin
cp .env.example .env
```

Change values in `.env` to match your setup

For displaying some LOGs during site testing set
```
DEBUG=true
```

Run yarn install:

```bash
yarn install
```

Enjoy:

```bash
yarn serve
```

## Built With

- [Vue CLI](https://cli.vuejs.org/) - Standard Tooling for Vue.js Development
- [Vuex](https://vuex.vuejs.org/) - Vuex is a state management pattern + library for Vue.js applications.
- [Vue-Router](https://router.vuejs.org/) - Vue Router is the official router for Vue.js.
- [Bootstrap](https://getbootstrap.com/) - Build responsive, mobile-first projects on the web with the world’s most popular front-end component library.
