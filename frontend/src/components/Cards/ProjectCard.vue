<template>
    <div
            class="project box pointer"
            @click="$router.push(`/projects/${project.id}`)"
            v-color="'white'"
            @contextmenu="e => $showContextMenu(e, 'actions', actionsMenuData)"
    >
        <v-image class="project__image" :src="project.image"/>
        <span class="project__name ttc" v-font="'headers'">{{ project.name }}</span>
    </div>
</template>

<script>
import { GQL_DELETE_PROJECT, GQL_PROJECTS } from '@/graphql';
import mutator from '@/mixins/mutator';
export default {
  props: { project: { required: true } },
  mixins: [mutator],
  methods: {
    remove() {
      this.mutate(
        GQL_DELETE_PROJECT,
        {
          id: this.project.id
        },
        'Project',
        GQL_PROJECTS
      );
    }
  },
  computed: {
    actionsMenuData() {
      return {
        actions: [
          {
            name: 'edit',
            icon: 'edit',
            action: () => this.$showModal('project', { project: this.project })
          },
          {
            name: 'delete',
            icon: 'delete',
            action: this.remove
          }
        ]
      };
    }
  }
};
</script>

<style lang="sass" scoped>
    .project
        overflow: hidden
        text-align: center
        padding-bottom: .5rem

        &__image
            height: 20rem
</style>
