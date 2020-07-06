<template>
    <div class="timeline">
        <div class="event df" v-for="(event, index) in events" :key="index" v-mb="2">
            <v-image v-if="event.type === 'comment'" :src="event.user.processed_avatar" v-circle="3" class="event__icon"/>
            <v-icon v-else v-circle="3" v-color="eventColorMap[event.type]" color="white" :name="eventIconMap[event.type]"
                    class="event__icon dif aic jcc"/>
            <div :class="event.type" slot="activator"
                 @contextmenu="(e) => event.type === 'comment' && $showContextMenu(e, 'actions', getActionsMenuData(event))">
                <div v-mb=".5">
                    <span>{{ event.user.name }}, </span>
                    <span class="text--xs" v-text-color="'text_light'">{{ event.time || event.created_at | date }}</span>
                </div>
                <markdown-renderer :value="event.content"/>
            </div>
        </div>
    </div>
</template>

<script>
import MarkdownRenderer from '@/components/Services/MarkdownRenderer';
import { eventColorMap, eventIconMap } from '@/libs/events';

export default {
  components: {
    MarkdownRenderer
  },
  props: ['events'],
  data: () => ({
    eventColorMap,
    eventIconMap
  }),
  methods: {
    // only for comments
    getActionsMenuData(comment) {
      return {
        actions: [
          {
            name: 'edit',
            icon: 'edit',
            action: () => this.$emit('edit', comment)
          },
          {
            name: 'delete',
            icon: 'delete',
            action: () => this.$emit('delete', comment.id)
          }
        ]
      };
    }
  }
};
</script>

<style lang="sass" scoped>
    .event
        position: relative

        &:not(:last-child)
            &:after
                content: ''
                position: absolute
                top: 3rem
                bottom: -2rem
                left: 1.3rem
                width: .4rem
                background-color: $gray

        &__icon
            margin-right: 2rem
</style>
