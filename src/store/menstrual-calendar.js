const defaultState = {
  averageCycle: null,
  menstrualCalendarSelected: null,
  menstrualCalendarId: null,
  isStart: false
}

export default {
  namespaced: true,

  state: {
    ...defaultState
  },

  mutations: {
    SET_ISSTART(state, boolean) {
      state.isStart = boolean
    }

  },

  actions: {

  },
  
  getters: {
    
  }
}
