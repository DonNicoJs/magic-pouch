import VueNativeSock from 'vue-native-websocket';
import Vue from 'vue';

import store from '../store/index';

store.dispatch('ws/getWsURL');

Vue.use(VueNativeSock, store.state.ws.wsUrl, store, {format: 'json'});
