<template>
  <div>
    <loading :active.sync="loading.isLoading"
    :can-cancel="true"
    :on-cancel="onCancel"
    :is-full-page="true"
    :loader="loading.loader"
    :background-color="loading.bgColor"
    :transition="loading.transition"
    :opacity="loading.opacity"
    :blur="loading.blur"
    :color="loading.color"></loading>
    <b-container fluid class="px-0 position-fixed w-100 bg-full-page">
      <b-row>
        <b-col cols="6">
          <div class="team-login p-4 text-left" @click="moveHome()">
            <img src="@/assets/img/logo/intaxa.png" width="30px" alt="sidecript" class="d-inline-block">
            <h5 class="viga d-inline-block position-relative ml-2" style="top: 4px">INTAXA</h5>
          </div>
          <h1 class="viga text-blue position-absolute petik">"</h1>
          <div class="caption-login p-4 bg-full-page d-md-inline-block text-left-block d-none">
            <h2 class="viga mb-3 text-blue">Indonesia Strategy <br> in Exploration</h2>
            <p>Mengembangkan Minat Literasi</p>
          </div>
          <div class="developed-login position-absolute px-4 py-3 d-md-inline-block d-none" style="bottom: 0px; left: 10px">
            <p style="font-size: .85rem">@2020 Developed by Sidescript dev</p>
          </div>
        </b-col>
        <b-col cols="6" class="bg-full-page bg-gradient-blue-cyan">
          <div class="text-left pl-5 ml-5">
            <div class="team-login p-4 text-right">
              <h5 class="position-relative mr-2 text-white d-md-inline-block d-none" style="top: 4px">SMKN 1 Purwosari</h5>
              <img src="@/assets/img/logo/smk.png" width="40px" alt="sidecript" class="d-inline-block">
            </div>
            <h1 class="viga text-white text-intaxa-login">INT<br>AXA</h1>
            <div class="position-absolute text-right w-100 px-5 py-3" style="bottom: 0px; right: 0px">
              <b-button class="btn btn-white rad-md py-3 px-5" :to="{name: 'Register'}">Daftar <font-awesome-icon class="ml-2" icon='angle-right'></font-awesome-icon></b-button>
            </div>
          </div>
        </b-col>
      </b-row>
    </b-container>
    <b-container fluid class="pt-5">
      <b-row class="pt-5 mb-5">
        <b-col class="pt-md-5 pt-3 mt-md-4 mt-0" lg="4" offset-lg="4" md="6" offset-md="3" sm="8" offset-sm="2">
          <div class="w-100 mShadow p-3 bg-white rad mb-5">
            <h2 class="viga mt-3 mb-0">Masuk</h2>
            <div class="text-center">
              <div class="line-blue d-inline-block bg-blue rad"></div>
            </div>
            <b-alert class="text-left" v-model="exception.show" variant="danger" dismissible>
              {{ exception.message }}
            </b-alert>
            <div class="mt-3 px-3 pb-3">
              <b-form-input type="email" class="rad-md px-4 py-3" placeholder="email" v-model="email"></b-form-input>
              <b-row>
                <b-col cols="9">
                  <b-form-input :type="passwordType" class="rad-md px-4 mt-3 py-3" placeholder="password" v-model="password"></b-form-input>
                </b-col>
                <b-col cols="3">
                  <b-button @click="togglePassword()" class="btn mt-3 rad-md" :class="{'btn-light text-dark' : showPassword == false, 'btn-blue-white text-white' : showPassword == true}">
                    <font-awesome-icon :icon="['fas', passwordCondition]"></font-awesome-icon>
                  </b-button>
                </b-col>
              </b-row>  
              <b-button class="btn w-100 btn-gradient-blue-cyan rad-md mt-3" @click="onLogin()">Masuk</b-button>
            </div>
          </div>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<style lang="scss">
@import '@/assets/css/style.scss';
@import '@/assets/css/login.scss';
</style>

<script>
import { mapGetters, mapMutations } from 'vuex'
import Loading from 'vue-loading-overlay'
export default {
  data() {
    return {
      email: '',
      password: '',
      passwordType: 'password',
      showPassword: false,
      loading: {
        isLoading: false,
        transition: "fade",
        bgColor: "#000",
        color: "#0D6AE3",
        opacity: 0.85,
        loader: "dots",
        blur: "100px"
      },
      exception: {
        show: false,
        message: null,
      },
      passwordCondition: 'eye-slash'
    }
  },
  components: {
    Loading
  },
  computed: {
    ...mapGetters({
      api: 'Api/getApi',
      web: 'Api/getWeb',
      user: 'Auth/getUser',
      token: 'Auth/getToken',
      isAuth: 'Auth/isAuth'
    })
  },
  created() {
    if(this.isAuth) {
      this.$router.push({name: 'Dashboard'})
    }
  },
  methods: {
    ...mapMutations("Auth", ["set_user", "set_token"]),
    moveHome() {
      this.$router.push({name: 'Home'})
    },
    togglePassword() {
      if(this.showPassword == false) {
        this.showPassword = true
        this.passwordCondition = 'eye'
        this.passwordType = 'text'
      } else {
        this.showPassword = false
        this.passwordType = 'password'
        this.passwordCondition = 'eye-slash'  
      }
    },
    onLogin() {
      this.loading.isLoading = true
      if(this.email == '' && this.password == '') {
        this.loading.isLoading = false
        this.exception.show = true
        this.exception.message = 'Isi semua form yang ada'
      } else {
        this.$http.post(`${this.api}signin`, {
          email: this.email,
          password: this.password
        }).then((response) => {
          console.log(response)
          if(response.data.code == 200) {
            this.loading.isLoading = false
            localStorage.setItem('api_token', response.data.data.api_token)
            console.log(response)
            this.set_user(response.data.data)
            this.set_token(response.data.data.api_token)
            this.$router.push({name: 'Dashboard'})
          } else {
            this.loading.isLoading = false
            this.exception.show = true
            this.exception.message = 'Email / Password tidak sesuai'
          }
        })
      }
    },
    onCancel() {
      console.log('Cancelled')
    }
  }
}
</script>