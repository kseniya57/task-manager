import Vue from 'vue';
import Vuex from 'vuex';
import { restart } from '@/plugins/apollo';
import { AUTH_TOKEN } from '@/constants';
import text from '@/libs/text';
// import generateModule from './generateModule';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    user: null,
    lang: 'ru'
  },
  mutations: {
    login(state, user) {
      state.user = user;
      restart(false);
    },
    logout(state) {
      localStorage.removeItem(AUTH_TOKEN);
      state.user = null;
      restart();
    },
    setLang(state, lang) {
      state.lang = lang;
    }
  },
  getters: {
    user: state => state.user,
    isAuthenticated: state => !!state.user,
    text: state => text[state.lang],
    lang: state => state.lang,
    languages: () => Object.keys(text)
  },
  modules: {
    // directory: generateModule('Directory', UPLOADS_URL)
  }
});
