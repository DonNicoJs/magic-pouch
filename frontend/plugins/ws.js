import VueNativeSock from 'vue-native-websocket';
import Vue from 'vue';

export default ({app: {router, store}}) => {
  store.dispatch('ws/getWsURL');
  Vue.use(VueNativeSock, store.state.ws.wsUrl, store, {format: 'json'});
};
