<template>
  <div class="box photo-editor" v-color="'base'">
    <div class="df jcfe toolbar">
      <v-icon name="rotate_left" @click="croppie.rotate(90)"></v-icon>
      <v-icon name="rotate_right" @click="croppie.rotate(-90)"></v-icon>
    </div>
    <div>
      <img ref="croppie" :src="$getImage(src)" alt="">
    </div>
    <div class="df aic jcc">
      <v-button @click="save" v-color="'accent'" v-mr="1">{{ text.actions.ok }}</v-button>
      <v-button @click="$closeModal" v-color="'gray'">{{ text.actions.cancel }}</v-button>
    </div>
  </div>
</template>

<script>
import Croppie from 'croppie';
import 'croppie/croppie.css';
import axios from 'axios';
import { UPLOADS_URL } from '@/constants';

export default {
  props: ['src', 'onResult'],
  data: () => ({
    croppie: null
  }),
  mounted() {
    this.croppie = new Croppie(this.$refs.croppie, {
      viewport: { width: 100, height: 100, type: 'circle' },
      boundary: { width: 300, height: 300 },
      enableOrientation: true
    });
  },
  destroyed() {
    this.croppie.destroy();
  },
  methods: {
    async save() {
      const result = await this.croppie.result({
        type: 'blob',
        size: 'viewport',
        format: 'png',
        quality: 1,
        circle: true
      });
      const formData = new FormData();
      formData.append('file', result, '1.png');
      const { data } = await axios.post(`${UPLOADS_URL}/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      this.onResult && this.onResult(data.fileName);
      this.$closeModal();
    }
  }
};
</script>

<style lang="sass" scoped>
  .photo-editor
    padding: 1rem
  .toolbar
    padding: .5rem 0

    i
      margin-right: .5rem
      cursor: pointer
</style>
