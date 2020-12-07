<script>
import {Line} from 'vue-chartjs'
export default {
  extends: Line,
  data() {
    return {
      datasets: {
        labels: ['Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov'],
        datasets: [
          {
            label: 'Rating',
            data: [1,3,6,2,4,1.2],
            borderColor: 'rgba(233, 185, 10, 0.6)',
            pointbackgroundColor: 'rgba(233, 185, 10, 1)',
            backgroundColor: 'rgba(255,255,255, .0)'
          },
          {
            label: 'Bookmark',
            data: [0,1,3,2,1,2.2],
            borderColor: 'rgba(20, 90, 183, 0.6)',
            pointbackgroundColor: 'rgba(20, 90, 183, 1)',
            backgroundColor: 'rgba(255,255,255, .0)'
          },
          {
            label: 'Reader',
            data: [3,5,4,6,5,6.2],
            borderColor: 'rgba(27, 221, 116, 0.6)',
            pointbackgroundColor: 'rgba(27, 221, 116, 1)',
            backgroundColor: 'rgba(255,255,255, .0)'
          },
        ]
      },
      option: {
        responsive: true,
        maintainAspectRatio: false,
        title: {
          display: false,
        }
      },
    }
  },
  mounted() {
    this.renderChart(this.datasets, this.option)
  }
}
</script>