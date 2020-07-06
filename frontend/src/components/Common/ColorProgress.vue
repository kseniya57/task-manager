<template>
    <div class="df progress">
        <tooltip tag="span" position="top" v-for="(value, key) in items" :key="key" message="message" v-color="$random(Object.values(colors), 0, Object.values(colors).length - 1)" :style="{ width: `${value}%` }" />
    </div>
</template>

<script>
import Tooltip from '@/components/Common/Tooltip';
export default {
  props: ['items'],
  components: { Tooltip }
};
</script>

<style lang="sass" scoped>
    .progress
        width: 100%
        height: 1rem
        border-radius: .6rem
        overflow: hidden
</style>
