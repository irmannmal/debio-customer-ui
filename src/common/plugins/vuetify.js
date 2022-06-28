import Vue from "vue"
import Vuetify from "vuetify"

Vue.use(Vuetify)

export default new Vuetify({
  theme: {
    themes: {
      light: {
        primary: "#C400A5",
        secondary: "#5640a5",
        success: "#52C41B",
        info: "#5640a5",
        accent: "#595959",
        error: "#F5222D",
        warning: "#FAAD15"
      },
      dark: {
        primary: "#C400A5",
        secondary: "#5640a5",
        success: "#52C41B",
        info: "#5640a5",
        accent: "#595959",
        error: "#F5222D",
        warning: "#FAAD15"
      }
    }
  }
})
