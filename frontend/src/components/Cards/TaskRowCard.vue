<template>
  <sortable-item>

    <div
        :class="`task df aic ${task.active === 0 && 'gradient--closed'}`"
        @contextmenu="e => $showContextMenu(e, 'actions', contextMenuActions)"
    >
      <div class="df fdc aifs task__header pointer" @click="$showModal('task', { task })">
        <span class="text--bold" v-mb=".3">{{ task.name }}</span>
        <span
            class="text--xs"
            v-text-color="'text_light'"
        >{{ task.created_at | date }}, {{ task.author.name }}</span>
      </div>

      <div class="df fww task__tags">
        <tag
            v-for="tag in task.tags"
            :key="`${task.id}-${tag.id}`"
            :removable="false"
            v-mb=".5"
            v-mr=".5"
            :tag="tag"
        />
      </div>
      <span class="expanded"/>
      <div class="df fdc aife" v-mr="2">
        <div class="df aic" v-mb="1">
          <avatar v-if="task.author" :user="task.author" v-mr=".5"/>
          <v-icon name="arrow_forward_ios" v-mr=".5"/>
          <avatar v-if="task.assigned_to" :user="task.assigned_to" v-mr="1.5"/>
          <v-icon name="comment" v-mr=".3" :color="task.comments.length === 0 ? 'gray' : 'dark'"/>
          <span v-text-color="task.comments.length === 0 ? 'gray' : 'dark'">{{ task.comments.length }}</span>
        </div>
        <span class="text--xs"
              v-text-color="'text_light'">{{ text.events.types.update }} {{ task.updated_at | date }}</span>
      </div>
      <sortable-handle v-mr="2">
        <v-icon name="drag_indicator" class="task__handle"/>
      </sortable-handle>
      <complete-task-icon :task="task"/>
    </div>
  </sortable-item>
</template>

<script>
import { GQL_TASKS, GQL_DELETE_TASK } from '@/graphql';
import { SortableItem, SortableHandle } from '@/components/Sortable';
import CompleteTaskIcon from '@/components/CompleteTaskIcon';
import Tag from '@/components/Common/Tag';
import Avatar from '@/components/Common/Avatar';

export default {
  props: ['task'],
  components: {
    SortableItem,
    SortableHandle,
    CompleteTaskIcon,
    Tag,
    Avatar
  },
  methods: {
    remove() {
      this.mutate(
        GQL_DELETE_TASK,
        {
          id: this.task.id
        },
        'Task',
        GQL_TASKS
      );
    }
  },
  computed: {
    contextMenuActions() {
      return {
        actions: [
          {
            name: 'edit',
            icon: 'edit',
            action: () => this.$showModal('task', { task: this.task })
          },
          {
            name: 'delete',
            icon: 'delete',
            action: () => this.remove(this.task.id)
          }
        ]
      };
    }
  }
};
</script>

<style lang="sass" scoped>
  .task
    padding: 1rem
    &:not(:last-child)
      border-bottom: $devider
    &__header
      flex-basis: 35%
    &__tags
      flex-basis: 20%
    &__handle
      cursor: move
</style>
