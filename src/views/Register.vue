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
    <b-container fluid class="px-0 position-fixed w-100 bg-full-page bg-main">
      <b-row>
        <b-col cols="6" class="bg-full-page">
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
            <img src="@/assets/img/logo/sidescript.png" width="30px" alt="sidecript" class="d-inline-block">
            <p class="d-inline-block ml-2" style="font-size: .85rem">@2020 Developed by Sidescript dev</p>
          </div>
        </b-col>
        <b-col cols="6" class="bg-full-page bg-gradient-blue-cyan" style="left: auto !important; right: 0px !important">
          <div class="text-left pl-5 ml-5">
            <div class="team-login p-4 text-right">
              <h5 class="position-relative mr-2 text-white d-md-inline-block d-none" style="top: 4px">SMKN 1 Purwosari</h5>
              <img src="@/assets/img/logo/smk.png" width="40px" alt="sidecript" class="d-inline-block">
            </div>
            <h1 class="viga text-white text-intaxa-login">INT<br>AXA</h1>
            <div class="position-absolute text-right w-100 px-5 py-3" style="bottom: 0px; right: 0px">
              <b-button class="btn btn-white rad-md py-3 px-5 text-sm" :to="{name: 'Login'}">Sign In <font-awesome-icon class="ml-lg-2 ml-0" icon='angle-right'></font-awesome-icon></b-button>
            </div>
          </div>
        </b-col>
      </b-row>
    </b-container>
    <b-container fluid class="pt-5 bg-main">
      <b-row class="pt-4 mb-5">
        <b-col class="pt-md-5 pt-3 mt-md-4 mt-0" lg="4" offset-lg="4" md="6" offset-md="3" sm="8" offset-sm="2">
          <div class="w-100 mShadow p-3 bg-white rad mb-5">
            <h2 class="viga mt-3 mb-0">Sign Up</h2>
            <div class="text-center">
              <div class="line-blue d-inline-block bg-blue rad"></div>
            </div>
            <b-alert class="text-left" v-model="exception.show" variant="danger" dismissible>
              {{ exception.message }}
            </b-alert>
            <div class="mt-3 px-3 pb-3" v-if="step === 1">
              <b-form-input type="text" class="rad-md px-4 py-3" placeholder="Username" v-model="username"></b-form-input>
              <b-form-input type="email" class="rad-md px-4 py-3 mt-4" placeholder="Email" v-model="email"></b-form-input>
              <b-form-input :type="passwordType" class="rad-md px-4 mt-4 py-3" placeholder="Password" v-model="password"></b-form-input>
              <b-form-input :type="passwordType" class="rad-md px-4 mt-4 py-3" placeholder="Confirm Password" v-model="repassword"></b-form-input>
              <div class="text-left mt-2">
                <b-form-checkbox @change="togglePassword()" class="d-inline-block"></b-form-checkbox>
                <span class="text-sm">Show password </span>
              </div>
              <b-button class="btn w-100 btn-gradient-blue-cyan rad-md mt-3" @click="register(2)">Selanjutnya</b-button>
            </div>
            <div class="mt-3 px-3 pb-3" v-if="step === 2">
              <b-form-file ref="avatarFile" class="d-none" id="avatarFile" @change="avatarChange" v-model="avatar"></b-form-file>
              <div class="w-100 text-center">
                <div class="avatar-toggle-signup d-inline-block" @click="clickAvatar()">
                  <div class="image-ico">
                    <font-awesome-icon icon="image"></font-awesome-icon>
                  </div>
                  <img id="previewAvatar" :src="src" alt="Avatar">
                </div>
              </div>
              <h5>{{ username }}</h5>
              <b-row>
                <b-col cols="4">
                  <b-button class="btn w-100 btn-light rad-md mt-3 text-sm" @click="moveStep(1)"><font-awesome-icon icon="angle-left"></font-awesome-icon> Kembali</b-button>
                </b-col>
                <b-col cols="8">
                  <b-button class="btn w-100 btn-gradient-blue-cyan rad-md mt-3" @click="onRegister()">Daftar</b-button>
                </b-col>
              </b-row>
            </div>
            <div class="mt-3 px-3 pb-3 text-left" v-if="step === 3">
              <p>Hai {{ username }}. Kami telah mengirimkan email verifikasi ke {{ email }}, Mohon check email anda.</p>
              <div class="text-center">
                <b-form-input type="text" @keyup="verify()" class="rad-md px-4 py-3 input-code" placeholder="XXX-XXX" v-model="code"></b-form-input>
              </div>
            </div>
          </div>
        </b-col>
      </b-row>
      <b-modal ref="modal" id="modal" hide-footer centered hide-header>
        <div class="closable-modal text-center" @click="$bvModal.hide('modal')"><font-awesome-icon icon="times"></font-awesome-icon></div>
        <div class="px-3 pt-3 pb-0">
          <h5 class="viga">Pendaftaran anda berhasil !</h5>
          <p class="pb-4">Kami mengharuskan anda agar memproses verifikasi email untuk keperluan penggunaan Intaxa</p>
          <div class="text-right">
            <b-button class="btn-light px-4 rad py-3 mx-2" :to="{name: 'Login'}">Nanti</b-button>
            <b-button class="btn-blue-white px-5 rad py-3 text-white" @click="sendVerify()">Verifikasi sekarang</b-button>
          </div>
        </div>
      </b-modal>
    </b-container>  
  </div>
