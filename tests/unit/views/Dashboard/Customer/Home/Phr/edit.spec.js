import { createLocalVue, shallowMount, config } from "@vue/test-utils"
import CustomerPHREdit from "@/views/Dashboard/Customer/Home/Phr/Edit"
import Vuex from "vuex"
import Vuetify from "vuetify"

config.stubs["ui-debio-icon"] = { template: "<div></div>" }
config.stubs["ui-debio-input"] = { template: "<div></div>" }
config.stubs["ui-debio-modal"] = { template: "<div></div>" }
config.stubs["ui-debio-banner"] = { template: "<div></div>" }
config.stubs["ui-debio-dropdown"] = { template: "<div></div>" }

describe("Customer PHR Dashboard", () => {
  let container
  let localVue = null

  beforeEach(() => {
    localVue = createLocalVue()
    localVue.use(Vuex)
    localVue.use(Vuetify)
  })

  afterEach(() => {
    localVue = null
  })

  it("Should render", () => {
    CustomerPHREdit.methods = {
      initialData: jest.fn(), 
      initialDataKey: jest.fn(), 
      fetchCategories: jest.fn() 
    };
    container = shallowMount(CustomerPHREdit, {
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
