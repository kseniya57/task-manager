<template>
  <div class="box task-modal df fdc jcc ais" v-color="'base'">
    <div class="df jcsb">
      <input v-if="editingName || !task.name" :placeholder="text.form.title" v-mb="1" class="input"
             @focus="editingName = true"
             @blur="editingName = false" v-model="task.name"/>
      <h3 v-else v-mb="1" @click="editingName = true" class="task-modal__title">{{ task.name }}</h3>
      <v-select
          :initialValue="task.assigned_to ? task.assigned_to.name : ''"
          @select="user => $set(task, 'assigned_to', user)"
          v-mb="2"
          :items="users"
          :placeholder="text.form.assigne"
          imageField="processed_avatar"
      />
    </div>
    <tabs :items="['edit', 'comment', 'show_chart', 'access_time']" @changed="tabChanged" v-mb="2" class="task-modal__tabs"
          v-color="'white'">
      <div>
        <editor-with-preview v-model="task.description" :noText="text.editor.no_description"/>
        <div v-mb="1">{{ text.form.tags }}</div>
        <tag-input v-mb="2" v-model="task.tags"/>
      </div>
      <div class="df fdc jcsb">
        <timeline :events="events" @edit="setComment" @delete="deleteComment"/>
        <div ref="commentEditor" class="relative">
          <editor :button-text="text.actions.send" @ok="addComment" v-model="comment.content"/>
        </div>
      </div>
      <div class="df ais">
        <activity-line-chart class="expanded" :data="taskActivity"/>
      </div>
      <timer :value="task.time" @input="updateTime"/>
    </tabs>
    <div class="df aic jcc">
      <v-button @click="save" v-color="'accent'" v-mr="1">{{ isNewTask ? text.actions.add :
        text.actions.ok}}
      </v-button>
      <v-button @click="$closeModal" v-color="'gray'">{{ text.actions.cancel }}</v-button>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import Tabs from '@/components/Common/Tabs';
import { TagInput, VSelect, EditorWithPreview } from '@/components/Controls';
import Editor from '@/components/Common/Editor';
import Timeline from '@/components/Common/Timeline';
import Timer from '@/components/Common/Timer';
import { ActivityLineChart } from '@/components/Charts';
import scrollTo from '@/utils/scrollTo';
import {
  GQL_ADD_TASK,
  GQL_UPDATE_TASK,
  GQL_USERS,
  GQL_ADD_COMMENT,
  GQL_UPDATE_COMMENT,
  GQL_DELETE_COMMENT,
  GQL_COMMENT_ADDED,
  GQL_COMMENT_UPDATED,
  GQL_COMMENT_DELETED,
  GQL_TASKS,
  GQL_COMMENTS,
  GQL_TASK_UPDATED
} from '@/graphql';
import mutator from '@/mixins/mutator';

