<template>
    <header class="header df ais" v-color="'base'">
        <div class="header__block">
            <logo/>
        </div>
        <breadcrumbs class="header__block expanded" v-ml="2"/>
        <dropdown width="20rem" class="header__block">
            <template slot="activator" scope="{ active }" :class="`ttc ${active && 'active'}`">
                <v-icon name="notifications" :color="active ? 'accent' : 'gray'"/>
            </template>
            <div slot="content" class="header__cards-container">
                <notification-card class="header__card" v-for="event in events" :key="event.id" :event="event"/>
            </div>
        </dropdown>
        <dropdown width="20rem" class="header__block">
            <template slot="activator" scope="{ active }" :class="`ttc ${active && 'active'}`">
                <v-icon name="dialpad" :color="active ? 'accent' : 'gray'"/>
            </template>
            <div slot="content" class="header__cards-container">
                <task-card v-for="task in tasks" :task="task" class="header__card" :key="task.id"/>
            </div>
        </dropdown>
        <div class="header__block">
            <lang-select class="fullheight"/>
        </div>
        <div class="header__block header__exit pointer" @click="$store.commit('logout')">
            <v-icon name="exit_to_app"/>
        </div>
    </header>
</template>

<script>
import { mapGetters } from 'vuex';
import Logo from '@/components/Logo';
import Breadcrumbs from '@/components/Common/Breadcrumbs';
import Dropdown from '@/components/Common/Dropdown';
import LangSelect from '@/components/LangSelect';
import {
  GQL_TASKS,
  GQL_TASK_ADDED,
  GQL_TASK_UPDATED,
  GQL_TASK_DELETED,
  GQL_EVENTS,
  GQL_EVENT_ADDED
} from '@/graphql';

import { TaskCard, NotificationCard } from '@/components/Cards';

export default {
  components: {
    Logo,
    Breadcrumbs,
    Dropdown,
    TaskCard,
    NotificationCard,
    LangSelect
  },
  data: () => ({
    tasks: [],
    events: []
  }),
  apollo: {
    tasks: {
      query: GQL_TASKS,
      variables() {
        return {
          assigned_to: this.user.id,
          active: 1
        };
      }
    },
    events: {
      query: GQL_EVENTS,
      variables() {
        return {
          filter: {},
          pagination: {
            limit: 5,
            offset: 0,
            order: 'created_at'
          }
        };
      }
    },

    $subscribe: {
      eventAdded: {
        query: GQL_EVENT_ADDED,
        result({ data: { eventAdded } }) {
          this.events.splice(1);
          this.events.push(eventAdded);
        }
      }
    }
  },
  created() {
    this.$addSubscriptions(
      'task',
      {
        added: GQL_TASK_ADDED,
        updated: GQL_TASK_UPDATED,
        deleted: GQL_TASK_DELETED,
        all: GQL_TASKS
      },
      { assigned_to: this.user.id },
      false
    );
  },
  computed: {
    ...mapGetters(['user'])
  }
};
</script>

<style lang="sass" scoped>
    .header
        border-bottom: $devider
        height: $header-height

        &__cards-container
            padding: 1rem
            text-align: left
            max-height: 50vh
            overflow-y: scroll

        &__card
            margin-bottom: 1rem

        &__exit
            padding: 0 1rem

            &:hover > i
                color: $dark !important

        &__block
            border-right: $devider
            display: flex
            align-items: center
            text-align: center

            &:first-child
                width: $sidebar-width
                justify-content: center
</style>
