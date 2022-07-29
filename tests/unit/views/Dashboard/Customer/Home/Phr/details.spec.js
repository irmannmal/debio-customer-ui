import { createLocalVue, shallowMount, config } from "@vue/test-utils"
import CustomerPHRDetails from "@/views/Dashboard/Customer/Home/Phr/Details"
import Vuex from "vuex"
import Vuetify from "vuetify"

config.stubs["ui-debio-modal"] = { template: "<div></div>" }
config.stubs["ui-debio-icon"] = { template: "<div></div>" }

const phrDocument = {
  "id": "0x6fd2cdd531c056d432d00185a000f19e86ac99c0c5330fd98c02dfec7137ade6",
  "ownerId": "5Da5aHSoy3Bxb7Kxo4HuPLY7kE9FKxEg93dVhCKeXJ5JGY25",
  "title": "PHR Dicki Maulana Yusuf",
  "category": "Vaccinations",
  "files": [
    {
      "id": "0xfe456ffebfe66b917f5a8f8e1f61bbb7fa7c2c84f4dfc336aa77476c8e1d5fe6",
      "electronicMedicalRecordId": "0x6fd2cdd531c056d432d00185a000f19e86ac99c0c5330fd98c02dfec7137ade6",
      "title": "Swab Test",
      "description": "This is my swab test result",
      "recordLink": "https://gateway.pinata.cloud/ipfs/QmSAEfYxBGjBdkc2GtAFQQHuBGQqE836j9eTTCz827b4Qz",
      "uploadedAt": "1,655,105,190,001"
    },
    {
      "id": "0x8bb28e7b29607fcebd2206b3a441d9b6bed18e67fb21b55d4515ac3d29fb93d7",
      "electronicMedicalRecordId": "0x6fd2cdd531c056d432d00185a000f19e86ac99c0c5330fd98c02dfec7137ade6",
      "title": "PCR Test",
      "description": "This is my PCR test",
      "recordLink": "https://gateway.pinata.cloud/ipfs/QmVDAfBrPsnr3tEfrK5DDAcq1tebTr7TT3q67GnhHWjREk",
      "uploadedAt": "1,655,105,190,001"
    },
    {
      "id": "0x37ab6de70845a80c1c25451fdb913e5e4603d59ba572bf31c4dc9558cdb4c2ef",
      "electronicMedicalRecordId": "0x6fd2cdd531c056d432d00185a000f19e86ac99c0c5330fd98c02dfec7137ade6",
      "title": "Vaccine's Result",
      "description": "This is my vaccinations result",
      "recordLink": "https://gateway.pinata.cloud/ipfs/QmeniE8WtuxYVUj6xY6LBAjh4BcKbVisfSLSVJX1iv5uXb",
      "uploadedAt": "1,655,105,190,001"
    }
  ]
}

describe("Customer PHR Dashboard Details", () => {
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
    CustomerPHRDetails.methods = {
      initialData: jest.fn()
    };
    container = shallowMount(CustomerPHRDetails, {
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
      }),
      data() {
        return { phrDocument }
      }
    })

    expect(container.exists()).toBe(true)
  })
})
