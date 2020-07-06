<template>
  <div>
    <div v-if="editing" v-mb="2" class="relative">
      <editor class="editor" :value="value" @input="v => $emit('input', v)" @ok="editing = false" />
    </div>
    <div v-else v-mb="3" class="text df fdc jcsb description">
      <markdown-renderer class="editor" v-if="value && value.length" :value="value" @input="v => $emit('input', v)"/>
      <span v-else-if="noText">{{ noText }}</span>
      <v-button
          class="edit-button"
          type="circle"
          v-color="'accent'"
          @click="editing = true"
      >
        <v-icon name="edit" color="white"/>
      </v-button>
    </div>
  </div>
</template>

<script>
import Editor from '@/components/Common/Editor';
import MarkdownRenderer from '@/components/Services/MarkdownRenderer';
export default {
  props: ['value', 'noText'],
  components: {
    Editor,
    MarkdownRenderer
  },
  data: () => ({ editing: false })
};
</script>

<style lang="sass" scoped>
  .value
    border: $devider
    padding: 1rem
    border-radius: 1rem
    position: relative
    max-height: 50vh
    overflow-y: auto

  .editor
    max-height: 50vh
    overflow-y: auto

  .description
    border: $devider
    padding: 1rem
    border-radius: 1rem
    position: relative

  .edit-button
    flex-basis: 3rem
    min-height: 3rem
    align-self: flex-end!important
</style>
