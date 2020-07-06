<template>
  <div class="relative schedule__container" v-color="'base'">
    <svg
        @mousemove="changeCoordinates"
        class="schedule"
        @click="$showModal('todo', { todo: { dayOfWeek, time, tags: [] } })"
    >
      <rect
          class="schedule__rect"
          v-for="(todo, index) in processedTodos"
          :x="`calc(.2rem + ${14.28 * (todo.dayOfWeek - 1)}%)`"
          :y="`calc(${100 - 4.16 * (todo.time + 1)}%)`"
          width="14.1%"
          height="3.9%"
          :fill="todo.done === 1 ? colors.success : colors.error"
          :key="`rect${index}`"
          @click.stop="$showModal('todo', { todo })"
          @contextmenu.prevent="toggleDone(todo)"
          @mouseenter="currentTodo = todo"
          @mouseleave="currentTodo = null"
      ></rect>
    </svg>
    <div
        class="todo__cloud box"
        v-if="currentTodo"
        :style="{ left: `calc(${x}% + 2.5rem)`, top: `calc(${y}% - 8rem)` }"
    >
      <div v-mb=".5">
        <span>{{ dayNameFrom(currentDayOfWeek, currentTodo.dayOfWeek) }}, </span><span>{{ currentTodo.time }}:00</span>
      </div>
      <markdown-renderer v-mb=".5" v-if="currentTodo.description && currentTodo.description.length"
                         :value="currentTodo.description"/>
      <div class="df fww todo__tags">
        <tag
            v-for="tag in currentTodo.tags"
            :key="tag.id"
            :removable="false"
            v-mb=".5"
            v-mr=".5"
            :tag="tag"
        />
      </div>
    </div>
    <span
        class="tooltip dif fdc box"
        v-else-if="x > 2 && x < 98 && y > 2 && y < 95"
        :style="{ left: `calc(${x}% + 2rem)`, top: `calc(${y}% + 2rem)` }"
    >
          <span v-mb=".3">{{ dayNameFrom(currentDayOfWeek, dayOfWeek) }}</span>
          <span>{{ time }}:00</span>
        </span>
    <span
        v-for="h in 24"
        class="text--xs"
        v-text-color="'text_base'"
        :style="{ position: 'absolute', left: '.5rem', bottom: `calc(4.18% * ${h - 1})` }"
        :key="`hour${h}`"
    >
      {{ `${h - 1}:00` }}
    </span>
    <span
        v-for="index in 7"
        class="text--xs"
        v-text-color="'text_base'"
        :style="{ position: 'absolute', left: `calc(5% + 14.28% * ${index - 1})`, bottom: '1rem' }"
        :key="`day${index}`"
    >
      {{ dayNameFrom(currentDayOfWeek, index) }}
    </span>
  </div>
</template>

<script>
import MarkdownRenderer from '@/components/Services/MarkdownRenderer';
import Tag from '@/components/Common/Tag';
import { GQL_TODOS, GQL_TODO_ADDED, GQL_UPDATE_TODO } from '@/graphql';
import { mapGetters } from 'vuex';
import scheduleDateMixin from '@/mixins/scheduleDateMixin';
import mutator from '@/mixins/mutator';

export default {
  components: {
    MarkdownRenderer,
    Tag
  },
  mixins: [scheduleDateMixin, mutator],
  data: () => ({
    x0: 0,
    y0: 0,
    percentX: 0,
    percentY: 0,
    percentsForDay: 0,
    percentsForHour: 0,
    currentLang: 'en',
    x: 0,
    y: 0,
    dayOfWeek: 1,
    time: null,
    todos: [],
    currentTodo: null
  }),
  mounted() {
    setTimeout(() => {
      const rect = this.$el.getBoundingClientRect();
      this.x0 = rect.x;
      this.y0 = rect.y;
      this.percentX = rect.width / 100;
      this.percentY = rect.height / 100;
      this.percentsForDay = 100 / 7;
      this.percentsForHour = 100 / 24;
    }, 500);
  },
  methods: {
    changeCoordinates(e) {
      const x = Math.floor((e.clientX - this.x0) / this.percentX);
      const y = Math.floor((e.clientY - this.y0) / this.percentY);
      if (this.x !== x) {
        this.x = x;
        const dayOfWeek = Math.floor(x / this.percentsForDay) + 1;
        if (dayOfWeek !== this.dayOfWeek) {
          this.dayOfWeek = dayOfWeek;
        }
      }
      if (this.y !== y) {
        this.y = y;
        const hour = Math.floor(24 - y / this.percentsForHour);
        if (hour !== this.time) {
          this.time = hour;
        }
      }
    },
    toggleDone(todo) {
      todo.done = +!todo.done;
      this.mutate(
        GQL_UPDATE_TODO,
        {
          id: todo.id,
          input: {
            done: todo.done,
            date: +new Date(todo.date) - this.timezoneOffset * 36e5
          }
        },
        'Todo',
        GQL_TODOS
      );
    }
  },
  apollo: {
    todos: {
      query: GQL_TODOS,
      variables() {
        // TODO: check it
        return { filter: { user_id: this.user.id } };
      },
      subscribeToMore: {
        document: GQL_TODO_ADDED,
        updateQuery: (previousResult, { subscriptionData }) => {
          const todo = subscriptionData.data.todoAdded;
          return {
            todos: [...previousResult.todos, todo]
          };
        }
      }
    }
  },
  computed: {
    ...mapGetters(['user']),
    processedTodos() {
      return this.todos.map(todo => {
        const date = new Date(todo.date);
        return {
          ...todo,
          date,
          dayOfWeek: (date.getDay() + 1 - this.currentDayOfWeek + 7) % 7,
          time: date.getHours()
        };
      });
    }
  }
};
</script>

<style lang="sass" scoped>
  .schedule
    width: 100%
    height: calc(100vh - #{$header-height} - .2rem)
    background-image: linear-gradient(white .2rem, transparent .2rem), linear-gradient(90deg, white .2rem, transparent .2rem)
    background-size: 4.16% 4.16%, 14.28% 14.28%
    cursor: copy

    &__rect
      transition: $default-transition
      cursor: pointer

  .tooltip
    position: absolute
    padding: 1rem
    cursor: copy

  .todo
    &__cloud
      position: absolute
      padding: 1rem 1rem 0

</style>
