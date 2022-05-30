import { createLocalVue, shallowMount  } from "@vue/test-utils"
import Vue from "vue"
import Vuex from "vuex"
import Vuetify from "vuetify"
import VueRouter from "vue-router"
import PaymentReceiptDialog from "@/views/Dashboard/Customer/Home/RequestTest/PaymentReceiptDialog"

Vue.use(Vuetify)

const localVue = createLocalVue()
localVue.use(Vuex)
localVue.use(VueRouter)

describe("Payment Receipt dialog", () => {
  let container
  let store
  let vuetify
  let router

  beforeEach(() => {
    vuetify = new Vuetify()
    router = new VueRouter()
    store = new Vuex.Store({
      state: {
        substrate: {
          api: "API",
          wallet: "WALLET",
          lastEventData: "LAST_EVENT",
          mnemonicData: "claw spare illegal parrot crack chase buddy answer slim weird write uncle"
        },
        metamask: {
          metamaskWalletAddress: "WALLET_ADDRESS"
        },
        testRequest: {
          products: []
        }
      }
    })
  })

  it("shourd render", () => {
    container = shallowMount(PaymentReceiptDialog, {
      localVue,
      vuetify,
      router,
      store,
      propsData: {
        serviceDetail: {
          labName: "",
          labRate: "",
          labAddress: "",
          city: "",
          country: "",
          servicePrice: 1,
          currency: "",
          totalPrice: 1,
          qcPrice: 1
        }
      }
    })

    expect(container.exists()).toBe(true)
  })
})

