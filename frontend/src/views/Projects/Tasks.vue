<template>
  <sortable-list v-model="tasks" v-color="'white'">
    <!--eslint-disable-next-line vue/no-unused-vars-->
    <div class="tasks-list box" slot-scope="{ items: tasks }" v-color="'base'">
      <div class="tasks-list__header df aic jcsb">
        <h3 class="ttc" v-font="'headers'">{{ text.menu.tasks }}</h3>
        <search
            v-mr="2"
            v-ml="2"
            class="expanded"
            v-model="filteredTasks"
            :initialFilter="{ active: 1 }"
            :filters="searchFilters"
            :searchValues="tasks"
        />
        <v-button
            v-color="'accent'"
            type="circle"
            v-mr="2"
            @click="$showModal('task', { task: createNewTask() })"
        >
          <v-icon name="add" :color="'white'"/>
        </v-button>
      </div>
      <task-row-card v-for="task in filteredTasks" :key="task.id" :task="task"/>
    </div>
  </sortable-list>
</template>

<script>
import { SortableList } from '@/components/Sortable';
import { TaskRowCard } from '@/components/Cards';
import { Search } from '@/components/Controls';
import {
  GQL_TASKS,
  GQL_TASK_ADDED,
  GQL_TASK_UPDATED,
  GQL_TASK_DELETED
} from '@/graphql';
import mutator from '@/mixins/mutator';

export default {
  components: {
    SortableList,
    TaskRowCard,
    Search
  },
  mixins: [mutator],
  data() {
    return {
      filteredTasks: [],
      tasks: [],
      projectId: +this.$route.params.id
    };
  },
  apollo: {
    tasks: {
      query: GQL_TASKS,
      variables() {
        return { filter: { project_id: this.projectId } };
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
      null,
      false
    );
  },
  computed: {
    searchFilters() {
      const { filters, status } = this.text;
      return [
        {
          icon: 'person',
          name: filters.author,
          value: 'author'
        },
        {
          icon: 'person',
          name: filters.assigned_to,
          value: 'assigned_to'
        },
        {
          icon: 'label',
          name: filters.tags,
          value: 'tags',
          type: 'array'
        },
        {
          icon: 'check',
          name: filters.active,
          value: 'active',
          process: value => (value === 0 ? status.closed : status.opened)
        }
      ];
    }
  },
  methods: {
    createNewTask() {
      return {
        position: this.tasks ? this.tasks.length : 1,
        tags: [],
        project_id: this.projectId
      };
    }
  }
};
</script>

<style lang="sass" scoped>
  .tasks-list
    margin: 2rem
    padding: 1rem

    &__header
      border-bottom: $devider
      padding: 1rem

    &__item
      padding: 1rem

      &:not(:last-child)
        border-bottom: $devider

    &__handle
      cursor: move

    .task
      &__header
        flex-basis: 35%

      &__tags
        flex-basis: 20%
</style>
