<template>
    <div class="account-box df fdc aic jcc">
        <div
                class="account-box__image-container"
                @contextmenu="$showContextMenu($event, 'actions', { actions })"
                @click="$showModal('image', { src: user.avatar })"
                v-mb="1"
                v-circle="8"
        >
            <v-image class="account-box__image" :src="user.processed_avatar" v-circle="8"/>
            <div class="account-box__image-overlay df aic jcc">
                <v-icon name="zoom_out_map" color="white" size="lg"/>
            </div>
        </div>
        <v-icon
                v-if="settings"
                name="settings"
                class="account-box__settings-icon"
                @click.stop="$showModal('profile')"
                color="accent"></v-icon>
        <span class="text--bold" v-font="'headers'">{{ user.name }}</span>
        <span v-font="'base'">{{ user.profession }}</span>
    </div>
</template>

<script>
import { GQL_PROFILE } from '@/graphql';

export default {
  props: { user: Object, settings: { default: true } },
  computed: {
    // Computed because file dialog may be not initialized yet and then openFileDialog is underfined
    actions() {
      return [
        {
          name: 'upload',
          icon: 'cloud_upload',
          action: () => this.$openFileDialog(this.onUpload)
        },
        {
          name: 'change_miniature',
          icon: 'blur_on',
          action: () =>
            this.$showModal('photoEditor', {
              src: this.user.avatar,
              onResult: this.onAvatarProcessedAvatar
            })
        },
        {
          name: 'delete',
          icon: 'delete',
          action: () => null
        }
      ];
    }
  },
  methods: {
    onUpload(avatar) {
      this.$emit('update', { avatar });
      this.$showModal('photoEditor', {
        src: avatar,
        onResult: this.onAvatarProcessedAvatar
      });
      this.$apollo.mutate({
        mutation: GQL_PROFILE,
        variables: {
          id: this.user.id,
          input: { avatar }
        }
      });
    },
    onAvatarProcessedAvatar(processed_avatar) {
      this.$emit('update', { processed_avatar });
      this.$apollo.mutate({
        mutation: GQL_PROFILE,
        variables: {
          id: this.user.id,
          input: { processed_avatar }
        }
      });
    }
  }
};
</script>

<style lang="sass" scoped>
    .account-box
        padding: 2rem 0
        border-bottom: $devider
        position: relative

        &__image
            box-shadow: $default-shadow

            &-container
                position: relative
                overflow: hidden
                cursor: pointer

            &-overlay
                position: absolute
                top: 0
                bottom: 0
                left: 0
                right: 0
                background-color: rgba($dark, .2)
                opacity: 0
                transition: $default-transition

                &:hover
                    opacity: 1

        &__settings-icon
            cursor: pointer
            font-size: 2.5rem
            position: absolute
            top: 8rem
            right: calc((#{$sidebar-width} - 7rem) / 2)
</style>
