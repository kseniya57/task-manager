<template>
  <div

      class="box project-modal df jcc fdc ais"
      v-color="'base'"
  >
    <avatar :user="creator" class="project-modal__creator"/>
    <v-image class="project-modal__image asc pointer" @click="uploadImage" :src="project.image" v-mb="2"/>
    <v-input v-model="project.name" v-mb="2" :placeholder="text.form.title"/>
    <v-textarea v-model="project.description" :placeholder="text.form.description" v-mb="2"/>
    <users-input v-model="project.users" :except="creator.id" v-mb="2"/>
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
import { GQL_ADD_PROJECT, GQL_UPDATE_PROJECT, GQL_PROJECTS } from '@/graphql';
import mutator from '@/mixins/mutator';

export default {
  props: {
    project: {
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
      return this.project.creator ? this.project.creator : this.user;
    }
  },
  methods: {
    onUpload(fileName) {
      this.$set(this.project, 'image', fileName);
    },
    uploadImage() {
      this.$openFileDialog(this.onUpload);
    },
    save() {
      const { id, name, image, description } = this.project;
      this.mutate(
        id ? GQL_UPDATE_PROJECT : GQL_ADD_PROJECT,
        {
          id,
          input: {
            name,
            image,
            description,
            users: this.project.users.map(user => user.id)
          }
        },
        'Project',
        GQL_PROJECTS
      );
      this.$closeModal();
    }
  }
};
</script>

<style lang="sass" scoped>
  .project-modal
    padding: 1rem
    width: 50vw
    max-height: 90vh
    position: relative

    &__image
      width: 20rem

    &__creator
      position: absolute !important
      top: 1rem
      right: 1rem
</style>
