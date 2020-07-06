<template>
    <div
            class="team df aic jcc fdc"
            v-circle="teamDiameter"
            v-color="'dark'"
            @contextmenu="e => $showContextMenu(e, 'actions', actionsMenuData)"
    >
        <div
                v-for="(user, index) in team.users"
                :key="user.id"
                class="team__user df fdc"
                :style="{ height: `${(teamDiameter + userDiameter) / 2}rem`, transform: `rotate(${360 / team.users.length * index}deg)` }"
        >
            <span class="team__user-name">{{ user.name }}</span>
            <v-image :src="user.processed_avatar" v-circle="userDiameter"/>
        </div>
        <span class="team__label">{{ team.name | first }}</span>
        <span class="team__name ttc">{{ team.name }}</span>
    </div>
</template>

<script>
import { GQL_DELETE_TEAM, GQL_TEAMS } from '@/graphql';
import mutator from '@/mixins/mutator';
export default {
  props: { team: { required: true } },
  mixins: [mutator],
  data: () => ({
    teamDiameter: 25,
    userDiameter: 5
  }),
  filters: {
    first(value) {
      return value[0];
    }
  },
  methods: {
    remove() {
      this.mutate(
        GQL_DELETE_TEAM,
        {
          id: this.team.id
        },
        'Team',
        GQL_TEAMS
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
            action: () => this.$showModal('team', { team: this.team })
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
    .team
        position: relative
        border: $devider
        color: $white
        margin: 0 2rem

        &__user
            position: absolute
            top: -2.5rem
            left: 10rem
            color: $dark
            transform-origin: bottom center
            cursor: pointer

            &-name
                transition: $default-transition
                opacity: 0
                text-align: center

            &:hover
                .team__user-name
                    opacity: 1
                    transform: translateY(-1rem)

        &__label
            text-transform: uppercase
            font-size: 7rem
            color: $white
            text-shadow: .5rem .5rem 1.2rem rgba(10, 10, 10, 0.9)

</style>
