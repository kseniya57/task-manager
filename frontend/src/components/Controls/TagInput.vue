<template>
    <div class="tag-input df fww aifs">
        <span v-if="!value.length">{{ text.editor.no_tags }}</span>
        <tag
                v-for="(tag, name) in tagsMap"
                :key="name"
                v-mr=".2"
                v-mb=".2"
                :tag="tag"
                @remove="removeTag(name)"
        />
        <dropdown width="5rem">
            <input
                    class="tag-input__input input"
                    slot="activator"
                    v-model="newTag"
                    @keydown.enter="addTag({ name: newTag, color: 'primary' })"
                    @keydown.delete="removeTagOnBackspace"
                    v-text-color="'text_light'"
                    v-font="'inputs'"
            >
            <div slot="content" class="tag-input__options-list" v-if="filteredTags.length">
                <tag
                        v-for="tag in filteredTags"
                        :key="tag.name"
                        :removable="false"
                        @click="addTag(tag)"
                        :tag="tag"
                        v-mb=".2"
                        class="pointer"
                />
            </div>
        </dropdown>
    </div>
</template>

<script>
import Dropdown from '@/components/Common/Dropdown';
import Tag from '@/components/Common/Tag';
import { prop, indexBy, assoc, dissoc } from 'ramda';
import { GQL_TAGS, GQL_ADD_TAG } from '@/graphql';

export default {
  props: {
    value: { required: true }
  },
  data: () => ({
    newTag: null,
    tagsQuery: GQL_TAGS,
    tags: []
  }),
  components: {
    Dropdown,
    Tag
  },
  computed: {
    tagsMap() {
      return indexBy(prop('name'), this.value);
    },
    filteredTags() {
      return this.tags.filter(tag => !this.tagsMap[tag.name]);
    }
  },
  apollo: {
    tags: GQL_TAGS
  },
  methods: {
    update(tagsMap) {
      this.$emit('input', Object.values(tagsMap));
    },
    addTag(tag) {
      if (tag.name && tag.name.length && !this.tagsMap[tag.name]) {
        this.update(assoc(name, tag, this.tagsMap));
        this.newTag = null;

        if (tag.id) return;

        this.$apollo
          .mutate({
            mutation: GQL_ADD_TAG,
            variables: { input: tag },
            update: (store, { data: { addTag } }) => {
              this.tagsMap[addTag.name] = addTag;
              this.update(this.tagsMap);

              const data = store.readQuery({ query: this.tagsQuery });
              data.tags.push(addTag);
              store.writeQuery({ query: this.tagsQuery, data });
            },
            optimisticResponse: {
              __typename: 'Mutation',
              addTag: {
                __typename: 'Tag',
                id: -1,
                ...tag
              }
            }
          })
          .catch(() => {
            this.newTag = tag.name;
          });
      }
    },
    removeTag(tag) {
      this.update(dissoc(tag, this.tagsMap));
    },
    removeTagOnBackspace(e) {
      const keys = Object.keys(this.tagsMap);
      if (!e.target.value && keys.length) {
        this.update(dissoc(keys[keys.length - 1], this.value));
      }
    }
  }
};
</script>

<style lang="sass" scoped>
    .tag-input
        padding: 1rem
        min-height: 5.5rem
        border-radius: .6rem
        background-color: $white
        border: $devider

        &__input
            height: 1.8rem

        &__options-list
            padding: .3rem
</style>
