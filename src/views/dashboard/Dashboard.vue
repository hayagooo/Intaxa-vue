<template>
  <div>
    <b-row>
      <b-col class="bg-light bg-full-page bg-main" style="overflow-y: auto" :class="{'col-lg-9 col-md-8': getAsideDashboard == true, 'col-md-11': getAsideDashboard == false}">
        <div class="pt-5 px-4 mt-5 text-left">
          <h3 class="mt-4 viga">Your Magazines</h3>
          <b-button @click="setSort('DESC')" :class="{'px-4 py-2 btn btn-blue-white rad shadow text-white btn-sm': sort == 'DESC', 'px-4 py-2 btn btn-light rad btn-sm mx-4': sort !== 'DESC'}">Recently</b-button>
          <b-button @click="setSort('Popular')" :class="{'px-4 py-2 btn btn-blue-white rad shadow text-white btn-sm': sort == 'Popular', 'px-4 py-2 btn btn-light rad btn-sm mx-4': sort !== 'Popular'}">Popular</b-button>
          <b-button @click="setSort('ASC')" :class="{'px-4 py-2 btn btn-blue-white rad shadow text-white btn-sm': sort == 'ASC', 'px-4 py-2 btn btn-light rad btn-sm mx-4': sort !== 'ASC'}">Oldest</b-button>
        </div>
        <div class="pl-3 pr-0" v-if="magazines != undefined && magazines != null">
          <b-row :options="magazineSlider" v-if="magazines.length > 0" class="magazineSlide">
            <b-col md="4" class="mt-5" v-for="magazine in magazines" :key="magazine.id">
              <div class="mx-3">
                <div class="previewMagazine">
                  <div class="image">
                    <img :src="`${web}images/magazine/cover/${magazine.cover}`" alt="Magazine cover">
                  </div>
                </div>
                <div class="text-left pt-3 textMagazine">
                  <h6 class="viga mb-0">{{ magazine.title }}</h6>
                  <p class="text-sm">{{ magazine.created_at }}</p>
                </div>
              </div>
            </b-col>
          </b-row>
        </div>
        <div class="responseReader px-3 py-4">
          <div class="w-100 card text-left shadow bg-white rad p-4 border-0">
            <h4 class="viga">Response from reader</h4>
            <dashboard-chart/>
          </div>
        </div>
      </b-col>
      <b-col :class="{'col-lg-3 col-md-4 col-6': getAsideDashboard == true, 'col-md-1 col-1 hide': getAsideDashboard == false}" class="position-md-fixed fixed-md-asideRight bg-full-page shadow bg-white" style="overflow: visible !important">
        <aside-dashboard/>
        <div class="toggleAsideRight" @click="toggleAside()" :class="{'hide': getAsideDashboard == false}">
          <font-awesome-icon icon="angle-right"></font-awesome-icon>
        </div>
      </b-col>
    </b-row>
  </div>
</template>

<style lang="scss">
@import '@/assets/css/style.scss';
@import '@/assets/css/dashboard/style.scss';
</style>

<script>
import { mapGetters, mapMutations } from 'vuex'
import Slick from 'vue-slick'
import DashboardChart from '@/components/DashboardChart.vue'
import AsideDashboard from '@/components/AsideDashboard.vue'
import $ from 'jquery'
export default {
  data() {
    return {
      magazines: [],
      window: {
        height: 0,
        width: 0,
      },
      sort: 'DESC',
       magazineSlider: {
        slidesToShow: 3,
        slidesToScroll: 1,
        swipe: true,
        centerPadding: '50px',
        infinite: false,
        variableWidth: true,
        arrows: false,
        // centerMode: true,
        dots: true,
        responsive: [
          {
            breakpoint: 650,
            settings: {
              slidesToShow: 2,
              slidesToScroll: 1,
            }
          }
        ]
      }
    }
  },
  components: {
    AsideDashboard,
    Slick,
    DashboardChart
  },
  created() {
    window.addEventListener('resize', this.handleResize)
    this.handleResize()
    this.getMagz()
  },
  destroyed() {
    window.removeEventListener('resize', this.handleResize)
  },
  computed: {
    ...mapGetters({
      api: 'Api/getApi',
      web: 'Api/getWeb',
      getAsideDashboard: 'Dashboard/getAsideDashboard',
      showAside: 'Dashboard/getShowAside'
    })
  },
  methods: {
    ...mapMutations("Dashboard", ["set_asideDashboard", "set_showAside"]),
    hideModal(ref) {
      this.$refs[ref].hide()
    },
    setSort(sort) {
      this.sort = sort
      this.getMagz()
    },
    getMagz() {
      this.$http.post(`${this.api}sort/magazine`, {
        sort: this.sort
      }).then((response) => {
        this.magazines = response.data.data
        console.log(response)
      })
    },
    handleResize() {
      this.window.width = window.innerWidth
      if(this.window.width < 960) {
        this.set_asideDashboard(false)
      } else {
        this.set_asideDashboard(true)
      }
    },
    toggleAside() {
      if(this.getAsideDashboard == true) {
        this.set_asideDashboard(false)
      } else {
        if(this.window.width < 960) {
          this.set_showAside(false)
        }
        this.set_asideDashboard(true)
      }
    }
  }
}
</script>