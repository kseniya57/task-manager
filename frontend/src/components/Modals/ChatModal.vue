<template>
    <div
            class="box chat-modal df jcc fdc ais"
            v-color="'base'"
    >
        <v-input v-model="chat.name" v-mb="2" :placeholder="text.form.title"/>
        <v-image class="chat-modal__image asc pointer" @click="uploadImage" :src="chat.image" v-mb="2"/>
        <users-input v-model="chat.users" v-mb="2"/>
        <div class="df aic jcc">
            <v-button @click="save" v-color="'accent'" v-mr="1">{{ text.actions.ok }}</v-button>
            <v-button @click="$closeModal" v-color="'gray'">{{ text.actions.cancel }}</v-button>
        </div>
    </div>
</template>

<script>
import { VInput, UsersInput } from '@/components/Controls';
import { GQL_ADD_CHAT, GQL_UPDATE_CHAT, GQL_CHATS } from '@/graphql';
import mutator from '@/mixins/mutator';

export default {
  props: ['chat'],
  mixins: [mutator],
  components: {
    VInput,
    UsersInput
  },
  computed: {
    isNew() {
      return !this.chat.id;
    }
  },
  methods: {
    onUpload(fileName) {
      this.$set(this.chat, 'image', fileName);
    },
    uploadImage() {
      this.$openFileDialog(this.onUpload);
    },
    save() {
      this.mutate(
        this.isNew ? GQL_ADD_CHAT : GQL_UPDATE_CHAT,
        {
          id: this.chat.id,
          input: {
            name: this.chat.name,
            image: this.chat.image,
            users: this.chat.users.map(user => user.id)
          }
        },
        'Chat',
        GQL_CHATS
      );
      this.$closeModal();
    }
  }
};
</script>

<style lang="sass" scoped>
    .chat-modal
        padding: 1rem
        width: 50vw
        max-height: 90vh

        &__image
            width: 20rem
</style>
