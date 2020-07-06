<script>
import { Radar } from 'vue-chartjs';
import createGradient from '@/utils/createGradient';
import ReactiveChartMixin from './ReactiveChartMixin';

export default {
  extends: Radar,
  mixins: [ReactiveChartMixin],
  props: { types: Object },
  computed: {
    gradients() {
      const canvas = this.$refs.canvas;
      return Object.values(this.types).map(color =>
        createGradient(
          canvas,
          [this.colors[color], this.colors.accent, this.colors[color]],
          500
        )
      );
    },
    options() {
      const colors = Object.values(this.types).map(color => this.colors[color]);
      return {
        responsive: true,
        maintainAspectRatio: false,
        legend: {
          display: false
        },
        tooltips: {
          callbacks: {
            // TODO: GRADIENTS !!!
            labelColor: tooltipItem => ({
              backgroundColor: colors[tooltipItem.index]
            })
          }
        }
      };
    }
  },
  methods: {
    makeChartData() {
      return {
        labels: Object.keys(this.data),
        datasets: Object.keys(this.types).map((type, index) => ({
          label: type,
          backgroundColor: this.gradients[index],
          data: Object.values(this.data).map(value => value[type] || 0)
        }))
      };
    }
  }
};
</script>
