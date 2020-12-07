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
    <div v-if="magazines.topic !== undefined">
      <div v-if="magazines.topic.length > 0 || user.publisher_id != null" class="btn-fab-add-magazine mb-4 mr-5" @click="getManageTopic(0 ,'create')">
        <font-awesome-icon icon="plus"></font-awesome-icon>
      </div>
      <div v-if="magazines.topic.length > 0 || user.publisher_id != null" class="btn-backup mb-4 mr-5" v-b-modal.modal-nyampah>
        <font-awesome-icon icon="trash"></font-awesome-icon>
      </div>
      <b-modal ref="modal-nyampah" id="modal-nyampah" size="lg" hide-footer hide-header>
        <div class="closable-modal text-center" @click="hideModal('modal-nyampah')"><font-awesome-icon icon="times"></font-awesome-icon></div>
        <div class="pt-3 px-3">
          <h3 class="viga mb-3">Data yang dihapus</h3>
          <div v-if="trasher != null || trasher.length > 0">
            <div class="card p-3 rad mb-3" v-for="trash in trasher" :key="trash.id">
              <b-row>
                <b-col lg="3" md="6" sm="6" cols="6" class="text-center">
                  <div class="preview-images mx-2">
                    <img :src="`${web}images/magazine/topic/${trash.cover}`" alt="Images">
                  </div>
                </b-col>
                <b-col lg="5" class="px-4 pt-5 pb-lg-3 pb-3" md="6" sm="6" cols="6">
                  <h5 class="viga">{{ trash.title }}</h5>
                  <p>Dihapus tanggal : <br> {{ trash.deleted_at }}</p>
                </b-col>
                <b-col lg="4" md="12" class="py-lg-5 py-0 text-right">
                  <b-button class="btn btn-blue-white py-3 px-5 rad text-white" @click="recoverTopic(trash.id)">Kembalikan</b-button>
                </b-col>
              </b-row>
            </div>
          </div>
          <div v-if="trasher == null || trasher.length <= 0">
            <b-alert variant="danger" dismissible show>Tidak ada data.</b-alert>
          </div>
        </div>
      </b-modal>
      <div class="bg-full-page bg-main" style="overflow-y: auto !important">
        <div class="jumbotron-magazine-cover" :class="{'bluring': manageTopic.id !== null }">
          <img :src="`${web}images/magazine/cover/${magazines.cover}`" alt="">
          <div class="text pl-3">
            <h3 class="viga text-white">{{ magazines.title }}</h3>
          </div>
        </div>
        <div class="pt-3 px-4 text-left" style="transition: all .3s ease-in-out" :class="{'bluring': manageTopic.id !== null }">
          <div class="btn-categories-magazine-topics" v-if="categories != null">
            <slick :options="categorySlide" ref="categorySlide" class="categorySlide">
              <b-button :class="{'btn-blue-white shadow rad mx-2 px-5 text-white': categorySelect == 0, 'btn-white shadow-sm rad mx-2 px-5': categorySelect != 0}" @click="showMagazine($route.params.id)">Semua</b-button>
              <b-button v-for="category in categories" :key="category.id" @click="showTopicByCategory(category.id)" :class="{'btn-blue-white shadow rad mx-2 px-5 text-white': categorySelect == category.id, 'btn-white shadow-sm rad mx-2 px-5': categorySelect != category.id}">{{ category.name }}</b-button>
            </slick>
          </div>
          <div class="list-magazine-topics w-100 p-3" v-if="magazines.topic.length > 0">
            <b-row>
              <b-col lg="3" md="4" sm="6" cols="6" class="my-2" v-for="topic in magazines.topic" :key="topic.id" v-if="topic.deleted_at !== null">
                <div class="card">
                  <img :src="`${web}images/magazine/topic/${topic.cover}`" alt="">
                  <div class="w-100 buttons-management p-2">
                    <b-row>
                      <b-col cols="4">
                        <div class="btn-show-topic btn-management" @click="getManageTopic(topic.id, 'show')">
                          <font-awesome-icon icon="eye"></font-awesome-icon>
                        </div>
                      </b-col>
                      <b-col cols="4">
                        <div class="btn-edit-topic btn-management" @click="getManageTopic(topic.id, 'edit')">
                          <font-awesome-icon icon="pen"></font-awesome-icon>
                        </div>
                      </b-col>
                      <b-col cols="4">
                        <div class="btn-delete-topic btn-management" @click="deleteTopic(topic.id)">
                          <font-awesome-icon icon="trash"></font-awesome-icon>
                        </div>
                      </b-col>
                    </b-row>
                  </div>
                </div>
                <h4 class="viga mb-1 mt-2">{{ topic.title }}</h4>
                <p class="text-sm mb-1">
                  <span class="date">{{ topic.created_at }}</span>
                </p>
                <p class="text-sm mb-1">
                  <span class="date">halaman {{ topic.page }}</span>
                </p>
              </b-col>
            </b-row>
          </div>
          <div class="w-100 px-3 py-5" v-if="magazines.topic.length == 0">
            <b-row>
              <b-col md="6" offset-md="3" class="text-center">
                <img src="@/assets/img/illust/no_data.svg" width="200px" alt="None">
                <h4 class="viga mt-4">Belum ada topic / artikel</h4>
                <b-button class="btn btn-blue-white px-5 py-3 mt-2 rad text-white" @click="getManageTopic(0, 'create')">Ayo buat</b-button>
              </b-col>
            </b-row>
          </div>
        </div>

        <b-modal id="delete-magazine" ref="delete-magazine" class="text-center" hide-footer hide-header centered>
          <div class="closable-modal text-center" @click="hideModal('delete-magazine')"><font-awesome-icon icon="times"></font-awesome-icon></div>
          <div class="text-center">
            <img src="@/assets/img/illust/delete.svg" class="my-4" width="250px" alt="Yakin hapus ?">
            <h5>Yakin mau dihapus ?</h5>
          </div>
          <div class="text-center mt-5">
            <b-button variant="light" class="py-3 px-4 btn-sm mx-3 rad" @click="destroyTopic('temporary')">Hapus dari linimasa</b-button>
            <b-button variant="danger" class="py-3 px-5 btn-sm rad" @click="destroyTopic('permanent')">Hapus Permanent</b-button>
          </div>
        </b-modal>

        <div class="magazine-topic-modal-fixed bg-full-page bg-main" style="overflow-y: auto !important" :class="{'show': manageTopic.id !== null }">
          <div class="closable pt-4 pr-5" @click="closeManageTopic()"><font-awesome-icon icon="times"></font-awesome-icon></div>
          <b-row class="px-3 py-4">
            <b-col lg="1" md="2">
              <div class="w-100 px-md-0 px-4">
                <b-row>
                  <b-col v-if="topicSelected !== null" lg="12" md="12" sm="4" cols="4">
                    <b-button style="transition: all .3s ease-in-out !important" @click="getManageTopic(0, 'create')" :class="{'btn-blue-white rad my-2 shadow w-100 py-3 text-white': manageTopic.method == 'create', 'btn-white w-100 my-2 rad transform-sm shadow-sm py-3': manageTopic.method != 'create'}">
                      <font-awesome-icon icon="plus"></font-awesome-icon>
                    </b-button>
                  </b-col>
                  <b-col v-if="topicSelected !== null && topicSelected !== 0" lg="12" md="12" sm="4" cols="4">
                    <b-button style="transition: all .3s ease-in-out !important" @click="setMethodTopic('show')" :class="{'btn-blue-white rad my-2 shadow w-100 py-3 text-white': manageTopic.method == 'show', 'btn-white w-100 my-2 rad transform-sm shadow-sm py-3': manageTopic.method != 'show'}">
                      <font-awesome-icon icon="eye"></font-awesome-icon>
                    </b-button>
                  </b-col>
                  <b-col v-if="topicSelected !== null && topicSelected !== 0" lg="12" md="12" sm="4" cols="4">
                    <b-button style="transition: all .3s ease-in-out !important" @click="setMethodTopic('edit')" :class="{'btn-blue-white rad my-2 shadow w-100 py-3 text-white': manageTopic.method == 'edit', 'btn-white w-100 my-2 rad transform-sm shadow-sm py-3': manageTopic.method != 'edit'}">
                      <font-awesome-icon icon="pen"></font-awesome-icon>
                    </b-button>
                  </b-col>
                </b-row>
              </div>
            </b-col>
            <b-col lg="10" class="text-left" v-if="topicSelected !== null">
              <div v-if="manageTopic.method == 'show'">
                <h3 class="viga mb-5 ml-4">Show Topic</h3>
                <div class="text-center mb-3">
                  <img class="w-50 rad" :src="`${web}images/magazine/topic/${magazines.topic.find(topic => topic.id === topicSelected).cover}`" alt="Cover">
                </div>
                <div class="px-4">
                  <table class="table tableTopic">
                    <tr>
                      <td scope="row">Magazine</td>
                      <td>{{ magazines.title }}</td>
                    </tr>
                    <tr>
                      <td scope="row">Topic</td>
                      <td>{{ magazines.topic.find(topic => topic.id === topicSelected).title }}</td>
                    </tr>
                    <tr>
                      <td scope="row">Date Published</td>
                      <td>{{ magazines.topic.find(topic => topic.id === topicSelected).created_at }}</td>
                    </tr>
                    <tr>
                      <td scope="row">Halaman tampil</td>
                      <td>{{ magazines.topic.find(topic => topic.id === topicSelected).page }}</td>
                    </tr>
                  </table>
                  <p class="mt-3">Description</p>
                  <p class="mt-3">
                    {{ magazines.topic.find(topic => topic.id === topicSelected).description }}
                  </p>
                  <h5 v-if="form.previewFiles !== null" class="viga">Gambar</h5>
                  <div v-if="form.previewFiles == null">
                    <b-alert variant="info" show dismissible>Tidak ada file lampiran</b-alert>
                  </div>
                  <div v-if="form.previewFiles !== null" class="d-inline-block">
                    <div class="preview-images mx-2" @click="openModalFiles('image', file.name)" v-for="file in form.previewFiles" :key="file.id" v-if="file.type == 'image'">
                      <img class="preview" :src="`${web}images/magazine/lampiran/${file.name}`" alt="Images">
                    </div>
                  </div>
                  <h5 v-if="form.previewFiles !== null" class="viga">Video</h5>
                  <div v-if="form.previewFiles !== null" class="d-inline-block">
                    <div class="preview-images mx-2" @click="openModalFiles('video', file.name)" v-for="file in form.previewFiles" :key="file.id" v-if="file.type == 'video'">
                      <video class="myVideo" :ref="'video'">
                        <source :src="`${web}images/magazine/lampiran/${file.name}`" id="video_here" :ref="'video_src'">
                      </video>
                    </div>
                  </div>
                  <b-modal ref="modal-files" centered size="lg" hide-header hide-footer>
                    <div class="closable-modal text-center" @click="hideModal('modal-files')"><font-awesome-icon icon="times"></font-awesome-icon></div>
                    <img v-if="modalFiles.type == 'image'" :src="`${web}images/magazine/lampiran/${modalFiles.src}`" class="w-100" alt="Images">
                    <video controls v-if="modalFiles.type == 'video'" class="myVideo w-100" :ref="'video'">
                      <source :src="`${web}images/magazine/lampiran/${modalFiles.src}`" id="video_here" :ref="'video_src'">
                    </video>
                  </b-modal>
                </div>
              </div>

              <div v-if="manageTopic.method == 'create' || manageTopic.method == 'edit'">
                <div class="p-3 px-md-3 px-5">
                  <h4 class="viga"><span v-if="manageTopic.method == 'create'">Buat Topic</span> <span v-else>Edit Topic</span></h4>
                  <b-row class="mt-5">
                    <b-col md="4">
                      <b-button class="btn-sm mb-4" @click="changeShowFile('image')" :class="{'btn-blue-white px-4 py-3 rad text-white': showFile == 'image', 'btn-white shadow-sm px-4 py-3 rad': showFile !== 'image'}">
                        <font-awesome-icon icon="image"></font-awesome-icon>
                      </b-button>
                      <b-button class="btn-sm mb-4 mx-2" @click="changeShowFile('file')" :class="{'btn-blue-white px-4 py-3 rad text-white': showFile == 'file', 'btn-white shadow-sm px-4 py-3 rad': showFile !== 'file'}">
                        <font-awesome-icon icon="file"></font-awesome-icon>
                      </b-button>
                      <div v-if="showFile == 'image'">
                        <b-form-file id="coverId" class="d-none" @change="changeFile" accept="image/jpeg, image/png, image/jpg" v-model="form.cover"></b-form-file>
                        <div class="list-magazine-topics" @click="clickFile()">
                          <div class="card">
                            <img :src="`${form.src}`" alt="">
                          </div>
                          <p class="mt-2">Click untuk mengubah tampilan artikel</p>
                        </div>
                      </div>
                      <div v-if="showFile == 'file'">
                        <b-form-file id="pdfId" @change="changeFilePdf" accept="application/pdf" v-model="form.pdf"></b-form-file>
                        <div>
                          <object class="bg-blue-white" :data="form.filePdf" width="100%" height="300"></object>
                        </div>
                        <p class="mt-2">Usahakan file pdf hanya 1 halaman</p>
                      </div>
                    </b-col>
                    <b-col md="8" class="">
                      <label for="title">Judul Artikel</label>
                      <b-form-input id="title" type="text" class="py-3 px-4 rad" v-model="form.title" placeholder="Title"></b-form-input>
                      <label for="title" class="mt-3">Set Halaman</label>
                      <b-form-input id="title" type="number" class="py-3 px-4 rad" v-model="form.page" min="0" max="32"></b-form-input>
                      <label for="category" class="mt-3">Kategori Artikel</label>
                      <b-form-select id="category" class="px-4 rad" v-model="form.category">
                        <b-form-select-option value="">Pilih Kategori Artikel</b-form-select-option>
                        <b-form-select-option v-for="category in categories" :key="category.id" :value="category.id">{{ category.name }}</b-form-select-option>
                        <b-form-select-option value="Lainnya">Tambah Category Lain</b-form-select-option>
                      </b-form-select>
                      <b-form-input id="title" v-if="form.category == 'Lainnya'" type="text" class="py-3 mt-2 px-4 rad" v-model="form.categoryLain" placeholder="Category Lain"></b-form-input>
                      <label for="description" class="mt-3">Deskripsi Artikel</label>
                      <b-form-textarea rows="3" max-rows="5" class="rad" v-model="form.description" placeholder="Isi Penjelasan Artikel"></b-form-textarea>    
                      <div class="text-left mt-3">
                        <span>Display Mode:  <font-awesome-icon icon="image"></font-awesome-icon></span>
                        <b-form-checkbox value="file" unchecked-value="image" class="d-inline-block mx-4" v-model="form.displayMode" switch></b-form-checkbox>
                        <span><font-awesome-icon icon="file"></font-awesome-icon></span>
                      </div>
                    </b-col>
                    <b-col md="12">
                      <!-- images -->
                      <h4 class="viga mb-3">Media majalah lainnya</h4>
                      <h5 class="viga">Sisipkan Gambar</h5>
                      <div v-if="form.previewFiles !== null" class="d-inline-block">
                        <div class="preview-images mx-2" v-for="file in form.previewFiles" :key="file.id" v-if="file.type == 'image'">
                          <img class="preview" :src="`${web}images/magazine/lampiran/${file.name}`" alt="Images">
                          <div class="btn-delete-file" @click="deleteFiles(file.id)"><font-awesome-icon icon="times"></font-awesome-icon></div>
                        </div>
                      </div>
                      <div class="preview-images mx-2" v-for="(image, key) in form.images" :key="key">
                        <img class="preview" :ref="'image'" alt="Images">
                        <div class="btn-delete-file" @click="removeImage(key)"><font-awesome-icon icon="times"></font-awesome-icon></div>
                      </div>
                      <div class="btn-add-multiple-file mx-2" @click="clickMultiImage()">
                        <font-awesome-icon icon="image"></font-awesome-icon>
                      </div>
                      <b-form-file id="multiple" class="d-none" multiple accept="image/jpeg, image/png, image/jpg" v-model="form.images" @change="multipleImageChange"></b-form-file>
                      <!-- videos -->
                      <b-row>
                        <b-col class="12">
                          <h5 class="viga">Sisipkan Video</h5>
                          <div v-if="form.previewFiles !== null" class="d-inline-block">
                            <div class="preview-images mx-2" v-for="file in form.previewFiles" :key="file.id" v-if="file.type == 'video'">
                              <video controls class="myVideo" :ref="'video'">
                                <source :src="`${web}images/magazine/lampiran/${file.name}`" id="video_here" :ref="'video_src'">
                              </video>
                              <div class="btn-delete-file" @click="deleteFiles(file.id)"><font-awesome-icon icon="times"></font-awesome-icon></div>
                            </div>
                          </div>
                          <div class="preview-images mx-2" v-for="(video, key) in form.videos" :key="key" :class="{'d-none': form.videos == null}">
                            <video controls class="myVideo" :ref="'video'">
                              <source src="" id="video_here" :ref="'video_src'">
                            </video>
                            <div class="btn-delete-file" @click="removeVideo(key)"><font-awesome-icon icon="times"></font-awesome-icon></div>
                          </div>
                          <div v-if="(form.previewFiles !== null) || (form.previewFiles == null && form.videos.length == 0)" class="btn-add-multiple-file mx-2" @click="clickMultiVideo()">
                            <font-awesome-icon icon="file-video"></font-awesome-icon>
                          </div>
                          <b-form-file id="multipleVideos" class="d-none" multiple accept="video/mp4, audio/x-m4v, audio/x-m4a, audio/x-m4b, audio/x-m4p, audio/mp4" @change="videoChange" v-model="form.videos"></b-form-file>
                        </b-col>
                      </b-row>
                      <b-col md="12" class="pt-3">
                        <div class="text-right">
                          <b-button class="btn-blue-white rad py-3 px-5 text-white" @click="onSave()">Simpan</b-button>
                        </div>
                      </b-col>
                    </b-col>
                  </b-row>  
                </div>
              </div>
            </b-col>
          </b-row>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
