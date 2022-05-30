import { mount, config, createLocalVue } from "@vue/test-utils"
import TestResult from "@/views/Dashboard/Customer/Home/MyTest/TestResult"
import Vuex from "vuex"
import Vuetify from "vuetify"

config.stubs["ui-debio-card"] = { template: "<div></div>" }
config.stubs["ui-debio-modal"] = { template: "<div></div>" }
config.stubs["ui-debio-rating"] = { template: "<div></div>" }
config.stubs["ui-debio-textarea"] = { template: "<div></div>" }
config.stubs["v-container"] = { template: "<div></div>" }

describe("Test Result Page", () => {
  const localVue = createLocalVue()
  let container
  let vuetify

  beforeEach(() => {
    localVue.use(Vuex)
    vuetify = new Vuetify()
  })

  it("Should render", () => {
    container = mount(TestResult, {
      localVue,
      vuetify,
      store: new Vuex.Store({
        state: {
          substrate: {
            wallet: "WALLET"
          }
        }
      })
    })

    expect(container.exists()).toBe(true)
  })
})
