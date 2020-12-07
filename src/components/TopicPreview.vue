<template>
  <div v-if="magazines !== undefined && magazines !== null">
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
    <div v-if="magazines !== undefined && magazines.length > 0 && user.publisher_id != null">
      <b-link class="position-absolute btn-detail-magazine-topic viga" :to="{name: 'DashboardTopics', params: {id: magazineId}}" style="z-index: 10">
        <h5 class="mb-0">
          <font-awesome-icon icon="eye" :class="{'mr-2': getAsideDashboard == true}"></font-awesome-icon>
          <span v-show="getAsideDashboard == true">Lebih detail</span>
        </h5>
      </b-link>
      <div class="w-100 bg-full-page bg-main" style="overflow-y: auto !important">
        <div class="cover-preview-magazine-topic" :style="`background-image: url('${web}images/magazine/cover/${magazines.find(magazine => magazine.id === magazineId).cover}')`">
          <!-- <img :src="`${web}images/magazine/cover/${magazines.find(magazine => magazine.id === magazineId).cover}`" alt=""> -->
        </div>
        <div class="p-3 pt-5 text-left text-white position-relative" v-show="getAsideDashboard == true">
          <div class="btn-update-delete-magazine">
            <button class="btn-update" @click="editMagazine(magazines.find(magazine => magazine.id === magazineId).id)"><font-awesome-icon icon="pen"></font-awesome-icon></button>
            <button class="btn-delete ml-2" v-b-modal.delete-magazine><font-awesome-icon icon="trash"></font-awesome-icon></button>
          </div>
          <h4 class="viga mb-1">{{ magazines.find(magazine => magazine.id === magazineId).title }}</h4>
          <p class="text-sm mb-1">{{ magazines.find(magazine => magazine.id === magazineId).created_at }}</p>
          <p class="text-sm mb-3">
            <font-awesome-icon icon="star" class="text-warning mr-1"></font-awesome-icon>
            <font-awesome-icon icon="star" class="text-warning mr-1"></font-awesome-icon>
            <font-awesome-icon icon="star" class="text-warning mr-1"></font-awesome-icon>
            <font-awesome-icon icon="star" class="text-warning mr-1"></font-awesome-icon>
            <font-awesome-icon icon="star" class="text-warning mr-1"></font-awesome-icon>
            <span class="font-weight-bold">4.8/5.0</span>
          </p>
          <p class="text-sm mb-4">{{ magazines.find(magazine => magazine.id === magazineId).description }}</p>
          <div v-if="magazines.find(magazine => magazine.id === magazineId).topic !== undefined">
            <div v-if="magazines.find(magazine => magazine.id === magazineId).topic.length > 0">
              <h5 class="viga">Recently Topic</h5>
              <div class="pr-md-2 pr-0 mb-5 pb-4">
                <div class="topics-topic-highlight" :style="`background-image: url('${web}images/magazine/topic/${magazines.find(magazine => magazine.id === magazineId).topic[0].cover}')`"></div>
                <h5 class="viga mt-1">{{ magazines.find(magazine => magazine.id === magazineId).topic[0].title }}</h5>
                <p class="text-sm mb-4">{{ magazines.find(magazine => magazine.id === magazineId).topic[0].created_at }}</p>
                <p class="text-sm mb-4">{{ magazines.find(magazine => magazine.id === magazineId).topic[0].description }}</p>
              </div>
            </div>
            <div v-else>
              <b-alert variant="info" show class="rad">
                <h5 class="viga">Belum ada artikel atau topic</h5>
                <p class="text-sm mb-0">Masuk ke detail majalah untuk menambah artikel atau topic</p>
              </b-alert>
            </div>  
          </div>
          <div v-else>
            <b-alert variant="info" show class="rad">
              <h5 class="viga">Belum ada artikel atau topic</h5>
              <p class="text-sm mb-0">Masuk ke detail majalah untuk menambah artikel atau topic</p>
            </b-alert>
          </div>
        </div>
      </div>
    </div>
    <div v-if=" magazines !== undefined && magazines.length == 0 || user.publisher_id == null">
      <div class="bg-white w-100 mb-4 cover-preview-magazine-topic bg-white p-4">
        <img src="@/assets/img/illust/preview.svg" alt="Preview" width="100px">
      </div>
      <div class="text-left px-4 text-white">
        <h4 class="viga mb-1">Tidak ada majalah yang bisa dipilih.</h4>
        <p class="text-sm my-4">Gabung team dan bersama sama buat majalah semenarik mungkin.</p>
      </div>
    </div>
    <b-modal size="xl" hide-footer hide-header centered ref="edit-modal" id="edit-modal">
      <div class="closable-modal text-center" @click="hideModal('edit-modal')"><font-awesome-icon icon="times"></font-awesome-icon></div>
      <div class="pt-0 pb-1 px-0 text-left">
        <b-row>
          <b-col lg="4" class="p-3 px-4">
            <h4 class="viga">
              <span v-if="formCondition == 'edit'">Edit Majalah</span>
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
              <b-form-select-option v-for="category in categories" :key="category.id" :value="category.id">{{ category.name }}</b-form-select-option>
              <b-form-select-option value="Lainnya">Tambahkan Lainnya</b-form-select-option>
            </b-form-select>
            <b-form-input  class="py-3 px-4 rad mt-2" v-model="formMagazine.categoryLain" v-if="formMagazine.category == 'Lainnya'" placeholder="Kategory Lain"></b-form-input>
            <label class="mt-3" for="deskripsi">Deskripsi Majalah (Optional)</label>
            <b-form-textarea rows="3" class="py-3 px-4 rad" placeholder="Description Magazine" max-rows="4" v-model="formMagazine.description"></b-form-textarea>
          </b-col>
          <b-col lg="12" class="border-top text-right pt-3">
            <b-button class="btn btn-blue-white px-5 py-3 text-white rad" @click="onSave()">Update</b-button>
          </b-col>
        </b-row>
      </div>
    </b-modal>
    <b-modal id="delete-magazine" ref="delete-magazine" class="text-center" hide-footer hide-header centered>
      <div class="closable-modal text-center" @click="hideModal('delete-magazine')"><font-awesome-icon icon="times"></font-awesome-icon></div>
      <div class="text-center">
        <img src="@/assets/img/illust/delete.svg" class="my-4" width="250px" alt="Yakin hapus ?">
        <h5>Yakin mau dihapus ?</h5>
      </div>
      <div class="text-center mt-5">
        <b-button variant="light" class="py-3 px-4 btn-sm mx-3 rad" @click="destroyMagazine('temporary')">Hapus dari linimasa</b-button>
        <b-button variant="danger" class="py-3 px-5 btn-sm rad" @click="destroyMagazine('permanent')">Hapus Permanent</b-button>
      </div>
    </b-modal>
  </div>
