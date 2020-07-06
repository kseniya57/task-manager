<script>
import { Line } from 'vue-chartjs';
import createGradient from '@/utils/createGradient';
import ReactiveChartMixin from './ReactiveChartMixin';

export default {
  extends: Line,
  mixins: [ReactiveChartMixin],
  data: () => ({
    options: {
      responsive: true,
      maintainAspectRatio: false,
      legend: {
        display: false
      }
    }
  }),
  methods: {
    makeChartData() {
      return {
        labels: Object.keys(this.data),
        datasets: [
          {
            label: this.text.charts.activity,
            borderColor: this.colors.primary,
            pointBackgroundColor: this.colors.accent,
            borderWidth: 1,
            pointBorderColor: this.colors.accent,
            backgroundColor: createGradient(
              this.$refs.canvas,
              [
                this.colors.secondary,
                this.colors.primary,
                this.colors.secondary
              ],
              450
            ),
            data: Object.values(this.data)
          }
        ]
      };
    }
  }
};
</script>
