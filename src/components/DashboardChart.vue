<template>
  <div>
    <b-container fluid class="px-0">
      <b-row>
        <b-col lg="12">
          <b-button class="btn mr-3 btn-white rad btn-chart-type btn-chart-rating px-3">
            <font-awesome-icon icon="chart-line"></font-awesome-icon> Rating
          </b-button>
          <b-button class="btn mr-3 btn-white rad btn-chart-type btn-chart-bookmark px-3">
            <font-awesome-icon icon="chart-line"></font-awesome-icon> Bookmark
          </b-button>
          <b-button class="btn mr-3 btn-white rad btn-chart-type btn-chart-reader px-3">
            <font-awesome-icon icon="chart-line"></font-awesome-icon> Reader
          </b-button>
          <div class="pt-3">
          </div>
          <div class="pt-3">
            <line-chart/>
          </div>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<style lang="scss">
@import '@/assets/css/dashboard/style.scss';
</style>

<script>
import LineChart from '@/components/dashboard/chart/LineChart.vue'
export default {
  components: {
    LineChart
  },
}
</script>