import { shallowMount, createLocalVue } from "@vue/test-utils"
import PaymentHistoryDetails from "@/views/Dashboard/Customer/Home/PaymentHistory/Details"
import Vuex from "vuex"
import Vuetify from "vuetify"
import VueRouter from "vue-router"
import "@/common/plugins/debionetwork-ui-components"

const localVue = createLocalVue()

localVue.use(Vuex)
localVue.use(Vuetify)
localVue.use(VueRouter)

const stubs = {
  uiDebioModal: true,
  uiDebioIcon: true,
  uiDebioButton: true,
  uiDebioCard: true
}

const defaultOrder = {
  "order": {
    "id": "0x972cda43477c8e42484ab92334a3f155ba58a67c278b9ebc791febff850fbe6b",
    "service_id": "0x2bf787db333463b606f6e120dfe36de4f540918454b388052190bda445f82d5e",
    "customer_id": "5Da5aHSoy3Bxb7Kxo4HuPLY7kE9FKxEg93dVhCKeXJ5JGY25",
    "customer_box_public_key": "0x35aa27206bdb36f0e5cc892170ec3dd97630c86786be8cbbb71d6b0ebf76a832",
    "seller_id": "5Hj284yPGCrxjh7CHw5o1CFJXKf1DYfgbYk6CPrm1pPyCiYM",
    "dna_sample_tracking_id": "AE9T58X2KSWI1HUJ476E1",
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
    "status": "Cancelled",
    "created_at": "4 Apr 2022",
    "updated_at": "1,649,060,190,001",
    "lab_info": {
      "box_public_key": "0xc49a8b0f195bd05c6b5edd364ae43ff37c33edfbfeacd69ff097a7b9c3b39465",
      "name": "Bali Lab",
      "email": "bjhsxbsajn@gmail.com",
      "phone_number": "382992812929",
      "website": "https://lab.dev.debio.network/lab/registration",
      "country": "ID",
      "city": "Denpasar",
      "region": "BA",
      "address": "bali",
      "latitude": null,
      "longitude": null,
      "profile_image": "https://ipfs.io/ipfs/QmQyntJ9uCnmjwDh2AWujBQyb5K1QNob3cBDvrEScL5yHH/featured-lab.jpg"
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
      "name": "SG BUCCAL",
      "expected_duration": {
        "duration": "3",
        "durationType": "WorkingDays"
      },
      "category": "Single Gene",
      "description": "SHORT DESC SG BUCCAL",
      "dna_collection_process": "Epithelial Cells - Buccal Swab Collection Process",
      "test_result_sample": "https://ipfs.io/ipfs/QmQBHWRMhycXmBjMZEnUAeruekkwQc5FVxXxVMdFn5AgHF/Wireframe_Request_DNA_Analysis.pdf",
      "long_description": "LONG DESC SG BUCCAL",
      "image": "https://ipfs.io/ipfs/QmP5z6bDP5vh1Jexr2de31gwmXPjH572Lqgi2Jtrtqxt9y/IU.jfif"
    },
    "order_flow": "RequestTest",
    "blockMetaData": {
      "blockNumber": 88628,
      "blockHash": "0xb42105de921651a7e16ea57682a648f7f4b41c6dfda932e6d79d7012e06b3984"
    },
    "section": "order",
    "formated_id": "0x9...be6b",
    "rating": {
      "service_id": "0x2bf787db333463b606f6e120dfe36de4f540918454b388052190bda445f82d5e",
      "sum_rating_service": 0,
      "count_rating_service": 0,
      "rating_service": null
    },
    "status_class": "error--text"
  },
  "orderGA": {
    "id": "0x9a80be3cf28d6c97808a45169e4896a635937a5d00b7de53908d73c3d212333f",
    "service_id": "0x0a05afe158bc0766c4a8f755a8e02e7dc456bbad64e01aed248f59c0bbf314d3",
    "customer_id": "5Da5aHSoy3Bxb7Kxo4HuPLY7kE9FKxEg93dVhCKeXJ5JGY25",
    "customer_box_public_key": "0x35aa27206bdb36f0e5cc892170ec3dd97630c86786be8cbbb71d6b0ebf76a832",
    "seller_id": "5DcWiG6XUcBtoG9XRRoay3LRzGWATbNuWppYyPfeMDEYaeYN",
    "genetic_data_id": "0x4c981b074d9380417ebf8fb90289500fceca23c05ed114488feb1f693dbb0132",
    "genetic_analysis_tracking_id": "M8O4UGZQTU7NT2QN0FMFD",
    "currency": "DBIO",
    "prices": [
      {
        "component": "analyze_price",
        "value": "10,000,000,000,000,000,000"
      }
    ],
    "additional_prices": [],
    "status": "Paid",
    "created_at": "5 Apr 2022",
    "updated_at": "1,649,129,010,000",
    "service_info": {
      "name": "A Genome Services",
      "prices_by_currency": [
        {
          "currency": "DBIO",
          "total_price": "10,000,000,000,000,000,000",
          "price_components": [
            {
              "component": "analyze_price",
              "value": "10,000,000,000,000,000,000"
            }
          ],
          "additional_prices": []
        }
      ],
      "expected_duration": {
        "duration": "4",
        "duration_type": "Days"
      },
      "description": "a service of genomic analysis and data interpretation services for those who need",
      "test_result_sample": "https://ipfs.debio.network/ipfs/QmYZh1jxcfVf7GwVZuCxViKS552Xf7Py2cZQf5VUBWuHno"
    },
    "genetic_analyst_info": {
      "first_name": "Harry James",
      "last_name": "Potter",
      "gender": "Male",
      "date_of_birth": "473,385,600,000",
      "email": "harry@potter.com",
      "phone_number": "",
      "specialization": "Personalized medicine",
      "profile_link": "",
      "profile_image": "https://ipfs.io/ipfs/QmbTV7WFeqVPeZuoA74f9okWVoXwf54rLd9W94oHuHNtgb/Harry_Potter_character_poster.jpeg",
      "name": "Harry James Potter"
    },
    "blockMetaData": {
      "blockNumber": 100098,
      "blockHash": "0x4276b698524f9178285d3538fe79c57e5ae31b030cfe2f175bae8c6152a68615"
    },
    "formated_id": "0x9...333f",
    "status_class": "success--text",
    "section": "orderGA"
  }
}

