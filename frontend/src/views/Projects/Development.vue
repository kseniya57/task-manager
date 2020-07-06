<template>
  <div class="development fullheight" v-color="'base'">
    <div class="development__header df aic jcsb" v-mb="1">
      <search
          v-mr="2"
          v-ml="2"
          class="expanded"
          v-model="filterMapping"
          :filters="searchFilters"
          :searchValues="repositories"
      />
      <v-button
          v-color="'accent'"
          type="circle"
          v-mr="3"
          @click="$showModal('repository', { repository: { users: [], project_id: projectId } })"
      >
        <v-icon name="add" :color="'white'"/>
      </v-button>
    </div>
    <div class="development__repositories-container df fww jcfs aifs" v-color="'white'">
      <div
          v-for="repository in repositories"
          :key="repository.id"
          class="df aic jcc fdc development__repositories-item"
          v-to="`/projects/${projectId}/repositories/${repository.name}`"
          v-mr="1"
          @contextmenu="e => $showContextMenu(e, 'actions', actionsMenuData(repository))"
      >
        <v-icon class="files__folder" color="secondary" name="folder" />
        <span class="text--light text--md">{{ repository.name }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import {
  GQL_DELETE_REPOSITORY,
  GQL_REPOSITORIES,
  GQL_REPOSITORY_ADDED,
  GQL_REPOSITORY_UPDATED,
  GQL_REPOSITORY_DELETED
} from '@/graphql';
import mutator from '@/mixins/mutator';
import { Search } from '@/components/Controls';

export default {
  components: {
    Search
  },
  data() {
    return {
      projectId: +this.$route.params.id,
      repositories: [],
      filterMapping: {}
    };
  },
  mixins: [mutator],
  apollo: {
    repositories: {
      query: GQL_REPOSITORIES,
      variables() {
        return { filter: { project_id: this.projectId } };
      }
    }
  },
  created() {
    this.$addSubscriptions(
      'repository',
      {
        added: GQL_REPOSITORY_ADDED,
        updated: GQL_REPOSITORY_UPDATED,
        deleted: GQL_REPOSITORY_DELETED,
        all: GQL_REPOSITORIES
      },
      { project_id: this.projectId },
      false
    );
  },
  methods: {
    remove(id) {
      this.mutate(
        GQL_DELETE_REPOSITORY,
        {
          id
        },
        'Repository',
        GQL_REPOSITORIES
      );
    },
    actionsMenuData(repository) {
      return {
        actions: [
          {
            name: 'edit',
            icon: 'edit',
            action: () => this.$showModal('repository', { repository })
          },
          {
            name: 'delete',
            icon: 'delete',
            action: () => this.remove(repository.id)
          }
        ]
      };
    }
  },
  computed: {
    ...mapGetters(['user']),
    searchFilters() {
      const { filters } = this.text;
      return [
        {
          icon: 'person',
          name: filters.author,
          value: 'author'
        }
      ];
    }
  }
};
</script>

<style lang="sass" scoped>
  .development
    padding: 1rem
    &__header
      height: 5rem
    &__repositories
      &-container
        border-radius: .6rem
        padding: 1rem
        min-height: calc(100% - #{$header-height} - 7rem)
      &-item
        cursor: pointer
        i
          font-size: 5rem
</style>
