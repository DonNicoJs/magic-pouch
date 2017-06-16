import Vue from 'vue';
import Vuex from 'vuex';
// import createPersistedState from 'vuex-persistedstate';

import base from './modules/base';

Vue.use(Vuex);

const debug = process.env.NODE_ENV !== 'production';

const store = new Vuex.Store({
  modules: {
    base
  },
  strict: debug
  // plugins: [createPersistedState({
  //   key: 'pouch-state',
  //   paths: []
  // })]
});

export default store;
