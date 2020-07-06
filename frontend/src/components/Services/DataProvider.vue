<script>
export default {
  props: ['url'],
  data: () => ({
    data: null,
    loading: true,
    error: null
  }),
  created() {
    fetch(this.url)
      .then(res => res.json())
      .then(data => (this.data = data))
      .catch(e => (this.error = e));
  },
  render() {
    return this.$scopedSlots.default({
      data: this.data,
      loading: this.loading,
      error: this.error
    });
  }
};
</script>
