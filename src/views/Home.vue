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
    <b-container fluid class="bg-full-page bg-img position-fixed blur-el" :style="`background-image: url('${web}images/magazine/cover/${coverActive}')`"></b-container>
    <b-container fluid class="bg-full-page position-fixed bg-blue" style="opacity: .7"></b-container>
    <b-container fluid class="position-fixed px-0 d-md-inline-block d-none" style="bottom: 0px; left: 0px;">
      <b-row>
        <b-col md="4">
          <div class="w-100 pt-3 px-3 pb-3 bg-white text-left" style="border-top-right-radius: 26px">
            <img src="@/assets/img/logo/sidescript.png" width="30px" class="d-inline-block" alt="sidescript">
            <h5 class="d-inline-block position-relative ml-3" style="top: 4px">sidescriptdev.com</h5>
          </div>
        </b-col>
      </b-row>
    </b-container>
    <b-container fluid class="w-100 position-absolute pb-md-0 pb-5 mb-md-0 mb-5" style="overflow-x: hidden !important; top: 8%;">
      <b-container style="z-index: 1100" v-if="magazines != undefined && magazines != null">
        <slick v-if="magazines.length > 0" @beforeChange="handleBeforeChange" @afterChange="handleAfterChange" ref="slick" class="slider-magazine position-relative w-100" :options="magazineSlider">
        <div class="w-100" v-for="magazine in magazines" :key="magazine.id">
          <b-col id="" lg="10" offset-lg="1">
            <div class="w-100 mt-5">
              <b-row>
                <b-col md="6" class="text-center">
                  <img :src="`${web}images/magazine/cover/${magazine.cover}`" width="80%" class="d-inline-block" alt="">
                </b-col>
                <b-col md="6" class="text-left pt-3">
                  <p class="mb-1">
                    <span><font-awesome-icon icon="star" class="mx-1 text-gold"></font-awesome-icon></span>
                    <span><font-awesome-icon icon="star" class="mx-1 text-gold"></font-awesome-icon></span>
                    <span><font-awesome-icon icon="star" class="mx-1 text-gold"></font-awesome-icon></span>
                    <span><font-awesome-icon icon="star" class="mx-1 text-gold"></font-awesome-icon></span>
                    <span><font-awesome-icon icon="star" class="mx-1 text-gold"></font-awesome-icon></span>
                    <span class="viga text-white">4.8 / 5.0</span>
                  </p>
                  <h1 class="viga text-white">{{ magazine.title }}</h1>
                  <p class="text-white">{{ magazine.created_at }}</p>
                  <div class="ability w-100 pb-5 border-bottom">
                    <b-button class="mr-2 btn btn-transparent btn-ability border-white" @click="showShare(magazine.id)"><font-awesome-icon icon="share-alt"></font-awesome-icon></b-button>
                    <div v-if="bookmark.find(bk => bk.id == magazine.id)" class="d-inline-block">
                      <div class="d-inline-block" v-for="(id, index) in bookmark" :key="index">
                        <button v-if="magazine.id == id.id" class="mr-2 btn btn-white text-blue btn-ability border-white" @click="removeBookmark(magazine.id, index)"><font-awesome-icon :icon="['far', 'bookmark']"></font-awesome-icon></button>
                      </div>
                    </div>
                    <div v-else class="d-inline-block">
                      <button class="mr-2 btn btn-transparent btn-ability border-white" @click="bookmarkToggleable(magazine.id, index)"><font-awesome-icon :icon="['far', 'bookmark']"></font-awesome-icon></button>
                    </div>            
                    <div v-if="isAuth" class="d-inline-block">
                      <div class="d-inline-block">
                        <button :class="{'mr-2 btn btn-transparent btn-ability border-white text-white': magazine.rating.find(rate => rate.user_id === user.id) == null, 'mr-2 btn btn-white text-blue btn-ability border-white': magazine.rating.find(rate => rate.user_id === user.id) != null}" @click="showRating(magazine.id)"><font-awesome-icon :icon="['far', 'star']"></font-awesome-icon></button>
                      </div>
                    </div>
                    <div v-else class="d-inline-block">
                      <button class="mr-2 btn btn-transparent btn-ability border-white text-white" @click="showRating(magazine.id)"><font-awesome-icon :icon="['far', 'star']"></font-awesome-icon></button>
                    </div>
                  </div>
                  <p class="text-white pt-4 pb-4">{{ magazine.description }}</p>
                  <button class="btn btn-white px-5 py-3 rad-md" @click="movePage('Magazine', magazine.id)">Read Now</button>
                  <button class="btn btn-white p-3 px-4 ml-3 rad-md" @click="modalDownload(magazine.id)"><font-awesome-icon icon="download"></font-awesome-icon></button>
                </b-col>
              </b-row>
            </div>
          </b-col>
        </div>
        </slick>
        <div v-else class="w-100">
          <b-container style="z-index: 1100" class="pt-5">
            <b-col md="6" offset-md="3" class="pt-5 text-white">
              <img src="@/assets/img/illust/no_data.svg" class="w-50" alt="No data">
              <h3 class="viga text-whie mb-1 mt-4">Tunggu Sebentar</h3>
              <p class="text-sm">Kami masih menyiapkan majalahnya</p>
            </b-col>
          </b-container>
        </div>
      </b-container>
      <b-container v-else style="z-index: 1100">
        <b-col md="6" offset-md="3" class="pt-5 text-white">
            <img src="@/assets/img/illust/no_data.svg" width="300px" alt="No data">
            <h3 class="viga text-whie mb-1 mt-4">Intaxa Belum Upload Gan..</h3>
            <p class="text-sm">Ayo mada.. ndang di upload majalahe. akeh seng ngenteni iki wkwk</p>
        </b-col>
      </b-container>
    </b-container>    
    <b-modal ref="modal-download" id="modal-download" class="moda-standart" centered size="md" hide-header hide-footer>
      <div class="closable-modal text-center" @click="hideDownload()" ><font-awesome-icon icon="times"></font-awesome-icon></div>
      <div class="text-left p-3">
        <h5 class="viga">Pengaturan download</h5>
        <div class="w-100">
          <b-row>
            <b-col cols="8">
              <b-form-input type="text" disabled v-model="FileMagazineName" class="p-3"></b-form-input>
            </b-col>
            <b-col cols="4">
              <select v-model="fileExtenstions" class="form-control">
                <option value="zip">ZIP</option>
                <option value="pdf" disabled>PDF</option>
                <option value="doc" disabled>DOC</option>
                <option value="docx" disabled>DOCX</option>
              </select>
            </b-col>
          </b-row>
          <div class="w-100 text-right mt-3">
            <b-button class="btn btn-blue-white text-white px-5 py-2 rad-md" @click="downloadMagazineAsset()">Download</b-button>
          </div>
        </div>
      </div>
    </b-modal>
    <b-modal ref="modal-rating" id="modal-rating" class="modal-standart" centered size="md" hide-header hide-footer>
      <div class="closable-modal text-center" @click="hideRating()"><font-awesome-icon icon="times"></font-awesome-icon></div>
      <div v-if="isAuth">
        <div class="text-center py-3">
          <h4 class="viga">Anda suka dengan Majalah ini ?</h4>
          <p>Berikan ratingmu kepada majalah kami</p>
          <p style="font-size: 1.5rem" class="mb-0">
            <span><font-awesome-icon @click="giveRating(1)" :icon="[faStar1 ,'star']" class="mx-1 text-gold rating-ico-modal"></font-awesome-icon></span>
            <span><font-awesome-icon @click="giveRating(2)" :icon="[faStar2 ,'star']" class="mx-1 text-gold rating-ico-modal"></font-awesome-icon></span>
            <span><font-awesome-icon @click="giveRating(3)" :icon="[faStar3 ,'star']" class="mx-1 text-gold rating-ico-modal"></font-awesome-icon></span>
            <span><font-awesome-icon @click="giveRating(4)" :icon="[faStar4 ,'star']" class="mx-1 text-gold rating-ico-modal"></font-awesome-icon></span>
            <span><font-awesome-icon @click="giveRating(5)" :icon="[faStar5 ,'star']" class="mx-1 text-gold rating-ico-modal"></font-awesome-icon></span>
          </p>
          <div class="w-100" v-if="magazines.find(magz => magz.id === magazineId) !== undefined">
            <div v-if="magazines.find(magz => magz.id === magazineId).rating.length > 0">
              <div class="w-100" v-if="magazines.find(magz => magz.id === magazineId).rating.find(rate => rate.user_id === user.id)">
                <b-button @click="removeRating(magazineId)" class="btn btn-light mt-3 px-5 py-3 rad">Hilangkan Rating</b-button>
              </div>
            </div>  
          </div>
        </div>
      </div>
      <div v-else>
        <div class="text-center py-3">
          <img src="@/assets/img/illust/login.svg" width="250px" class="my-2 mb-4" alt="Login dulu dong.">
          <h4 class="viga">Anda belum login</h4>
          <b-button class="btn btn-blue-white px-5 py-3 rad text-white" :to="{name: 'Login'}">Login</b-button>
        </div>
      </div>
    </b-modal>
    <b-modal ref="modal-share" id="modal-share" class="modal-standart" centered size="md" hide-header hide-footer>
      <div class="closable-modal text-center" @click="hideShare()"><font-awesome-icon icon="times"></font-awesome-icon></div>
      <div class="text-left p-3" v-if="shareMagazine != null">
        <b-button class="btn-blue-white py-2 px-3 mb-3 rad text-white" @click="toggleShare()">
          <font-awesome-icon :icon="shareMethodIcon"></font-awesome-icon>
        </b-button>
        <h5 class="viga">Bagikan majalah ini</h5>
        <div class="medsos-modal w-100 pt-2 pb-3" v-if="shareMethod == 'manually'">
          <ShareNetwork :url="urlShare" :title="shareMagazine.title" :description="shareMagazine.description" network="facebook" class="medsos-modal-item d-inline-block mr-3"><font-awesome-icon :icon="['fab', 'facebook']"></font-awesome-icon></ShareNetwork>
          <ShareNetwork :url="urlShare" :title="shareMagazine.title" :description="shareMagazine.description" network="twitter" class="medsos-modal-item d-inline-block mr-3"><font-awesome-icon :icon="['fab', 'twitter']"></font-awesome-icon></ShareNetwork>
          <ShareNetwork :url="urlShare" :title="shareMagazine.title" :description="shareMagazine.description" network="whatsapp" class="medsos-modal-item d-inline-block mr-3"><font-awesome-icon :icon="['fab', 'whatsapp']"></font-awesome-icon></ShareNetwork>
          <ShareNetwork :url="urlShare" :title="shareMagazine.title" :description="shareMagazine.description" network="telegram" class="medsos-modal-item d-inline-block mr-3"><font-awesome-icon :icon="['fab', 'telegram']"></font-awesome-icon></ShareNetwork>
        </div>
        <div class="medsos-modal w-100 pt-2 pb-3" v-if="shareMethod == 'qrcode'">
          <h6 class="viga">Majalah {{ shareMagazine.title }}</h6>
          <div class="w-100 text-center">
            <qrcode-vue :value="urlShare" size="300" level="H"></qrcode-vue>
          </div>
        </div>
        <h6 class="viga mb-2">Atau salin url</h6>
        <b-row>
          <b-col cols="9">
            <b-form-input class="py-3 px-3 rad-md" placeholder="Url" v-model="urlShare"></b-form-input>
          </b-col>
          <b-col cols="3">
            <b-button class="btn-blue-white h-100 w-100 rad-md text-white"><font-awesome-icon :icon="['far', 'copy']"></font-awesome-icon></b-button>
          </b-col>
        </b-row>
      </div>
    </b-modal>
  </div>
