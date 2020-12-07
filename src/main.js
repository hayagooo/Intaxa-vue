import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import axios from 'axios'
import $ from 'jquery'
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { fab } from '@fortawesome/free-brands-svg-icons'
import { far } from '@fortawesome/free-regular-svg-icons'
import Loading from 'vue-loading-overlay'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import bootstrapVue from 'bootstrap-vue'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import 'bootstrap/dist/css/bootstrap.css'
import { FlippingWidget } from 'vue-turnjs'
import { TurnPlugin } from 'vue-turnjs'
import { BooklockPlugin } from 'vue-turnjs'
import { Booklock2Plugin } from 'vue-turnjs'
import { BookPlugin } from 'vue-turnjs'
import 'vue-turnjs/dist/vue-turnjs.esm.css'
import VueSocialSharing from 'vue-social-sharing'
import slick from 'vue-slick'
import 'vue-loading-overlay/dist/vue-loading.css'

library.add(fab, fas, far)
Vue.component('font-awesome-icon', FontAwesomeIcon)
Vue.use(bootstrapVue, $, slick, FlippingWidget, TurnPlugin, BooklockPlugin, Booklock2Plugin, BookPlugin)
window.$ = require('jquery')
Vue.use(VueSocialSharing, {
  networks: {
    fakeblock: 'https://fakeblock.com/share?url=@url&title=@title' 
  }
})
window.jQuery = require('jquery')
Vue.prototype.$http = axios
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: function (h) { return h(App) }
}).$mount('#app')
