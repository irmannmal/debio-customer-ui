import { createLocalVue, shallowMount, config } from "@vue/test-utils"
import MyTest from "@/views/Dashboard/Customer/Home/MyTest"
import Vuex from "vuex"
import Vuetify from "vuetify"

jest.mock("@debionetwork/polkadot-provider", () => ({
  queryDnaSamples: jest.fn(() => {
    return {
      trackingId: "CU6F63ADJ9RTWF5J10CU6",
      labId:" 5FFEr8P3DnLHzVybCYV4JsM9d9SmHCJZcMEMB9dBowcnUx4z",
      ownerId: "5G3gNkTpmv2dmnJs5je5tT2DpUy2w2yXtfUoAYwcaH7tVVnC",
      status: "Registered",
      orderId: "0x6ad6f473bc381f5a2e56faf9f3a69c7cbee2fbe5f395420b4921be5ef0f33cb5",
      rejectedTitle: null,
      rejectedDescription: null,
      createdAt: "1,643,181,408,001",
      updatedAt: "1,643,181,408,001"
    }
  }),
  queryDnaTestResults: jest.fn(() => {
    return {
      trackingId: "MZYNDX3ROYMHXWEKIY50M",
      labId: "5DM74887MsaaDHHqaK9Nf84xPV8Gw3bWvRaufR9wou7nb4o1",
      ownerId: "5FmohAvhCKiahYwrvT2PA2SWBRNj5FxQ5WeAbaz4quV3oufG",
      comments: null,
      resultLink: "https://ipfs.io/ipfs/tmp",
      reportLink: "https://ipfs.io/ipfs/tmp",
      orderId: "0x9610a03baa48bb7254afa6b96acf4eb16330198719308893f06198de873770a1",
      createdAt: "1,650,554,598,001",
      updatedAt: "1,650,554,598,001"
    }
  })
}))

config.stubs["ui-debio-button"] = { template: "<div></div>" }
config.stubs["ui-debio-icon"] = { template: "<div></div>" }
config.stubs["ui-debio-banner"] = { template: "<div></div>" }
config.stubs["ui-debio-data-table"] = { template: "<div></div>" }
config.stubs["ui-debio-avatar"] = { template: "<div></div>" }

describe("Dashboard My Test", () => {
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
    container = shallowMount(MyTest, {
      localVue,
      vuetify: new Vuetify(),
      store: new Vuex.Store({
        state: {
          substrate: {
            api: "API",
            wallet: "WALLET",
            lastEventDate: "LAST_EVENT",
            mnemonicData: "oil spend nation obey lecture behave lake diary reward forest gym apple"
          },
          auth: {
            loadingData: "LOADING"
          },
          metamask: {
            web3: "WEB3"
          },
          lab: {
            stakingId: "STAKING_ID"
          }
        }
      })
    })

    expect(container.exists()).toBe(true)
  })
})
