<template>
  <div>
    <b-container fluid class="bg-full-page bg-img position-fixed blur-el" :style="`background-image: url('${web}images/wallpaper/wallpaper2.png')`"></b-container>
    <b-container fluid class="bg-full-page position-fixed bg-blue" style="opacity: .5"></b-container>
    <b-container fluid class="bg-full-page position-fixed" style="opacity: 1"></b-container>
    <b-container fluid class="py-5 bg-blue w-100">
      <b-row>
        <b-col lg="10" offset-lg="1">
          <b-row class="pt-5">
            <b-col lg="12" class="text-left py-4">
              <h1 class="viga text-white">Most Popular</h1>
            </b-col>
          </b-row>
          <b-row v-if="magazines != null && magazines != undefined">
            <b-col lg="6" md="6" sm="6" v-for="(magz, index) in magazines" :key="index" v-show="magz.rating.length !== 0" class="text-left mb-4">
              <div class="w-100">
                <b-row>
                  <b-col cols="6">
                   <div class="w-100 list-magazine-topics">
                    <div class="card">
                      <img :src="`${web}images/magazine/cover/${magz.cover}`" alt="Image Magazine">
                      <div class="w-100 buttons-management p-2">
                        <b-row>
                          <b-col cols="12">
                            <div class="btn-show-topic btn-management" @click="viewMagz(magz.id, index)">
                              <font-awesome-icon icon="eye"></font-awesome-icon>
                            </div>
                          </b-col>
                        </b-row>
                      </div>
                    </div>
                  </div>
                  </b-col>
                  <b-col cols="6">
                    <div class="mt-3 text-left">
                      <p class="mb-2 text-sm">
                        <span><font-awesome-icon icon="star" class="mx-1 text-gold"></font-awesome-icon></span>
                        <span><font-awesome-icon icon="star" class="mx-1 text-gold"></font-awesome-icon></span>
                        <span><font-awesome-icon icon="star" class="mx-1 text-gold"></font-awesome-icon></span>
                        <span><font-awesome-icon icon="star" class="mx-1 text-gold"></font-awesome-icon></span>
                        <span><font-awesome-icon icon="star" class="mx-1 text-gold"></font-awesome-icon></span>
                        <span class="viga text-white">4.8 / 5.0</span>
                      </p>
                      <h2 class="viga text-white">{{ magz.title }}</h2>
                      <p class="text-white" style="font-size: .85rem">{{ magz.created_at }}</p>
                      <hr class="bg-white text-white">
                      <p class="text-white mt-3" style="font-size: .85rem">{{ magz.description.length > 100 ? magz.description.substring(0,8)+"..." : magz.description }}</p>
                    </div>
                  </b-col>
                </b-row>
              </div>
            </b-col>
          </b-row>
          <!-- <b-row v-if="magazines != undefined">
            <b-col lg="12" md="12" sm="12" v-if="magazines.rating.length == 0)">
              <b-alert variant="info" show dismissible>
                Tidak ada majalah
              </b-alert>
            </b-col>
          </b-row> -->
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<style lang="scss">
@import '@/assets/css/style.scss';
@import '@/assets/css/bookmark.scss';
</style>

<script>
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      FileMagazineName: 'File_Magazine.',
      fileExtenstions: 'PDF',
      magazines: null,
    }
  },
  created() {
    this.getMagazine()
  },
  computed: {
    ...mapGetters({
      api: 'Api/getApi',
      web: 'Api/getWeb'
    })
  },
  methods: {
    getMagazine() {
      this.$http.get(`${this.api}popular/magazine`).then((response) => {
        this.magazines = response.data.data
        console.log(response)
      })
    },
    viewMagz(id) {
      this.$router.push({name: 'Magazine', params: {id: id}})
    },
    modalDownload(id) {
      this.$refs['modal-download'].show()
    },
  }
}
</script>