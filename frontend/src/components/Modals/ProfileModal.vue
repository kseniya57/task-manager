<template>
    <div class="box profile df fdc ais" v-color="'white'">
        <account-box class="asc" :settings="false" :user="user" @update="({ processed_avatar }) => $set(user, 'processed_avatar', processed_avatar)" v-mb="2"/>
        <status-input v-mb="2" v-model="user.status" :emoji="user.emoji" @emoji="emoji => user.emoji = emoji"/>
        <v-input v-model="user.name" :placeholder="text.form.name" v-mb="2" class="profile__input"/>
        <v-input v-model="user.email" :placeholder="text.form.email" v-mb="2" class="profile__input"/>
        <v-input v-model="user.profession" :placeholder="text.form.profession" v-mb="2" class="profile__input"/>
        <v-textarea :placeholder="text.form.bio" v-model="user.bio" class="profile__textarea" v-mb="2"></v-textarea>
        <div class="df aic jcc">
            <v-button @click="save" v-color="'accent'" v-mr="1">{{ text.actions.ok }}</v-button>
            <v-button @click="$closeModal" v-color="'gray'">{{ text.actions.cancel }}</v-button>
        </div>
    </div>
</template>

<script>
import AccountBox from '@/components/AccountBox';
import { StatusInput, VInput, VTextarea } from '@/components/Controls';
import { mapGetters } from 'vuex';
import { GQL_PROFILE } from '@/graphql';
import { omit } from 'ramda';

export default {
  components: {
    AccountBox,
    StatusInput,
    VInput,
    VTextarea
  },
  computed: {
    ...mapGetters(['user'])
  },
  methods: {
    save() {
      this.$apollo.mutate({
        mutation: GQL_PROFILE,
        variables: {
          id: this.user.id,
          // TODO: role => roles
          input: omit(['__typename', 'id', 'role', 'emoji'], {
            ...this.user,
            status: this.user.emoji + '|' + this.user.status
          })
        }
      });
      this.$closeModal();
    }
  }
};
</script>

<style lang="sass" scoped>
    .profile
        padding: 1rem
        width: 50vw
        max-height: 90vh
        &__input, &__textarea
            border: $devider

</style>
