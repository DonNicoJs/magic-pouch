
const state = {
  link: false,
  event: null,
  wsUrl: null,
  files: [],
  chunks: []
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
  },
  FILE_CHUNK (state, event) {
    state.chunks.push(event.chunk);
  },
  FILE_READY (state, event) {
    const file = {
      fileName: event.data.fileName,
      path: `data:${event.data.contentType};base64, ${state.chunks.join('')}`
    };
    state.files.push(file);
  }
};

export default {
  state,
  actions,
  mutations,
  namespaced: true
};
