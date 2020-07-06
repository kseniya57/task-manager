<template>
  <div

      class="box repository-modal df jcc fdc ais"
      v-color="'base'"
  >
    <avatar :user="creator" class="repository-modal__author"/>
    <v-input v-model="repository.name" v-mb="2" :placeholder="text.form.title"/>
    <v-textarea v-model="repository.description" :placeholder="text.form.description" v-mb="2"/>
    <users-input v-model="repository.users" :except="creator.id" v-mb="2"/>
    <div class="df aic jcc">
      <v-button @click="save" v-color="'accent'" v-mr="1">{{ text.actions.ok }}</v-button>
      <v-button @click="$closeModal" v-color="'gray'">{{ text.actions.cancel }}</v-button>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { VInput, VTextarea, UsersInput } from '@/components/Controls';
import Avatar from '@/components/Common/Avatar';
import {
  GQL_ADD_REPOSITORY,
  GQL_UPDATE_REPOSITORY,
  GQL_REPOSITORIES
} from '@/graphql';
import mutator from '@/mixins/mutator';

export default {
  props: {
    repository: {
      default: () => ({ users: [] })
    }
  },
  mixins: [mutator],
  components: {
    VInput,
    VTextarea,
    UsersInput,
    Avatar
  },
  computed: {
    ...mapGetters(['user']),
    creator() {
      return this.repository.creator ? this.repository.creator : this.user;
    }
  },
  methods: {
    save() {
      const { id, name, description, project_id } = this.repository;
      this.mutate(
        id ? GQL_UPDATE_REPOSITORY : GQL_ADD_REPOSITORY,
        {
          id,
          input: {
            project_id,
            name,
            description,
            users: this.repository.users.map(user => user.id)
          }
        },
        'Repository',
        GQL_REPOSITORIES
      );
      this.$closeModal();
    }
  }
};
</script>

<style lang="sass" scoped>
  .repository-modal
    padding: 1rem
    width: 50vw
    max-height: 90vh
    position: relative
    padding-top: 4rem

    &__author
      position: absolute !important
      top: 1rem
      right: 1rem
</style>
