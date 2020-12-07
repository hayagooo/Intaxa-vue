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
    <b-row>
      <b-col :class="{'col-lg-9 col-md-8': getAsideDashboard == true, 'col-md-11': getAsideDashboard == false}" class="position-relative">
        <div v-if="magazines.length > 0 || user.publisher_id != null" class="btn-fab-add-magazine mb-4 mr-5" @click="formMagazineShow('create')">
          <font-awesome-icon icon="plus"></font-awesome-icon>
        </div>
        <div v-if="magazines.length > 0 || user.publisher_id != null" class="btn-backup mb-4 mr-5" v-b-modal.modal-nyampah>
          <font-awesome-icon icon="trash"></font-awesome-icon>
        </div>
        <b-modal ref="modal-nyampah" id="modal-nyampah" size="lg" hide-footer hide-header>
        <div class="closable-modal text-center" @click="hideModal('modal-nyampah')"><font-awesome-icon icon="times"></font-awesome-icon></div>
          <div class="pt-3 px-3">
            <h3 class="viga mb-3">Data yang dihapus</h3>
            <div v-if="trasher != null">
              <div v-if="trasher.length > 0">
                <div class="card p-3 rad mb-3" v-for="trash in trasher" :key="trash.id">
                  <b-row>
                    <b-col lg="3" md="6" sm="6" cols="6" class="text-center">
                      <div class="preview-images mx-2">
                        <img :src="`${web}images/magazine/cover/${trash.cover}`" alt="Images">
                      </div>
                    </b-col>
                    <b-col lg="5" class="px-4 pt-5 pb-lg-3 pb-3" md="6" sm="6" cols="6">
                      <h5 class="viga">{{ trash.title }}</h5>
                      <p>Dihapus tanggal : <br> {{ trash.deleted_at }}</p>
                    </b-col>
                    <b-col lg="4" md="12" class="py-lg-5 py-0 text-right">
                      <b-button class="btn btn-blue-white py-3 px-5 rad text-white" @click="recoverMagazine(trash.id)">Kembalikan</b-button>
                    </b-col>
                  </b-row>
                </div>
              </div>
            </div>
            <div v-if="trasher == null || trasher.length <= 0">
              <b-alert variant="danger" dismissible show>Tidak ada data.</b-alert>
            </div>
          </div>
        </b-modal>
        <div class="bg-full-page bg-main" style="overflow-y: auto !important">
          <div class="btn-categories-magazine-topics position-relative pt-5 mt-5" style="z-index: 100" v-if="(categories != null && categories != undefined) && user.publisher_id != null">
            <slick :options="categorySlide" ref="categorySlide" class="categorySlide pt-4">
              <b-button :class="{'btn-blue-white shadow rad mx-2 px-5 text-white': categorySelect == 'Semua', 'btn-white shadow-sm rad mx-2 px-5': categorySelect != 'Semua'}" @click="getMagazine()">Semua</b-button>
              <b-button v-for="category in categories" :key="category.id" :class="{'btn-blue-white shadow rad mx-2 px-5 text-white': categorySelect == category.name, 'btn-white shadow-sm rad mx-2 px-5': categorySelect != category.name}" @click="getMagazineByCategory(category.id, category.name)">{{ category.name }}</b-button>
            </slick>
          </div>
          <div class="px-4 mt-0 pt-0 text-left" v-if="magazines.length > 0 && user.publisher_id != null">
            <h3 class="mt-2 viga">Magazine List</h3>
            <div class="w-100 mt-4">
              <b-row>
                <b-col class="cardMagazine mb-4" :class="{'col-md-4': getAsideDashboard == true, 'col-md-3': getAsideDashboard == false}" sm="6" cols="6" v-for="magazine in magazines" :key="magazine.id" @click="previewMagazine(magazine.id)">
                  <div class="previewMagazine" :class="{'active': magazine.id == activeMagazine}">
                    <div class="image">
                      <img :src="`${web}images/magazine/cover/${magazine.cover}`" alt="Magazine cover">
                    </div>
                  </div>
                  <div class="text-left pt-3 textMagazine">
                    <h5 class="viga mb-0">{{ magazine.title }}</h5>
                    <p class="text-sm">{{ magazine.date }}</p>
                  </div>
                </b-col>
              </b-row>
            </div>
          </div>
          <div class="pt-5 px-4 mt-5 mb-5" v-if="magazines.length == 0 || user.publisher_id == null">
            <b-row>
              <b-col md="6" offset-md="3">
                <div :class="{'mt-5': categorySelect == 'Semua'}">
                  <img src="@/assets/img/illust/no_data.svg" alt="No Magazine" width="250px">
                  <h3 class="viga mt-4">Belum ada majalah</h3>
                  <div v-if="categorySelect == 'Semua'">
                    <p>Pastikan kamu sudah bergabung dengan team yang ada, lalu buat majalah bersama.</p>
                    <b-button class="btn btn-light rad py-3 px-4 mx-2" :to="{name: 'DashboardTeams'}">Ke Team</b-button>
                    <b-button class="btn btn-blue-white rad py-3 px-4 mx-2 text-white" @click="formMagazineShow('create')">Buat majalah</b-button>
                  </div>
                </div>
              </b-col>
            </b-row>
          </div>
        </div>
      </b-col>
       <b-col :class="{'col-lg-3 col-md-4 col-6': getAsideDashboard == true, 'col-md-1 col-1 hide': getAsideDashboard == false}" class="position-md-fixed fixed-md-asideRight bg-full-page shadow bg-blue p-0" style="overflow: visible !important">
        <topic-preview ref="TopicPreview" :magazine-id="activeMagazine"/>
        <div class="toggleAsideRight bg-blue text-white" @click="toggleAside()" :class="{'hide': getAsideDashboard == false}">
          <font-awesome-icon icon="angle-right"></font-awesome-icon>
        </div>
      </b-col>
    </b-row>
    <b-modal id="form-magazine" ref="form-magazine" hide-header hide-footer centered size="xl">
      <div class="closable-modal text-center" @click="hideModal('form-magazine')"><font-awesome-icon icon="times"></font-awesome-icon></div>
      <div class="pt-0 pb-1 px-0 text-left">
        <b-row>
          <b-col lg="4" class="p-3 px-4">
            <h4 class="viga">
              <span v-if="formCondition == 'create'">Buat majalah baru</span>
            </h4>
            <h5 class="viga">Cover</h5>
            <b-form-file accept="image/jpeg, image/png, image/jpg" class="d-none" id="coverFile" @change="changeFile" v-model="formMagazine.cover"></b-form-file>
            <div class="text-center" @click="clickFile()">
              <div class="cardMagazine my-4 d-inline-block">
                <div class="previewMagazine">
                  <div class="image">
                    <img :src="`${formMagazine.src}`" alt="">
                  </div>
                </div>
              </div>
            </div>
          </b-col>
          <b-col lg="8" class="px-md-5 px-3 py-4 pb-5">
            <h5 class="viga">Data Majalah</h5>
            <label for="title">Judul Majalah</label>
            <b-form-input v-model="formMagazine.title" id="title" placeholder="Title magazine" class="py-3 px-4 rad"></b-form-input>
            <label class="mt-3" for="title">Kategori Majalah</label>
            <b-form-select v-model="formMagazine.category" id="category" class="px-4 rad">
              <b-form-select-option value="">Pilih Kategori</b-form-select-option>
              <b-form-select-option v-for="category in categories" :key="category.id" :value="category.id">{{ category.name }}</b-form-select-option>
              <b-form-select-option value="Lainnya">Tambahkan Lainnya</b-form-select-option>
            </b-form-select>
            <b-form-input  class="py-3 px-4 rad mt-2" v-model="formMagazine.categoryLain" v-if="formMagazine.category == 'Lainnya'" placeholder="Kategory Lain"></b-form-input>
            <label class="mt-3" for="deskripsi">Deskripsi Majalah (Optional)</label>
            <b-form-textarea rows="3" class="py-3 px-4 rad" placeholder="Description Magazine" max-rows="4" v-model="formMagazine.description"></b-form-textarea>
          </b-col>
          <b-col lg="12" class="border-top text-right pt-3">
            <b-button class="btn btn-blue-white px-5 py-3 text-white rad" @click="onSave()">Simpan</b-button>
          </b-col>
        </b-row>
      </div>
    </b-modal>
  </div>
