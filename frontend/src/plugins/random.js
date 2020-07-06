export default {
  install: Vue =>
    (Vue.prototype.$random = (value, min, max) =>
      Math.floor((max - min) * Math.random() + min))
};