export default {
  props: {
    task: { required: true }
  },
  mixins: [mutator],
  components: {
    Tabs,
    TagInput,
    VSelect,
    Timeline,
    ActivityLineChart,
    EditorWithPreview,
    Editor,
    Timer
  },
  data: () => ({
    users: [],
    editingName: false,
    isNewTask: false,
    comment: { id: null, content: '' }
  }),
  apollo: {
    users: GQL_USERS,
    $subscribe: {
      taskUpdated: {
        query: GQL_TASK_UPDATED,
        result({ data: { taskUpdated } }) {
          Object.assign(this.task, taskUpdated);
          // TODO: Why it not working ???
          // const store = this.$apolloProvider.defaultClient.cache;
          // const tasks = store.readQuery({ query: GQL_TASKS }).tasks;
          // store.writeQuery({ query: GQL_TASKS, data: { tasks: tasks.map( task => task.id === taskUpdated.id ? taskUpdated : task) } })
        },
        variables() {
          return { id: this.task.id };
        }
      },
      commentAdded: {
        query: GQL_COMMENT_ADDED,
        result({ data: { commentAdded } }) {
          this.task.comments.push(commentAdded);
        },
        variables() {
          return { object: { id: this.task.id, name: 'task' } };
        }
      },
      commentUpdated: {
        query: GQL_COMMENT_UPDATED,
        result({ data: { commentUpdated } }) {
          const oldComment = this.task.comments.find(
            item => item.id === commentUpdated.id
          );
          if (oldComment) {
            Object.assign(oldComment, commentUpdated);
          }
        },
        variables() {
          return { object: { id: this.task.id, name: 'task' } };
        }
      },
      commentDeleted: {
        query: GQL_COMMENT_DELETED,
        result({
          data: {
            commentDeleted: { id }
          }
        }) {
          const index = this.task.comments.findIndex(item => item.id === id);
          if (index !== -1) {
            this.$delete(this.task.comments, index);
          }
        },
        variables() {
          return { object: { id: this.task.id, name: 'task' } };
        }
      }
    }
  },
  mounted() {
    this.isNewTask = !this.task.id;
  },
  computed: {
    ...mapGetters(['user']),
    taskActivity() {
      return {
        [this.$dateFormatter.format(Date.now())]: 4, // date - countOfEvents
        [this.$dateFormatter.format(Date.now() + 60 * 60 * 1000 * 24)]: 5,
        [this.$dateFormatter.format(Date.now() + 2 * 60 * 60 * 1000 * 24)]: 15,
        [this.$dateFormatter.format(Date.now() + 3 * 60 * 60 * 1000 * 24)]: 4,
        [this.$dateFormatter.format(Date.now() + 4 * 60 * 60 * 1000 * 24)]: 30
      };
    },
    events() {
      if (this.isNewTask) {
        return [];
      }
      return (this.task.comments || [])
        .map(comment => Object.assign({}, comment, { type: 'comment' }))
        .concat([
          {
            type: 'editing',
            content:
              '- __[babelfish](https://github.com/nodeca/babelfish/)__ - developer friendly',
            user: this.user,
            icon: 'edit',
            time: Date.now()
          },
          {
            type: 'done',
            content: 'completed subtask `hello`',
            user: this.user,
            icon: 'done',
            time: Date.now()
          },
          {
            type: 'rating',
            content: 'gave 5 stars',
            user: this.user,
            icon: 'star',
            time: Date.now()
          },
          {
            type: 'approve',
            content: 'approved this design',
            user: this.user,
            icon: 'plus_one',
            time: Date.now()
          }
        ])
        .sort((a, b) => (a.time || +a.created_at) - (b.time || +b.created_at));
    }
  },
  methods: {
    save() {
      const {
        id,
        name,
        description,
        position,
        project_id,
        assigned_to
      } = this.task;
      this.mutate(
        id ? GQL_UPDATE_TASK : GQL_ADD_TASK,
        {
          id,
          input: {
            name,
            description,
            position,
            project_id,
            assigned_to: (assigned_to || {}).id,
            tags: this.task.tags.map(tag => tag.id)
          }
        },
        'Task',
        GQL_TASKS
      );
      this.$closeModal();
    },
    updateTime(time) {
      this.mutate(
        GQL_UPDATE_TASK,
        {
          id: this.task.id,
          input: {
            time
          }
        },
        'Task',
        GQL_TASKS
      );
    },
    tabChanged(index) {
      if (index === 1) {
        this.$nextTick(() => {
          this.scrollToCommentEditor();
        });
      }
    },
    scrollToCommentEditor() {
      scrollTo(this.$refs.commentEditor);
    },
    addComment() {
      // this.events.push({
      //   type: 'comment',
      //   content: this.comment.content,
      //   user: this.user
      // });
      const { id, content } = this.comment;
      this.mutate(
        id ? GQL_UPDATE_COMMENT : GQL_ADD_COMMENT,
        {
          id,
          input: { content, user_id: this.user.id },
          object: { name: 'task', id: this.task.id }
        },
        'Comment',
        GQL_COMMENTS
      );
      this.comment = { id: null, content: '' };
    },
    setComment(comment) {
      this.comment = comment;
      this.scrollToCommentEditor();
    },
    deleteComment(id) {
      this.mutate(
        GQL_DELETE_COMMENT,
        {
          id,
          object: {
            name: 'task',
            id: this.task.id
          }
        },
        'Comment',
        GQL_COMMENTS
      );
    }
  }
};
</script>

<style lang="sass" scoped>
  .task-modal
    padding: 1rem
    width: 70vw
    max-height: 90vh

    &__title
      padding: .5rem

    &__tabs
      height: 70vh
</style>
