<template>
  <div class="searchBar">
    <b-col :class="{'col-lg-9': getAsideDashboard == true, 'col-lg-11': getAsideDashboard == false ,'col-lg-12': this.$route.name == 'DashboardProfile' || this.$route.name == 'DashboardTeams' || this.$route.name == 'DashboardSetting' || this.$route.name == 'DashboardTopics', 'bg-light': this.$route.name != 'DashboardTopics'}" class="position-absolute" style="z-index: 6">
      <img src="@/assets/img/pattern/long-pattern.png" v-show="this.$route.name == 'Dashboard' || this.$route.name == 'DashboardMagazines'" class="w-100 position-absolute" style="top: -24px; left: 0px; opacity: .4; z-index: 0" alt="">
      <div class="w-100 px-3 py-4">
        <b-row>
          <b-col :class="{'col-7': getAsideDashboard == true, 'col-lg-6 col-7': getAsideDashboard == false, 'col-lg-5 col-7': this.$route.name == 'DashboardProfile' || this.$route.name == 'DashboardTeams' || this.$route.name == 'DashboardSetting' || this.$route.name == 'DashboardTopics'}">
            <div class="search-bar p-1 rad bg-white shadow-sm">
              <b-form-input class="border-0" placeholder="Cari sesuatu.."></b-form-input>
            </div>
          </b-col>
          <b-col :class="{'col-5': getAsideDashboard == true, 'col-lg-3 col-5': getAsideDashboard == false, 'col-lg-3 col-5': this.$route.name == 'DashboardProfile' || this.$route.name == 'DashboardTeams' || this.$route.name == 'DashboardSetting' || this.$route.name == 'DashboardTopics'}" class="text-right">
            <div class="notif-btn d-inline-block position-relative shadow-sm mr-4">
              <div class="new-notif">5</div>
              <font-awesome-icon icon="bell" class="notif-icon"></font-awesome-icon>
            </div>
          </b-col>
        </b-row>
      </div>
    </b-col>
    <b-col lg="11" class="position-absolute bg-white" style="left: 0; top: -48px; z-index: 5">
    </b-col>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  data() {
    return {

    }
  },
  computed: {
    ...mapGetters({
      getAsideDashboard: 'Dashboard/getAsideDashboard',
    })
  },
}
</script>