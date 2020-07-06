export default {
  data: () => ({
    activeIndex: -1
  }),
  methods: {
    changeActive(direction, isOpen, toggle) {
      if (!isOpen) {
        toggle();
      }
      const length = this.items.length;
      this.activeIndex = (length + this.activeIndex + direction) % length;
      scrollTo(this.$refs.content.children[this.activeIndex]);
    },
    select(item, close) {
      this.$emit('select', item);
      this.value = item.name || item;
      this.closeOnSelect && close && close();
      if (this.clearOnSelect) {
        this.value = '';
      }
    }
  }
};
