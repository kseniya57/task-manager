<template>
    <div v-if="events">
        <tabs
                :items="['show_chart', 'bubble_chart', 'list_alt']"
                position="right"
                class="activity__tabs"
                v-color="'white'"
        >
            <activity-line-chart :data="activity" v-color="'base'" class="activity__chart" v-font="'base'"/>
            <radar-chart :data="statistics" :types="this.types" v-color="'base'" class="activity__chart"/>
            <div>
                <timeline :events="events" />
            </div>
        </tabs>

    </div>
</template>

<script>
import { GQL_EVENTS, GQL_EVENT_ADDED } from '@/graphql';
import { mapGetters } from 'vuex';
import { ActivityLineChart, RadarChart } from '@/components/Charts';
import Tabs from '@/components/Common/Tabs';
import Timeline from '@/components/Common/Timeline';

export default {
  props: { filter: { default: () => ({}) } },
  components: {
    Tabs,
    Timeline,
    ActivityLineChart,
    RadarChart
  },
  data: () => ({
    events: null
  }),
  apollo: {
    events: {
      query: GQL_EVENTS,
      variables() {
        return {
          filter: Object.entries(this.filter).reduce(
            (map, [key, value]) =>
              Object.assign(map, {
                [key]: typeof value === 'function' ? value(this) : value
              }),
            {}
          )
        };
      },
      subscribeToMore: {
        document: GQL_EVENT_ADDED,
        updateQuery(previousResult, { subscriptionData }) {
          return {
            events: previousResult.events.concat(
              subscriptionData.data.eventAdded
            )
          };
        }
      }
    }
  },
  mounted() {
    this.$apollo.queries.events.refetch();
  },
  computed: {
    ...mapGetters(['user']),
    activity() {
      return this.events.reverse().reduce((map, event) => {
        const date = this.$dateFormatter.format(event.time);
        map[date] = (map[date] || 0) + 1;
        return map;
      }, {});
    },
    statistics() {
      const { types, objects } = this.text.events;
      return this.events.reduce((map, event) => {
        if (!map[objects[event.object]]) {
          map[objects[event.object]] = {};
        }
        map[objects[event.object]][types[event.type]] =
          (map[objects[event.object]][types[event.type]] || 0) + 1;
        return map;
      }, {});
    },
    types() {
      const { types } = this.text.events;
      return Object.entries({
        add: 'success',
        update: 'warning',
        delete: 'error'
      }).reduce(
        (map, [key, value]) => Object.assign(map, { [types[key]]: value }),
        {}
      );
    }
  }
};
</script>

<style lang="sass" scoped>
    .activity
        padding: 1rem
        &__tabs
            margin-top: $header-height
            height: calc(100vh - #{$header-height} - 10rem)
        &__chart
            border-radius: 1.5rem
</style>
