import Vue from 'vue';

['date', 'limitText']
  .reduce(
    (acc, module) => acc.concat(Object.values(require(`./${module}`))),
    []
  )
  .forEach(({ name, handler }) => Vue.filter(name, handler));
