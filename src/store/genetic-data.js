const defaultState ={
  selectedData: null,
  selectedAnalysisSerivice: null,
  loadingProgress: null,
  cancelUpload: null
}

export default {
  namespaced: true,
  state: {...defaultState},
  mutations: {
    SET_SELECTED_DATA(state, data){
      state.selectedData = data
    },

    SET_SELECTED_SERVICE(state, data){
      state.selectedAnalysisSerivice = data
    },

    SET_LOADING_PROGRESS(state, data){
      state.loadingProgress = data
    },

    SET_CANCEL_UPLOAD(state, data){
      state.cancelUpload = data
    }
  },
  actions: {
    async getData({ commit }, data) {
      commit("SET_SELECTED_DATA", data)
    },

    async getSelectedAnalysisService({ commit }, data) {
      commit("SET_SELECTED_SERVICE", data)
    },

    async getLoadingProgress({ commit }, data) {
      if (!data.download) {
        commit("SET_LOADING_PROGRESS", data.upload)
        return
      }
      let download = Math.round(data.download/2)
      let upload = data.upload ? Math.round(data.upload/2) : 0
      const total = download + upload
      commit("SET_LOADING_PROGRESS", total)
    },

    async setCancel({commit}, data) {
      commit("SET_CANCEL_UPLOAD", data)
    }
  }
}
