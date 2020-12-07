<template>
  <div class="bg-full-page position-relative" v-show="getAsideDashboard == true" style="overflow-y: auto !important">
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
    <div class="text-right p-3">
      <b-button class="btn mx-2 btn-white shadow-sm rad scale-08" @click="setDisplay()">
        <font-awesome-icon v-if="displayAside == 'team'" icon="user"></font-awesome-icon>
        <font-awesome-icon v-if="displayAside == 'user'" icon="users"></font-awesome-icon>
      </b-button>
      <b-button class="btn mx-2 btn-profile-dashboard d-inline-block">
        <font-awesome-icon v-if="displayAside == 'user'" icon="user"></font-awesome-icon>
        <font-awesome-icon v-if="displayAside == 'team'" style="font-size: .85rem" icon="users"></font-awesome-icon>
      </b-button>
    </div>
    <div v-show="displayAside == 'user'">
      <div class="text-center pr-3 pl-2">
        <b-form-file accept="image/jpeg, image/png, image/jpg" class="d-none" v-model="avatarFile" id="avatarFile" @change="changeAvatar"></b-form-file>
        <div class="avatar-dashboard-index position-relative">
          <img :src="`${web}images/user/avatar/${user.avatar}`" @click="showModalImageUser('user')" alt="User Profile">
          <div class="overlay-black text-center" @click="clickFile()">
            <font-awesome-icon icon="image" class="text-white my-4"></font-awesome-icon>
          </div>
        </div>
        <b-button class="btn-edit-profile" v-b-modal.edit-profile><font-awesome-icon icon="pen"></font-awesome-icon></b-button>
        <b-modal show ref="edit-profile" id="edit-profile" size="md" class="position-relative" centered hide-header hide-footer>
          <div class="closable-modal text-center" @click="hideModal('edit-profile')"><font-awesome-icon icon="times"></font-awesome-icon></div>
          <div class="pt-3 px-3 pb-0">
            <h4 class="viga">Edit Your Profile</h4>
            <label for="username">Username</label>
            <b-form-input id="username" v-model="formUpdate.username" class="rad pl-3" placeholder="Username"></b-form-input>
            <label for="email" class="mt-3">Email</label>
            <b-form-input id="email" v-model="formUpdate.email" class="rad pl-3" placeholder="example@domain.com"></b-form-input>
            <div class="text-right">
              <b-button class="btn-blue-white px-4 py-3 rad mt-3 text-white" @click="updateUser()">Save</b-button>
            </div>
          </div>
        </b-modal>
        <div class="pt-3 pr-3 pl-2">
          <h4 class="viga mb-0">{{ user.name }}</h4>
          <p class="text-sm">{{ user.level }}</p>
          <div v-if="user.publisher_id != null">
            <p class="mb-1 text-sm">{{ user.publisher.name }}</p>
            <div class="teammate-profile-dashboard rad">
              <div class="profile-sm" v-for="team in teammate" :key="team.id">
                <img :src="`${web}/images/user/avatar/${team.avatar}`" alt="Team profile">
              </div>
            </div>
          </div>
          <div v-if="user.publisher_id == null" class="text-left">
            <b-alert show variant="info" class="text-sm">
              Publisher masih belum ada.
            </b-alert>
          </div>
        </div>
      </div>
      <div class="text-left pr-3 pl-1 pt-3" v-show="getAsideDashboard == true">
        <h5 class="viga">My Activity</h5>
        <div v-if="activities.count > 0">
          <div class="personal-activity w-100 p-1 mb-2">
            <b-row>
              <b-col cols="3">
                <div class="profile-sm d-inline-block mt-2">
                  <img :src="`${web}/images/user/avatar/ninno-sm.png`" alt="Team profile">
                </div>
              </b-col>
              <b-col cols="9" class="position-relative py-0">
                <span class="d-inline-block m-0 text-sm font-weight-bold" style="font-size: .8rem !important">{{ user.name }}</span>
                <span class="d-inline-block m-0 text-sm">Created magazines "Digital Magaz..."</span>
                <div class="text-right position-absolute mb-0" style="top: 0px; right: 25px">
                  <span class="d-inline-block m-0 text-sm">Kemarin</span>
                </div>
              </b-col>
            </b-row>
          </div>
        </div>
        <div v-if="activities.count == 0">
          <b-alert show variant="info" class="text-sm">
            Masih belum ada Aktifitas
          </b-alert>
        </div>
      </div>
    </div>

    <div v-show="displayAside == 'team'">
      <div v-if="user.publisher == null" class="py-5">
        <img src="@/assets/img/illust/none.svg" class="w-75" alt="">
        <h5 class="viga mt-4">Kamu belum punya team.</h5>
        <b-button class="btn btn-blue-white rad px-5 py-3 text-white" v-b-modal.create-team>Buat Team</b-button>
        <div class="mt-3">
          <b-button class="btn btn-sm btn-light px-4 py-2 rad" v-b-modal.modal-join>Join team lain</b-button>
        </div>
        <b-modal ref="modal-join" id="modal-join" hide-footer hide-header centered>
          <div class="closable-modal text-center" @click="hideModal('modal-join')"><font-awesome-icon icon="times"></font-awesome-icon></div>
          <div class="px-3 py-3">
            <h4 class="viga">Cari team.</h4>
            <b-form-input @keyup="searchData" v-model="search" class="py-3 px-4 rad" placeholder="Cari team"></b-form-input>
            <div v-if="searchResult != null">
              <div v-for="result in searchResult" :key="result.id" class="card rad p-2 my-2">
                <b-row class="p-0 m-0">
                  <b-col cols="4" class="p-0 m-0 text-center">
                    <div class="avatar-group">
                      <img :src="`${web}images/team/logo/${result.avatar}`" alt="">
                    </div>
                  </b-col>
                  <b-col cols="4" class="p-0 m-0 text-center mt-2">
                    <h5 class="viga mb-0">{{ result.name }}</h5>
                    <p class="text-sm mb-0">{{ result.category }}</p>
                  </b-col>
                  <b-col cols="4" class="p-0 m-0 text-center mt-2">
                    <b-button v-if="result.req.find(request => request.user_id === user.id) == null" @click="joinTeam(result.id)" class="btn btn-blue-white px-4 py-2 rad text-white">Join</b-button>  
                    <b-button v-if="result.req.find(request => request.user_id === user.id) != null" @click="cancelJoin(result.id)" class="btn btn-blue-white px-4 py-2 rad text-white">Pending</b-button>  
                  </b-col>
                </b-row>
              </div>
            </div>
            <div class="text-center mt-3">
              <img v-if="searchResult == null" src="@/assets/img/illust/none.svg" class="w-50" alt="">
            </div>
          </div>
        </b-modal>
      </div>
      <b-modal size="md" ref="create-team" id="create-team" hide-footer hide-header centered>
        <div class="closable-modal text-center" @click="hideModal('create-team')"><font-awesome-icon icon="times"></font-awesome-icon></div>
        <div class="pt-3 px-3 pb-0">
          <h4 class="viga mb-3"><span v-if="teamModalCondition == 'create'">Buat Team Baru</span> <span v-if="teamModalCondition == 'edit'">Edit Team</span></h4>
          <b-form-input class="py-3 px-4 rad mb-2" v-model="formTeam.name" placeholder="name"></b-form-input>
          <b-form-select class="px-4 rad mb-2" v-model="formTeam.category">
            <b-form-select-option value="">Pilih Category Team</b-form-select-option>
            <b-form-select-option value="Media Partner">Media Partner</b-form-select-option>
            <b-form-select-option value="Studio Workshop">Studio Workshop</b-form-select-option>
            <b-form-select-option value="Magazine Store">Magazine Store</b-form-select-option>
            <b-form-select-option value="Book Store">Book Store</b-form-select-option>
            <b-form-select-option value="Startup Digital">Startup Digital</b-form-select-option>
            <b-form-select-option value="Other">Other</b-form-select-option>
          </b-form-select>
          <b-form-textarea rows="3" max-rows="4" class="p-3 rad mb-2" v-model="formTeam.description" placeholder="Description team"></b-form-textarea>
          <div class="text-right mt-3">
            <b-button class="btn btn-blue-white rad px-5 py-3 text-white" @click="onCreateTeam()">Buat Team</b-button>
          </div>
        </div>
      </b-modal>
      <div v-if="user.publisher != null">
        <div class="text-center pr-3 pl-2">
          <b-form-file accept="image/jpeg, image/png, image/jpg" class="d-none" v-model="avatarFileTeam" id="avatarFileTeam" @change="changeAvatarTeam"></b-form-file>
          <div class="avatar-dashboard-index position-relative">
            <img :src="`${web}images/team/logo/${user.publisher.avatar}`" @click="showModalImageUser('team')" alt="User Profile">
            <div class="overlay-black text-center" @click="clickFileTeam()">
              <font-awesome-icon icon="image" class="text-white my-4"></font-awesome-icon>
            </div>
          </div>
          <b-button v-if="user.level == 'Owner'" class="btn-edit-profile" @click="editTeam()"><font-awesome-icon icon="pen"></font-awesome-icon></b-button>
          <div class="pt-3 pr-3 pl-2">
            <h4 class="viga mb-0">{{ user.publisher.name }}</h4>
            <p class="text-sm">{{ user.publisher.category }}</p>
            <div v-if="user.publisher_id != null">
              <div class="teammate-profile-dashboard rad">
                <div class="profile-sm" v-for="team in teammate" :key="team.id">
                  <img :src="`${web}/images/user/avatar/${team.avatar}`" alt="Team profile">
                </div>
              </div>
            </div>
            <div v-if="user.publisher_id == null" class="text-left">
              <b-alert show variant="info" class="text-sm">
                Publisher masih belum ada.
              </b-alert>
            </div>
          </div>
        </div>
        <div class="text-left pr-3 pl-1 pt-3" v-show="getAsideDashboard == true">
          <h5 class="viga">Our Activity</h5>
          <div v-if="activities.count > 0">
            <div class="personal-activity w-100 p-1 mb-2">
              <b-row>
                <b-col cols="3">
                  <div class="profile-sm d-inline-block mt-2">
                    <img :src="`${web}/images/user/avatar/ninno-sm.png`" alt="Team profile">
                  </div>
                </b-col>
                <b-col cols="9" class="position-relative py-0">
                  <span class="d-inline-block m-0 text-sm font-weight-bold" style="font-size: .8rem !important">{{ user.name }}</span>
                  <span class="d-inline-block m-0 text-sm">Created magazines "Digital Magaz..."</span>
                  <div class="text-right position-absolute mb-0" style="top: 0px; right: 25px">
                    <span class="d-inline-block m-0 text-sm">Kemarin</span>
                  </div>
                </b-col>
              </b-row>
            </div>
          </div>
          <div v-if="activities.count == 0">
            <b-alert show variant="info" class="text-sm">
              Masih belum ada Aktifitas
            </b-alert>
          </div>
        </div>
      </div>
      <b-modal ref="img-user" id="img-user" hide-footer hide-header size="md">
        <div class="closable-modal text-center" @click="hideModal('img-user')"><font-awesome-icon icon="times"></font-awesome-icon></div>
        <div class="p-2">
          <img v-if="modalImg == 'user'" :src="`${web}images/user/avatar/${user.avatar}`" class="w-100 rad" alt="User Profile"> 
          <img v-if="modalImg == 'team'" :src="`${web}images/team/logo/${user.publisher.avatar}`" class="w-100 rad" alt="User Profile"> 
        </div>
      </b-modal>
      <b-modal ref="modal-avatar-team" id="modal-avatar-team" hide-footer centered hide-header size="md">
        <div class="closable-modal text-center" @click="hideModal('modal-avatar-team')"><font-awesome-icon icon="times"></font-awesome-icon></div>
        <div class="pt-3 px-3 pb-0">
          <h5 class="viga">Hai <span v-if="user.publisher_id != null">{{ user.publisher.name }}</span> Team. Kalian ingin mengganti logo team ?</h5>
          <div class="text-center">
            <b-form-file accept="image/jpeg, image/png, image/jpg" class="d-none" v-model="avatarFileTeam" @change="changeAvatarTeam"></b-form-file>
            <div class="avatar-dashboard-index position-relative">
              <img :src="`${web}images/team/logo/avatar.png`" alt="User Profile">
              <div class="overlay-black text-center" @click="clickFileTeam()">
                <font-awesome-icon  icon="image" class="text-white my-4"></font-awesome-icon>
              </div>
            </div>
          </div>
          <div class="text-right">
            <b-button class="btn btn-light rad px-5 py-3" @click="hideModal('modal-avatar-team')">Nanti saja</b-button>
          </div>
        </div>
      </b-modal>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import Loading from 'vue-loading-overlay'
