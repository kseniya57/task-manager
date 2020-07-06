<template>
    <div :class="{dropdown: true, open}">
        <div class="dropdown__activator pointer" :style="{minWidth: width}" ref="activator" @click.stop="toggle">
            <slot :active="open" :toggle="toggle" name="activator"/>
        </div>
        <div class="dropdown__content box" :style="{ height, width, left }">
            <slot name="content" :toggle="toggle"/>
        </div>
    </div>
</template>

<script>
import closeable from '@/mixins/closeable';
export default {
  props: {
    height: { default: 'auto' },
    width: { default: 'auto' },
    left: { default: 0 }
  },
  data: () => ({
    open: false
  }),
  mixins: [closeable],
  methods: {
    toggle() {
      this.open = !this.open;
    },
    close() {
      this.open = false;
    }
  }
};
</script>

<style lang="sass" scoped>
    .dropdown
        position: relative

        &__content
            z-index: 20
            position: absolute
            top: 100%
            left: 0
            box-shadow: $default-shadow
            transform: translateY(-50%) scaleY(0)
            transition: $default-transition

        &.open
            .dropdown__content
                transform: translateY(0) scaleY(1)
</style>
