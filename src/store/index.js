import Vue from 'vue'
import Vuex from 'vuex'
import Api from '../stores/Api.js'
import Auth from '../stores/Auth.js'
import Dashboard from '../stores/Dashboard.js'
import Magazine from '../stores/Magazine.js'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    Api,
    Auth,
    Dashboard,
    Magazine,
  }
})
