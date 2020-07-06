<template>
        <textarea
                ref="textarea"
                class="textarea"
                style="resize: none"
                @input="e => $emit('input', e.target.value)"
                @focus="checkPlaceholder"
                @blur="checkPlaceholder"
                :value="value"
                v-on="listeners"
                v-text-color="'text_base'"
                v-font="'inputs'"
        ></textarea>
</template>

<script>
export default {
  props: ['value', 'placeholder'],
  data: () => ({
    minHeight: 50,
    showPlaceholder: false
  }),
  mounted() {
    this.resize();
    if (!this.value && this.placeholder) {
      this.checkPlaceholder();
    }
  },
  methods: {
    resize: function() {
      this.$refs.textarea.style.setProperty('height', 'auto');
      let contentHeight = this.$refs.textarea.scrollHeight + 1;
      if (this.minHeight) {
        contentHeight =
          contentHeight < this.minHeight ? this.minHeight : contentHeight;
      }
      if (this.maxHeight) {
        if (contentHeight > this.maxHeight) {
          contentHeight = this.maxHeight;
          this.maxHeightScroll = true;
        } else {
          this.maxHeightScroll = false;
        }
      }
      const heightVal = contentHeight + 'px';
      this.$refs.textarea.style.setProperty('height', heightVal);
      return this;
    },
    checkPlaceholder() {
      if (!this.value || this.value === this.placeholder) {
        if (this.showPlaceholder) {
          this.$emit('input', '');
          this.showPlaceholder = false;
        } else {
          this.$emit('input', this.placeholder);
          this.showPlaceholder = true;
        }
      }
    }
  },
  watch: {
    value(value) {
      if (
        value &&
        value !== this.placeholder &&
        value.endsWith(this.placeholder)
      ) {
        this.$emit(
          'input',
          value.substring(0, this.value.length - this.placeholder.length)
        );
      }
      this.$nextTick(this.resize);
    }
  },
  computed: {
    listeners() {
      return Object.entries(this.$listeners).reduce(
        (map, [event, listener]) =>
          Object.assign(map, event === 'input' ? {} : { [event]: listener }),
        {}
      );
    }
  }
};
</script>
