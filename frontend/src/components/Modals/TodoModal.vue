<template>
    <div class="box todo-modal" v-color="'white'">
        <div v-mb="1">
            <span>{{ dayNameFrom(currentDayOfWeek, todo.dayOfWeek) }}, </span><span>{{ todo.time }}:00</span>
        </div>
        <editor-with-preview v-model="todo.description" :noText="text.editor.no_description" />
        <div v-mb="1">Tags</div>
        <tag-input v-mb="2" v-model="todo.tags"/>
        <div class="df aic jcc">
            <v-button @click="save" v-color="'accent'" v-mr="1">{{ text.actions.ok }}</v-button>
            <v-button @click="$closeModal" v-color="'gray'">{{ text.actions.cancel }}</v-button>
        </div>
    </div>
</template>

<script>
import { TagInput, EditorWithPreview } from '@/components/Controls';
import { GQL_ADD_TODO, GQL_UPDATE_TODO, GQL_TODOS } from '@/graphql';
import scheduleDateMixin from '@/mixins/scheduleDateMixin';
import mutator from '@/mixins/mutator';

export default {
  props: ['todo'],
  components: {
    EditorWithPreview,
    TagInput
  },
  mixins: [scheduleDateMixin, mutator],
  methods: {
    save() {
      this.mutate(
        this.todo.id ? GQL_UPDATE_TODO : GQL_ADD_TODO,
        {
          id: this.todo.id,
          input: this.input
        },
        'Todo',
        GQL_TODOS
      );
      this.$closeModal();
    }
  },
  computed: {
    input() {
      const { tags, description, dayOfWeek, time } = this.todo;
      return {
        description,
        date: +new Date(
          this.year,
          this.month,
          // TODO: WHY -1 ???
          this.day - 1 + dayOfWeek,
          // TODO: WHY +3 ???
          time - this.timezoneOffset
        ),
        tags: tags.map(tag => tag.id)
      };
    }
  }
};
</script>

<style lang="sass" scoped>
    .todo-modal
        padding: 1rem
        width: 50vw
        max-height: 90vh
</style>
