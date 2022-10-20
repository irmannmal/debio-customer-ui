import Web3 from "web3"
import store from "@/store/index"

const defaultState = {
  web3: null,
  isLoadingWeb3: false
}

export default {
  namespaced: true,

  state: {
    ...defaultState
  },
  mutations: {
    SET_LOADING_WEB3(state, isLoadingWeb3) {
      state.isLoadingWeb3 = isLoadingWeb3
    },

    SET_WEB3(state, web3Instance) {
      state.web3 = web3Instance
    }
  },
  actions: {
    async initWeb3({ commit }) {
      try {
        commit("SET_WEB3", null)
        commit("SET_LOADING_WEB3", true)

        const rpcUrl = store.getters["auth/getConfig"].web3Rpc
        const web3 = new Web3()
        web3.setProvider(new Web3.providers.HttpProvider(rpcUrl))
        const isConnected = await web3.eth.net.isListening()

        if (isConnected) {
          console.log(isConnected)
          commit("SET_WEB3", web3)
        }

        commit("SET_LOADING_WEB3", false)
        return { success: true }
      } catch (error) {
        console.error(error)

        commit("SET_WEB3", null)
        commit("SET_LOADING_WEB3", false)
        return { success: false, error }
      }
    }
  },
  getters: {
    getWeb3(state) {
      return state.web3
    }
  }
}
