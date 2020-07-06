import Vue from 'vue';
import App from '@/App.vue';
import router from '@/router';
import store from '@/store';

import '@/plugins';
import '@/directives';
import '@/filters';
import '@/mixins/global';
import '@/components/global';

import '@/styles/index.sass';
import { apolloProvider } from '@/plugins/apollo';

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  apolloProvider,
  render: h => h(App)
}).$mount('#app');