</template>

<style lang="scss">
@import '@/assets/css/dashboard/style.scss';
@import '@/assets/css/dashboard/magazine.scss';
</style>

<script>
import { mapGetters, mapMutations } from 'vuex'
import Loading from 'vue-loading-overlay'
export default {
  props: ['magazineId'],
  components: {
    Loading
  },
  data() {
    return {
      editId: 1,
      loading: {
        isLoading: false,
        transition: "fade",
        bgColor: "#000",
        color: "#0D6AE3",
        opacity: 0.85,
        loader: "dots",
        blur: "100px"
      },
      formCondition: 'edit',
      formMagazine: {
        cover: null,
        description: '',
        title: '',
        categoryLain: '',
        category: '',
        src: ''
      },
      categories: [],
      magazines: [
        {
          id: 1,
          title: 'Animal Standing',
          date: '12 Nov 2020',
          cover: '1.png',
          hightTopic: 'Human and zoo',
        },
        {
          id: 2,
          title: 'Lake Cleanest',
          date: '11 Nov 2020',
          cover: '2.png',
          hightTopic: 'Monster inside river',
        },
        {
          id: 3,
          title: 'Tarik siss, semongko',
          date: '10 Nov 2020',
          cover: '3.png',
          hightTopic: 'Konser meriah',
        },
        {
          id: 4,
          title: 'Anjing penjaga',
          date: '09 Nov 2020',
          cover: '4.png',
          hightTopic: 'Santai dijaga anjing',
        },
        {
          id: 5,
          title: 'Kereta api',
          date: '08 Nov 2020',
          cover: '5.png',
          hightTopic: 'Berpetualang',
        }
      ],
    }
  },
  mounted() {
    this.magazines.length = 0
  },
  created() {
    this.getAuth()
    this.showMagazine()
    this.getCategory()
    this.formMagazine.src = this.web+'/images/magazine/cover/'+this.magazines[0].cover
  },
  computed: {
    ...mapGetters({
      api: 'Api/getApi',
      web: 'Api/getWeb',
      token: 'Auth/getToken',
      user: 'Auth/getUser',
      getAsideDashboard: 'Dashboard/getAsideDashboard'
    })
  },
  methods: {
    ...mapMutations('Auth', ['set_user', 'set_token']),
    getCategory() {
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
    showMagazine() {
      this.$http.get(`${this.api}magazine`).then((response) => {
        this.magazines = response.data.data.data
        console.log(this.magazines)
      })
    },
    changeFile(e) {
      let url = e.target.files[0];
      this.formMagazine.src = URL.createObjectURL(url)
    },
    clickFile() {
      document.getElementById('coverFile').click()
    },
    editMagazine(id) {
      this.editId = id
      this.$refs['edit-modal'].show()
      this.$http.get(`${this.api}magazine/${id}`).then((response) => {
        this.formMagazine.title = response.data.data.title
        this.formMagazine.category = response.data.data.category_id
        this.formMagazine.description = response.data.data.description
        this.formMagazine.src = this.web+'images/magazine/cover/'+response.data.data.cover
      })
    },
    onSave() {
      this.$refs['edit-modal'].hide()
      this.loading.isLoading = true
      let formData = new FormData()
      formData.append('title', this.formMagazine.title)
      formData.append('author', this.user.id)
      formData.append('cover', this.formMagazine.cover)
      formData.append('description', this.formMagazine.description)
      formData.append('category', this.formMagazine.category)
      formData.append('_method', 'PATCH')
      formData.append('otherCategory', this.formMagazine.categoryLain)
      console.log(formData)
      this.$http.post(`${this.api}magazine/${this.magazineId}`, formData).then((response) => {
        console.log(response)
        this.showMagazine()
        this.getCategory()
        this.$root.$emit('getData')
        this.loading.isLoading = false
      })
      // alert(this.magazineId)
    },
    deleteMagazine() {
      
    },
    onCancel() {
      console.log('Cancelled')
    },
    hideModal(ref) {
      this.$refs[ref].hide()
    },
    destroyMagazine(type) {
      this.$refs['delete-magazine'].hide()
      this.loading.isLoading = true
      if(type == 'permanent') {
        this.$http.delete(`${this.api}magazine/${this.magazineId}`).then((response) => {
          console.log(response)
          this.showMagazine()
          this.getCategory()
          this.$root.$emit('getData')
          this.loading.isLoading = false
        })
      }
      if(type == 'temporary') {
        this.$http.delete(`${this.api}magazine/${this.magazineId}/delete`).then((response) => {
          console.log(response)
          this.showMagazine()
          this.getCategory()
          this.$root.$emit('getData')
          this.loading.isLoading = false
        })
      }
    }
  }
}
</script>