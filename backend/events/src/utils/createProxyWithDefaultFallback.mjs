export default (object, key) => new Proxy(object[key] || object, {
  get(target, property) {
    return target[property] || target['default']
  }
});