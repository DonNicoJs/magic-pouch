import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate';

// system modules
import auth from './auth';
import ws from './ws';

const persisted = createPersistedState({
  paths: ['auth']
});

const state = {
  socket: {
    isConnected: false,
    message: ''
  }
};

const store = new Vuex.Store({
  modules: {
    auth,
    ws
  },
  state,
  mutations: {
    SOCKET_ONOPEN (state, event) {
      state.socket.isConnected = true;
    },
    SOCKET_ONCLOSE (state, event) {
      state.socket.isConnected = false;
    },
    SOCKET_ONERROR (state, event) {
      console.error(state, event);
    },
    // default handler called for all methods
    SOCKET_ONMESSAGE (event, message) {
      state.socket.message = message;
    }
  },
  plugins: [persisted]
});

export default store;
