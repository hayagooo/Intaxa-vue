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
    <b-container v-if="user.publisher != null && user.publisher != undefined" fluid class="bg-full-page bg-main pt-5 px-5">
      <b-row class="pt-5 mt-4">
        <b-col lg="3" md="4" class="pb-5">
          <div class="profile-preview">
            <div v-if="isAuth && user != null && user != undefined" class="image" @click="previewImage(user.publisher.avatar)">
              <img :src="`${web}images/team/logo/${user.publisher.avatar}`" alt="User Avatar">
            </div>
            <b-button class="btn-change" @click="clickFile" v-if="user.level == 'Owner'">
              <font-awesome-icon icon="pen"></font-awesome-icon>
            </b-button>
            <b-form-file id="file" v-if="user.level == 'Owner'" class="d-none" accept="image/jpeg, image/png, image/jpg" @change="onChange"></b-form-file>
          </div>
          <div class="w-100 cover text-left">
            <div class="item-menu-profile pb-0 pt-3" :class="{'active': modeProfile == 'detail'}" @click="setModeProfile('detail')">
              <font-awesome-icon icon="info-circle"></font-awesome-icon>
              <p class="d-inline-block ml-3">Detail Team</p>
            </div>
            <div v-if="user.level == 'Owner'" class="item-menu-profile pb-0 pt-3" :class="{'active': modeProfile == 'edit'}" @click="setModeProfile('edit')">
              <font-awesome-icon icon="pen"></font-awesome-icon>
              <p class="d-inline-block ml-3">Edit Team</p>
            </div>
            <div class="item-menu-profile pb-0 pt-3" :class="{'active': modeProfile == 'task'}" @click="setModeProfile('task')">
              <font-awesome-icon icon="tasks"></font-awesome-icon>
              <p class="d-inline-block ml-3">Task</p>
            </div>
            <div v-if="user.level == 'Owner'" class="item-menu-profile pb-0 pt-3" :class="{'active': modeProfile == 'join'}" @click="setModeProfile('join')">
              <font-awesome-icon icon="envelope"></font-awesome-icon>
              <p class="d-inline-block ml-3">Request Join</p>
            </div>
          </div>
        </b-col>
        <b-col lg="9" md="8">
          <div class="w-100 bg-white rad p-3">
            <div v-if="modeProfile == 'detail'" class="text-left">
              <h4 class="viga">{{ user.publisher.name }}</h4>
              <div v-if="teams != null">
                <div v-for="team in teams" :key="team.id">
                  <div class="w-100 mb-3 p-3 shadow-sm rad">
                    <b-row>
                      <b-col lg="3" cols="3">
                        <div class="team-profile" @click="showUserAvatar(team.avatar)">
                          <img :src="`${web}images/user/avatar/${team.avatar}`" alt="User Avatar">
                        </div>
                      </b-col>
                      <b-col lg="4" cols="9" class="pt-2">
                        <h4 class="viga mb-1">{{ team.name }}</h4>
                        <p class="mb-0">{{ team.email }}</p>
                      </b-col>
                      <b-col lg="5" cols="12">
                        <div v-if="team.level == 'Owner'" class="text-right">
                          <div class="px-5 py-3 bg-blue rad text-white d-inline-block text-center">{{ team.level }}</div>
                        </div>
                        <div v-if="user.level == 'Owner' && team.level != 'Owner'" class="text-right pt-3">
                          <b-form-select name="permission" :value="team.level" @change="setPermission(team.id, $event)" class="form-control d-inline-block rad pl-3 pr-5 w-50">
                            <b-form-select-option value="Member">Member</b-form-select-option>
                            <b-form-select-option value="Admin">Admin</b-form-select-option>
                          </b-form-select>
                          <b-button variant="danger" class="px-3 py-2 mx-2 rad" @click="kick(team.id)">Kick</b-button>
                        </div>
                        <div v-if="user.level != 'Owner' && team.level != 'Owner'" class="text-right">
                          <div class="px-5 py-3 bg-blue rad text-white d-inline-block text-center">{{ team.level }}</div>
                        </div>
                      </b-col>
                    </b-row>
                  </div>
                </div>
              </div>
            </div>
            <div v-if="modeProfile == 'task'" class="text-left">
              <div v-if="tasks !== null && tasks.length !== 0">
              <b-row class="pb-5">
                <b-col cols="8">
                  <h4 class="viga">Task Team {{ user.publisher.name }}</h4>
                </b-col>
                <b-col cols="4" class="text-right">
                  <b-button class="btn btn-blue-white px-5 py-2 rad text-white">Tambah Task</b-button>
                </b-col>
              </b-row>
              <div class="w-100 p-3 rad shadow-sm position-relative" v-for="task in tasks" :key="task.id">
                <div class="bg-blue rad px-3 d-inline-block text-center py-1 text-white shadow position-absolute" style="left: -10px; top: -15px; font-size: .8rem">{{ task.type }}</div>
                <b-row>
                  <b-col lg="4" md="6" cols="6" class="text-center">
                    <h5 class="viga mb-0 mt-2">{{ task.title }}</h5>
                    <p class="mb-0 text-sm"><font-awesome-icon icon="hourglass-end"></font-awesome-icon>: {{ task.due_date }}</p> 
                  </b-col>
                  <b-col lg="4" md="6" cols="6" class="text-center">
                    <b-button :class="{'btn-blue-white d-inline-block px-4 text-white py-2 rad': task.status == 'Done', 'btn-white border-primary d-inline-block px-4 py-2 rad': task.status == 'Active'}" style="font-size: .8rem" @click="toggleStatus(task.status, task.id)">{{ task.status }}</b-button>
                  </b-col>
                  <b-col lg="4" md="6" cols="12" class="pt-md-0 pt-4">
                    <div v-if="task.user != null">
                      <div class="teammate-profile-dashboard rad">
                        <div class="profile-sm" v-for="(team, index) in task.user" :key="index" v-if="index < 4" :class="{'overflow-auto pl-2 w-auto d-inline-block bg-white': index == 3}">
                          <img :src="`${web}/images/user/avatar/${team.avatar}`" @click="showUserAvatar(team.avatar)" v-if="index < 3" alt="Team profile">
                          <div v-else class="position-relative w-100 h-100 bg-white pl-1" style="left: 0px; top: 0px; font-size: .8rem; line-height: 30px">
                            {{ parseInt(task.user.length) - 3 }}+
                          </div>
                        </div>
                      </div>
                    </div>
                  </b-col>
                  <b-col lg="12" md="12" cols="12" class="text-right pt-md-3 pt-2">
                    <b-button class="rad btn-sm btn-white text-blue border-primary px-3 py-2" @click="showTask(task.id)"><font-awesome-icon icon="eye"></font-awesome-icon></b-button>
                    <b-button v-if="user.level == 'Owner' || user.level == 'Admin'" @click="editTask(task.id)" class="rad btn-sm btn-blue-white text-white border-0 mx-1 px-3 py-2"><font-awesome-icon icon="pen"></font-awesome-icon></b-button>
                    <b-button v-if="user.level == 'Owner' || user.level == 'Admin'" @click="deleteTask(task.id)" variant="danger" class="rad btn-sm px-3 py-2"><font-awesome-icon icon="trash"></font-awesome-icon></b-button>
                  </b-col>
                </b-row>
              </div>
              </div>
              <div v-else>
                <b-row class="text-center">
                  <b-col md="6" offset-md="3" class="my-4">
                    <img src="@/assets/img/illust/no_data.svg" class="w-75" alt="No data">
                    <h4 class="viga mt-3">Tidak ada task</h4>
                  </b-col>
                </b-row>
              </div>
            </div>
            <div v-if="modeProfile == 'join'" class="text-left">
              <div v-if="pending !== null && pending.length !== 0">
                <h4 class="viga">Meminta untuk bergabung dengan {{ user.publisher.name }}</h4>
                <div v-for="team in pending" :key="team.id">
                  <div class="w-100 p-3 shadow-sm rad">
                    <b-row>
                      <b-col md="3" cols="3">
                        <div class="team-profile">
                          <img :src="`${web}images/user/avatar/${team.user.avatar}`" alt="User Avatar">
                        </div>
                      </b-col>
                      <b-col md="4" cols="9" class="pt-2">
                        <h4 class="viga mb-1">{{ team.user.name }}</h4>
                        <p class="mb-0">{{ team.user.email }}</p>
                      </b-col>
                      <b-col md="5" cols="12" class="pt-3 text-right">
                        <b-button class="px-3 btn-blue-white text-white py-2 mx-2 rad" @click="acceptRequest(team.user_id, team.publisher_id)"><font-awesome-icon icon="check"></font-awesome-icon></b-button>
                        <b-button variant="danger" class="px-3 py-2 rad" @click="rejectRequest(team.user_id, team.publisher_id)"><font-awesome-icon icon="trash"></font-awesome-icon></b-button>
                      </b-col>
                    </b-row>
                  </div>
                </div>
              </div>
              <div v-if="pending == null || pending.length == 0" class="text-center">
                <b-row>
                  <b-col md="6" offset-md="3" class="my-4">
                    <img src="@/assets/img/illust/no_data.svg" class="w-75" alt="No data">
                    <h4 class="viga mt-3">Tidak ada yang join</h4>
                  </b-col>
                </b-row>
              </div>
            </div>
            <div v-if="(modeProfile == 'edit') && (user.level == 'Owner' || user.level == 'Admin')" class="text-left">
              <b-row>
                <b-col lg="6" offset-lg="3" md="8" offset-md="2" class="py-3">
                  <label for="name">Name Team</label>
                  <b-form-input id="name" placeholder="Team name" class="p-3 rad"  v-model="formTeam.name"></b-form-input>
                  <label for="categoy" class="mt-3">Category Team</label>
                  <b-form-select id="category" class="rad" v-model="formTeam.category">
                    <b-form-select-option value="Media Partner">Media Partner</b-form-select-option>
                    <b-form-select-option value="Studio Workshop">Studio Workshop</b-form-select-option>
                    <b-form-select-option value="Magazine Store">Magazine Store</b-form-select-option>
                    <b-form-select-option value="Book Store">Book Store</b-form-select-option>
                    <b-form-select-option value="Startup Digital">Startup Digital</b-form-select-option>
                    <b-form-select-option value="Other">Other</b-form-select-option>
                  </b-form-select>
                  <label for="categoy" class="mt-3">Description</label>
                  <b-form-textarea class="rad" v-model="formTeam.description" rows="3" max-rows="5" placeholder="Team description">{{ formTeam.description }}</b-form-textarea>
                  <div class="text-left">
                    <b-button class="btn-blue-white text-white px-5 py-3 rad mt-3" @click="setTeams">Simpan</b-button>
                  </div>
                </b-col>
              </b-row>
            </div>
          </div>
        </b-col>
      </b-row>
      <b-modal ref="modal-image" id="modal-image" centered hide-footer hide-header>
        <div class="closable-modal text-center" @click="hideModal('modal-image')"><font-awesome-icon icon="times"></font-awesome-icon></div>
        <img :src="`${web}images/team/logo/${avatar}`" class="w-100 rad" alt="User Avatar">
      </b-modal>
      <b-modal ref="modal-image-user" id="modal-image-user" centered hide-footer hide-header>
        <div class="closable-modal text-center" @click="hideModal('modal-image-user')"><font-awesome-icon icon="times"></font-awesome-icon></div>
        <img :src="`${web}images/user/avatar/${avatar}`" class="w-100 rad" alt="User Avatar">
      </b-modal>
      <b-modal ref="modal-show-task" id="modal-show-task" size="lg" centered hide-footer hide-header>
        <div class="closable-modal text-center" @click="hideModal('modal-show-task')"><font-awesome-icon icon="times"></font-awesome-icon></div>
        <div v-if="taskShow != null">
          <b-row>
            <b-col md="7">
              <h4 class="viga">{{ taskShow.title }}</h4>
              <p class="text-sm mb-2 pl-2">Deadline {{ taskShow.due_date }}</p>
              <div class="d-inline-block px-5 py-2 rad bg-blue text-white">{{ taskShow.type }}</div>
            </b-col>
            <b-col md="5" class="pt-md-3 pt-2 text-right" v-if="taskShow.user != null && taskShow.user != undefined">
              <div class="teammate-profile-dashboard rad mt-3">
                <div class="profile-sm" style="overflow: visible !important" v-for="team in taskShow.user" :key="team.id">
                  <div class="images position-absolute w-100 h-100 overflow-hidden rad" style="left: 0; top: 0">
                    <img :id="`${team.email}`" :src="`${web}/images/user/avatar/${team.avatar}`" @click="showUserAvatar(team.avatar)" alt="Team profile">
                  </div>
                  <b-popover
                  :target="`${team.email}`"
                  placement="top"
                  triggers="hover focus"
                  :title="`${team.name}`"></b-popover>
                </div>
              </div>
            </b-col>
          </b-row>
          <b-form-textarea rows="7" max-rows="10" class="rad mt-2" disabled :value="taskShow.description"></b-form-textarea>
        </div>
      </b-modal>
      <b-modal ref="modal-form-task" id="modal-form-task" hide-footer></b-modal>
    </b-container>
    <b-container v-else class="pt-5">
      <b-row class="pt-5">
        <b-col md="6" offset-md="3" class="text-center pt-5">
          <img src="@/assets/img/illust/no_data.svg" class="w-75" alt="No data">
          <h3 class="viga text-blue mt-4">Anda Belum Punya Team</h3>
          <button class="btn btn-blue-white text-white mx-2 rad px-5 py-3">Buat Baru</button>
          <button class="btn btn-white rad px-5 py-3 mx-2">Join Team</button>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<style lang="scss">
