<template>
    <div class="df">
    <span
            v-for="(item, index) in items"
            :key="item"
            class="df aic"
    >
      <a
              @click="go(item)"
              :class="`ttc ${isLast(index) && 'disabled'}`"
              v-text-color="'text_base'"
              v-font="'headers'"
      >{{ text.menu[item] || item }}</a>
      <v-icon v-if="!isLast(index)" name="keyboard_arrow_right"/>
    </span>
    </div>
</template>

<script>
export default {
  computed: {
    items() {
      return this.$route.path.split('/').slice(1);
    }
  },
  methods: {
    go(item) {
      const path = this.$route.path;
      this.$router.push(path.substr(0, path.indexOf(item) + item.length));
    },
    isLast(index) {
      return index + 1 === this.items.length;
    }
  }
};
</script>
