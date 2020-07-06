<template>
    <img
            :src="$getImage(Ωsrc, Ωlocal)"
            @error="setDefault"
            @abort="setDefault"
            v-on="$listeners"
    >
</template>

<script>
import { DEFAULT_IMAGE } from '../../constants';

// Ω: I'm fine :) But I couldn’t find a normal character :)
export default {
  props: ['src', 'local'],
  data: () => ({
    Ωsrc: null,
    Ωlocal: false
  }),
  mounted() {
    this.setActual();
  },
  watch: {
    src() {
      this.setActual();
    }
  },
  methods: {
    setDefault() {
      this.Ωsrc = DEFAULT_IMAGE;
      this.Ωlocal = true;
    },
    setActual() {
      this.Ωsrc = this.src;
      this.Ωlocal = this.local;
    }
  }
};
</script>
