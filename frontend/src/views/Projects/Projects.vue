<template>
  <div class="projects" v-color="'base'">
    <div class="projects__header df aic jcsb" v-mb="1">
      <search
          v-mr="2"
          v-ml="2"
          class="expanded"
          v-model="filteredProjects"
          :filters="searchFilters"
          :searchValues="projects"
      />
      <v-select :items="sortSelectItems" class="projects__sort-select" v-mr="2"/>
      <v-button
          v-color="'accent'"
          type="circle"
          v-mr="3"
          @click="$showModal('project')"
      >
        <v-icon name="add" :color="'white'"/>
      </v-button>
    </div>
    <tabs
        v-if="projects"
        :items="['person', 'star', 'search']"
        position="right"
        v-mb="2"
        class="projects__tabs"
        v-color="'white'"
    >
      <div class="df fww jcsb aifs">
        <project-card class="projects__item" v-for="project in userProjects" :project="project"
                      :key="project.id" v-mb="1"/>
      </div>
      <div class="df fww jcsb aifs">
        <project-card class="projects__item" v-for="project in favouriteProjects" :project="project"
                      :key="project.id" v-mb="1"/>
      </div>
      <div class="df fww jcsb aifs">
        <project-card class="projects__item" v-for="project in filteredProjects" :project="project"
                      :key="project.id" v-mb="1"/>
      </div>
    </tabs>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { ProjectCard } from '@/components/Cards';
import Tabs from '@/components/Common/Tabs';
import { Search, VSelect } from '@/components/Controls';
import {
  GQL_PROJECTS,
  GQL_PROJECT_ADDED,
  GQL_PROJECT_UPDATED,
  GQL_PROJECT_DELETED
} from '@/graphql';

export default {
  components: {
    ProjectCard,
    Tabs,
    Search,
    VSelect
  },
  data: () => ({
    filteredProjects: [],
    projects: []
  }),
  created() {
    this.$addSubscriptions('project', {
      added: GQL_PROJECT_ADDED,
      updated: GQL_PROJECT_UPDATED,
      deleted: GQL_PROJECT_DELETED,
      all: GQL_PROJECTS
    });
  },
  computed: {
    ...mapGetters(['user']),
    sortSelectItems() {
      const { sort } = this.text;
      return [
        {
          name: sort.updated_at_desc,
          value: 'updated_at_desc',
          icon: 'shutter_speed'
        },
        {
          name: sort.created_at_desc,
          value: 'created_at_desc',
          icon: 'trending_up'
        },
        {
          name: sort.created_at_asc,
          value: 'created_at_asc',
          icon: 'trending_down'
        },
        {
          name: sort.updated_at_asc,
          value: 'updated_at_asc',
          icon: 'weekend'
        },
        {
          name: sort.likes,
          value: 'likes',
          icon: 'star'
        }
      ];
    },
    searchFilters() {
      const { filters } = this.text;
      return [
        {
          icon: 'person',
          name: filters.creator,
          value: 'creator'
        },
        {
          icon: 'person',
          name: filters.users,
          value: 'users',
          type: 'array'
        }
      ];
    },
    userProjects() {
      if (!this.projects) return [];
      return this.filteredProjects.filter(
        project => project.creator.id === this.user.id
      );
    },
    favouriteProjects() {
      if (!this.projects) return [];
      return this.filteredProjects.filter(project => project.favourite);
    }
  }
};
</script>

<style lang="sass" scoped>
  .projects
    padding: 1rem

    &__tabs
      height: calc(100vh - #{$header-height} - 10rem)

    &__header
      height: 5rem
    &__item
      width: 30%
</style>
