<template>
    <transition name="fade">
        <div v-if="currentModal" class="modal df aic jcc">
            <v-icon name="close" class="modal__close pointer" size="lg" @click="close"/>

            <component :is="currentModal" v-bind="data"/>

        </div>
    </transition>

</template>

<script>
import Vue from 'vue';
import {
  TaskModal,
  TodoModal,
  ProfileModal,
  ImageModal,
  ProjectModal,
  RepositoryModal,
  TeamModal,
  ChatModal,
  CodeMirror,
  PhotoEditor
} from '@/components/Modals';

export default {
  components: {
    TaskModal,
    TodoModal,
    ProjectModal,
    RepositoryModal,
    TeamModal,
    ImageModal,
    ProfileModal,
    CodeMirror,
    PhotoEditor
  },
  data: () => ({
    currentModal: null,
    data: null,
    modals: {
      task: TaskModal,
      todo: TodoModal,
      profile: ProfileModal,
      image: ImageModal,
      project: ProjectModal,
      repository: RepositoryModal,
      team: TeamModal,
      chat: ChatModal,
      codeMirror: CodeMirror,
      photoEditor: PhotoEditor
    }
  }),
  created() {
    Vue.prototype.$showModal = this.show;
    Vue.prototype.$closeModal = this.close;
    const escapeHandler = e => {
      if (e.key === 'Escape' && this.currentModal) {
        this.close();
      }
    };
    document.addEventListener('keydown', escapeHandler);
    this.$once('hook:destroyed', () => {
      document.removeEventListener('keydown', escapeHandler);
    });
  },
  methods: {
    show(name, data = {}) {
      [this.currentModal, this.data] = [this.modals[name], data];
    },
    close() {
      [this.currentModal, this.data] = [null, null];
    }
  }
};
</script>

<style lang="sass" scoped>
    .modal
        position: fixed
        top: 0
        left: 0
        right: 0
        bottom: 0
        background-color: rgba($dark, .5)

        &__close
            position: absolute
            top: 1rem
            right: 1rem

            &:hover
                color: $white !important
</style>
