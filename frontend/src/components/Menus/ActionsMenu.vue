<template>
    <div class="menu-list df fdc" ref="content">
    <span
            v-for="(action, index) in actions"
            :class="`menu-list__item dif aic pointer ${activeIndex === index && 'active'}`"
            @click.stop="onClick(action)"
            :key="action.name"
    >
      <v-icon :name="action.icon" v-mr="1"/>
      {{ text.actions[action.name] || action.name }}
    </span>
    </div>
</template>

<script>
import scrollTo from '@/utils/scrollTo';

export default {
  props: { actions: { required: true } },
  data: () => ({
    activeIndex: -1
  }),
  methods: {
    onClick({ action }) {
      action && action();
      this.$emit('close');
    },
    changeActive(direction) {
      const length = this.actions.length;
      this.activeIndex = (length + this.activeIndex + direction) % length;
      scrollTo(this.$refs.content.children[this.activeIndex]);
    }
  },
  created() {
    const keydownActionsMap = {
      ArrowDown: () => this.changeActive(1),
      ArrowUp: () => this.changeActive(-1),
      Enter: () =>
        this.activeIndex !== -1 && this.onClick(this.actions[this.activeIndex])
    };

    const keydownListener = e => {
      if (keydownActionsMap[e.key]) {
        e.preventDefault();
        keydownActionsMap[e.key]();
      }
    };

    document.addEventListener('keydown', keydownListener);
    this.$once('hook:destroyed', () => {
      document.removeEventListener('keydown', keydownListener);
    });
  }
};
</script>
