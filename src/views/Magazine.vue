<template>
  <div>
    <b-container v-if="magazines != null && magazines != undefined" fluid class="bg-full-page bg-img position-fixed blur-el" :style="`background-image: url('${web}images/magazine/cover/${magazines.cover}')`"></b-container>
    <b-container fluid class="bg-full-page position-fixed bg-blue" style="opacity: .4"></b-container>
    <!-- <b-container fluid class="bg-full-page position-fixed bg-blue" style="opacity: 1; background-image: url('/../assets/img/widget/wallpaper.png');"></b-container> -->
    <b-container fluid class="position-fixed w-100" style="z-index: 10">
      <b-row>
        <b-col md="6" cols="3" class="text-left pt-4 px-5">
          <div class="d-inline-block brand-nav" @click="moveRouter('Home')" style="z-index: 10">
            <img src="@/assets/img/logo/intaxa-white.png" width="30px" alt="Logo INTAXA" class="d-inline-block mt-md-0 mt-2">
            <h3 class="d-md-inline-block d-none viga text-white ml-2 position-relative nav-brand-text" style="top: 6px">INTAXA</h3>
          </div>
        </b-col>
        <b-col md="6" cols="9" class="text-right pt-4 px-5">
          <audio autoplay ref="audioMusic" loop id="audioMusic">
            <source :src="require(`@/assets/sound/${selectAudio}`)" type="audio/mp3">
          </audio>
          <div class="d-inline-block py-2 px-3 rad-md" :class="{'dark-mode text-white': themeStyle == 'dark', 'bg-white': themeStyle == 'light'}">
            <button v-if="magazineMode != 'scroll'" @click="showSearch()" :class="{'text-white dark-mode': themeStyle == 'dark', 'btn-white': themeStyle == 'light'}" class="btn text-sm-small rad-md px-sm-3 py-sm-2 px-2 py-1 text-blue">
              <font-awesome-icon icon="search"></font-awesome-icon>
            </button>
            <button class="btn text-sm-small px-sm-3 py-sm-2 px-2 py-1 mx-sm-2 mx-1 text-blue" :class="{'text-white dark-mode': themeStyle == 'dark', 'btn-white': themeStyle == 'light', 'btn-white text-blue': showSettings == false, 'btn-blue-white text-white': showSettings == true}" @click="toggleSetting()">
              <font-awesome-icon icon="cog"></font-awesome-icon>
            </button>
            <button v-if="magazineMode != 'scroll'" class="btn text-sm-small rad-md px-sm-3 py-sm-2 px-2 py-1 text-blue" :class="{'text-white dark-mode': themeStyle == 'dark', 'btn-white text-blue': showThumbnails == false, 'btn-white': themeStyle == 'light', 'btn-blue-white text-white': showThumbnails == true}" @click="toggleThumnails">
              <font-awesome-icon icon="layer-group"></font-awesome-icon>
            </button>
          </div>
        </b-col>
      </b-row>
    </b-container>
    
    <div class="position-fixed" style="right: -16px; top: 30%; z-index: 50" v-if="topicData != null && topicData.file.length > 0">
      <b-button v-b-modal.modal-files @click="toggleFile()" class="btn btn-white btn-lg pr-5 rad-md px-3 py-2 text-blue">
        <font-awesome-icon icon="file"></font-awesome-icon>
      </b-button>
    </div>

    <div v-if="topicData != null && topicData.file.length > 0" class="files-preview" :class="{'show': showFile == 1}">
      <b-container fluid class="bg-full-page bg-main">
        <b-container class="p-4 text-left position-relative">
          <b-row>
            <b-col md="12">
              <h3 class="viga">File Topic</h3>
              <p>Foto</p>
              <b-row>
                <b-col lg="3" md="4" cols="6" class="mb-3" v-for="image in topicData.file" :key="image.id">
                  <div v-if="image.type == 'image'" class="card-image rad overflow-hidden" @click="FileShow('image', image.name)">
                    <img :src="`${web}images/magazine/lampiran/${image.name}`" class="w-100 h-100" style="object-fit: cover" alt="">
                  </div>
                </b-col>
                <b-col v-if="topicData.file.find(image => image.type === 'image') == null">
                  <b-alert variant="info" show dimissible>
                    Tidak ada foto
                  </b-alert>
                </b-col>
              </b-row>
              <p>Video</p>
              <b-row>
                <b-col lg="3" md="4" cols="6" class="mb-3" v-for="video in topicData.file" :key="video.id" v-if="video.type == 'video'">
                  <div class="card-image rad overflow-hidden" @click="FileShow('video', video.name)">
                    <video class="video w-100 h-100" style="object-fit: cover">
                      <source :src="`${web}images/magazine/lampiran/${video.name}`">
                    </video>
                  </div>
                </b-col>
                <b-col v-if="topicData.file.find(video => video.type === 'video') == null">
                  <b-alert variant="info" show dimissible>
                    Tidak ada video
                  </b-alert>
                </b-col>
              </b-row>
            </b-col>
          </b-row>
        </b-container>
      </b-container>
      <div class="position-absolute" style="left: -16px; top: 30%;" v-if="topicData != null && topicData.file.length > 0">
        <b-button v-b-modal.modal-files @click="toggleFile()" class="btn btn-blue-white btn-lg pl-5 rad-md px-3 py-2 text-white">
          <font-awesome-icon icon="times"></font-awesome-icon>
        </b-button>
      </div>
    </div>

    <b-modal ref="modal-show-file" id="modal-show-file" size="lg" hide-footer hide-header centered>
      <div class="closable-modal text-center" @click="$bvModal.hide('modal-show-file')"><font-awesome-icon icon="times"></font-awesome-icon></div>
      <div class="pt-3 px-3 pb-0">
        <video v-if="showFiles.type == 'video'" controls class="video w-100">
          <source :src="`${web}images/magazine/lampiran/${showFiles.name}`">
        </video>
        <img v-if="showFiles.type == 'image'" :src="`${web}images/magazine/lampiran/${showFiles.name}`" class="w-100" alt="">
      </div>
    </b-modal>

    <!-- Book View -->
    <div v-if="magazineMode == 'book'" class="bg-full-page position-relative">
      <b-container fluid class="px-0 position-relative w-100 py-5" style="overflow-x: visible !important; overflow-y: visible !important; left: 0px">
        <b-row class="pb-5">
          <div class="col-md-6 mb-5" v-if="(magazines != null && magazines != undefined) && (magazines.topic != null && magazines.topic != undefined)" :class="`offset-md-${offsetMagazine}`">
            <fw-turn @mouseover="hideNav()" @mouseleave="showNav()"  @click="gotoPageBook(null, 1)" class="position-relative my-5" :options="bookOptions" id="magazineView" style="height: 500px">
              <div class="bg-white hard" @mouseover="hideNav()" @mouseleave="showNav()">
                <img :src="`${web}images/magazine/cover/${magazines.cover}`" class="w-100 h-100" style="object-fit: cover" alt="Cover Here">
              </div>
              <div v-for="(topic, index) in magazines.topic" :key="topic.id"  @click="gotoPageBook(topic.id, parseInt(2+parseInt(index)))" :class="{'hard': index == 0 || index == (magazines.topic.length - 1) || index == (magazines.topic.length - 2)}" class="bg-white" @mouseover="hideNav()" @mouseleave="showNav()">
                <img :src="`${web}images/magazine/topic/${topic.cover}`" class="w-100 h-100" style="object-fit: cover" alt="Cover Here"/>
              </div>
            </fw-turn>
          </div>
        </b-row>
      </b-container>
    </div>
    <!-- End Book View -->
    
    <!-- Slider View -->
    <div v-if="magazineMode == 'slider'" class="bg-full-page position-relative pt-4">
      <b-container fluid class="px-0 w-100 w-50 my-auto d-inline-block position-relative pt-3 pb-5 bg-magazine" style="overflow-x: hidden !important;">
        <b-row class="pb-5 mb-5" v-if="(magazines != null && magazines != undefined) && (magazines.topic != null && magazines.topic != undefined)">
          <b-col lg="12" class="pb-5 mb-5">
            <slick :options="MagazineSlider" class="magazineViewSlider mb-0 pb-0">
              <div @mouseover="hideNav()" @mouseleave="showNav()" @click="gotoPageBook(null, 1)" class="magazinePage">
                <img :src="`${web}images/magazine/cover/${magazines.cover}`" class="w-100 h-100" style="object-fit: cover" alt="Cover Here"/>
              </div>
              <div v-for="(topic, index) in magazines.topic" :key="topic.id" @mouseover="hideNav()" @mouseleave="showNav()" @click="gotoPageBook(topic.id, parseInt(2+parseInt(index)))" class="magazinePage">
                <img v-if="topic.display_mode == 'image'" :src="`${web}images/magazine/topic/${topic.cover}`" class="w-100 h-100" style="object-fit: cover" alt="Cover Here"/>
                <object v-if="topic.display_mode == 'file'" style="overflow: hidden !important; left: 0px" class="w-100 h-100 position-absolute" :data="`${web}document/topic/${topic.file_pdf}`" type="application/pdf">
                  <param name="view" value="Fit" />
                </object>
              </div>
            </slick>
          </b-col>
        </b-row>
      </b-container>
    </div>
    <!-- End Slider View -->

    <!-- Scroll View -->
    <div style="overflow-x: hidden !important" class="w-100 mb-5">
      <b-container v-if="magazineMode == 'scroll'" fluid class="px-0 w-100 py-5">
        <b-row class="py-5">
          <div class="col-md-6 mb-5" v-if="(magazines != null && magazines != undefined) && (magazines.topic != null && magazines.topic != undefined)" :class="`offset-md-${offsetMagazine}`">
            <fw-bookblock @mouseover="hideNav()" @mouseleave="showNav()" @click="gotoPageBook(null, 1)" :options="bookOptions" id="magazineView" style="height: 500px">
              <div class="bg-white" @mouseover="hideNav()" @mouseleave="showNav()">
                <img :src="`${web}images/magazine/cover/${magazines.cover}`" class="w-100 h-100 position-relative" style="object-fit: cover" alt="Cover Here">
              </div>
              <div v-for="topic in magazines.topic" :key="topic.id"  @click="gotoPageBook(topic.id, parseInt(2+parseInt(index)))" class="bg-white" @mouseover="hideNav()" @mouseleave="showNav()">
                <img :src="`${web}images/magazine/topic/${topic.cover}`" class="w-100 h-100" style="object-fit: cover" alt="Cover Here"/>
              </div>
            </fw-bookblock>
          </div>
        </b-row>
      </b-container>
    </div>
    <!-- End Scroll View -->

    <b-container fluid class="navbar-magazine p-3 position-fixed w-100" v-if="magazineMode != 'scroll'">
      <div class="d-inline-block p-2 toolsMagazine rad-md shadow" :class="{'tool-hide': navbar == false, 'dark-mode': themeStyle == 'dark', 'bg-white': themeStyle == 'light'}">
        <button :class="{'dark-mode text-white': themeStyle == 'dark', 'bg-white btn-white': themeStyle == 'light'}" class="btn p-md-2 p-0 btn-sm-small btn-sm" @click="zoomIn()"><font-awesome-icon icon="search-plus"></font-awesome-icon></button>
        <button :class="{'dark-mode text-white': themeStyle == 'dark', 'bg-white btn-white': themeStyle == 'light'}" class="btn p-md-2 p-0 btn-sm-small btn-sm" @click="firstPage()"><font-awesome-icon icon="backward"></font-awesome-icon></button>
        <button :class="{'dark-mode text-white': themeStyle == 'dark', 'bg-white btn-white': themeStyle == 'light'}" class="btn p-md-2 p-0 btn-sm-small btn-sm" @click="prevPage()"><font-awesome-icon icon="angle-left"></font-awesome-icon></button>
        <button class="btn p-md-2 p-0 btn-sm-small btn-sm" :class="{'btn-blue-white text-white': magazineAutoplay == true,'dark-mode text-white': themeStyle == 'dark', 'bg-white btn-white': themeStyle == 'light'}" @click="playPage()"><font-awesome-icon :icon="iconAutoplay"></font-awesome-icon></button>
        <button :class="{'dark-mode text-white': themeStyle == 'dark', 'bg-white btn-white': themeStyle == 'light'}" class="btn p-md-2 p-0 btn-sm-small btn-sm" @click="nextPage()"><font-awesome-icon icon="angle-right"></font-awesome-icon></button>
        <button :class="{'dark-mode text-white': themeStyle == 'dark', 'bg-white btn-white': themeStyle == 'light'}" class="btn p-md-2 p-0 btn-sm-small btn-sm" @click="endPage()"><font-awesome-icon icon="forward"></font-awesome-icon></button>
        <button :class="{'dark-mode text-white': themeStyle == 'dark', 'bg-white btn-white': themeStyle == 'light'}" class="btn p-md-2 p-0 btn-sm-small btn-sm" @click="zoomOut()"><font-awesome-icon icon="search-minus"></font-awesome-icon></button>
      </div>
    </b-container>
    <b-container fluid class="px-2 settings-magazine overflow-hidden">
      <div class="settings-content text-left p-md-5 p-5"  :class="{'settings-hide': showSettings == false, 'settings-show': showSettings == true, 'dark-mode': themeStyle == 'dark'}">
        <h2 class="viga">General</h2>
        <div class="border-bottom pb-3">
          <h5 class="viga">Audio</h5>
          <div class="w-100">
            <b-row>
              <b-col md="6" class="mt-2">
                <p class="mb-0" style="font-size: .9rem">Music</p>
              </b-col>
              <b-col md="6">
                <span class="d-inline-block">Off</span>
                <b-form-checkbox v-model="enablingMusic" @change="toggleAudio()" class="d-inline-block mx-3" name="check-button" switch></b-form-checkbox>
                <span class="d-inline-block">On</span>
              </b-col>
            </b-row>
            <b-row>
              <b-col md="6" class="mt-2">
                <p class="mb-0" style="font-size: .9rem">Volume Music {{ parseInt(volumeAudio * 100) }} %</p>
              </b-col>
              <b-col md="6">
                <b-form-input @change="setVolumeAudio()" v-model="volumeAudio" type="range" min="0" max="1" step="0.01"></b-form-input>
              </b-col>
            </b-row>
            <b-row>
              <b-col md="6" class="mt-2">
                <p class="mb-0" style="font-size: .9rem">Music Playlist</p>
              </b-col>
              <b-col md="6">
                <b-form-select @change="chooseAudio()" v-model="selectAudio" :value="'music1'" :options="optionAudio"></b-form-select>
              </b-col>
            </b-row>
          </div>
        </div>
        <div class="border-bottom pb-3 mt-3">
          <h5 class="viga">Magazine</h5>
          <div class="w-100">
            <b-row>
              <b-col md="6" class="mt-2">
                <p class="mb-0" style="font-size: .9rem">Thumbnails view</p>
              </b-col>
              <b-col md="6">
                <b-form-select v-model="thumbnailsPosition" :options="optionThumbnail"></b-form-select>
              </b-col>
            </b-row>
            <b-row class="mt-3">
              <b-col md="6" class="mt-2">
                <p class="mb-0" style="font-size: .9rem">Magazine Mode</p>
              </b-col>
              <b-col md="6">
                <b-form-select v-model="magazineMode" :options="optionMode"></b-form-select>
              </b-col>
            </b-row>
             <b-row class="mt-3">
              <b-col md="6" class="mt-2">
                <p class="mb-0" style="font-size: .9rem">Autoplay Speed</p>
              </b-col>
              <b-col md="6">
                <b-form-input class="d-inline-block" style="width: 100px" v-model="secondAutoplay" type="number"></b-form-input>
                <span class="d-inline-block ml-2">Detik</span>
              </b-col>
            </b-row>
          </div>
        </div>
        <div class="border-bottom pb-3 mt-3">
          <h5 class="viga">Theme style</h5>
          <div class="w-100">
            <b-row>
              <b-col md="4" class="mt-2">
                <p class="mb-0" style="font-size: .9rem">Theme</p>
              </b-col>
              <b-col md="8" class="text-center">
                <span class="d-inline-block" style="font-size: .9rem"><font-awesome-icon :icon="['far', 'sun']"></font-awesome-icon> Light</span>
                <b-form-checkbox v-model="themeStyle" value="dark" unchecked-value="light" class="d-inline-block mx-3" :options='optionTheme' name="check-button" switch></b-form-checkbox>
                <span class="d-inline-block" style="font-size: .9rem"><font-awesome-icon :icon="['far', 'moon']"></font-awesome-icon> Dark</span>
              </b-col>
            </b-row>
          </div>
        </div>
        <b-button v-if="!isAuth || user == null" :to="{name: 'Login'}" class="btn btn-blue-white w-100 py-3 rad-md text-white viga">Masuk</b-button>
      </div>
    </b-container>
    <b-modal ref="modal-search" size="xl" id="modal-search" hide-footer hide-header centered>
      <div class="closable-modal text-center" @click="$bvModal.hide('modal-search')"><font-awesome-icon icon="times"></font-awesome-icon></div>
      <div class="p-3 w-100">
        <h4 class="viga mb-3">Cari Sesuatu</h4>
        <b-row>
          <b-col md="6">
            <b-form-input @keyup="searchMagazine()" placeholder="Cari artikel" class="p-3 rad-md" v-model="searchInput"></b-form-input>
          </b-col>
          <b-col md="6" v-if="categories != null">
            <b-form-select @change="searchMagazine()" class="rad-md" v-model="categorySearch">
              <b-form-select-option value="">Pilih kategori</b-form-select-option>
              <b-form-select-option v-for="ctr in categories" :key="ctr.id" :value="ctr.id">{{ ctr.name }}</b-form-select-option>
            </b-form-select>
          </b-col>
        </b-row>
        <h6 class="viga mt-3">Hasil pencarian</h6>
        <b-row class="mt-2" v-if="magazineSearchs != undefined">
          <b-col v-for="(topic, index) in magazineSearchs.topic" class="mb-3" :key="index" lg="3" md="4" sm="6" cols="6">
            <div class="w-100 preview-result-search overflow-hidden rad-md my-md-0 my-2" @click="selectTopic(topic.id)">
              <img :src="`${web}images/magazine/topic/${topic.cover}`" class="w-100 h-100" alt="">
            </div>
            <h5 class="viga mb-0 mt-2">{{ topic.title }}</h5>
            <p class="text-sm">{{ topic.created_at }}</p>
          </b-col>
          <b-col cols="12" class="text-center" v-if="magazineSearchs.topic.length == 0">
            <img src="@/assets/img/illust/none.svg" class="py-3" width="200px" alt="Not Found">
            <h4 class="viga mt-3">Artikel Tidak ditemukan</h4>
          </b-col>
        </b-row>
      </div>
    </b-modal>
    <b-container fluid class="position-fixed thumbnails-preview" 
      :class="{
        'thumbnails-hide': showThumbnails == false,
        'thumbnails-show': showThumbnails == true,
        'thumbnails-top': thumbnailsPosition == 'top',
        'thumbnails-bottom': thumbnailsPosition == 'bottom',
        'thumbnails-left': thumbnailsPosition == 'left',
        'thumbnails-right': thumbnailsPosition == 'right',
      }">
        <div class="closable-thumbnails" @click="closeThumbnails">
          <font-awesome-icon icon="times"></font-awesome-icon>
        </div>
        <div v-if="magazines != null && magazines != undefined" class="w-100 position-relative py-2" :class="{'d-none' : thumbnailsPosition == 'left' || thumbnailsPosition == 'right'}">
          <slick :options="thumbnailHorizontal" class="slider-magazine slider-thumbnail bottom-slide position-relative">
            <!-- <div class="thumbnailItem bg-blue mx-2 rad-md w-100 mt-5">0</div> -->
            <div @click="gotoPageBook(null, 1)" class="thumbnailItem bg-blue mx-2 rad-md w-100 mt-5">
              <img :src="`${web}images/magazine/cover/${magazines.cover}`" class="w-100 h-100" style="object-fit: cover" alt="Cover Here"/>
            </div>
            <div v-for="(topic, index) in magazines.topic" :key="index" @click="gotoPageBook(topic.id, parseInt(2+parseInt(index)))" class="thumbnailItem bg-blue mx-2 rad-md w-100 mt-5">
              <img :src="`${web}images/magazine/topic/${topic.cover}`" class="w-100 h-100" style="object-fit: cover" alt="Cover Here"/>
            </div>
            <!-- <div class="thumbnailItem bg-blue mx-2 rad-md w-100 mt-5">21</div> -->
          </slick>
        </div>
        <div v-if="magazines != null && magazines != undefined" style="z-index: 100" class="w-100 position-relative py-2" :class="{'d-none' : thumbnailsPosition == 'top' || thumbnailsPosition == 'bottom'}">
          <slick :options="thumbnailVertical" class="slider-magazine slider-thumbnail left-slide position-relative">
            <div class="thumbnailItem bg-white my-2 rad-md w-100 p-3 mt-3"></div>
            <div @click="gotoPageBook(null, 1)" class="thumbnailItem bg-blue my-2 rad-md w-100 mt-3">
              <img :src="`${web}images/magazine/cover/${magazines.cover}`" class="w-100 h-100" style="object-fit: cover" alt="Cover Here"/>
            </div>
            <div v-for="(topic, index) in magazines.topic" :key="index" @click="gotoPageBook(topic.id, parseInt(2+parseInt(index)))" class="thumbnailItem bg-blue my-2 rad-md w-100 mt-3">
              <img :src="`${web}images/magazine/topic/${topic.cover}`" class="w-100 h-100" style="object-fit: cover" alt="Cover Here"/>
            </div>
            <div class="thumbnailItem bg-white my-2 rad-md w-100 p-3 mt-3"></div>
          </slick>
        </div>
      </b-container>
  </div>
