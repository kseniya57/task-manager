import { mixins } from 'vue-chartjs';

export default {
  mixins: [mixins.reactiveData],
  props: { data: { type: Object, required: true } },
  mounted() {
    this.chartData = this.makeChartData(this.data);
    this.renderChart(this.chartData, this.options);
  }
};
