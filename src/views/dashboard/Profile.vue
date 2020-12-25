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
    <b-container class="pt-5 px-5 bg-full-page bg-main" fluid>
      <b-row class="mt-5 pt-5">
        <b-col lg="3" md="4">
          <div class="w-100 cover text-left">
            <div class="item-menu-profile pb-0 pt-3" :class="{'active': modeProfile == 'edit'}" @click="setModeProfile('edit')">
              <font-awesome-icon icon="pen"></font-awesome-icon>
              <p class="d-inline-block ml-3">Edit Profile</p>
            </div>
            <!-- <div class="item-menu-profile pb-0 pt-3" :class="{'active': modeProfile == 'notif'}" @click="setModeProfile('notif')">
              <font-awesome-icon icon="bell"></font-awesome-icon>
              <p class="d-inline-block ml-3">Notifikasi</p>
            </div> -->
            <div class="item-menu-profile pb-0 pt-3" :class="{'active': modeProfile == 'password'}" @click="setModeProfile('password')">
              <font-awesome-icon icon="lock"></font-awesome-icon>
              <p class="d-inline-block ml-3">Password</p>
            </div>
          </div>
        </b-col>
        <b-col lg="9" md="8">
          <div class="w-100 bg-white rad px-3 pb-4 pt-5">
            <div v-if="modeProfile == 'edit'">
              <div v-if="user.publisher != null && user.publisher != undefined" class="position-absolute bg-blue px-5 py-3 rad text-white" style="top: -16px; right: 0px">
                {{ user.level }} {{ user.publisher.name }}
              </div>
              <b-form-file id="file" class="d-none" accept="image/jpeg, image/png, image/jpg" @change="onChange"></b-form-file>
              <div class="profile-preview">
                <div v-if="isAuth && user != null && user != undefined" class="image" @click="previewImage(user.avatar)">
                  <img :src="`${web}images/user/avatar/${user.avatar}`" alt="User Avatar">
                </div>
                <b-button class="btn-change" @click="clickFile">
                  <font-awesome-icon icon="pen"></font-awesome-icon>
                </b-button>
              </div>
              <div class="w-100 text-left">
                <b-row>
                  <b-col md="8" offset-md="2">
                    <label for="name">Username</label>
                    <b-form-input type="text" class="p-3 rad" placeholder="Your Name Here" v-model="name"></b-form-input>
                    <label for="name" class="mt-3">Email</label>
                    <b-form-input type="text" class="p-3 rad" placeholder="Your Email Here" v-model="email"></b-form-input>
                    <div class="text-left mt-3">
                      <b-button class="btn btn-blue-white rad px-5 py-3 text-white" @click="setUser">Simpan</b-button>
                    </div>
                  </b-col>
                </b-row>
              </div>
            </div>
            <div v-if="modeProfile == 'notif'">
              <div v-if="notif == null">
                <img src="@/assets/img/illust/none.svg" class="w-50" alt="404 No Data">
                <h2 class="viga text-blue mt-4">Belum ada notifikasi</h2>
              </div>
            </div>
            <div v-if="modeProfile == 'password'">
              <div class="w-100 text-left">
                <b-row>
                  <b-col md="6" offset-md="3">
                     <b-alert variant="danger" :show="alertException.visible">
                      {{ alertException.msg }}
                    </b-alert>
                    <b-alert variant="success" :show="alertSuccess.visible">
                      {{ alertSuccess.msg }}
                    </b-alert>
                    <label for="password-old">Password Lama</label>
                    <b-form-input :type="typePassword" class="p-3 rad" v-model="passwordOld"></b-form-input>
                    <hr>
                    <label for="password-old" class="mt-1">Password Baru</label>
                    <b-form-input :type="typePassword" class="p-3 rad" v-model="passwordNew"></b-form-input>
                    <label for="password-old" class="mt-3">Ulangi Password Baru</label>
                    <b-form-input :type="typePassword" class="p-3 rad" v-model="repasswordNew"></b-form-input>
                    <div class="mt-3">
                      <b-form-checkbox id="typePassword" class="d-inline-block" value="text" unchecked-value="password" v-model="typePassword"></b-form-checkbox>
                      <label class="d-inline-block" for="typePassword">Tampilkan Password</label>
                    </div>
                    <div class="text-left mt-3">
                      <b-button class="btn btn-blue-white rad px-5 py-3 text-white" @click="setPassword">Simpan</b-button>
                    </div>
                  </b-col>
                </b-row>
              </div>
            </div>
          </div>
        </b-col>
      </b-row>
      <b-modal ref="modal-image" id="modal-image" hide-footer hide-header centered>
        <div class="closable-modal text-center" @click="hideModal('modal-image')"><font-awesome-icon icon="times"></font-awesome-icon></div>
        <img :src="`${web}images/user/avatar/${avatar}`" class="w-100 rad" alt="User Avatar">
      </b-modal>
    </b-container>
  </div>
