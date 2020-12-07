<template>
  <div>
    <b-container fluid class="bg-full-page bg-img position-fixed blur-el" :style="`background-image: url('${web}images/wallpaper/wallpaper1.png')`"></b-container>
    <b-container fluid class="bg-full-page position-fixed bg-blue" style="opacity: .5"></b-container>
    <b-container fluid class="bg-full-page position-fixed" style="opacity: 1"></b-container>
    <b-container fluid class="py-5 bg-blue w-100">
      <b-container>
        <b-row class="pt-5">
          <b-col lg="12" class="text-left py-4">
            <h1 class="viga text-white">Your Bookmark</h1>
          </b-col>
        </b-row>
        <b-row v-if="magazines != null && magazines != undefined">
          <b-col lg="3" md="4" sm="6" class="text-left text-sm mb-5" v-for="(magz, index) in magazines" :key="index" v-if="bookmark.find(book => book.id == magz.id)">
            <p class="mb-2" v-if="magz.rating.length > 0">
              <span><font-awesome-icon icon="star" class="mx-1 text-gold"></font-awesome-icon></span>
              <span><font-awesome-icon icon="star" class="mx-1 text-gold"></font-awesome-icon></span>
              <span><font-awesome-icon icon="star" class="mx-1 text-gold"></font-awesome-icon></span>
              <span><font-awesome-icon icon="star" class="mx-1 text-gold"></font-awesome-icon></span>
              <span><font-awesome-icon icon="star" class="mx-1 text-gold"></font-awesome-icon></span>
              <span class="viga text-white">4.8 / 5.0</span>
            </p>
            <p v-else class="mb-2 text-white">
              Tidak ada rating
            </p>
            <div class="w-100 list-magazine-topics">
              <div class="card">
                <img :src="`${web}images/magazine/cover/${magz.cover}`" alt="Image Magazine">
                <div class="w-100 buttons-management p-2">
                  <b-row>
                    <b-col cols="6">
                      <div class="btn-show-topic btn-management" @click="viewMagz(magz.id, index)">
                        <font-awesome-icon icon="eye"></font-awesome-icon>
                      </div>
                    </b-col>
                    <b-col cols="6">
                      <div v-if="bookmark.find(bk => bk.id === magz.id).id == magz.id" class="d-inline-block">
                        <div class="d-inline-block" v-for="(id, index) in bookmark" :key="index">
                          <div v-if="magz.id == id.id" class="btn-edit-topic btn-management" @click="removeBookmark(magz.id, index)">
                            <font-awesome-icon icon="trash"></font-awesome-icon>
                          </div>
                        </div>
                      </div>
                    </b-col>
                  </b-row>
                </div>
              </div>
            </div>
            <div class="mt-3 text-left">
              <h5 class="viga text-white mb-0">{{ magz.title }}</h5>
              <p class="text-sm text-white">{{ magz.created_at }}</p>
            </div>
          </b-col>
        </b-row>
      </b-container>
    </b-container>
  </div>
</template>

<style lang="scss">
@import '@/assets/css/style.scss';
@import '@/assets/css/bookmark.scss';
@import '@/assets/css/magazines.scss';
</style>

<script>
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      FileMagazineName: 'File_Magazine.',
      fileExtenstions: 'PDF',
      magazines: [],
      obj: [],
      bookmark: JSON.parse(localStorage.getItem('bookmark') || "[]")
    }
  },
  created() {
    this.getMagazine()
    console.log(this.bookmark)
  },
  computed: {
    ...mapGetters({
      api: 'Api/getApi',
      isBookmark: 'Magazine/isBookmark',
      web: 'Api/getWeb',
    })
  },
  methods: {
    getMagazine() {
      this.$http.get(`${this.api}magazine`).then((response) => {
        console.log(response.data.data)
        this.magazines = response.data.data.data
      })
    },
    modalDownload(id) {
      this.$refs['modal-download'].show()
    },
    viewMagz(id) {
      this.$router.push({name: 'Magazine', params: {id: id}})
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
  }
}
</script>