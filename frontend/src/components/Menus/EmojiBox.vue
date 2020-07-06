<template>
  <div @click.stop="() => null">
    <picker @select="emoji => input(emoji.native)" />
  </div>
</template>

<script>
import { Picker } from 'emoji-mart-vue';
export default {
  props: { input: { required: true, type: Function } },
  components: {
    Picker
  }
};
</script>
