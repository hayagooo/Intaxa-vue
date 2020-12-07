const state = {
  user: [],
  token: localStorage.getItem('api_token'),
}

const getters = {
  isAuth: state => state.token !== null && state.token !== undefined && state.token !== 'null' && state.token !== '',
  getUser: state => state.user,
  getToken: state => state.token,
}

const mutations = {
  set_user(state, payload) {
    state.user = payload
  },
  set_token(state, payload) {
    state.token = payload
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
}