<template>
  <div>
    <div class="py-4 pl-md-5 ml-md-0 pl-4 ml-3">
      <img src="@/assets/img/logo/intaxa.png" height="35px" class="d-inline-block" alt="">
      <div class="d-inline-block" v-if="showAside == true">
        <h4 class="viga text-blue d-inline-block position-relative ml-2" style="top: 5px">INTAXA</h4>
        <span class="font-weight-bold position-relative" style="font-size: .8rem; top: 5px">Beta</span>
      </div>
    </div>
    <div class="py-3 pl-4 mt-4 bg-white">
      <div class="list-menu mb-4" :class="{'active': this.$route.name == 'Dashboard', 'aside-hide': showAside == false, 'aside-hide': showAside == false}" @click="moveRouter('Dashboard')">
        <div class="d-inline-block icon-menu">
          <font-awesome-icon class="mx-md-3 mx-2" icon="tachometer-alt"></font-awesome-icon>
        </div>
        <span class="ml-3" v-show="showAside == true">Dashboard</span>
      </div>
      <!-- <div class="list-menu mb-4" :class="{'active': this.$route.name == 'DashboardProfile', 'aside-hide': showAside == false}" @click="moveRouter('DashboardProfile')">
        <div class="d-inline-block icon-menu">
          <font-awesome-icon class="mx-md-3 mx-2" icon="user"></font-awesome-icon>
        </div>
        <span class="ml-3" v-show="showAside == true">Profile</span>
      </div> -->
      <div class="list-menu mb-4" :class="{'active': this.$route.name == 'DashboardMagazines' || this.$route.name == 'DashboardTopics', 'aside-hide': showAside == false}" @click="moveRouter('DashboardMagazines')">
        <div class="d-inline-block icon-menu">
          <font-awesome-icon class="mx-md-3 mx-2" icon="book"></font-awesome-icon>
        </div>
        <span class="ml-3" v-show="showAside == true">Magazines</span>
      </div>
      <div class="list-menu mb-4" :class="{'active': this.$route.name == 'DashboardTeams', 'aside-hide': showAside == false}" @click="moveRouter('DashboardTeams')">
        <div class="d-inline-block icon-menu">
          <font-awesome-icon class="mx-md-3 mx-2" icon="users"></font-awesome-icon>
        </div>
        <span class="ml-3" v-show="showAside == true">Teams</span>
      </div>
      <div class="list-menu mb-4" :class="{'active': this.$route.name == 'DashboardSetting', 'aside-hide': showAside == false}" @click="moveRouter('DashboardSetting')">
        <div class="d-inline-block icon-menu">
          <font-awesome-icon class="mx-md-3 mx-2" icon="cog"></font-awesome-icon>
        </div>
        <span class="ml-3" v-show="showAside == true">Settings</span>
      </div>
    </div>
    <div class="w-100 overflow-x-hidden position-absolute" style="height: 285px; bottom: 0px">
      <img src="@/assets/img/pattern/pattern.png" class="position-absolute" alt="pattern" width="160px" style="opacity: .5; bottom: 0px">
    </div>
    <div @click="onLogout()" class="position-absolute p-3 bg-blue sign-out" :class="{'pr-5': showAside == true, 'pr-3': showAside == false}" style="bottom: 0px">
      <div class="d-inline-block icon-menu text-white">
        <font-awesome-icon class="mx-4" icon="sign-out-alt"></font-awesome-icon>
      </div>
      <span class="ml-3 text-white" v-show="showAside == true">Logout</span>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
export default {
  data() {
    return {

    }
  },
  mounted() {

  },
  computed: {
    ...mapGetters({
      showAside: 'Dashboard/getShowAside',
      asideName: 'Dashboard/getAsideName',
      api: 'Api/getApi',
      web: 'Api/getWeb',
    })
  },
  methods: {
    ...mapMutations("Dashboard", ["set_asideName", "set_showAside"]),
    moveRouter(path) {
      this.set_asideName(path)
      this.$router.push({name: path})
    },
    onLogout() {
      localStorage.removeItem('api_token')
      this.$router.push({name: 'Login'})
    }
  }
}
</script>