<template>
    <div :class="`df jcsb fdc task ${task.active === 0 && 'gradient--closed'}`" v-color="'white'">
        <div class="df jcsb">
            <span>{{ task.name | limit(20) }}</span>
            <v-image :src="task.author.processed_avatar" v-circle="1.5"/>
        </div>
        <div class="df jcsb">
            <span class="text--xs asfs" v-text-color="'text_light'">{{ task.created_at | date }}</span>
            <complete-task-icon :task="task"/>
        </div>
    </div>
</template>

<script>
import CompleteTaskIcon from '@/components/CompleteTaskIcon';

export default {
  props: { task: { required: true } },
  components: {
    CompleteTaskIcon
  }
};
</script>

<style lang="sass" scoped>
    .task
        border-radius: .6rem
        padding: 1rem
        height: 7rem
</style>
