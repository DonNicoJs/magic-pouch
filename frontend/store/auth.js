import axios from '../plugins/axios';

const state = {
  user: null
};

const actions = {
  doLogin: async ({commit}, {username, password}) => {
    const { data } = await axios.get('/api/login/', {username, password});
    commit('SET_USER', data.user);
  }
};

const mutations = {
  SET_USER: (state, user) => {
    state.user = user;
  }
};

export default {
  state,
  actions,
  mutations,
  namespaced: true
};
