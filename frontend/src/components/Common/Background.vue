<template>
    <div
            class="background"
            :style="{ backgroundImage: `url(${$getImage(`${name}.${ext || 'jpg'}`, true)})` }"
    >
        <slot/>
    </div>
</template>

<script>
export default {
  props: {
    name: {
      type: String,
      required: true
    },
    ext: {
      type: String,
      default: 'jpg'
    }
  }
};
</script>

<style lang="sass" scoped>
    .background
        background-position: 50% 50%
        background-size: cover
        background-repeat: no-repeat
</style>
