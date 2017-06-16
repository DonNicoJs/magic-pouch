import VueNativeSock from 'vue-native-websocket';
import Vue from 'vue';
import store from '../store/index';

// Vue.use(VueNativeSock, 'ws://127.0.0.1:9090/pouch', store);
Vue.use(VueNativeSock, 'ws://localhost:9090/pouch', store, {format: 'json'});
