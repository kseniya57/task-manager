<template>
    <div class="teams" v-color="'base'">
        <div class="teams__header df aic jcsb" v-mb="1">
            <search
                    v-mr="2"
                    v-ml="2"
                    class="expanded"
                    v-model="filteredTeams"
                    :filters="searchFilters"
                    :searchValues="teams"
            />
            <v-button
                    v-color="'accent'"
                    type="circle"
                    v-mr="3"
                    @click="$showModal('team', { team: { users: [] } })"
            >
                <v-icon name="add" :color="'white'"/>
            </v-button>
        </div>
        <tabs
                v-if="teams"
                :items="['person', 'search']"
                position="right"
                v-mb="2"
                class="teams__tabs"
                v-color="'white'"
        >
            <div class="df fww jcsb aifs teams__tab">
                <team-card class="teams__item" v-for="team in filteredTeams" :team="team" :key="team.id" v-mb="10"/>
            </div>
            <div class="df fww jcsb aifs teams__tab">
                <team-card class="teams__item" v-for="team in userTeams" :team="team" :key="team.id" v-mb="10"/>
            </div>
        </tabs>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import Tabs from '@/components/Common/Tabs';
import { Search } from '@/components/Controls';
import {
  GQL_TEAMS,
  GQL_TEAM_ADDED,
  GQL_TEAM_UPDATED,
  GQL_TEAM_DELETED
} from '@/graphql';
import { TeamCard } from '@/components/Cards';

export default {
  components: {
    TeamCard,
    Search,
    Tabs
  },
  data: () => ({
    filteredTeams: [],
    teams: []
  }),
  created() {
    this.$addSubscriptions('team', {
      added: GQL_TEAM_ADDED,
      updated: GQL_TEAM_UPDATED,
      deleted: GQL_TEAM_DELETED,
      all: GQL_TEAMS
    });
  },
  computed: {
    ...mapGetters(['user']),
    searchFilters() {
      const { filters } = this.text;
      return [
        {
          icon: 'person',
          name: filters.users,
          value: 'users',
          type: 'array'
        }
      ];
    },
    userTeams() {
      return this.filteredTeams.filter(
        team => !!team.users.find(user => user.id === this.user.id)
      );
    }
  }
  // watch: {
  //     tasks() {
  //         this.filteredTasks = tasks;
  //     }
  // },
};
</script>

<style lang="sass" scoped>
    .teams
        padding: 1rem

        &__tab
            padding: 3rem

        &__tabs
            height: calc(100vh - #{$header-height} - 10rem)

        &__header
            height: 5rem
</style>
