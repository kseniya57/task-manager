<template>
  <div class="home df jcsb" v-color="'base'">
    <div class="home__projects home__cards box" v-mr="1">
      <project-card v-for="project in projects" :project="project" :key="project.id" v-mb="1"/>
    </div>
    <div class="df fdc expanded">
      <sortable-list v-model="tasks" class="home__tasks expanded home__cards box"  v-mb="2">
        <div slot-scope="{ items: tasks }" v-color="'base'">
          <task-row-card v-for="task in tasks" :task="task" :key="task.id"/>
        </div>
      </sortable-list>
      <div class="df expanded jcsb home__cards">
        <div class="card box df aic jcc fdc" v-for="i in ['tasks', 'projects', 'todos']" :key="i" v-to="i">
          <div class="card__circle df jcc aic" v-mb="2">10</div>
          <h3 class="card__title">
            {{ text.menu[i] }}
          </h3>
        </div>
      </div>
      <!--<div class="df fdc expanded fww home__notifications home__cards box">-->
        <!--<notification-card v-for="event in events" :event="event" :key="event.id" v-mb="1" v-mr="1"/>-->
      <!--</div>-->
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { SortableList } from '@/components/Sortable';
import { TaskRowCard, NotificationCard, ProjectCard } from '@/components/Cards';
import { GQL_TASKS, GQL_EVENTS, GQL_PROJECTS, GQL_TODOS } from '@/graphql';

export default {
  components: {
    SortableList,
    TaskRowCard,
    NotificationCard,
    ProjectCard
  },
  data: () => ({
    projects: [],
    tasks: [],
    todos: [],
    events: []
  }),
  apollo: {
    tasks: {
      query: GQL_TASKS,
      variables() {
        return {
          filter: {
            //assigned_to: this.user.id,
            active: 1
          }
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
    projects: {
      query: GQL_PROJECTS
    },
    todos: GQL_TODOS
  },
  computed: {
    ...mapGetters(['user'])
  }
};
</script>

<style lang="sass" scoped>
  .home
    height: calc(100vh - #{$header-height} - .2rem)
    overflow-y: auto
    padding: 1rem
    &__cards
      overflow: auto
    &__projects
      width: 25rem
    &__tasks, &__notifications
      padding: 1rem
  .card
    border-radius: .6rem
    margin: 1rem
    width: 30%
    cursor: pointer
    &__circle
      border: 2rem solid $accent
      border-radius: 50%
      width: 10rem
      height: 10rem
    &__title
      text-transform: capitalize
</style>
