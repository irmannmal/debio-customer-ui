<template lang="pug">
  .customer-staking-tab
    ui-debio-data-table(
      :headers="headers"
      :items="items"
      :loading="isLoadingData"
    )
      template(v-slot:[`item.id`]="{ item }")
        .customer-staking-tab__id
          div {{ formatId(item.request.hash) }}

      template(v-slot:[`item.country`]="{ item }")
        .customer-staking-tab__country
          div {{ item.request.country ? country(item.request.country) : "N/A"}}

      template(v-slot:[`item.city`]="{ item }")
        .customer-staking-tab__city
          div {{ item.request.city ? item.request.city : "N/A"}}

      template(v-slot:[`item.category`]="{ item }")
        .customer-staking-tab__category
          div {{ item.request.service_category ? item.request.service_category : "N/A"}}

      template(v-slot:[`item.stakingDate`]="{ item }")
        .customer-staking-tab__staking-date
          span {{ formatDate(item.request.created_at) }}

      template(v-slot:[`item.stakeStatus`]="{ item }")
        .customer-staking-tab__stake-status
          span(:style="{color: setButtonBackground(item.request.status)}") {{ getStatusName(item.request.status) }} 

      template(v-slot:[`item.amount`]="{ item }")
      
        span(:style="setButtonBackground(item.request.status)") {{ setAmount(item.request.staking_amount) }}

      template(v-slot:[`item.actions`]="{ item }")
        .customer-staking-tab__actions(v-if="item.request.status !== 'WaitingForUnstaked'" )
          ui-debio-button.pa-4(
            height="25px"
            width="100px"
            style="font-size: 1em"
            color="primary"
            @click="getUnstakingDialog(item.request.hash)"
            :disabled="item.request.status === 'Unstaked' || item.request.status === 'Processed'"
          ) Unstake

          ui-debio-button.pa-4(
            v-if="item.request.status === 'Open' || item.request.status === 'Claimed'" 
            height="25px"
            style="font-size: 1em"
            width="100px"
            color="secondary"
            @click="toRequestTest(item)"
            :disabled="item.request.status === 'Open'"
          ) Proceed

        .customer-staking-tab__actions(v-else)
          ui-debio-button(disabled width="220px" color="white" )
            vue-countdown-timer(
              :start-time="new Date().getTime()"
              :end-time="setRemainingStakingDate(item.request.unstaked_at)"
              :interval="1000"
              :end-text="'-'"
              :day-txt="'D :'"
              :hour-txt="'H :'"
              :minutes-txt="'M :'"
              :seconds-txt="'S'"
            )

    ui-debio-alert-dialog(
      :show="showAlert"
      :width="289"
      title="Unpaid Order"
      message="Complete your unpaid order first before requesting a new one. "
      imgPath="alert-circle-primary.png"
      btn-message="Go to My Payment"
      @click="toPaymentHistory"
      )

</template>

<script>

import { mapState, mapMutations } from "vuex"
import { getServiceRequestByCustomer } from "@/common/lib/api"
import { getLocations } from "@/common/lib/api"
import { STAKE_STATUS_DETAIL } from "@/common/constants/status"
import { queryLastOrderHashByCustomer, queryServiceById, queryOrderDetailByOrderID, processRequest } from "@debionetwork/polkadot-provider"
import CryptoJS from "crypto-js"
import Kilt from "@kiltprotocol/sdk-js"
import { u8aToHex } from "@polkadot/util"
import { fmtReferenceFromHex } from "@/common/lib/string-format"
import { queryGetServiceOfferById } from "@/common/lib/polkadot-provider/query/service-request"
import { createOrder } from "@/common/lib/polkadot-provider/command/order.js"
import { setOrderPaid } from "@/common/lib/polkadot-provider/command/order"


