export default {
  data() {
    const currentDate = new Date();
    return {
      currentDayOfWeek: currentDate.getDay(),
      timezoneOffset: currentDate.getTimezoneOffset() / 60,
      day: currentDate.getDate(),
      month: currentDate.getMonth(),
      year: currentDate.getFullYear()
    };
  },
  computed: {
    days() {
      return Object.values(this.text.week);
    }
  },
  methods: {
    dayNameFrom(from, index) {
      return this.days[(from + index - 1) % 7];
    }
  }
};