jest.mock("@debionetwork/polkadot-provider", () => ({
  queryGeneticAnalysisByGeneticAnalysisTrackingId: jest.fn(() => {
    return {
      geneticAnalysisTrackingId: "SZ9A8QNBT0ZBV8WPEZVAZ",
      geneticAnalystId: "5DcWiG6XUcBtoG9XRRoay3LRzGWATbNuWppYyPfeMDEYaeYN",
      ownerId: "5Da5aHSoy3Bxb7Kxo4HuPLY7kE9FKxEg93dVhCKeXJ5JGY25",
      reportLink: null,
      comment: null,
      rejectedTitle: null,
      rejectedDescription: null,
      geneticAnalysisOrderId: "0x42a8998edd2177ec7b505f65f5becb20b84da1ca1bd62b9b82630355c09a1805",
      createdAt: "1,649,043,486,000",
      updatedAt: "1,649,043,486,000",
      status: "Registered"
    }
  }),
  queryDnaSamples: jest.fn(() => {
    return {
      trackingId: "JKSNNX0ILF0FELPU80OBZ",
      labId: "5Hj284yPGCrxjh7CHw5o1CFJXKf1DYfgbYk6CPrm1pPyCiYM",
      ownerId: "5Da5aHSoy3Bxb7Kxo4HuPLY7kE9FKxEg93dVhCKeXJ5JGY25",
      status: "Registered",
      orderId: "0xb44114546064160514b47c2ddf5d3afbda3af8abcff35de08abadb7f9a472319",
      rejectedTitle: null,
      rejectedDescription: null,
      createdAt: "1,648,776,792,000",
      updatedAt: "1,648,776,792,000"
    }
  })
}))

describe("Customer Payment History Dashboard", () => {
  let container
  let vuetify
  let store
  let router

  beforeEach(() => {
    vuetify = new Vuetify()
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
    router = new VueRouter({
      routes: [
        {
          path: "payment-histories",
          name: "customer-payment-history",
          meta: { pageHeader: "Payment History" },
          component: () => import(/* webpackChunkName */ "@/views/Dashboard/Customer/Home/PaymentHistory")
        }
      ]
    })
  })

  afterEach(() => {
    container = null
  })

  it("Should render", () => {
    container = shallowMount(PaymentHistoryDetails, {
      localVue,
      vuetify,
      store,
      router,
      global: {
        stubs
      }
    })

    expect(container.exists()).toBe(true)
  })

  it("Should render with default order details", async () => {
    PaymentHistoryDetails.methods = {
      fetchDetails: jest.fn(),
      handleCopy: jest.fn(),
      handleCTA: jest.fn(),
      formatPrice: jest.fn()
    }

    container = shallowMount(PaymentHistoryDetails, {
      localVue,
      vuetify,
      store,
      router,
      global: {
        stubs
      },
      data: () => ({ payment: { ...defaultOrder.order } })
    })

    expect(container.html()).toContain("Specimen Number")
  })

  it("Should render with GA order details", async () => {
    PaymentHistoryDetails.methods = {
      fetchDetails: jest.fn(),
      handleCopy: jest.fn(),
      handleCTA: jest.fn(),
      formatPrice: jest.fn()
    }

    container = shallowMount(PaymentHistoryDetails, {
      localVue,
      vuetify,
      store,
      router,
      global: {
        stubs
      },
      data: () => ({ payment: { ...defaultOrder.orderGA } })
    })

    expect(container.html()).not.toContain("Specimen Number")
  })
})
