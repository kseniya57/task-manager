<template>
    <div>
        <div @click.stop="show = true">
            <slot name="activator"/>
        </div>
        <transition name="slide--to-top">
            <div v-if="show" :class="`sheet box sheet--${mode}`" @click.stop="() => null">
                <slot name="content"/>
            </div>
        </transition>
    </div>
</template>

<script>
import closeable from '@/mixins/closeable';
export default {
  props: {
    mode: { default: 'bottom' }
  },
  data: () => ({
    show: false
  }),
  mixins: [closeable],
  methods: {
    close() {
      if (this.show) {
        this.show = false;
      }
    }
  }
};
</script>

<style lang="sass" scoped>
    .sheet
        position: fixed

        &--bottom, &--top
            left: 0
            right: 0

        &--bottom
            bottom: 0

        &--top
            top: 0

        &--left, &--right
            bottom: 0
            top: 0

        &--left
            left: 0

        &--right
            right: 0
</style>
