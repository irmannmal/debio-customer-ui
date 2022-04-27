import { shallowMount } from "@vue/test-utils"
import GeneticResultPage from "@/views/Dashboard/Customer/Home/GeneticData/Result"
import Vuex from "vuex"
import Vue from "vue"
import VueRouter from "vue-router"
import "@/common/plugins/debionetwork-ui-components"

Vue.use(Vuex)
Vue.use(VueRouter)

const stubs = { uiDebioIcon: true }

const dataSample = {
  "service": {
    "name": "test",
    "pricesByCurrency": [
      {
        "currency": "DBIO",
        "totalPrice": "10,000,000,000,000,000,000",
        "priceComponents": [
          {
            "component": "analyze_price",
            "value": "10,000,000,000,000,000,000"
          }
        ],
        "additionalPrices": []
      }
    ],
    "expectedDuration": {
      "duration": "4",
      "durationType": "Days"
    },
    "description": "test",
    "testResultSample": "test"
  },
  "analyst": {
    "boxPublicKey": "0x0000000000000000000000000000000000000000000000000000000000000000",
    "firstName": "test",
    "lastName": "tes",
    "gender": "Male",
    "dateOfBirth": "473,385,600,000",
    "email": "test@gmail.com",
    "phoneNumber": "",
    "specialization": "test",
    "profileLink": "",
    "profileImage": "test"
  },
  "geneticData": {
    "geneticAnalysisTrackingId": "test",
    "geneticAnalystId": "test",
    "ownerId": "test",
    "reportLink": "test",
    "comment": null,
    "rejectedTitle": null,
    "rejectedDescription": null,
    "geneticAnalysisOrderId": "test",
    "createdAt": "1,649,128,986,000",
    "updatedAt": "1,650,526,506,000",
    "status": "ResultReady",
    "lastUpdate": "21 Apr 2022"
  }
}

GeneticResultPage.methods = {
  initialData: jest.fn(),
  prepareData: jest.fn(),
  parseResult: jest.fn(),
  handlePrevious: jest.fn()
}

describe("Genetic Result Page", () => {
  let container
  let router
  let store

  beforeEach(() => {
    router = new VueRouter({
      routes: [
        {
          path: "genetic-analysis-detail/:id?/result",
          name: "customer-genetic-analysis-result",
          meta: { parent: "customer-genetic-analysis-detail", pageHeader: "Result" },
          component: () => import(/* webpackChunkName */ "@/views/Dashboard/Customer/Home/GeneticData/Result")
        }
      ]
    })

    store = new Vuex.Store({
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

  afterEach(() => {
    container = null
  })

  it("Should render", async() => {
    const initialData = jest.spyOn(GeneticResultPage.methods, "initialData")
    await GeneticResultPage.methods.initialData()

    container = shallowMount(GeneticResultPage, {
      router,
      stubs,
      store,
      data: () => ({ details: dataSample })
    })

    expect(initialData).toHaveBeenCalled()
    expect(container.exists()).toBe(true)
  })
})