@import '@/assets/css/dashboard/style.scss';
@import '@/assets/css/dashboard/magazine.scss';
</style>

<script>
import Slick from 'vue-slick'
import Loading from 'vue-loading-overlay'
import { mapGetters, mapMutations } from 'vuex'
import $ from 'jquery'
import { Doughnut } from 'vue-chartjs'
export default {
  components: {
    Slick,
    Loading
  },
  data() {
    return {
      form: {
        title: '',
        categoryLain: '',
        displayMode: 'image',
        category: '',
        description: '',
        images: [],
        src: '',
        pdf: null,
        videos: [],
        filePdf: null,
        page: '',
        cover: null,
        previewFiles: null,
      },
      topicSelected: 0,
      modalFiles: {
        type: '',
        src: '',
      },
      showFile: 'image',
      loading: {
        isLoading: false,
        transition: "fade",
        bgColor: "#000",
        color: "#0D6AE3",
        opacity: 0.85,
        loader: "dots",
        blur: "100px"
      },
      categorySelect: 0,
      trasher: null,
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
      manageTopic: {
        id: null,
        method: '',
      },
      magazineId: null,
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
      categories: null,
    }
  },
  created() {
    this.getAuth()
    this.getTrash()
    this.showMagazine(this.$route.params.id)
  },
  mounted() {
    this.form.src = this.web+'images/magazine/topic/avatar.png'
    this.form.filePdf = this.web+'document/topic/dummy.pdf'
    this.getCategory()
  },
  // watch: {
  //   "$route.params.id" : {
  //     deep: true,
  //     immediate: true,
  //     handler: function(value) {
  //       this.showMagazine(value)
  //     }
  //   }
  // },
  computed: {
    ...mapGetters({
      api: 'Api/getApi',
      web: 'Api/getWeb',
      user: 'Auth/getUser',
      token: 'Auth/getToken',
    })
  },
  methods: {
    ...mapMutations('Auth', ['set_user']),
    changeShowFile(showFile) {
      this.showFile = showFile
    },
    getTrash() {
      this.$http.get(`${this.api}deleted/topic`).then((response) => {
        this.trasher = response.data.data
      })
    },
    openModalFiles(type, src) {
      this.modalFiles.type = type
      this.modalFiles.src = src
      this.$refs['modal-files'].show()
    },
    getAuth() {
      this.$http.get(`${this.api}user/profile`, {
        headers: {
          'Authorization': `Bearer ${this.token}`
        }
      }).then((response) => {
        if(response.data.data.publisher_id == null) {
          this.$router.push({name: 'DashboardMagazines'})
        }
      })
    },
    getCategory() {
      this.$http.get(`${this.api}category/topic`).then((response) => {
        console.log(response.data.data)
        this.categories = response.data.data
      })
    },
    showTopicByCategory(id) {
      this.$http.get(`${this.api}magazine/${this.$route.params.id}/topic/category/${id}`).then((response) => {
        console.log(response.data.data)
        this.magazines = response.data.data
        this.categorySelect = id
      })
    },
    clickFile() {
      document.getElementById('coverId').click()
    },
    changeFile(e) {
      let url = e.target.files[0]
      this.form.cover = url
      this.form.src = URL.createObjectURL(url)
    },
    clickFilePdf() {
      document.getElementById('pdfId').click()
    },
    recoverTopic(id) {
      this.$http.get(`${this.api}recover/topic/${id}`).then((response) => {
        this.showMagazine(this.$route.params.id)
        this.getTrash()
      })
    },
    changeFilePdf(e) {
      let url = e.target.files[0]
      this.form.pdf = url
      this.form.filePdf = URL.createObjectURL(url)
    },
    showMagazine(id) {
      this.categorySelect = 0
      this.$http.get(`${this.api}magazine/${id}`).then((response) => {
        this.magazines = response.data.data
        console.log(response)
      })
    },
    clickMultiImage() {
      document.getElementById('multiple').click()
    },
    clickMultiVideo() {
      document.getElementById('multipleVideos').click()
    },
    getManageTopic(idTopic, method) {
      this.manageTopic.id = idTopic
      this.categorySelect = 0
      this.topicSelected = idTopic
      this.manageTopic.method = method
      if(method == 'edit' || method == 'show') {
        this.getTopic()
      }
      if(method == 'create') {
        this.form.title = ''
        this.form.description = ''
        this.form.category = ''
        this.form.displayMode = 'image'
        this.form.src = this.web+'images/magazine/topic/avatar.png'
        this.form.filePdf = this.web+'document/topic/dummy.pdf'
        this.form.previewFiles = null
        this.form.pdf = null
        this.form.cover = null
        this.form.videos = []
        this.form.images = []
      }
    },
    deleteFiles(id) {
      this.$http.delete(`${this.api}file/topic/${id}/delete`).then((response) => {
        console.log(response)
        if(response.data.code == 200) {
          this.getManageTopic(this.manageTopic.id, this.manageTopic.method)
        }
      })
    },
    getTopic() {
        this.$http.get(`${this.api}topic/${this.topicSelected}`).then((response) => {
          console.log(response.data.data)
          if(response.data.data.file.length > 0) {
            this.form.previewFiles = response.data.data.file
          } else {
            this.form.previewFiles = null
          }
        })
        console.log(this.magazines.topic.find(topic => topic.id === this.topicSelected))
        this.form.title = this.magazines.topic.find(topic => topic.id === this.topicSelected).title
        this.form.category = this.magazines.topic.find(topic => topic.id === this.topicSelected).category_id
        this.form.page = this.magazines.topic.find(topic => topic.id === this.topicSelected).page
        this.form.description = this.magazines.topic.find(topic => topic.id === this.topicSelected).description
        this.form.displayMode = this.magazines.topic.find(topic => topic.id === this.topicSelected).display_mode
        this.form.src = this.web+'images/magazine/topic/'+this.magazines.topic.find(topic => topic.id === this.topicSelected).cover
        this.form.filePdf = this.web+'document/topic/'+this.magazines.topic.find(topic => topic.id === this.topicSelected).file_pdf
    },
    setMethodTopic(method) {
      if(method == 'edit') {
        this.getManageTopic(this.manageTopic.id, method)
      }
      if(method == 'create') {
        this.getManageTopic(0, method)
      }
      this.manageTopic.method = method
    },
    closeManageTopic() {
      this.manageTopic.id = null
      this.topicSelected = null
      this.form.title = ''
      this.form.description = ''
      this.form.category = ''
      this.form.displayMode = 'image'
      this.form.src = this.web+'images/magazine/topic/avatar.png'
      this.form.filePdf = this.web+'document/topic/dummy.pdf'
      this.form.pdf = null
      this.form.previewFiles = null
      this.form.cover = null
      this.form.videos = []
      this.form.images = []
      this.manageTopic.method = null
    },
    videoChange(e) {
      let videoFiles = e.target.files
      for(let i = 0; i < videoFiles.length; i++) {
        this.form.videos.push(videoFiles[i])
      }
      for(let i = 0; i < this.form.videos.length; i++) {
        let reader = new FileReader()
        reader.onload = (e) => {
          this.$refs.video[i].src = reader.result
        } 
        reader.readAsDataURL(this.form.videos[i])
      }
    },
    multipleImageChange(e) {
      let vm = this;
      var selectedFiles = e.target.files;
      for (let i = 0; i < selectedFiles.length; i++) {
        this.form.images.push(selectedFiles[i]);
      }
      for (let i = 0; i < this.form.images.length; i++) {
        let reader = new FileReader();
        reader.onload = (e) => {
          this.$refs.image[i].src = reader.result;
        };
        reader.readAsDataURL(this.form.images[i]);
      }
    },
    removeImage(i) {
      this.form.images.splice(i, 1)
    },
    removeVideo(j) {
      console.log(this.form.videos)
      this.form.videos = []
    },
    onSave() {
      this.manageTopic.id = null
      this.loading.isLoading = true
      let formData = new FormData()
      formData.append('magazine', this.$route.params.id)
      formData.append('title', this.form.title)
      formData.append('page', this.form.page)
      formData.append('description', this.form.description)
      formData.append('category', this.form.category)
      formData.append('otherCategory', this.form.categoryLain)
      formData.append('display', this.form.displayMode)
      formData.append('cover', this.form.cover)
      formData.append('filePdf', this.form.pdf)
      for(let i = 0; i < this.form.images.length; i++) {
        formData.append('images[]', this.form.images[i])
      }
      for(let i = 0; i < this.form.videos.length; i++) {
        formData.append('videos[]', this.form.videos[i]);
      }
      console.log(this.form.images)
      console.log(this.form.videos)
      if(this.manageTopic.method == 'create') {
        this.$http.post(`${this.api}topic`, formData).then((response) => {
          console.log(response)
          this.loading.isLoading = false
          this.showMagazine(this.$route.params.id)
        })
      } else if(this.manageTopic.method == 'edit') {
        formData.append('_method', 'PATCH')
        this.$http.post(`${this.api}topic/${this.topicSelected}`, formData).then((response) => {
          this.loading.isLoading = false
          this.showMagazine(this.$route.params.id)
          console.log(response)
        })
      }
    },
    onCancel() {
      console.log('cancelled')
    },
    deleteTopic(id) {
      this.topicSelected = id
      this.$refs['delete-magazine'].show()
    },
    destroyTopic(type) {
      this.$refs['delete-magazine'].hide()
      this.loading.isLoading = true
      if(type == 'permanent') {
        this.$http.delete(`${this.api}topic/${this.topicSelected}`).then((response) => {
          console.log(response)
          this.showMagazine(this.$route.params.id)
          this.getCategory()
          this.loading.isLoading = false
        })
      }
      if(type == 'temporary') {
        this.$http.delete(`${this.api}topic/${this.topicSelected}/delete`).then((response) => {
          console.log(response)
          this.showMagazine(this.$route.params.id)
          this.getCategory()
          this.getTrash()
          this.loading.isLoading = false
        })
      }
    }
  }
}
</script>