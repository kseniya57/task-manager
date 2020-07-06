<template>
    <object ref="artboard" type="image/svg+xml" :data="svg" @load="setDocument"></object>

</template>

<script>
export default {
  props: {
    svg: { required: true }
  }
};
</script>

<style lang="sass" scoped>

</style>
