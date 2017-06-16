import Vue from 'vue';
import Quasar from 'quasar';
import router from './router';
import store from './store/';
// eslint-disable-next-line no-undef
require(`./themes/app.${__THEME}.styl`);

Vue.use(Quasar); // Install Quasar Framework

Quasar.start(() => {
  /* eslint-disable no-new */
  new Vue({
    el: '#q-app',
    router,
    store,
    render: h => h(require('./App'))
  });
});
