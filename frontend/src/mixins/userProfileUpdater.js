import { mapGetters } from 'vuex';
import { GQL_PROFILE } from '@/graphql';

export default {
  computed: {
    ...mapGetters(['user'])
  },
  destroyed() {
    this.$apollo.mutate({
      mutation: GQL_PROFILE,
      variables: {
        id: this.user.id,
        input: this.getUserInput()
      }
    });
  }
};
