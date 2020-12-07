const state = {
  bookmark: localStorage.getItem('bookmark')
}

const getters = {
  getBookmark: state => state.bookmark,
  isBookmark: state => state.bookmark !== null && state.bookmark !== undefined && state.bookmark !== 'null',
}

export default {
  namespaced: true,
  state,
  getters,
}