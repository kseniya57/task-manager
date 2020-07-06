export default {
  methods: {
    mutate(mutation, data) {
      this.$apollo.mutate({
        mutation,
        variables: data
      });
    }
  }
};
