export default (oldData, data) => Object.keys(data).reduce((map, key) => {
  if (data[key] !== oldData[key]) {
    map[key] = {
      oldValue: oldData[key],
      value: data[key]
    }
  }
  return map;
}, {});