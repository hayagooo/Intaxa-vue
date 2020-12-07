const state = {
  showAside: true,
  asideName: 'Dashboard',
  asideDashboard: true,
}

const getters = {
  getShowAside: state => state.showAside,
  getAsideName: state => state.asideName,
  getAsideDashboard: state => state.asideDashboard,
}

const mutations = {
  set_showAside(state, payload) {
    state.showAside = payload
  },
  set_asideName(state, payload) {
    state.asideName = payload
  },
  set_asideDashboard(state, payload) {
    state.asideDashboard = payload
  },
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
}