import { createLocalVue, shallowMount } from "@vue/test-utils"
import Vue from "vue"
import Vuex from "vuex"
import Vuetify from "vuetify"
import VueRouter from "vue-router"
import PaymentSuccess from "@/views/Dashboard/Customer/Home/RequestTest/Success/PaymentSuccess"

Vue.use(Vuetify)

const localVue = createLocalVue()
localVue.use(VueRouter)

describe("Success page", () => {
  let container
  let vuetify
  let store
  
  beforeEach(() => {
    vuetify = new Vuetify()
    store = new Vuex.Store({
      state: {
        testRequest: {
          products: {},
          detailOrder: {}
        }
      }
    })
  })

  it("should render", () => {
    container = shallowMount(PaymentSuccess, {
      localVue,
      vuetify,
      store
    })
    
    expect(container.exists()).toBe(true)
  })
})