</template>

<style lang="scss">
@import '~@/assets/css/navbar.scss';
@import '~@/assets/css/style.scss';
@import '~@/assets/css/magazines.scss';
</style>

<script>
import { FwTurn } from 'vue-turnjs'
import { FwBook } from 'vue-turnjs'
import { FwBookblock } from 'vue-turnjs'
import Slick from 'vue-slick'
import '../../src/assets/css/slick.css'
import '../../src/assets/css/slick-theme.css'
import { mapGetters } from 'vuex'
import pdf from 'vue-pdf'
export default {
  components: {
    FwTurn,
    pdf,
    FwBookblock,
    Slick,
  },
  created() {
    this.showMagazine(this.$route.params.id)
    this.getCategories()
  },
  destroyed() {
    document.removeEventListener('resize', this.handleResize)
  },
  mounted() {
    // window.onload = function() {
    // let audio = document.getElementById("audioMusic")
    // audio.muted = 'false'
    // audio.play()
    // }
    window.addEventListener('resize', this.handleResize)
    this.handleResize()
    if(this.isAuth && this.user != null) {
      this.usernameProfile = this.user.name
    }
    window.addEventListener('keyup', event => {
      if(this.magazineMode == 'book') {
        if (event.keyCode === 37) { 
          this.prevPage()
        }
        if (event.keyCode === 39) { 
          this.nextPage()
        }
      } else if(this.magazineMode == 'slider') {
        if (event.keyCode === 37) { 
          $('.magazineViewSlider').slick('slickPrev')
          this.slideNumber -= 1
          if(this.slideNumber <= 1) {
            this.slideNumber = 1
          }
          this.selectTopicIndex(this.slideNumber)
        }
        if (event.keyCode === 39) { 
          $('.magazineViewSlider').slick('slickNext')
          this.slideNumber += 1
          if(this.slideNumber >= parseInt(this.magazines.topic.length + 1)) {
            this.slideNumber = parseInt(this.magazines.topic.length + 1)
          }
          this.selectTopicIndex(this.slideNumber)
        }
      }
    })
  },
  data() {
    return {
      usernameProfile: 'Ninno',
      categories: null,
      searchInput: '',
      themeStyle: 'light',
      selectThumbnail: 'bottom',
      offsetMagazine: 3,
      intervalAutoplay: '',
      magazineAutoplay: false,
      iconAutoplay: 'play',
      slideNumber: 1,
      magazines: null,
      zoomMagazine: 1,
      magazineSearchs: null,
      secondAutoplay: 1,
      MagazineSlider: {
        slidesToShow: 2,
        slidesToScroll: 1,
        infinite: false,
        arrows: false,
        centerMode: true,
        dots: false,
        focusOnSelect: true,
        swipeToSlide: true,
        variableWidth: true,
        variableHeight: true,
        responsive: [
          {
            breakpoint: 768,
            settings: {
              slidesToShow: 1,
              slidesToScroll: 1,
              infinite: false,
              arrows: false,
              centerMode: true,
              dots: false,
              variableWidth: true,
              variableHeight: true
            }
          }
        ],
      },
      topicActive: 0,
      showFile: 0,
      categorySearch: '',
      topicData: null,
      thumbnailHorizontal: {
        slidesToShow: 5,
        slidesToScroll: 1,
        infinite: false,
        centerMode: true,
        swipeToSlide: true,
        arrows: true,
        dots: false,
        responsive: [
          {
            breakpoint: 960,
            settings: {
              slidesToShow: 2,
              slidesToScroll: 1,
              infinite: false,
              centerMode: true,
              arrows: true,
              dots: false,
            }
          },
          {
            breakpoint: 480,
            settings: {
              slidesToShow: 1,
              slidesToScroll: 1,
              infinite: false,
              centerMode: true,
              arrows: true,
              dots: false,
            }
          }
        ]
      },
      thumbnailVertical: {
        slidesToShow: 5,
        slidesToScroll: 1,
        swipeToSlide: true,
        infinite: false,
        centerMode: true,
        arrows: true,
        vertical: true,
        dots: false,
        responsive: [
          {
            breakpoint: 960,
            settings: {
              slidesToShow: 2,
              slidesToScroll: 1,
              infinite: false,
              centerMode: true,
              arrows: true,
              dots: false,
            }
          },
          {
            breakpoint: 480,
            settings: {
              slidesToShow: 1,
              slidesToScroll: 1,
              infinite: false,
              centerMode: true,
              arrows: true,
              dots: false,
            }
          }
        ]
      },
      selectAudio: 'music1.mp3',
      showFiles: {
        type: null,
        name: null,
      },
      showThumbnails: false,
      showSettings: false,
      bookOptions: {
        autoCenter: true,
        elevation: 1000,
        width: 700,
      },
      avatarFile: null,
      enablingMusic: true,
      srcPreview: '',
      navbar: true,
      window: {
        width: 0,
        height: 0,
      },
      thumbnailsPosition: 'bottom',
      magazineMode: 'book',
      volumeAudio: .5,
      optionMode: [
        {value: 'book', text: 'Book'},
        {value: 'slider', text: 'Slider'},
        {value: 'scroll', text: 'Scrolling'},
      ],
      optionAudio: [
        {value: 'music1.mp3', text: 'Music Theme 1'},
        {value: 'music2.mp3', text: 'Music Theme 2'},
      ],
      optionThumbnail: [
        {value: 'bottom', text: 'Bottom'},
        {value: 'top', text: 'Top'},
        {value: 'left', text: 'Left'},
        {value: 'right', text: 'Right'},
      ],
      optionTheme: [
        {value: 'light', text: 'Light'},
        {value: 'dark', text: 'Dark'}
      ],
    }
  },
  computed: {
    ...mapGetters({
      api: 'Api/getApi',
      web: 'Api/getWeb',
      isAuth: 'Auth/isAuth',
      user: 'Auth/getUser'
    })
  },
  methods: {
    toggleFile() {
      if(this.showFile == 0) {
        this.showFile = 1
      } else {
        this.showFile = 0
      }
    },
    FileShow(type, name) {
      this.showFiles.type = type
      this.showFiles.name = name
      this.$refs['modal-show-file'].show()
    },
    showMagazine(id) {
      this.$http.get(`${this.api}magazine/${id}`, {
        headers: {
          'Content-Type': 'application/pdf'
        }
      }).then((response) => {
        this.magazines = response.data.data
        this.magazineSearchs = response.data.data
      })
    },
    showTopics(id) {
      this.$http.get(`${this.api}topic/${id}`).then((response) => {
        console.log(response.data.data)
        this.topicData = response.data.data
      })
    },
    handleResize() {
      this.window.width = window.innerWidth
      console.log(this.window)
      if(this.window.width < 960) {
        this.magazineMode = 'slider'
      }
    },
    gotoPageBook(id, page) {
      if(id != null) {
        this.topicActive = id
        this.showTopics(id)
      } else {
        this.topicData = null
        this.topicActive = null
      }
      if(this.magazineMode == 'book') {
        $('#magazineView').turn('page', page)      
      } else if(this.magazineMode == 'slider') {
        let sliderPage = parseInt(page - 1);
        $('.magazineViewSlider').slick('slickGoTo', sliderPage)
      }
    },
    toggleAudio() {
      if(this.enablingMusic == true) {
        this.$refs['audioMusic'].play()
      } else {
        this.$refs['audioMusic'].pause()
      }
    },
    setVolumeAudio() {
      this.$refs['audioMusic'].volume = this.volumeAudio
    },
    hideNav() {
      this.navbar = false
      // console.log('false')
    },
    showNav() {
      this.navbar = true
      // console.log('true')
    },
    getCategories() {
      this.$http.get(`${this.api}category/topic`).then((res) => {
        this.categories = res.data.data
      })
    },
    playPage() {
      if(this.magazineMode == 'book') {
        if(this.magazineAutoplay == false) {
          this.magazineAutoplay = true
          this.iconAutoplay = 'stop'
          this.intervalAutoplay = setInterval(function() {
            $('#magazineView').turn('next')
          }, this.secondAutoplay + '000')
        } else {
          this.iconAutoplay = 'play'
          this.magazineAutoplay = false
          clearInterval(this.intervalAutoplay)
        }
      } else if(this.magazineMode == 'slider') {
        if(this.magazineAutoplay == false) {
          this.magazineAutoplay = true
          this.iconAutoplay = 'stop'
          this.intervalAutoplay = setInterval(function() {
            $('.magazineViewSlider').slick('slickNext')
          }, this.secondAutoplay + '000')
        } else {
          this.iconAutoplay = 'play'
          this.magazineAutoplay = false
          clearInterval(this.intervalAutoplay)
        }
      }
    },
    chooseAudio() {
      this.$refs['audioMusic'].load()
    },
    nextPage() {
      this.slideNumber += 1
      if(this.slideNumber >= (this.magazines.topic.length + 1)) {
        this.slideNumber = (this.magazines.topic.length + 1)
      }
      this.selectTopicIndex(this.slideNumber)
      if(this.magazineMode == 'book') {
        $('#magazineView').turn('next')
      } else if(this.magazineMode == 'slider') {
        $('.magazineViewSlider').slick('slickNext')
      }
    },
    searchMagazine() {
      this.$http.post(`${this.api}q/magazine/${this.$route.params.id}/topic`, {
        name: this.searchInput,
        category: this.categorySearch
      }).then((res) => {
        this.magazineSearchs = res.data.data
        console.log(res.data.data)
      })
    },
    prevPage() {
      this.slideNumber -= 1
      if(this.slideNumber <= 1) {
        this.slideNumber = 1
      }
      this.selectTopicIndex(this.slideNumber)
      if(this.magazineMode == 'book') {
        $('#magazineView').turn('previous')
      } else {
        $('.magazineViewSlider').slick('slickPrev')
      }
    },
    endPage() {
      this.slideNumber = (this.magazines.topic.length + 1)
      this.selectTopicIndex(this.slideNumber)
      if(this.magazineMode == 'book') {
        $('#magazineView').turn('page', 6)
      } else if(this.magazineMode == 'slider') {
        $('.magazineViewSlider').slick('slickGoTo', 5)
      }
    },
    firstPage() {
      this.slideNumber = 1
      this.selectTopicIndex(this.slideNumber)
      if(this.magazineMode == 'book') {
        $('#magazineView').turn('page', 1)
      } else if(this.magazineMode == 'slider') {
        $('.magazineViewSlider').slick('slickGoTo', 0)
      }
    },
    selectTopicIndex(index) {
      let i = (index - 2)
      if(i >= 0) {
        let topicId = this.magazines.topic[i].id
        this.topicActive = topicId
        this.showTopics(topicId)
      } else {
        this.topicData = null
        this.topicActive = null
      }
    },
    selectTopic(id) {
      let index = this.magazines.topic.findIndex(top => top.id === id)
      console.log(index)
      this.$refs['modal-search'].hide()
      this.gotoPageBook(id, parseInt(2+parseInt(index)))
    },
    zoomIn() {
      if(this.magazineMode == 'book') {
        if(this.zoomMagazine == 1) {
          this.zoomMagazine = 1.7
          this.offsetMagazine = 1
          $('#magazineView').turn('zoom', this.zoomMagazine)
        } else if(this.zoomMagazine = 1.7) {
          this.zoomMagazine = 2.0
          this.offsetMagazine = 0
          $('#magazineView').turn('zoom', this.zoomMagazine)
        }
      } else if(this.magazineMode == 'slider') {
        if(this.zoomMagazine == 1) {
          this.zoomMagazine = 1.7
          $('.magazineViewSlider').find('.slick-center').find('.magazinePage').css('transform', 'scale('+ 1.1 +')', '!important')
        } else if(this.zoomMagazine = 1.7) {
          this.zoomMagazine = 2
          $('.magazineViewSlider').find('.slick-center').find('.magazinePage').css('transform', 'scale('+ 1.2 +')', '!important')
        }
      }
    },
    zoomOut() {
      if(this.magazineMode == 'book') {
        if(this.zoomMagazine == 2.0) {
          this.zoomMagazine = 1.7
          this.offsetMagazine = 1
          $('#magazineView').turn('zoom', this.zoomMagazine)
        } else if(this.zoomMagazine = 1.7) {
          this.zoomMagazine = 1
          this.offsetMagazine = 3
          $('#magazineView').turn('zoom', this.zoomMagazine)
        }
      } else if(this.magazineMode == 'slider') {
        if(this.zoomMagazine == 2.0) {
          this.zoomMagazine = 1.7
          $('.magazineViewSlider').find('.slick-center').find('.magazinePage').css('transform', 'scale('+ 1.1 +')', '!important')
        } else if(this.zoomMagazine = 1.7) {
          this.zoomMagazine = 1
          $('.magazineViewSlider').find('.slick-center').find('.magazinePage').css('transform', 'scale('+ 1 +')', '!important')
        }
      }
    },
    closeThumbnails() {
      this.showThumbnails = false
    },
    showSearch() {
      this.$refs['modal-search'].show()
      this.showSettings = false
      this.showThumbnails = false
    },
    callFile() {
      document.getElementById('avatar-file').click();
    },
    changeAvatar(e) {
      let file = e.target.files[0]
      this.srcPreview = URL.createObjectURL(file)
    },
    moveRouter(value) {
      this.$router.push({name: value})
    },
    toggleSetting() {
      if(this.showSettings == false) {
        this.showSettings = true
        this.showThumbnails = false
      } else {
        this.showSettings = false
      }
    },
    toggleThumnails() {
      if(this.showThumbnails == false) {
        this.showThumbnails = true
        this.showSettings = false
      } else {
        this.showThumbnails = false
      }
    }
  }
}
</script>