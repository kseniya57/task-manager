<template>
    <dropdown class="select" width="100%">
        <template slot="activator" scope="{ toggle, active }">
            <input
                    v-bind="$attrs"
                    v-model="value"
                    class="select__input input"
                    v-text-color="'text_light'"
                    @keydown.exact="checkTouch"
                    @keydown.down="changeActive(1, active, toggle)"
                    @keydown.up="changeActive(-1, active, toggle)"
                    @keydown.enter="active && select(filteredItems[activeIndex], toggle)"
                    v-font="'inputs'"
            >
        </template>
        <template slot="content" scope="{ toggle }">
            <div class="select__content" ref="content">
        <span
                v-for="(option, index) in filteredItems"
                :class="`select__option pointer dif aic ${activeIndex === index && 'active'}`"
                :key="option.name || option"
                @click="select(option, toggle)"
        >
        <v-icon v-if="option.icon" :name="option.icon" v-mr="1"/>
        <v-image v-else-if="option[imageField]" v-circle="1.5" :src="option[imageField]" v-mr="1"/>
        <span>{{ option.name || option }}</span>
      </span>
            </div>
        </template>
    </dropdown>
</template>

<script>
import Dropdown from '@/components/Common/Dropdown';
import scrollTo from '@/utils/scrollTo';

export default {
  components: {
    Dropdown
  },
  props: {
    items: { default: () => [] },
    initialValue: { default: '' },
    closeOnSelect: { default: true },
    clearOnSelect: { default: false },
    filter: { default: true },
    imageField: { default: 'image' }
  },
  mounted() {
    this.value = this.initialValue;
    if (this.value) {
      this.showAll = true;
    }
  },
  data: () => ({
    activeIndex: -1,
    value: '',
    showAll: false
  }),
  computed: {
    filteredItems() {
      if (this.showAll) {
        return this.items;
      }
      const lowerCasedValue = this.value.toLowerCase();
      return this.items.filter(item =>
        (item.name || item).toLowerCase().startsWith(lowerCasedValue)
      );
    }
  },
  methods: {
    changeActive(direction, isOpen, toggle) {
      if (!isOpen) {
        toggle();
      }
      const length = this.items.length;
      this.activeIndex = (length + this.activeIndex + direction) % length;
      scrollTo(this.$refs.content.children[this.activeIndex]);
    },
    select(item, close) {
      this.$emit('select', item);
      this.value = item.name || item;
      this.closeOnSelect && close && close();
      if (this.clearOnSelect) {
        this.value = '';
      }
    },
    checkTouch() {
      if (this.value === '') {
        this.showAll = false;
      }
    }
  }
};
</script>

<style lang="sass" scoped>
    .select
        &__content
            max-height: 12rem
            overflow-y: auto
            border-radius: .6rem

        &__option
            background-color: $white
            height: 3rem
            padding: 0 .5rem
            transition: $default-transition
            width: 100%

            &:not(:last-child)
                border-bottom: $devider

            &.active
                background-color: rgba($primary, .1)
</style>
