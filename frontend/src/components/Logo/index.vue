<template>
    <router-link class="logo df jcc aic" to="/">
        <logo-icon />
        <span class="logo__text" v-text-color="'text_base'" v-font="'headers'">{{ text.app.name }}</span>
    </router-link>
</template>

<script>
import LogoIcon from './Icon';
export default {
  components: {
    LogoIcon
  }
};
</script>

<style lang="sass" scoped>
    .logo
        min-width: 10rem
        &__text
            font-size: 2rem
            margin-left: .5rem
            text-transform: capitalize
</style>
