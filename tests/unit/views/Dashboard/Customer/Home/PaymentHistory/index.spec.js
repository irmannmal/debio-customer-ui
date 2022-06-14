import { createLocalVue, shallowMount, config } from "@vue/test-utils"
import PaymentHistory from "@/views/Dashboard/Customer/Home/PaymentHistory"
import Vuex from "vuex"
import Vuetify from "vuetify"

config.stubs["ui-debio-input"] = { template: "<div></div>" }
config.stubs["ui-debio-icon"] = { template: "<div></div>" }
config.stubs["ui-debio-modal"] = { template: "<div></div>" }
config.stubs["ui-debio-banner"] = { template: "<div></div>" }
config.stubs["ui-debio-data-table"] = { template: "<div></div>" }

describe("Customer Payment History Dashboard", () => {
  let container
  let localVue = null

  beforeEach(() => {
    localVue = createLocalVue()
    localVue.use(Vuex)
  })

  afterEach(() => {
    localVue = null
  })

  it("Should render", () => {
    container = shallowMount(PaymentHistory, {
      localVue,
      vuetify: new Vuetify(),
      store: new Vuex.Store({
        state: {
          substrate: {
            api: "API",
            wallet: "WALLET",
            mnemonicData: "oil spend nation obey lecture behave lake diary reward forest gym apple"
          },
          auth: {
            loadingData: "LOADING"
          },
          metamask: {
            web3: "WEB3"
          }
        }
      })
    })

    expect(container.exists()).toBe(true)
  })
})