</template>

<style lang="scss">
@import '@/assets/css/style.scss';
@import '@/assets/css/login.scss';
</style>

<script>
import Loading from 'vue-loading-overlay'
import { mapGetters } from 'vuex'
export default {
  components: {
    Loading
  },
  data() {
    return {
      code: '',
      loading: {
        isLoading: false,
        transition: "fade",
        bgColor: "#000",
        color: "#0D6AE3",
        opacity: 0.85,
        loader: "dots",
        blur: "100px"
      },
      email: '',
      src: '',
      password: '',
      showPassword: false,
      username: '',
      passwordType: 'password',
      repassword: '',
      userId: '',
      api_token: '',
      exception: {
        show: false,
        message: '',
      },
      avatar: null,
      step: 1,
      passwordCondition: 'eye'
    }
  },
  mounted() {
    // this.$refs['modal'].show()
    // if(this.email == '' && this.password == '' && this.repassword == '' && this.username == '') {
    //   this.step = 3
    // }
    this.src = this.web+'/images/user/avatar/avatar.svg'
  },
  computed: {
    ...mapGetters({
      api: 'Api/getApi',
      web: 'Api/getWeb',
    })
  },
  methods: {
    moveHome() {
      this.$router.push({name: 'Home'})
    },
    togglePassword() {
      if(this.showPassword == false) {
        this.showPassword = true
        this.passwordCondition = 'eye'
        this.passwordType = 'text'
      } else {
        this.passwordType = 'password'
        this.showPassword = false
        this.passwordCondition = 'eye-slash'
      }
    },
    clickAvatar() {
      document.getElementById('avatarFile').click()
    },
    avatarChange(e) {
      let file = e.target.files[0]
      this.src = URL.createObjectURL(file)
    },
    register() {
      if(this.email == '' && this.password == '' && this.repassword == '' && this.username == '') {
        this.exception.show = true
        this.exception.message = 'Isi semua form yang ada'
      } else {
        if(this.password !== this.repassword) {
          this.exception.show = true
          this.exception.message = 'Password tidak sesuai'
        } else {
          this.exception.show = false
          this.exception.message = ''
          this.moveStep(2)
        }
      }
    },
    onRegister() {
      this.loading.isLoading = true
      this.$http.post(`${this.api}signup`, {
        name: this.username,
        email: this.email,
        password: this.password,
        level: 'User',
      }).then((response) => {
        console.log(response)
        if(response.data.code == 200) {
          this.userId = response.data.data.id
          this.api_token = response.data.data.api_token
          this.upload()
          console.log(response)
        }
      })
    },
    upload() {
      let formAvatar = new FormData();
      formAvatar.append('avatar', this.avatar)
      this.$http.post(`${this.api}upload/avatar/${this.userId}`, formAvatar).then((response) => {
        console.log(response)
        this.loading.isLoading = false
        if(response.data.code == 200) {
          // alert('Berhasil')
          this.$refs['modal'].show()
        } else {
          alert('Gagal')
        }
      })
    },
    sendVerify() {
      this.loading.isLoading = true
      this.$http.post(`${this.api}send/verify`, {
        email: this.email
      }).then((response) => {
        console.log(response)
        if(response.data.code == 200) {
          // alert('Berhasil')
          this.loading.isLoading = false
          this.step = 3
          this.$refs['modal'].hide()
        } else {
          this.loading.isLoading = false
          alert('Gagal')
        }
      })
    },
    verify() {
      if(this.code.length == 5) {
        this.$http.post(`${this.api}verify/${this.api_token}/token`).then((response) => {
          console.log(response)
          if(response.data.code == 200) {
            // alert('Berhasil')
            this.$router.push({name: 'Login'})
          }
        })
      }
    },
    moveStep(step) {
      this.step = step
    },
    onCancel() {
      console.log('Cancelled');
    }
  }
}
</script>