@import '@/assets/css/dashboard/profile.scss';
</style>

<script>
import { mapGetters, mapMutations } from 'vuex'
import Loading from 'vue-loading-overlay'
export default {
  components: {
    Loading
  },
  data() {
    return {
      modeProfile: 'detail',
      avatar: '',
      teams: null,
      formTeam: {
        name: '',
        category: '',
        description: '',
      },
      pending: null,
      tasks: null,
      taskUser: null,
      loading: {
        isLoading: false,
        transition: "fade",
        bgColor: "#000",
        color: "#0D6AE3",
        opacity: 0.85,
        loader: "dots",
        blur: "100px"
      },
      permission: '',
      taskShow: null,
    }
  },
  created() {
    this.getAuth()
    this.getPublisher()
    this.getPending()
    this.getTask()
  },
  computed: {
    ...mapGetters({
      user: 'Auth/getUser',
      token: 'Auth/getToken',
      isAuth: 'Auth/isAuth',
      api: 'Api/getApi',
      web: 'Api/getWeb',
    })
  },
  methods: {
    ...mapMutations('Auth', ['set_user', 'set_token']),
    editTask(id) {
      this.$http.get(`${this.api}task/${id}`, {
        headers: {
          'Authorization': `Bearer ${this.token}`
        }
      }).then((response) => {
        this.$refs['modal-create-task'].show()
      })
    },
    getAuth() {
      this.$http.get(`${this.api}user/profile`, {
        headers: {
          'Authorization': `Bearer ${this.token}`
        }
      }).then((response) => {
        this.set_user(response.data.data)
        this.email = response.data.data.email
        this.name = response.data.data.name
        this.formTeam.name = response.data.data.publisher.name
        this.formTeam.category = response.data.data.publisher.category
        this.formTeam.description = response.data.data.publisher.description
      })
    },
    showTask(id) {
      this.$http.get(`${this.api}task/${id}`, {
        headers: {
          'Authorization': `Bearer ${this.token}`
        }
      }).then((response) => {
        console.log(response)
        this.$refs['modal-show-task'].show()
        this.taskShow = response.data.data
      })
    },
    getTask() {
      this.$http.get(`${this.api}task`, {
        headers: {
          'Authorization': `Bearer ${this.token}`
        }
      }).then((response) => {
        this.taskUser = response.data.data.user
        this.tasks = response.data.data
        console.log(this.tasks)
      })
    },
    showUserAvatar(avatar) {
      this.avatar = avatar
      this.$refs['modal-image-user'].show()
    },
    getPublisher() {
      this.$http.get(`${this.api}publisher/teammate`, {
        headers: {
          'Authorization': `Bearer ${this.token}`
        }
      }).then((response) => {
        console.log(response.data.data)
        this.teams = response.data.data.data
      })
    },
    toggleStatus(stats, id) {
      let status = ''
      if(stats == 'Active') {
        status = 'Done'        
      } else {
        status = 'Active'
      }
      this.$http.post(`${this.api}stats/task/${id}`, {
        stat: status
      },{
        headers: {
          'Authorization': `Bearer ${this.token}`
        }
      }).then((response) => {
        this.getTask()
      })
    },
    onCancel() {
      console.log('Cancelled')
    },
    acceptRequest(user, publisher) {
      this.$http.post(`${this.api}req/accept/publisher`, {
        userId: user,
        publisherId: publisher
      }, {
        headers: {
          'Authorization': `Bearer ${this.token}`
        }
      }).then((response) => {
        this.getAuth()
        this.getPublisher()
        this.getPending()
      })
    },
    clickFile() {
      document.getElementById('file').click()
    },
    rejectRequest(user, publisher) {
      this.$http.post(`${this.api}req/reject/publisher`, {
        userId: user,
        publisherId: publisher
      }, {
        headers: {
          'Authorization': `Bearer ${this.token}`
        }
      }).then((response) => {
        this.getAuth()
        this.getPublisher()
        this.getPending()
      })
    },
    setPermission(id, e) {
      let position = e
      this.$http.post(`${this.api}permission/publisher`, {
        userId: id,
        permission: e
      }, {
        headers: {
          'Authorization': `Bearer ${this.token}`
        }
      }).then((response) => {
        this.getAuth()
        this.getPublisher()
        this.getPending()
      })
    },
    setTeams() {
      this.loading.isLoading = true
      this.$http.post(`${this.api}publisher/${this.user.publisher_id}`, {
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
        this.getAuth()
        this.getPublisher()
        this.getPending()
      })
    },
    kick(id) {
      this.$http.get(`${this.api}kick/user/${id}`, {
        headers: {
          'Authorization': `Bearer ${this.token}`
        }
      }).then((response) => {
        this.getAuth()
        this.getPublisher()
        this.getPending()
      })
    },
    getPending() {
      this.$http.get(`${this.api}publisher/pending`, {
        headers: {
          'Authorization': `Bearer ${this.token}`
        }
      }).then((response) => {
        this.pending = response.data.data
      })
    },
    onChange(e) {
      this.loading.isLoading = true
      let file = e.target.files[0]
      let formData = new FormData()
      formData.append('avatar', file)
      this.$http.post(`${this.api}publisher/upload/${this.user.publisher_id}`, formData, {
        headers: {
          'Authorization': `Bearer ${this.token}`
        }
      }).then((response) => {
        this.loading.isLoading = false
        this.getPublisher()
        this.getPending()
        this.getAuth()
      })
    },
    hideModal(ref) {
      this.$refs[ref].hide()
    },
    previewImage(avatar) {
      this.$refs['modal-image'].show()
      this.avatar = avatar
    },
    setModeProfile(mode) {
      this.modeProfile = mode
    }
  }
}
</script>