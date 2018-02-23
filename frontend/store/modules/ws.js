
const state = {
  link: false,
  event: null,
  wsUrl: null,
  files: [],
  uuid: '',
  chunks: []
};

const getters = {
  getFiles: (state) => {
    return state.files.map(f => {
      const path = `${f.path}${state.uuid}/`;
      return {
        ...f,
        path
      };
    });
  },
  getUUID: (state) => {
    return state.uuid;
  }
};

const actions = {
  getWsURL ({commit}) {
    if (window.location.host.indexOf('localhost') > -1) {
      commit('SET_WS_URL', 'ws://localhost:9010/pouch');
    } else {
      commit('SET_WS_URL', 'wss://magic-pouch.blazenet.info/pouch');
    }
  },
  generateUUID ({commit}) {
    const pool = '23456789abdegjkmnpqrvwxyz';

    const length = 8;
    let uuid = '';
    for (let i = 0; i < length; i++) {
      uuid += pool.charAt(Math.floor(Math.random() * pool.length));
    }
    commit('SET_UUID', uuid);
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
  SET_UUID (state, uuid) {
    state.uuid = uuid;
  }
};

export default {
  state,
  actions,
  getters,
  mutations,
  namespaced: true
};
