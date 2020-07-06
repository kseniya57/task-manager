<template>
    <div class="fullheight">
        <artboard :svg="require('@/assets/sketch/Dashboard.svg')"/>
    </div>
</template>

<script>
import Artboard from './Artboard';
export default {
  components: {
    Artboard
  },
  created() {
    //this.$refs.artboard.
  }
};
</script>

<style lang="sass" scoped>

</style>
