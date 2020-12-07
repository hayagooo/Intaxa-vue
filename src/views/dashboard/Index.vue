<template>
  <div>
    <b-container fluid class="pr-3 pl-0 overflow-hidden">
      <b-row style="z-index: 0;">
        <b-col :class="{'col-lg-1 col-md-2 col-2 hide': showAside == false, 'col-lg-2 col-md-3 col-sm-4 col-6': showAside == true}"  class="position-md-fixed bg-full-page overflow-x-visible overflow-y-visible text-left bg-white shadow px-0">
          <aside-menu/>
          <div class="toggleAside" @click="toggleAside()" :class="{'hide': showAside == false}">
            <font-awesome-icon icon="angle-left"></font-awesome-icon>
          </div>
        </b-col>
        <b-col class="mainViews position-relative bg-light" style="z-index: 100" :class="{'col-lg-11 col-md-10 col-12 offset-lg-0 offset-0': showAside == false, 'col-md-10 col-md-9 offset-lg-0 col-10 offset-2': showAside == true, 'px-0': this.$route.name == 'DashboardTopics'}">
          <search-bar/>
          <dashboard-view v-if="this.$route.name == 'Dashboard'"/>
          <magazines-view v-if="this.$route.name == 'DashboardMagazines'"/>
          <topics-view v-if="this.$route.name == 'DashboardTopics'"/>
          <profile-view v-if="this.$route.name == 'DashboardProfile'"/>
          <team-view v-if="this.$route.name == 'DashboardTeams'"/>
          <setting-view v-if="this.$route.name == 'DashboardSetting'"/>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<style lang="scss">
@import '@/assets/css/aside.scss';
</style>

<script>
import AsideMenu from '@/components/AsideMenu.vue'
import SearchBar from '@/components/SearchBar.vue'
import DashboardView from '@/views/dashboard/Dashboard.vue'
import MagazinesView from '@/views/dashboard/Magazines.vue'
import TopicsView from '@/views/dashboard/detail/MagazineTopic.vue'
import ProfileView from '@/views/dashboard/Profile.vue'
import TeamView from '@/views/dashboard/Teams.vue'
import SettingView from '@/views/dashboard/Setting.vue'
import { mapGetters, mapMutations } from 'vuex'
export default {
  data() {
    return {
      window: {
        width: 0,
        height: 0,
      }
    }
  },
  created() {
    window.addEventListener('resize', this.handleResize)
    this.handleResize()
  },
  destroyed() {
    window.removeEventListener('resize', this.handleResize)
  },
  components: {
    AsideMenu,
    DashboardView,
    MagazinesView,
    ProfileView,
    SettingView,
    TopicsView,
    TeamView,
    SearchBar,
  },
  mounted() {
    this.setAside(this.$route.name)
    this.getAuth()
    if(this.token == undefined || this.token == null) {
      this.$router.push({name: 'Login'})
    }
  },
  computed: {
    ...mapGetters({
      showAside: 'Dashboard/getShowAside',
      asideName: 'Dashboard/getAsideName',
      api: 'Api/getApi',
      web: 'Api/getWeb',
      getAsideDashboard: 'Dashboard/getAsideDashboard',
      isAuth: 'Auth/isAuth',
      user: 'Auth/getUser',
      token: 'Auth/getToken',
    })
  },
  methods: {
    ...mapMutations("Dashboard", ["set_showAside", "set_asideName", "set_asideDashboard"], "Auth", ["set_user"]),
    setAside(path) {
      this.set_asideName(path)
      // console.log(this.asideName)
    },
    getAuth() {
      this.$http.get(`${this.api}user/${this.token}/token`)
      .then((response) => {
        console.log(response)
        if(response.data.code != 200) {
          localStorage.removeItem('api_token')
          this.$router.push({name: 'Login'})
        }
      })
    },
    handleResize() {
      this.window.width = window.innerWidth
      if(this.window.width < 960) {
        this.set_showAside(false)
      } else {
        this.set_showAside(true)
      }
    },
    toggleAside() {
      if(this.showAside == true) {
        this.set_showAside(false)
      } else {
        if(this.window.width < 960) {
          console.log("tutup")
          this.set_asideDashboard(false)
        }
        this.set_showAside(true)
      }
    }
  }
}
</script>