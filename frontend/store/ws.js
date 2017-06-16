
const state = {
  link: false,
  files: []
};

const mutations = {
  LINK_ESTABLISHED (state, event) {
    console.log(event);
    state.link = true;
  },
  FILE_ADDED (state, event) {
    state.files.push(event.data);
  }
};

export default {
  state,
  mutations,
  namespaced: true
};
