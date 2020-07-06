<template>
  <div class="timer df aic jcc fdc">
    <span class="timer__time" v-mb="2">
      {{ hours | twoDigits }}:{{ minutes | twoDigits }}:{{ seconds | twoDigits }}
    </span>
    <div class="timer__toolbar df aic jcc">
      <v-button @click="isRecording ? stop() : start()">{{ text.timer[isRecording ? 'stop' : time ? 'continue' :
        'start'] }}
      </v-button>
    </div>
  </div>
</template>

<script>
export default {
  props: { value: { default: 0 } },
  data: () => ({
    isRecording: false,
    interval: null,
    time: 0
  }),
  mounted() {
    this.time = this.value;
  },
  destroyed() {
    this.stop();
  },
  computed: {
    hours() {
      return Math.floor(this.time / 3600) % 3600;
    },
    minutes() {
      return Math.floor(this.time / 60) % 60;
    },
    seconds() {
      return this.time % 60;
    }
  },
  methods: {
    handler() {
      this.time++;
    },
    start() {
      this.isRecording = true;
      this.interval = setInterval(this.handler.bind(this), 1000);
    },
    stop() {
      this.isRecording = false;
      clearInterval(this.interval);
      this.$emit('input', this.time);
    }
  },
  filters: {
    twoDigits(value) {
      return value.toString().padStart(2, '0');
    }
  }
};
</script>

<style lang="sass" scoped>
  .timer
    border: 1rem dashed $accent
    border-radius: 50%
    width: 40rem
    height: 40rem

    &__time
      font-size: 7.2rem
      background: -webkit-linear-gradient($base, $accent)
      -webkit-background-clip: text
      -webkit-text-fill-color: transparent
</style>
