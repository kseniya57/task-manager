<template>
  <div class="message-editor df aifs">
      <v-icon name="attach_file" color="text_light" @click="$openFileDialog(onUpload)"/>
      <v-textarea
          ref="editor"
          :placeholder="text.chat.type"
          @click="changePosition(0)"
          @keydown.enter.prevent="$emit('send')"
          @keydown="check"
          class="chat__textarea input expanded"
          :value="value"
          @input="v => $emit('input', v)"
      />
      <v-icon name="tag_faces"/>
      <v-icon name="keyboard_voice"/>
  </div>
</template>

<script>
import editor from '@/mixins/editor';

export default {
  props: ['value'],
  inheritAttrs: false,
  mixins: [editor]
};
</script>

<style lang="sass" scoped>
  .message-editor
    flex-basis: 3rem
    i
      flex-basis: 3rem
      font-size: 2rem
      cursor: pointer
    textarea
      padding-top: 0
</style>
