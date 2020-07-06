<template>
    <v-icon
            name="check"
            class="pointer"
            :color="task.active ? 'gray' : 'info'"
            @click.stop="update"
    />
</template>

<script>
import { GQL_UPDATE_TASK, GQL_TASKS } from '@/graphql';
import mutator from '@/mixins/mutator';

export default {
  props: ['task'],
  mixins: [mutator],
  methods: {
    update() {
      this.$set(this.task, 'active', this.task.active === 0 ? 1 : 0);
      this.mutate(
        GQL_UPDATE_TASK,
        {
          id: this.task.id,
          input: { active: this.task.active }
        },
        'Task',
        GQL_TASKS
      );
    }
  }
};
</script>
