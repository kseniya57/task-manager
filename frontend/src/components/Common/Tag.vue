<template>
  <span
          :class="`tag dif aic jcc text--white ${removable && 'removable'}`"
          v-color="tag.color"
          v-on="$listeners"
          @contextmenu="e => $showContextMenu(e, 'colorBox', { input: setTagColor })"
  >
    {{ tag.name }}
    <v-icon
            v-if="removable"
            name="close"
            class="dif aic jcc pointer"
            v-circle="1.3"
            v-ml="1"
            size="xxs"
            v-color="'white'"
            @click="$emit('remove')"></v-icon>
  </span>
</template>

<script>
import { GQL_UPDATE_TAG, GQL_TAGS } from '@/graphql';
import mutator from '@/mixins/mutator';
export default {
  props: {
    tag: { required: true },
    removable: { default: true }
  },
  mixins: [mutator],
  methods: {
    setTagColor(color) {
      this.mutate(
        GQL_UPDATE_TAG,
        { id: this.tag.id, input: { color } },
        'Tag',
        GQL_TAGS
      );
      // TODO: all tags will be updated later
      this.tag.color = color;
    }
  }
};
</script>
