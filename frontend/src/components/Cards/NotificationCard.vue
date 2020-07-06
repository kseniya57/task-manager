<template>
    <div class="notification df jcsb" v-color="'white'">
        <v-icon
            name="close"
            class="pointer notification__icon"
            v-ml="1"
            size="xxs"
            v-color="'white'"
            @click.stop="$emit('remove', event.id)"></v-icon>
        <div class="df fdc jcsb aic">
            <div>{{ event.content | limit(20) }}</div>
            <span class="text--xs asfs" v-text-color="'text_light'">{{ event.time | date }}</span>
        </div>
        <div class="df fdc jcsb aic">
            <v-icon v-circle="2" v-color="color" color="white" class="dif aic jcc" :name="iconName"/>
            <v-image :src="event.user.processed_avatar" v-circle="2"/>
        </div>
    </div>
</template>

<script>
import { eventColorMap, eventIconMap } from '@/libs/events';
export default {
  props: {
    event: { required: true }
  },
  computed: {
    color() {
      return eventColorMap[this.event.type];
    },
    iconName() {
      return eventIconMap[this.event.type];
    }
  }
};
</script>

<style lang="sass" scoped>
    .notification
        border-radius: .6rem
        padding: 1rem
        height: 7rem
        position: relative
        min-width: 13rem
        &__icon
            position: absolute
            top: .3rem
            right: .3rem
</style>