</template>

<style lang="scss">
@import '@/assets/css/dashboard/style.scss';
@import '@/assets/css/dashboard/profile.scss';
</style>

<script>
import Loading from 'vue-loading-overlay'
import { mapGetters, mapMutations } from 'vuex'
export default {
  components: {
    Loading
  },
  data() {
    return {
      avatar: '',
      typePassword: 'password',
      notif: null,
      modeProfile: 'edit',
      alertException: {
        visible: false,
        msg: null
      },
      alertSuccess: {
        visible: false,
        msg: null
      },
      name: '',
      email: '',
      passwordNew: '',
      repasswordNew: '',
      passwordOld: '',
      loading: {
        isLoading: false,
        transition: "fade",
        bgColor: "#000",
        color: "#0D6AE3",
        opacity: 0.85,
        loader: "dots",
        blur: "100px"
      },
    }
  },
  created() {
    this.getAuth()
  },
  computed: {
    ...mapGetters({
      user: 'Auth/getUser',
      isAuth: 'Auth/isAuth',
      token: 'Auth/getToken',
      api: 'Api/getApi',
      web: 'Api/getWeb'
    })
  },
  methods: {
    ...mapMutations('Auth', ['set_user', 'set_token']),
    getAuth() {
      this.$http.get(`${this.api}user/profile`, {
        headers: {
          'Authorization': `Bearer ${this.token}`
        }
      }).then((response) => {
        this.set_user(response.data.data)
        this.email = response.data.data.email
        console.log(response.data.data)
        this.name = response.data.data.name
      })
    },
    setModeProfile(mode) {
      this.modeProfile = mode
    },
    hideModal(ref) {
      this.$refs[ref].hide()
    },
    previewImage(avatar) {
      this.$refs['modal-image'].show()
      this.avatar = avatar
    },
    clickFile() {
      document.getElementById('file').click()
    },
    onCancel() {
      console.log('Cancelled')
    },
    onChange(e) {
      this.loading.isLoading = true
      let file = e.target.files[0]
      let formData = new FormData()
      formData.append('avatar', file)
      this.$http.post(`${this.api}upload/avatar/${this.user.id}`, formData).then((response) => {
        if(response.data.code == 200) {
          this.loading.isLoading = false
          this.getAuth()    
        }
      })
    },
    setUser() {
      this.loading.isLoading = true
      this.$http.post(`${this.api}user/${this.user.id}`, {
        name: this.name,
        email: this.email,
      }, {
        headers: {
          'Authorization': `Bearer ${this.token}`
        }
      }).then((response) => {
        this.loading.isLoading = false
        this.getAuth()
      })
    },
    setPassword() {
      if(this.passwordNew != this.repasswordNew) {
          this.alertSuccess.visible = false
          this.alertSuccess.msg = null
          this.alertException.visible = true
          this.alertException.msg = 'Password baru tidak sama'
      } else {
        this.loading.isLoading = true
        this.$http.post(`${this.api}user/profile/password`, {
          oldPassword: this.passwordOld,
          newPassword: this.passwordNew
        }, {
          headers: {
            'Authorization': `Bearer ${this.token}`
          }
        }).then((response) => {
          this.loading.isLoading = false
          if(response.data.code == 404) {
            this.alertException.visible = true
            this.alertException.msg = 'Password lama salah'
            this.alertSuccess.visible = false
            this.alertSuccess.msg = null
          } else {
            this.alertException.visible = false
            this.alertException.msg = null
            this.alertSuccess.visible = true
            this.alertSuccess.msg = 'Password berhasil diubah'
          }
        })
      }
    }
  }
}
</script>