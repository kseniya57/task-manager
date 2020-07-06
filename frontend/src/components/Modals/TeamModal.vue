<template>
  <div
      class="box team-modal df jcc fdc ais"
      v-color="'base'"
  >
    <v-input v-model="team.name" v-mb="2" :placeholder="text.form.title"/>
    <users-input v-model="team.users" v-mb="2"/>
    <div class="df aic jcc">
      <v-button @click="save" v-color="'accent'" v-mr="1">{{ text.actions.ok }}</v-button>
      <v-button @click="$closeModal" v-color="'gray'">{{ text.actions.cancel }}</v-button>
    </div>
  </div>
</template>

<script>
import { VInput, UsersInput } from '@/components/Controls';
import { GQL_ADD_TEAM, GQL_UPDATE_TEAM, GQL_TEAMS } from '@/graphql';
import mutator from '@/mixins/mutator';

export default {
  props: ['team'],
  mixins: [mutator],
  components: {
    VInput,
    UsersInput
  },
  computed: {
    isNew() {
      return !this.team.id;
    }
  },
  methods: {
    save() {
      this.mutate(
        this.isNew ? GQL_ADD_TEAM : GQL_UPDATE_TEAM,
        {
          id: this.team.id,
          input: {
            name: this.team.name,
            users: this.team.users.map(user => user.id)
          }
        },
        'Team',
        GQL_TEAMS
      );
      this.$closeModal();
    }
  }
};
</script>

<style lang="sass" scoped>
  .team-modal
    padding: 1rem
    width: 50vw
    max-height: 90vh

    &__image
      width: 20rem
</style>
