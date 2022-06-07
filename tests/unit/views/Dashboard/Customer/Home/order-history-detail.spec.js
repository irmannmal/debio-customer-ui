import { createLocalVue, shallowMount } from "@vue/test-utils"
import Vue from "vue"
import Vuex from "vuex"
import Vuetify from "vuetify/lib"
import VueRouter from "vue-router"
import OrderHistoryDetail from "@/views/Dashboard/Customer/Home/MyTest/OrderHistoryDetail"

Vue.use(Vuetify)

const localVue = createLocalVue()
localVue.use(Vuex)
localVue.use(VueRouter)

const myTest = {
  "id": "",
  "service_id": "",
  "customer_id": "",
  "customer_box_public_key": "",
  "seller_id": "",
  "dna_sample_tracking_id": "",
  "currency": "DAI",
  "prices": [
    {
      "component": "testing_price",
      "value": "1,000,000,000,000,000,000"
    }
  ],
  "additional_prices": [
    {
      "component": "qc_price",
      "value": "1,000,000,000,000,000,000"
    }
  ],
  "status": "Paid",
  "created_at": "1,652,762,808,002",
  "updated_at": "1,652,762,856,001",
  "lab_info": {
    "box_public_key": "",
    "name": "test 12",
    "email": "test@mail.com",
    "country": "ID",
    "region": "JK",
    "city": "Kota Administrasi Jakarta Timur",
    "address": "test",
    "phone_number": "",
    "website": "",
    "latitude": null,
    "longitude": null,
    "profile_image": ""
  },
  "service_info": {
    "prices_by_currency": [
      {
        "currency": "DAI",
        "total_price": "2,000,000,000,000,000,000",
        "price_components": [
          {
            "component": "testing_price",
            "value": "1,000,000,000,000,000,000"
          }
        ],
        "additional_prices": [
          {
            "component": "qc_price",
            "value": "1,000,000,000,000,000,000"
          }
        ]
      }
    ],
    "name": "test service name",
    "expected_duration": {
      "duration": "1",
      "durationType": "Days"
    },
    "category": "Single Gene",
    "description": "",
    "dna_collection_process": "",
    "test_result_sample": "",
    "long_description": "",
    "image": ""
  },
  "order_flow": "",
  "transaction_hash": ""
}

describe("Order History Detail", () => {
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
          api: "API"
        },
        metamask: {
          web3: {
            utils: "WEB3"
          }
        }
      }
    })
  })

  it("should render", () => {
    container = shallowMount(OrderHistoryDetail, {
      localVue,
      vuetify,
      router,
      store,
      data: () => ({
        myTest
      })
    })

    expect(container.exists()).toBe(true)
  })
})