export default {
  name: "StakingServiceTab",

  data: () => ({
    status: "",
    headers: [
      {
        text: "Staking ID",
        value: "id",
        sortable: true
      },
      {
        text: "Country",
        value: "country",
        sortable: true
      },
      {
        text: "City",
        value: "city",
        sortable: true
      },
      {
        text: "Test Category",
        value: "category",
        sortable: true
      },
      {
        text: "Staking Date",
        value: "stakingDate",
        sortable: true
      },
      {
        text: "Stake Status",
        value: "stakeStatus",
        sortable: true
      },
      {
        text: "Amount (DBIO)",
        value: "amount",
        sortable: true,
        align: "right"
      },
      {
        text: "Action",
        value: "actions",
        sortable: false,
        align: "center"
      }
    ],
    items: [],
    documents: null,
    tabs: null,
    showDialog: false,
    requestId: "",
    countries: [],
    isLoadingData: false,
    loading: false,
    showAlert: false,
    stakingData: null

  }),

  watch: {
    async lastEventData(event) {
      if (!event) return
      const dataEvent = JSON.parse(event.data.toString())
      const orderId = dataEvent[0].id

      if (event.method === "OrderCreated") {
        await this.setPaid(orderId)
      }

      if (event.method === "OrderPaid") {
        await this.processRequestService(dataEvent[0])
      }

      if(event.method === "ServiceRequestProcessed") this.toCheckout()
    }
  },

  computed: {
    ...mapState({
      api: (state) => state.substrate.api,
      pair: (state) => state.substrate.wallet,
      web3: (state) => state.metamask.web3,
      lastEventData: (state) => state.substrate.lastEventData,
      mnemonicData: (state) => state.substrate.mnemonicData
    })
  },

  async mounted () {
    await this.getCountries()
    await this.fetchData ()
  },

  methods: {
    ...mapMutations({
      setCategory: "lab/SET_CATEGORY",
      setStakingService: "lab/SET_STAKING_SERVICE",
      setStakingId: "lab/SET_STAKING_ID"
    }),

    async fetchData () {
      try {
        const { data } = await getServiceRequestByCustomer(this.pair.address)
        this.items = data
        this.items.sort((a, b) => {
          const dateA = (a.request.created_at).replace(/,/g, "")
          const dateB = (b.request.created_at).replace(/,/g, "")

          if(new Date(parseInt(dateA)) < new Date(parseInt(dateB))) {
            return 1
          } 
          
          if (new Date(parseInt(dateA)) > new Date(parseInt(dateB))) {
            return -1
          } 
          
          return 0
          
        })
        this.isLoadingData = false
      } catch (error) {
        console.log(error)
        this.isLoadingData = false
      }
    },

    async setPaid(id) {
      await setOrderPaid(this.api, this.pair, id)
    },

    async processRequestService(event) {
      const detailOrder = await queryOrderDetailByOrderID(this.api, event.id)
      await processRequest(
        this.api,
        this.pair,
        event.sellerId,
        this.stakingData.hash,
        event.id,
        detailOrder.dnaSampleTrackingId
      )
    },

    setAmount(amount) {
      const formatedAmount = this.web3.utils.fromWei(String(amount.replaceAll(",", "")), "ether")
      return formatedAmount
    },

    async getCountries() {
      const { data : { data }} = await getLocations()
      this.countries = data
    },

    country (country) {
      return this.countries.filter((c) => c.iso2 === country)[0].name
    },

    setRemainingStakingDate(date) {
      const formatedDate = new Date(parseInt(date.replace(/,/g, "")))
      const dueDate = formatedDate.setDate(formatedDate.getDate() + 6)

      return dueDate
    },

    async toRequestTest(req) {
      this.loading = true
      this.stakingData = req.request
      console.log(this.stakingData)
      const lastOrder = await this.getLastOrderId()


      if (lastOrder) {
        const detailOrder = await queryOrderDetailByOrderID(this.api, lastOrder)
        const status = detailOrder.status
        if (status === "Unpaid") {  
          this.showAlert = true
          return
        }
      }

      const request = req.request
      const serviceOffer = await queryGetServiceOfferById(this.api, request.hash)
      const service = await queryServiceById(this.api, serviceOffer.serviceId)
      await this.createOrder(service)
      this.$emit("loading")

    },
    
    toPaymentHistory() {
      this.$router.push({ name: "customer-payment-history" })
    },

    getCustomerPublicKey() {
      const identity = Kilt.Identity.buildFromMnemonic(this.mnemonicData.toString(CryptoJS.enc.Utf8))
      return u8aToHex(identity.boxKeyPair.publicKey)
    },

    async createOrder(service) {
      const assetId = service.currency === "USDT" ? 2 : 1      
      const customerBoxPublicKey = await this.getCustomerPublicKey() 
      const indexPrice = 0

      await createOrder(
        this.api,
        this.pair,
        service.id,
        indexPrice,
        customerBoxPublicKey,
        service.serviceFlow,
        assetId
      )
    },

    async getUnstakingDialog(id) {
      this.setStakingId(id)
      await this.$emit("unstake")
      this.requestId = id
    },

    setButtonBackground(status) {
      return STAKE_STATUS_DETAIL[status.toUpperCase()].color
    },

    getStatusName(status) {
      return STAKE_STATUS_DETAIL[status.toUpperCase()].display
    },

    formatDate(date) {
      const formattedDate = new Date(parseInt(date.replace(/,/g, ""))).toLocaleDateString("en-GB", {
        day: "numeric", month: "short", year: "numeric"
      })
      return formattedDate
    },
    
    formatId(id) {
      return fmtReferenceFromHex(id)
    },

    async getLastOrderId () {
      const lastOrderId = await queryLastOrderHashByCustomer(
        this.api,
        this.pair.address
      )
      this.lastOrderId = lastOrderId
      return lastOrderId
    },

    async toCheckout() {
      await this.getLastOrderId()
      
      this.$router.push({ 
        name: "customer-request-test-checkout", params: { id: this.lastOrderId }
      })
      this.$emit("closeLoading")
    }
  }
}
</script>

<style lang="sass" scoped>
  @import "@/common/styles/mixins.sass"

  .customer-staking-tab
    padding: 0 !important
    margin: -50px -28px 0 -28px

    &__tabs
      padding: 2px

    &__table
      width: 100%
      padding: 0px 30px

    &__id
      width: 74px

    &__country
      width: 60px

    &__category
      width: 112px

    &__staking-date
      width: 88px
    
    &__actions
      padding: 0 10px
      align-content: center
      margin: 0 10%
      display: flex
      align-items: center
      gap: 20px
</style>
