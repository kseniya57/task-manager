<template>
    <div :class="`df jcsb fdc todo ${todo.active === 0 && 'gradient--closed'}`" v-color="'white'">
        <div class="df jcsb">
            <span>{{ todo.name }}</span>
        </div>
        <div class="df jcsb">
            <span class="text--xs asfs" v-text-color="'text_light'">{{ todo.created_at | date }}</span>
            <!--<complete-task-icon :todo="todo"/>-->
        </div>
    </div>
</template>

<script>
export default {
  props: { todo: { required: true } }
};
</script>

<style lang="sass" scoped>
    .todo
        border-radius: .6rem
        padding: 1rem
        height: 7rem
</style>
