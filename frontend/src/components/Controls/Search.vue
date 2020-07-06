<template>
    <div class="search df" @keydown.delete="removeLastFilter">
        <div v-for="(value, key) in filterMapping" class="search__tag df aic" :key="key" v-mr="1">
            <span>{{ text.filters[key.split(':')[0]] }}</span>
            <span
                v-if="isNotNull(value)" class="dif aic"
                @click.stop="e => $showContextMenu(e, 'actions', alternativeValuesMenu(key))"
            >
          {{ process(key, value) }}
          <v-icon
                  name="delete"
                  v-ml=".5"
                  size="sm"
                  class="pointer dif aic jcc"
                  v-circle="2"
                  @click.stop="removeFilter(key)"></v-icon>
        </span>
        </div>
        <v-select
                slot="activator"
                v-model="searchText"
                @select="add"
                :items="options"
                :closeOnSelect="!isFilterMode"
                :clearOnSelect="true"
                v-text-color="'text_light'"
        />
    </div>
</template>

<script>
import { VSelect } from '@/components/Controls';

export default {
  props: ['filters', 'searchValues', 'initialFilter'],
  components: {
    VSelect
  },
  computed: {
    isFilterMode() {
      return this.filterMode || !this.currentFilter;
    },
    options() {
      return this.isFilterMode
        ? this.filters.filter(
            filter =>
              !this.filterMapping[filter.value] &&
              this.getValuesForFilter(filter).length
          )
        : this.getValuesForFilter(this.currentFilter);
    },
    values() {
      if (!this.searchValues) return {};
      return this.filters.reduce((map, filter) => {
        map[filter.value] = Object.values(
          this.searchValues.reduce((acc, team) => {
            const value = team[filter.value];
            if (isNotNull(value)) {
              if (Array.isArray(value)) {
                Object.assign(
                  acc,
                  value.reduce(
                    (o, c, index) =>
                      Object.assign(o, { [`${filter.value}:${index}`]: c }),
                    {}
                  )
                );
              } else {
                acc[typeof value === 'object' ? value.id : value] = value;
              }
            }
            return acc;
          }, {})
        );
        return map;
      }, {});
    }
  },
  data: () => ({
    filterMode: true,
    filterMapping: {},
    currentFilter: null,
    searchText: '',
    activeIndex: -1,
    searchOptions: {},
    content: ''
  }),
  methods: {
    add(option) {
      const isFilterMode = this.isFilterMode;
      let [name, value] = isFilterMode
        ? [this.getName(option, true), null]
        : [this.getName(this.currentFilter), option.name || option];
      this.filterMapping[name] = isFilterMode
        ? value
        : this.getActualValue(this.currentFilter, value);
      this.$emit('input', this.getFilteredValues());
      if (isFilterMode) {
        this.currentFilter = option;
        this.filterMode = false;
      } else {
        this.filterMode = true;
      }
      this.searchText = '';
    },
    getName(item, isIncrement = false) {
      if (item.type === 'array') {
        item.index = (item.index || 0) + (isIncrement ? 1 : 0);
        return `${item.value}:${item.index}`;
      }
      return item.value;
    },
    getValuesForFilter({ value, process, type }) {
      let values = this.values[value];

      if (!values) {
        return [];
      }

      if (process) {
        values = values.map(process);
      }

      const existingFilters =
        type === 'array' &&
        Object.entries(this.filterMapping).reduce((acc, [k, v]) => {
          if (k.startsWith(value)) {
            acc.push(v);
          }
          return acc;
        }, []);

      return existingFilters
        ? values.filter(v => !existingFilters.includes(v.name || v))
        : values;
    },
    removeFilter(key) {
      this.$delete(this.filterMapping, key);
      this.$emit('input', this.getFilteredValues());
    },
    removeLastFilter() {
      if (!this.searchText.length) {
        const keys = Object.keys(this.filterMapping);
        if (keys.length) {
          this.removeFilter(keys[keys.length - 1]);
          this.currentFilter = null;
        }
      }
    },
    process(key, value) {
      const actualKey = key.split(':')[0];
      const process = this.filters.find(f => f.value === actualKey).process;
      return process ? process(value) : value;
    },
    alternativeValuesMenu(key) {
      const filter = this.filters.find(f => f.value === key);
      return {
        actions: this.getValuesForFilter(filter).map(item => ({
          name: item,
          icon: filter.icon,
          action: () => {
            this.filterMapping[key] = this.getActualValue(filter, item);
            this.$emit('input', this.getFilteredValues());
          }
        }))
      };
    },
    getActualValue(filter, value) {
      return filter.process
        ? this.values[filter.value].find(v => filter.process(v) === value)
        : value;
    },
    getFilteredValues() {
      return this.searchValues.filter(task =>
        Object.entries(this.filterMapping).every(([key, value]) => {
          const [actualKey] = key.split(':');
          return (
            !isNotNull(value) ||
            (isNotNull(task[actualKey]) &&
              (Array.isArray(task[actualKey])
                ? task[actualKey]
                : [task[actualKey]]
              ).some(
                item =>
                  item &&
                  (typeof item === 'object' ? item.name : item) === value
              ))
          );
        })
      );
    }
  },
  watch: {
    searchValues() {
      this.$emit('input', this.getFilteredValues());
    }
  },
  mounted() {
    if (this.initialFilter) {
      this.filterMapping = this.initialFilter;
    }
    this.$emit('input', this.getFilteredValues());
  }
};
</script>

<style lang="sass" scoped>
    .search
        background-color: $white
        padding: .5rem
        border-radius: .6rem
        height: 4.5rem

        &__option
            padding: .5rem
            transition: $default-transition

            &:not(:last-child)
                border-bottom: $devider

            &:hover
                font-weight: bold

                i
                    color: $primary !important

            &.active
                background-color: rgba($primary, .1)

        &__tag
            color: $white
            border-radius: .5rem
            overflow: hidden

            span
                padding: 1rem
                background-color: $gray
                transition: $default-transition

                &:hover
                    background-color: darken($gray, 10%)

                &:last-child
                    border-left: $devider

            i
                background-color: $white

                &:hover
                    color: $dark !important
</style>
