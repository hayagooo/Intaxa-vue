<template>
  <div id="app">
    <layout-header v-show="this.$route.matched[0].props.default.type != 'Dashboard'" :class="{'d-none': showHeader == true}"/>
    <router-view/>
  </div>
</template>

<script>
import LayoutHeader from '@/components/LayoutHeader.vue'
import { mapGetters, mapMutations } from 'vuex'
export default {
  data() {
    return {
      routeType: this.$route.matched[0].props.default.type,
      showHeader: false,
    }
  },
  computed: {
    isAuth() {
      if(this.routeType == 'Auth') {
        return this.routeType
      } else {
        return true
      }
    },
    ...mapGetters({
      api: 'Api/getApi',
      token: 'Api/getToken',
      user: 'Auth/getUser',
      token: 'Auth/getToken',
      isAuth: 'Auth/isAuth',
      isBookmark: 'Magazine/isBookmark',
      bookmark: 'Magazine/getBookmark',
    })
  },
  watch: {
    routeType: {
      deep: true,
      immediate: true,
      handler: function(value) {
        // console.log(value)
        if(value == 'Auth') {
          this.showHeader = true
        }
      } 
    }
  },
  created() {
    console.log(this.isBookmark)
    if(this.bookmark == undefined) {
      let bookmark = [{id: 0}]
      localStorage.setItem('bookmark', JSON.stringify(bookmark) || "[]");
      let obj = JSON.parse(localStorage.getItem('bookmark')).bookmark
      console.log(obj)
    }
  },
  mounted() {
    if(this.routeType == 'Auth') {
      this.showHeader = true
    }
    if(this.isAuth) {
      console.log(this.token)
      if(this.user.length === 0) {
        this.getUser()
      }
    }
  },
  components: {
    LayoutHeader
  },
  methods: {
    ...mapMutations("Auth", ["set_user", "set_token"]),
    getUser() {
      this.$http.get(`${this.api}user/profile`, {
        headers: {
          'Authorization': `Bearer ${this.token}`
        }
      }).then((response) => {
        this.set_user(response.data.data)
        console.log(this.user)
        this.set_token(response.data.data.api_token)
      }).catch((err) => {
        console.log(err)
        if(401 === err.response.status) {
          err.response.status = 200
          console.log('Anda belum login')
        }
      })
    }
  },
}
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
