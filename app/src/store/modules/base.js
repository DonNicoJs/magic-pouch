import { Platform } from 'quasar';

const state = {
  baseURL: null
};

const actions = {
  findBaseURL ({commit}) {
    if (Platform.is.mobile) {
      commit('SET_BASE_URL', 'https://magic-pouch.blazenet.info');
    } else {
      commit('SET_BASE_URL', '');
    }
  }
};

const mutations = {
  SET_BASE_URL: (state, url) => {
    state.baseURL = url;
  }
};

export default {
  state,
  actions,
  mutations,
  namespaced: true
};
