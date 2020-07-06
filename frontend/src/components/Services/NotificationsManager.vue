<template>
    <div class="notifications__container">
        <transition name="fade" v-for="event in notifications" :key="event.id">
            <notification-card class="notifications__item" @remove="remove" v-mb="1" :event="event"/>
        </transition>
    </div>
</template>

<script>
import { GQL_EVENT_ADDED } from '@/graphql';
import { NotificationCard } from '@/components/Cards';

export default {
  data: () => ({
    notifications: []
  }),
  components: {
    NotificationCard
  },
  apollo: {
    $subscribe: {
      eventAdded: {
        query: GQL_EVENT_ADDED,
        result({ data: { eventAdded } }) {
          this.notifications.push(eventAdded);
          eventAdded.timeout = setTimeout(() => {
            this.notifications = this.notifications.filter(
              notification => notification.id !== eventAdded.id
            );
          }, 1000 * 30);
        }
      }
    }
  },
  methods: {
    remove(id) {
      const notification = this.notifications.find(
        notification => notification.id === id
      );
      if (notification) {
        clearTimeout(notification.timeout);
      }
      this.notifications = this.notifications.filter(
        notification => notification.id !== id
      );
    }
  }
};
</script>

<style lang="sass" scoped>
    .notifications
        &__container
            position: fixed
            right: 1rem
            top: 1rem
            width: 15rem

</style>
