<template>
  <div class="df status-input">
    <div
        class="status-input__emoji dif aic jcc"
        v-color="emoticon ? 'white' : 'gray'"
        @click.stop="e => $showContextMenu(e, 'emojiBox', { input: changeEmoticon })"
    >{{ emoticon }}</div>
    <input
        v-font="'inputs'"
        class="input"
        :value="value"
        @input="e => $emit('input', e.target.value)"
        v-text-color="'text_light'"
        :placeholder="text.form.status"
    />
  </div>
</template>

<script>
export default {
  props: ['value', 'emoji'],
  data: () => ({
    emoticon: null
  }),
  mounted() {
    if (this.emoji) {
      this.emoticon = this.emoji;
    }
  },
  methods: {
    changeEmoticon(emoticon) {
      this.$emit('emoji', emoticon);
      this.emoticon = emoticon;
      this.$closeContextMenu();
    }
  }
};
</script>

<style lang="sass" scoped>
  .status-input
    overflow: hidden
    border: $devider
    border-radius: 1rem
    &__emoji
      width: 2.5rem
      cursor: pointer
      border-right: $devider
</style>
