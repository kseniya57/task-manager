<template>
    <div class="fullheight">
        <loader v-if="$apollo.queries.authOutput.loading"/>
        <div v-else class="df fullheight ais auth">
            <Background class="auth__left" name="auth-bg" ext="jpg">
            </Background>
            <form class="df aic jcc fdc expanded auth__right" @submit.prevent="mutate">
                <h3 v-mb="1" class="text--lg tac">{{ text.app.name }} - {{ text.app.short_description }}</h3>
                <h5 v-mb="4" class="text--md auth__text" v-text-color="'text_light'">{{ text.app.description }}</h5>
                <input v-if="!isLogin" class="input auth__input" v-model="authData.name" :placeholder="text.form.name">
                <input class="input auth__input" type="email" v-model="authData.email" :placeholder="text.form.email">
                <input class="input auth__input" type="password" v-model="authData.password" :placeholder="text.form.password">
                <input v-if="!isLogin" type="password" class="input auth__input"
                       v-model="authData.password_confirmation" :placeholder="text.form.password_confirmation">
                <v-button v-mb="2">{{ isLogin ? text.auth.login : text.auth.register }}</v-button>
                <a
                        @click="isLogin = !isLogin"
                        class="text--xs"
                        v-text-color="'text_light'"
                >
                    {{ isLogin ?  text.auth.no_account : text.auth.have_account }}
                </a>
            </form>
        </div>
    </div>
</template>

<script>
import { Background } from '@/components/Common';
import { AUTH_TOKEN } from '../constants';
import Loader from '@/components/Common/Loader';

const TOKEN = localStorage.getItem(AUTH_TOKEN);

export default {
  components: {
    Background,
    Loader
  },
  data: () => ({
    authData: {},
    authOutput: null,
    isLogin: true,
    loading: false
  }),
  watch: {
    authOutput(value) {
      const { user } = value || {};
      if (user) {
        this.$store.commit('login', user);
        if (user.theme) {
          const theme = JSON.parse(user.theme);
          Object.assign(this.colors, theme.colors);
          Object.assign(this.fonts, theme.fonts);
          Object.assign(this.highlights, theme.highlights);
          Object.assign(this.mdStyles, theme.mdStyles);
        }
        if (user.status) {
          [user.emoji, user.status] = user.status
            .match(/([^|]+)|(.*)/)
            .slice(1);
        }
        const highlights = Object.entries(this.highlights).reduce(
          (map, [key, value]) =>
            Object.assign(map, {
              [key]: value.toLowerCase().replace(/\s+/g, '')
            }),
          {}
        );

        require(`prismjs/themes/prism${
          highlights.code === 'default' ? '' : `-${highlights.code}`
        }.css`);
        require(`codemirror/theme/${highlights.file}.css`);
      }
    }
  },
  apollo: {
    authOutput: {
      query: require('@/graphql/auth/check.graphql'),
      variables: {
        token: TOKEN
      },
      skip: !TOKEN || TOKEN === 'undefined',
      update: data => data.check,
      error: () => {
        localStorage.removeItem(AUTH_TOKEN);
      }
    }
  },
  methods: {
    async mutate() {
      if (this.loading) return;
      this.loading = true;
      try {
        const method = this.isLogin ? 'login' : 'register';
        this.authOutput = await this.$apollo
          .mutate({
            mutation: require(`@/graphql/auth/${method}.graphql`),
            variables: {
              user: this.authData
            }
          })
          .then(data => data.data[method]);
        localStorage.setItem(AUTH_TOKEN, this.authOutput.token);
      } catch (e) {
        console.error(e);
      }
      this.loading = false;
    }
  }
};
</script>

<style lang="sass" scoped>
    .auth
        &__left
            width: 50%
        &__right
            padding: 1rem

        &__text
            max-width: 30rem
            text-align: center

        &__input
            min-width: 25rem
            margin-bottom: 2rem
            background-color: $base

            &:last-child
                margin-bottom: 4rem
</style>
