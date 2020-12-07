<template>
  <div v-show="$route.path === '/login' || $route.path === '/register' ? false : true" v-if="$route.name !== 'Magazine'">
    <header>
      <b-container fluid class="position-absolute w-100 mNav py-3">
        <b-row>
          <b-col cols="6" class="text-left px-5 py-3">
            <div v-if="$route.name !== 'Magazine'" class="brand-nav" @click="moveRouter('Home')">
              <img :src="require(`../assets/img/logo/${navBrandImg}`)" width="30px" class="d-inline-block nav-brand-img" alt="Intaxa">
              <h3 class="d-inline-block viga text-white ml-2 position-relative nav-brand-text" :class="{'text-black': menuShow == true}" style="top: 6px">INTAXA</h3>
            </div>
          </b-col>
          <b-col cols="6" v-show="$route.name === 'Home' || $route.name === 'Bookmark' || $route.name === 'Popular' ? true : false" class="text-right px-5 py-3">
            <div class="burger-line d-inline-block p-2" :class="{'menu-closable': menuShow == true}" @click="toggleNav">
              <div class="line"></div>
              <div class="line"></div>
            </div>
          </b-col>
        </b-row>
      </b-container>
    </header>
    <div class="menu-nav position-fixed" v-show="$route.name === 'Home' || $route.name === 'Bookmark' || $route.name === 'Popular' ? true : false" :class="{'menu-hide': menuShow == false, 'menus-show': menuShow == true}"></div>
    <b-container  v-show="$route.name === 'Home' || $route.name === 'Bookmark' || $route.name === 'Popular' ? true : false" fluid class="position-fixed menu-items" :class="{'items-hide': menuShow == false, 'items-show': menuShow == true}">
      <img src="@/assets/img/widget/allFitur.png" class="w-75 pt-lg-2 pt-4 position-absolute widget-sm d-lg-none d-inline-block" alt="All Fitur Intaxa">
      <b-row>
        <b-col lg="8" md="6" class="text-center py-lg-3 py-5 px-0 d-lg-inline-block d-none">
          <img src="@/assets/img/widget/allFitur.png" class="w-75 pt-lg-2 pt-4" alt="All Fitur Intaxa">
        </b-col>
        <b-col lg="4" class="text-right px-5 pb-5 pt-5">
          <div class="pl-3 pb-3 pr-md-5 pr-5">
            <div class="my-4 menu-item" :class="{'active-item': $route.name == 'Bookmark'}" @click="moveRouter('Bookmark')">
              <h1 class="viga">BOOKMARK</h1>
            </div>
            <div class="my-4 menu-item" :class="{'active-item': $route.name == 'Home'}" @click="moveRouter('Home')">
              <h1 class="viga">MAGAZINES</h1>
            </div>
            <div class="my-4 menu-item" :class="{'active-item': $route.name == 'Popular'}" @click="moveRouter('Popular')">
              <h1 class="viga">POPULAR</h1>
            </div>
            <div class="my-4 menu-item" :class="{'active-item': $route.name == 'Login'}" @click="moveRouterLogin('Login')">
              <h1 class="viga">SIGNIN</h1>
            </div>
            <div class="my-4 menu-item">
              <img src="@/assets/img/widget/appStore.png" class="d-inline-block mx-1 my-2 widget-nav" height="40px" alt="app store">
              <img src="@/assets/img/widget/playStore.png" class="d-inline-block mx-1 my-2 widget-nav" height="40px" alt="app store">
            </div>
          </div>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<style lang="scss" scoped>
@import '@/assets/css/style.scss';
@import '@/assets/css/navbar.scss';
</style>

<script>
export default {
  data() {
    return {
      menuShow: false,
      routeType: this.$route.matched[0].props.default.type,
      navBrandImg: 'intaxa-white.png'
    }
  },
  methods: {
    moveRouter(name) {
      this.menuShow = false
      this.$router.push({name: name})
      setTimeout(() => {
        $('.nav-brand-img').fadeIn('slow')
        this.navBrandImg = 'intaxa-white.png'
      }, 1000)
    },
    moveRouterLogin(name) {
      this.menuShow = false
      setTimeout(() => {
        $('.nav-brand-img').fadeIn('slow')
        this.navBrandImg = 'intaxa-white.png'
      }, 1000)
      setTimeout(() => {
        this.$router.push({name: name})
      }, 1500);
    },
    toggleNav() {
      if(this.menuShow == false) {
        this.menuShow = true
        setTimeout(() => {
          $('.nav-brand-img').fadeOut('slow')
          this.navBrandImg = 'intaxa-black.png'
        }, 1000)
      } else {
        this.menuShow = false
        setTimeout(() => {
          $('.nav-brand-img').fadeIn('slow')
          this.navBrandImg = 'intaxa-white.png'
        }, 1000)
      }
    }
  },
  created() {
    // console.log(this.$route.path)
  }
}
</script>