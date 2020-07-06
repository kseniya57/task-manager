import axios from 'axios';

export default (name, url) => {
  const state = {
    [name.toLowerCase()]: [],
    [`loading${name}`]: false
  };

  const getters = {
    [name.toLowerCase()]: state => state[name.toLowerCase()],
    [`loading${name}`]: state => state[`loading${name}`]
  };

  const actions = {
    [`get${name}`]: ({ commit }, { method = 'get', params, id }) => {
      commit(`setLoading${name}`, true);
      axios[method](
        `${url}${name.replace(/([A-Z])/g, '/$1').toLowerCase()}${
          id ? `/${id}` : ''
        }`,
        params
      )
        .then(res => {
          commit(`set${name}`, res.data);
          commit(`setLoading${name}`, false);
        })
        .catch(() => {
          commit(`setLoading${name}`, false);
        });
    }
  };

  const mutations = {
    [`set${name}`]: (state, items) => (state[name.toLowerCase()] = items),
    [`setLoading${name}`]: (state, status) => (state[`loading${name}`] = status)
  };

  return {
    state,
    getters,
    actions,
    mutations
  };
};
