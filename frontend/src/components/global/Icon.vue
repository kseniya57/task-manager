<template>
    <i
            :class="`material-icons icon text--${size}`"
            v-text-color="color"
            v-on="$listeners"
    >{{name}}</i>
</template>

<script>
export default {
  props: {
    name: String,
    size: { default: 'md' },
    color: { default: 'light' }
  }
};
</script>

<style lang="sass" scoped>
    .icon
        font-feature-settings: 'liga'
        vertical-align: text-bottom
        font-weight: 900
        transition: $default-transition
</style>