</template>

<script>
import Slick from 'vue-slick'
import TopicPreview from '@/components/TopicPreview.vue'
import { mapGetters, mapMutations } from 'vuex'
import Loading from 'vue-loading-overlay'
export default {
  components: {
    TopicPreview,
    Slick,
    Loading,
  },
  data() {
    return {
      window: {
        width: 0,
        height: 0,
      },
      activeMagazine: 1,
      loading: {
        isLoading: false,
        transition: "fade",
        bgColor: "#000",
        color: "#0D6AE3",
        opacity: 0.85,
        loader: "dots",
        blur: "100px"
      },
      formCondition: 'create',
      trasher: [],
      categorySelect: 'Semua',
      categorySlide: {
        slidesToShow: 5,
        slidesToScroll: 1,
        infinite: false,
        variableWidth: true,
        // centerMode: true,
        dots: true,
        outerEdgeLimit: true,
        responsive: [
          {
            breakpoint: 650,
            settings: {
              slidesToShow: 2,
              slidesToScroll: 1,
              dots: true
            }
          },
          {
            breakpoint: 1100,
            settings: {
              slidesToShow: 3,
              slidesToScroll: 1,
              dots: true
            }
          },
        ]
      },
      formMagazine: {
        cover: null,
        description: '',
        title: '',
        categoryLain: '',
        category: '',
        src: ''
      },
      magazines: [
        {
          id: 1,
          title: 'Animal Standing',
          date: '12 Nov 2020',
          cover: '1.png',
        },
        {
          id: 2,
          title: 'Lake Cleanest',
          date: '11 Nov 2020',
          cover: '2.png',
        },
        {
          id: 3,
          title: 'Tarik siss, semongko',
          date: '10 Nov 2020',
          cover: '3.png',
        },
        {
          id: 4,
          title: 'Anjing penjaga',
          date: '09 Nov 2020',
          cover: '4.png',
        },
        {
          id: 5,
          title: 'Kereta api',
          date: '08 Nov 2020',
          cover: '5.png',
        }
      ],
      categories: null
    }
  },
  created() {
    window.addEventListener('resize', this.handleResize)
    this.handleResize()
    this.getMagazine()
    this.getCategoryMagazine()
    this.getTrasher()
  },
  mounted() {
    this.formMagazine.src = this.web+'images/team/logo/avatar.png'
    this.getAuth()
    this.$root.$on('getData', () => {
      this.getMagazine()
      this.getCategoryMagazine()
      this.getTrasher()
    })
  },
  destroyed() {
    window.removeEventListener('resize', this.handleResize)
  },
  computed: {
    ...mapGetters({
      api: 'Api/getApi',
      web: 'Api/getWeb',
      getAsideDashboard: 'Dashboard/getAsideDashboard',
      showAside: 'Dashboard/getShowAside',
      user: 'Auth/getUser',
      token: 'Auth/getToken',
    })
  },
  methods: {
    ...mapMutations("Dashboard", ["set_asideDashboard", "set_showAside"]),
    ...mapMutations('Auth', ['set_user', 'set_token']),
    getCategoryMagazine() {
      this.$http.get(`${this.api}category/magazine`).then((response) => {
        this.categories = response.data.data
      })
    },
    getAuth() {
      this.$http.get(`${this.api}user/profile`, {
        headers: {
          'Authorization': `Bearer ${this.token}`
        }
      }).then((response) => {
        this.set_user(response.data.data)
        console.log(this.user)
      })
    },
    clickFile() {
      document.getElementById('coverFile').click()
    },
    changeFile(e) {
      let url = e.target.files[0];
      this.formMagazine.src = URL.createObjectURL(url)
    },
    formMagazineShow(method) {
      this.formCondition = method
      this.$refs['form-magazine'].show()
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
    },
    hideModal(ref) {
      this.$refs[ref].hide()
    },
    getMagazine() {
      this.$http.get(`${this.api}magazine`).then((response) => {
        this.magazines = response.data.data.data
        this.categorySelect = 'Semua'
        this.activeMagazine = this.magazines[0].id
      })
    },
    getMagazineByCategory(id, name) {
      this.$http.post(`${this.api}q/magazine`, {
        category: id
      }).then((response) => {
        console.log(response)
        this.magazines = response.data.data.data
        this.categorySelect = name
        // this.activeMagazine = this.magazines[0].id
      })
    },
    onSave() {
      this.$refs['form-magazine'].hide()
      this.loading.isLoading = true
      console.log(this.formMagazine.cover)
      let formData = new FormData()
      formData.append('title', this.formMagazine.title)
      formData.append('cover', this.formMagazine.cover)
      formData.append('description', this.formMagazine.description)
      formData.append('category', this.formMagazine.category)
      formData.append('otherCategory', this.formMagazine.categoryLain)
      formData.append('author', this.user.id)
      if(this.formCondition == 'create') {
        this.$http.post(`${this.api}magazine`, formData).then((response) => {
          this.getMagazine()
          this.loading.isLoading = false
          this.$refs.TopicPreview.showMagazine()
        })
      } else if(this.formCondition == 'edit') {
        formData.append('_method', 'PATCH')
        this.$http.post(`${this.api}magazine/${activeMagazine}`, formData).then((response) => {
          this.getMagazine()
          this.loading.isLoading = false
          this.$refs.TopicPreview.showMagazine()
        })
      }
    },
    onCancel() {
      console.log('cancelled')
    },
    handleResize() {
      this.window.width = window.innerWidth
      if(this.window.width < 960) {
        this.set_asideDashboard(false)
      } else {
        this.set_asideDashboard(true)
      }
    },
    previewMagazine(id) {
      this.activeMagazine = id
    },
    getTrasher() {
      this.$http.get(`${this.api}deleted/magazine`).then((response) => {
        console.log(response)
        this.trasher = response.data.data
      })
    },
    recoverMagazine(id) {
      this.$http.get(`${this.api}recover/magazine/${id}`).then((response) => {
        this.getMagazine()
        this.getTrasher()
        this.$refs.TopicPreview.showMagazine()
      })
    }
  },
}
</script>