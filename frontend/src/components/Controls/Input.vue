<template>
    <input
            v-font="'inputs'"
            class="input"
            :value="value"
            @input="e => $emit('input', e.target.value)"
            v-text-color="'text_light'"
    />
</template>

<script>
export default {
  props: ['value']
};
</script>
