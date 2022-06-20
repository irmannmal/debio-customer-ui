import { createLocalVue, shallowMount, config } from "@vue/test-utils"
import Vuex from "vuex"
import Vuetify from "vuetify"
import VueRouter from "vue-router"
import StepperStatusCard from "@/views/Dashboard/Customer/Home/GeneticData/Details/StepperStatusCard"

config.stubs["v-icon"] = { template: "<div></div>" }
config.stubs["ui-debio-avatar"] = { template: "<div></div>" }

describe("Service card", () => {
  let container
  let localVue = null

  beforeEach(() => {
    localVue = createLocalVue()
    localVue.use(Vuex)
    localVue.use(Vuetify)
    localVue.use(VueRouter)
  })

  afterEach(() => {
    localVue = null
  })

  it("Should render", () => {
    StepperStatusCard.methods = {
      setClass: jest.fn()
    }

    container = shallowMount(StepperStatusCard, {
      localVue,
      vuetify: new Vuetify(),
      propsData: {
        analysis: {
          status: ""
        }
      },
      store: new Vuex.Store({
        state: {
          substrate: {
            api: "API"
          },
          metamask: {
            web3: "WEB3"
          }
        }
      }),
      data: () => ({
        activeStep: 1,
        orderDetail: {
          Registered: {
            status: "Awaiting Confirmation",
            message: "Your request has been sent.",
            active: 1
          },
          Rejected: {
            status: "Order Rejected",
            message: "Your request has been rejected by Genetic Analyst.",
            active: 1
          },
          InProgress: {
            status: "Confirmation Order",
            message: "Your request has been registered. You may send your sample to selected lab.",
            active: 2
          },
          ResultReady: {
            status: "Confirmation Order",
            message: "Your request being analyzed",
            active: 3
          }
        }
      })
    })
    expect(container.exists()).toBe(true)

  })
})