</template>

<style lang="scss">
@import '@/assets/css/style.scss';
@import '@/assets/css/magazines.scss';
</style>

<script>
import { mapGetters, mapMutations } from 'vuex'
import QrcodeVue from 'qrcode.vue'
import Loading from 'vue-loading-overlay'
import Slick from 'vue-slick'
import '../../src/assets/css/slick.css'
import '../../src/assets/css/slick-theme.css'
export default {
  name: 'Home',
  components: {
    Slick,
    QrcodeVue,
    Loading,
  },
  data() {
    return {
      urlShare: '',
      magazineId: '',
      loading: {
        isLoading: false,
        transition: "fade",
        bgColor: "#000",
        color: "#0D6AE3",
        opacity: 0.85,
        loader: "dots",
        blur: "100px"
      },
      faStar1: 'far',
      faStar2: 'far',
      faStar3: 'far',
      shareMethod: 'manually',
      shareMethodIcon: 'qrcode',
      faStar4: 'far',
      fileExtenstions: 'zip',
      valueRating: 0,
      FileMagazineName: 'File_Magazine.',
      faStar5: 'far',
      bookmark: JSON.parse(localStorage.getItem('bookmark') || "[]"),
      bookmarkToggle: 0,
      obj: [],
      coverActive: 'cover.png',
      magazines: [],
      magazineSlider: {
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: true,
        dots: false,
      },
      shareMagazine: null,
    }
  },
  mounted() {
    this.getMagazines()
    console.log(this.isAuth)
  },
  created() {
    this.getAuth()
    console.log(this.isBookmark)
    if(this.bookmark == undefined) {
      let bookmark = [{'id': 0}]
      localStorage.setItem('bookmark', JSON.stringify(bookmark) || "[]");
      this.obj = JSON.parse(localStorage.getItem('bookmark')).bookmark
    }
  },
  computed: {
    ...mapGetters({
      api: 'Api/getApi',
      web: 'Api/getWeb',
      user: 'Auth/getUser',
      isAuth: 'Auth/isAuth',
      token: 'Auth/getToken',
      isBookmark: 'Magazine/isBookmark',
    })
  },
  methods: {
    ...mapMutations('Auth', ['set_user']),
    getAuth() {
      if(this.isAuth == true) {
        this.$http.get(`${this.api}user/profile`, {
          headers: {
            'Authorization': `Bearer ${this.token}`
          }
        }).then((response) => {
          this.set_user(response.data.data)
        })
      }
    },
    getMagazines() {
      this.$http.get(`${this.api}magazine`).then((response) => {
        console.log(response)
        this.magazines = response.data.data.data
        this.coverActive = this.magazines[0].cover
      })
    },
    modalDownload(id) {
      this.magazineId = id
      let fileName = this.magazines.find(magz => magz.id === this.magazineId).title
      this.FileMagazineName = fileName.split(' ').join('_')+'.'+this.fileExtenstions
      this.$refs['modal-download'].show()
    },
    giveRating(value) {
      if(value == 1) {
        this.faStar1 = 'fas'
        this.faStar2 = 'far'
        this.faStar3 = 'far'
        this.faStar4 = 'far'
        this.faStar5 = 'far'
      }
      if(value == 2) {
        this.faStar1 = 'fas'
        this.faStar2 = 'fas'
        this.faStar3 = 'far'
        this.faStar4 = 'far'
        this.faStar5 = 'far'
      }
      if(value == 3) {
        this.faStar1 = 'fas'
        this.faStar2 = 'fas'
        this.faStar3 = 'fas'
        this.faStar4 = 'far'
        this.faStar5 = 'far'
      }
      if(value == 4) {
        this.faStar1 = 'fas'
        this.faStar2 = 'fas'
        this.faStar3 = 'fas'
        this.faStar4 = 'fas'
        this.faStar5 = 'far'
      }
      if(value == 5) {
        this.faStar1 = 'fas'
        this.faStar2 = 'fas'
        this.faStar3 = 'fas'
        this.faStar4 = 'fas'
        this.faStar5 = 'fas'
      }
      this.valueRating = value
      this.$http.post(`${this.api}user/magazine/${this.magazineId}/rating`, {
        rating: this.valueRating
      }, {
        headers: {
          'Authorization': `Bearer ${this.token}`
        }
      }).then((response) => {
        console.log(response)
        this.getMagazines()
      })
    },
    bookmarkToggleable(idtos, key) {
      let bookmarks = JSON.parse(localStorage.getItem('bookmark') || "[]")
      console.log(bookmarks)
      bookmarks.forEach(function(book, index) {
        console.log("["+index+"]: "+book.id)
      })
      let bookmark = {
        id: idtos
      }
      bookmarks.push(bookmark)
      console.log('Added bookmark' + bookmark.id)
      localStorage.setItem('bookmark', JSON.stringify(bookmarks))
      this.obj = bookmarks
      this.bookmark = JSON.parse(localStorage.getItem('bookmark') || "[]")
    },
    showShare(id) {
      this.magazineId = id
      this.$http.get(`${this.api}magazine/${id}`).then((response) => {
        this.shareMagazine = response.data.data
      })
      this.urlShare = document.location.href+'magazine/'+id
      this.$refs['modal-share'].show()
    },
    toggleShare() {
      if(this.shareMethod == 'manually') {
        this.shareMethod = 'qrcode'
        this.shareMethodIcon = 'share-alt'
      } else {
        this.shareMethod = 'manually'
        this.shareMethodIcon = 'qrcode'
      }
    },
    onCancel() {
      //
    },
    movePage(name, id) {
      this.$router.push({name: name, params: {id: id}})
    },
    hideRating() {
      this.$refs['modal-rating'].hide()
    },
    hideDownload() {
      this.$refs['modal-download'].hide()
    },
    downloadMagazineAsset() {
      this.$refs['modal-download'].hide()
      this.loading.isLoading = true
      this.$http.post(`${this.api}download/magazine/${this.magazineId}`, {
        filename: this.FileMagazineName
      },{
        responseType: 'blob',
      }).then((response) => {
        console.log(response)
        let blob = new Blob([response.data], {type: response.headers['content-type']})
        let link = document.createElement('a');
        let url = window.URL.createObjectURL(blob)
        console.log(url);
        link.href = url
        link.download = this.FileMagazineName
        link.click()
        this.loading.isLoading = false
        // var fileUrl = URL.createObjectURL(new Blob([response.data]))
        // console.log(fileUrl)
        // var fileLink = document.createElement('a')
        // fileLink.href = fileUrl
        // fileLink.setAttribute('download', 'magazine.zip')
        // document.body.appendChild(fileLink)
        // fileLink.click()
      })
    },
    removeRating(magazineId) {
      if(this.isAuth) {
        this.$http.delete(`${this.api}magazine/${magazineId}/delete/rating`, {
          headers: {
            'Authorization': `Bearer ${this.token}`
          }
        }).then((response) => {
          this.getAuth()
          this.getMagazines()
          this.hideRating()
        })
      }
    },
    showRating(id) {
      this.faStar1 = 'far'
      this.faStar2 = 'far'
      this.faStar3 = 'far'
      this.faStar4 = 'far'
      this.faStar5 = 'far'
      console.log(this.magazines)
      this.getMagazines()
      this.magazineId = id
      if(this.isAuth) {
        this.getAuth()
        console.log(this.magazines.find(magz => magz.id === id).rating.find(rate => rate.user_id === this.user.id))
        if(this.magazines.find(magz => magz.id === id).rating.find(rate => rate.user_id === this.user.id)) {
          if(this.magazines.find(magz => magz.id === id).rating.find(rate => rate.user_id === this.user.id).rating == 1) {
            this.faStar1 = 'fas'
            this.faStar2 = 'far'
            this.faStar3 = 'far'
            this.faStar4 = 'far'
            this.faStar5 = 'far'
          }
          else if(this.magazines.find(magz => magz.id === id).rating.find(rate => rate.user_id === this.user.id).rating == 2) {
            this.faStar1 = 'fas'
            this.faStar2 = 'fas'
            this.faStar3 = 'far'
            this.faStar4 = 'far'
            this.faStar5 = 'far'
          }
          else if(this.magazines.find(magz => magz.id === id).rating.find(rate => rate.user_id === this.user.id).rating == 3) {
            this.faStar1 = 'fas'
            this.faStar2 = 'fas'
            this.faStar3 = 'fas'
            this.faStar4 = 'far'
            this.faStar5 = 'far'
          }
          else if(this.magazines.find(magz => magz.id === id).rating.find(rate => rate.user_id === this.user.id).rating == 4) {
            this.faStar1 = 'fas'
            this.faStar2 = 'fas'
            this.faStar3 = 'fas'
            this.faStar4 = 'fas'
            this.faStar5 = 'far'
          }
          else if(this.magazines.find(magz => magz.id === id).rating.find(rate => rate.user_id === this.user.id).rating == 5) {
            this.faStar1 = 'fas'
            this.faStar2 = 'fas'
            this.faStar3 = 'fas'
            this.faStar4 = 'fas'
            this.faStar5 = 'fas'
          } else {
            this.faStar1 = 'far'
            this.faStar2 = 'far'
            this.faStar3 = 'far'
            this.faStar4 = 'far'
            this.faStar5 = 'far'
          }
        } else {
          this.faStar1 = 'far'
          this.faStar2 = 'far'
          this.faStar3 = 'far'
          this.faStar4 = 'far'
          this.faStar5 = 'far'
        }
      }
      this.$refs['modal-rating'].show()
    },
    hideShare() {
      this.$refs['modal-share'].hide()
      this.faStar1 = 'far'
      this.faStar2 = 'far'
      this.faStar3 = 'far'
      this.faStar4 = 'far'
      this.faStar5 = 'far'
    },
    handleAfterChange(event, slick, currentSlide) {
        // console.log(currentSlide);
    },
    handleBeforeChange(event, slick, currentSlide, nextSlide) {
        console.log(nextSlide);
        this.coverActive = this.magazines[nextSlide].cover
    },
    next() {
      this.$refs.slick.next();
    },
    prev() {
      this.$refs.slick.prev();
    },
    reInit() {
      this.$nextTick(() => {
        this.$refs.slick.reSlick();
      })
    },
    beforeUpdate() {
        if (this.$refs.slick) {
            this.$refs.slick.destroy();
        }
    },
    removeBookmark(id, key) {
      let bookmarks = JSON.parse(localStorage.getItem('bookmark') || "[]")
      console.log(bookmarks)
      bookmarks.forEach(function(book, index) {
        console.log("["+index+"]: "+book.id)
      })
      bookmarks.splice(key, 1)
      localStorage.setItem('bookmark', JSON.stringify(bookmarks))
      this.obj = bookmarks
      this.bookmark = JSON.parse(localStorage.getItem('bookmark') || "[]")
    },
    updated() {
      this.$nextTick(function () {
          if (this.$refs.slick) {
              this.$refs.slick.create(this.magazineSlider);
          }
      });
    },
  }
}
</script>
