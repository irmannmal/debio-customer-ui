import { createLocalVue, shallowMount, config } from "@vue/test-utils"
import Vuetify from "vuetify"
import VueRouter from "vue-router"
import ServiceCard from "@/views/Dashboard/Customer/Home/GeneticData/Details/ServiceCard"

config.stubs["v-icon"] = { template: "<div></div>" }
config.stubs["ui-debio-avatar"] = { template: "<div></div>" }

describe("Service card", () => {
  let container
  let localVue = null

  beforeEach(() => {
    localVue = createLocalVue()
    localVue.use(Vuetify)
    localVue.use(VueRouter)
  })

  afterEach(() => {
    localVue = null
  })

  it("Should render", () => {
    container = shallowMount(ServiceCard, {
      localVue,
      vuetify: new Vuetify(),
      propsData: {
        service: {}
      }
    })
    expect(container.exists()).toBe(true)

  })
})
