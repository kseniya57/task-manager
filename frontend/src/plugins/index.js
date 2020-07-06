import Vue from 'vue';

['isNotNull', 'apollo', 'subscriptions', 'moment', 'image', 'copy', 'random']
  .map(module => require(`./${module}`).default)
  .forEach(plugin => Vue.use(plugin));
