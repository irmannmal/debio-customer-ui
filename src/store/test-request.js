const defaultState = {
  lab: null,
  products: {},
  order: {}
}

export default {
  namespaced: true,
  state: { ...defaultState },
  mutations: {
    SET_LAB(state, lab) {
      state.lab = lab
    },
    SET_PRODUCTS(state, products) {
      state.products = products
    },
    CLEAR_TEST_REQUEST(state) {
      state.lab = null
      state.products = []
    },
    SET_ORDER(state, order) {
      state.order = order
    }
  },
  actions: {
    async getLab({ commit }, lab) {
      commit("SET_LAB", lab)
    },
    async getProduct({ commit }, product) {
      commit("SET_PRODUCTS", product)
    }
  }
}