export default {
  data() {
    return {
      displayAside: 'user',
      teammate: [],
      teamModalCondition: 'create',
      modalImg: 'user',
      formTeam: {
        name: '',
        category: '',
        description: '',
      },
      avatar: 'avatar.svg',
      publisher: {
        name: 'Sidescript',
        logo: 'sidescript.png',
        category: 'startup digital',
      },
      formUpdate: {
        username: '',
        email: '',
      },
      activities: {
        count: 0,
      },
      loading: {
        isLoading: false,
        transition: "fade",
        bgColor: "#000",
        color: "#0D6AE3",
        opacity: 0.85,
        loader: "dots",
        blur: "100px"
      },
      avatarFile: null,
      avatarFileTeam: null,
      searchResult: null,
      search: '',
    }
  },
  components: {
    Loading
  },
  mounted() {
    if(this.user.length == 0) {
      this.getUser()
      this.getTeammate()
    } else {
      this.avatar = this.user.avatar
      this.activities.count = this.user.activity.length
      this.formUpdate.email = this.user.email
      this.formUpdate.username = this.user.name
      this.getTeammate()
    }
  },
  computed: {
    ...mapGetters({
      api: 'Api/getApi',
      web: 'Api/getWeb',
      getAsideDashboard: 'Dashboard/getAsideDashboard',
      user: 'Auth/getUser',
      token: 'Auth/getToken',
    })
  },
  methods: {
    ...mapMutations('Auth', ['set_user', 'set_token']),
    getTeammate() {
      this.$http.get(`${this.api}publisher/teammate`, {
        headers: {
          'Authorization': `Bearer ${this.token}`
        }
      }).then((response) => {
        if(response.data.code == 200) {
          console.log(response)
          this.teammate = response.data.data.data
        }
      })
    },
    editTeam() {
      this.teamModalCondition = 'edit'
      this.formTeam.name = this.user.publisher.name
      this.formTeam.category = this.user.publisher.category
      this.formTeam.description = this.user.publisher.description
      this.$refs['create-team'].show()
    },
    onCancel() {
      console.log('Cancelled')
    },
    cancelJoin(teamId) {
      this.$http.get(`${this.api}user/cencel/req/publisher/${teamId}`, {
        headers: {
          'Authorization': `Bearer ${this.token}`
        }
      }).then((response) => {
        console.log(response)
        this.searchData()
      })
    },
    onCreateTeam() {
      this.$refs['create-team'].hide()
      this.loading.isLoading = true
      if(this.teamModalCondition == 'create') {
        this.$http.post(`${this.api}publisher`, {
          name: this.formTeam.name,
          category: this.formTeam.category,
          description: this.formTeam.description
        }, {
          headers: {
            'Authorization': `Bearer ${this.token}`
          }
        }).then((response) => {
          console.log(response)
          this.loading.isLoading = false
          if(response.data.code == 200) {
            this.$refs['modal-avatar-team'].show()
            this.getUser()
            this.$refs['modal-avatar-team'].show()
          }
        })
      } else {
        this.$http.post(`${this.api}publisher/${this.user.publisher_id}`, {
          name: this.formTeam.name,
          category: this.formTeam.category,
          description: this.formTeam.description
        }, {
          headers: {
            'Authorization': `Bearer ${this.token}`
          }
        }).then((response) => {
            this.loading.isLoading = false
            this.getUser()
        })
      }
    },
    joinTeam(teamId) {
      this.$http.get(`${this.api}user/req/publisher/${teamId}`, {
        headers: {
          'Authorization': `Bearer ${this.token}`
        }
      }).then((response) => {
        console.log(response)
        this.searchData()
      })
    },
    getUser() {
      this.$http.get(`${this.api}user/profile`, {
        headers: {
          'Authorization': `Bearer ${this.token}`
        }
      }).then((response) => {
        this.set_user(response.data.data)
        this.formUpdate.email = this.user.email
        this.formUpdate.username = this.user.name
        // console.log(this.formUpdate)
        this.set_token(response.data.data.api_token)
      }).catch((err) => {
        // console.log(err)
        if(401 === err.response.status) {
          err.response.status = 200
          console.log('Anda belum login')
        }
      })
    },
    clickFile() {
      document.getElementById('avatarFile').click()
    },
    clickFileTeam() {
      document.getElementById('avatarFileTeam').click()
    },
    changeAvatar(e) {
      this.avatarFile = e.target.files[0]
      console.log(this.avatarFile)
      this.loading.isLoading = true
      let avatarForm = new FormData()
      avatarForm.append('avatar', this.avatarFile)
      this.$http.post(`${this.api}upload/avatar/${this.user.id}`, avatarForm)
      .then((response) => {
        console.log(response)
        this.loading.isLoading = false
        this.getUser()
      })
    },
    changeAvatarTeam(e) {
      this.$refs['modal-avatar-team'].hide()
      this.loading.isLoading = true
      this.avatarFileTeam = e.target.files[0]
      console.log(this.avatarFileTeam)
      let avatarFormTeam = new FormData()
      avatarFormTeam.append('avatar', this.avatarFileTeam)
      this.$http.post(`${this.api}publisher/upload/${this.user.publisher_id}`, avatarFormTeam, {
        headers: {
          'Authorization': `Bearer ${this.token}`
        }
      })
      .then((response) => {
        console.log(response)
        this.getUser()
        this.loading.isLoading = false
      })
    },
    hideModal(ref) {
      this.$refs[ref].hide()
    },
    showModalImageUser(obj) {
      this.modalImg = obj
      this.$refs['img-user'].show()
    },
    setDisplay() {
      if(this.displayAside == 'user') {
        this.displayAside = 'team'
      } else {
        this.displayAside = 'user'
      }
    },
    updateUser() {
      this.$refs['edit-profile'].hide()
      this.loading.isLoading = true
      this.$http.post(`${this.api}user/${this.user.id}`, {
          name: this.formUpdate.username,
          email: this.formUpdate.email
        },
        {
        headers: {
          'Authorization': `Bearer ${this.token}`
        }
      }).then((response) => {
        this.loading.isLoading = false
        this.getUser()
      })
    }, 
    searchData() {
      if(this.search.length >= 3) {
        this.$http.post(`${this.api}q/publisher`, {
          name: this.search
        }, {
          headers: {
            'Authorization': `Bearer ${this.token}`
          }
        }).then((response) => {
          console.log(response.data.data)
          this.searchResult = response.data.data
          if(response.data.data.length == 0) {
            this.searchResult = null
          }
        })
      } else {
        this.searchResult = null
      }
    }
  }
}
</script>