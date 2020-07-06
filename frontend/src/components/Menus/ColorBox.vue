<template>
  <div class="color-box df jcc fww" v-color="'white'">
    <span v-for="(color, key) in colors" :key="key" v-color="color" @click.stop="input(key)"></span>
  </div>
</template>

<script>
export default {
  props: { input: { required: true, type: Function } }
};
</script>

<style lang="sass" scoped>
.color-box
  width: 10rem
  padding: .5rem
  &>span
    display: inline-block
    width: 1.5rem
    height: 1.5rem
    margin-bottom: .5rem
    border-radius: .3rem
    cursor: pointer
    &:not(:nth-child(4n))
      margin-right: .5rem
</style>
