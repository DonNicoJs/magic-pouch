import Vue from 'vue';
import Vuex from 'vuex';
// import createPersistedState from 'vuex-persistedstate';

import files from './modules/files';

Vue.use(Vuex);

const debug = process.env.NODE_ENV !== 'production';

const store = new Vuex.Store({
  modules: {
    files
  },
  strict: debug
  // plugins: [createPersistedState({
  //   key: 'pouch-state',
  //   paths: []
  // })]
});

export default store;
