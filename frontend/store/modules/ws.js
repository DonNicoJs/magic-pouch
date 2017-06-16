
const state = {
  link: false,
  event: null,
  wsUrl: null,
  files: []
};

const actions = {
  getWsURL ({commit}) {
    if (window.location.host.indexOf('localhost') > -1) {
      commit('SET_WS_URL', 'ws://localhost:9010/pouch');
    } else {
      commit('SET_WS_URL', 'wss://magic-pouch.blazenet.info/pouch');
    }
  }
};

const mutations = {
  LINK_ESTABLISHED (state, event) {
    state.event = event;
    state.link = true;
  },
  FILE_ADDED (state, event) {
    state.files.push(event.data);
  },
  SET_WS_URL (state, url) {
    state.wsUrl = url;
  }
};

export default {
  state,
  actions,
  mutations,
  namespaced: true
};
