<template>
    <div class="sidebar" v-color="'base'">
        <account-box :user="user" @update="({ processed_avatar }) => $set(user, 'processed_avatar', processed_avatar)"/>
        <div class="menu">
            <a
                    v-font="'base'"
                    class="menu__item df aic"
                    v-for="item in menu"
                    :key="item.name"
                    v-to="item.link"
            >
                <v-icon :name="item.icon" v-mr="1" color="gray" />
                <span class="ttc" v-text-color="'text_base'">{{ item.name }}</span>
            </a>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import AccountBox from '../components/AccountBox';

export default {
  components: {
    AccountBox
  },
  computed: {
    ...mapGetters(['user']),
    menu() {
      const values = this.text.menu;
      return [
        {
          name: values.home,
          icon: 'home',
          link: '/'
        },
        {
          name: values.schedule,
          icon: 'schedule',
          link: '/schedule'
        },
        {
          name: values.projects,
          icon: 'work',
          link: '/projects'
        },
        {
          name: values.statistics,
          icon: 'bubble_chart',
          link: '/statistics'
        },
        {
          name: values.activity,
          icon: 'show_chart',
          link: '/activity'
        },
        {
          name: values.teams,
          icon: 'group',
          link: '/teams'
        },
        {
          name: values.chat,
          icon: 'chat',
          link: '/chat'
        }
      ];
    }
  }
};
</script>

<style lang="sass" scoped>
    .sidebar
        width: $sidebar-width
        height: calc(100vh - #{$header-height})
        border-right: $devider

        .menu
            padding: 0 2rem

            &__item
                border-bottom: $devider
                padding: 1rem 0
                cursor: pointer
</style>
