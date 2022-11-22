<template lang="pug">
  v-container.container-card
    v-skeleton-loader(
      v-if="fetching"
      type="card"
      width="300"
    )

    v-card.menu-card(v-if=!fetching)
      .menu-card__title Order Summary

      .menu-card__sub-title-medium Details

      hr.menu-card__line

      .menu-card__details
        .menu-card__sub-title Service Price
        .menu-card__price 
          | {{ dataService.servicePrice }}
          | {{ dataService.currency }}
    
      .menu-card__details
        .menu-card__sub-title Quality Control Price
        .menu-card__price 
          | {{ dataService.qcPrice }} 
          | {{ dataService.currency }}

      .menu-card__operation +
      hr.menu-card__line

      .menu-card__details
        .menu-card__sub-title-medium Total Price
        .menu-card__price-medium
          | {{ dataService.totalPrice }} 
          | {{ dataService.currency}}

      .menu-card__rate ( {{ this.usdRate }} USD )
      
      div(class="text-center" v-if="status === 'Cancelled'")
        div(class="d-flex justify-space-between align-center pa-4 ms-3 me-3")
          ui-debio-button(
            color="secondary"
            width="49%"
            height="35"
            @click="$router.push({name: 'customer-dashboard'})"
            style="font-size: 10px;"
            outlined 
            ) Go to Dashboard {{ status }}

          ui-debio-button(
            color="secondary"
            width="49%"
            height="35"
            style="font-size: 9px;"
            @click="toPaymentHistory"
            ) Go To Payment History

      div(class="text-center" v-else)
        div(v-if="!success && !isCreated" class="mt-3 d-flex justify-center align-center")
          ui-debio-button.mt-12(
            color="secondary"
            width="280"
            height="35"
            @click="onSubmit"
            ) Submit Order

        div(v-if="status === 'Paid'" class="d-flex justify-space-between align-center pa-4 ms-3 me-3")
          ui-debio-button(
            color="secondary"
            width="50%"
            height="35"
            style="font-size: 9px;"
            @click="toPaymentHistory"
            outlined
            ) Go To Payment History

          ui-debio-button(
            color="secondary"
            width="42%"
            height="35"
            @click="toInstruction(dataService.dnaCollectionProcess)"
            style="font-size: 9px;"
            ) View Instruction

        div(v-if="status === 'Unpaid'" class="d-flex justify-space-between align-center pa-4 ms-3 me-3")
          ui-debio-button(
            color="primary"
            width="46%"
            height="35"
            @click="showCancelConfirmation"
            style="font-size: 10px;"
            outlined 
            :loading="loading"
            ) Cancel Order

          ui-debio-button(
            color="secondary"
            width="46%"
            height="35"
            style="font-size: 10px;"
            @click="onSubmit"
            :disabled="loading"
            ) Pay
            
    template
      PaymentReceiptDialog(
        :show="showReceipt"
        :serviceDetail="dataService"
        @onContinue="onContinue"
        @close="showReceipt = false"
      )

      CancelDialog(
        :show="cancelDialog"
        :orderId="orderId"
        @cancel="setCancelled"
        @close="cancelDialog = false"
      )

      ui-debio-alert-dialog(
        :show="showAlert"
        :width="289"
        title="Unpaid Order"
        message="Complete your unpaid order first before requesting a new one. "
        imgPath="alert-circle-primary.png"
        btn-message="Go to My Payment"
        @close="showAlert = false"
        @click="toPaymentHistory"
      )
</template>

<script>
import { mapState, mapMutations } from "vuex"
import CryptoJS from "crypto-js"	
import Kilt from "@kiltprotocol/sdk-js"
import { u8aToHex } from "@polkadot/util"
import CancelDialog from "@/common/components/Dialog/CancelDialog"
import PaymentReceiptDialog from "./PaymentReceiptDialog.vue"
import { cancelOrder } from "@debionetwork/polkadot-provider"
import { queryLastOrderHashByCustomer, queryOrderDetailByOrderID } from "@debionetwork/polkadot-provider"
import { getConversion, getOrderDetail } from "@/common/lib/api"
import { getDNACollectionProcess } from "@/common/lib/api"

export default {
  name: "PaymentDetailCard",
  
  components: {
    PaymentReceiptDialog,
    CancelDialog
  },

  data: () => ({
    showReceipt: false,
    newService: false,
    lastOrder: null,
    detailOrder: null,
    cancelDialog: false,
    isCancelled: false,
    status: "Unpaid",
    labDetail: null,
    orderId: "",
    showAlert: false,
    isCreated: false,
    success: false,
    loading: false,
    rate: null,
    usdRate: null
  }),

  props: {
    fetching: { type: Boolean, default: false }
  },

  async mounted () {

    if(this.$route.name === "customer-request-test-success") {
      this.success = true
    }

    this.getUsdRate()

    if(this.$route.params.hash) {
      this.success = true
    }

    if(this.$route.params.id) {
      this.isCreated = true
    }

    const orderId = this.$route.params.id || this.$route.params.hash

    // get last order id
    this.lastOrder = await queryLastOrderHashByCustomer(
      this.api,
      this.wallet.address
    )
    
    if (this.lastOrder) {
      const detailOrder = await queryOrderDetailByOrderID(this.api, orderId)
      this.detailOrder = detailOrder
      this.orderId = this.detailOrder.id
      this.status = this.detailOrder.status
    }
  },

  computed: {
    ...mapState({
      api: (state) => state.substrate.api,
      wallet: (state) => state.substrate.wallet,
      mnemonicData: (state) => state.substrate.mnemonicData,
      dataService: (state) => state.testRequest.products,
      metamaskWalletAddress: (state) => state.metamask.metamaskWalletAddress,
      stakingData: (state) => state.lab.stakingData,
      web3: (state) => state.metamask.web3,
      lastEventData: (state) => state.substrate.lastEventData
    })
  },

  watch: {
    lastEventData(event) {
      if (!event) return
      if (event.method === "OrderCancelled" && this.isCancelled) {
        this.loading = false
        this.$router.push({
          name: "customer-request-test-canceled",
          params: {
            hash: this.$route.params.id || this.$route.params.hash
          }
        })
      }

      if(event.method === "OrderPaid") {
        this.status = "Paid"
      }
    }
  },

  methods: {
    ...mapMutations({
      setProductsToRequest: "testRequest/SET_PRODUCTS"
    }),

    async getUsdRate() {
      const totalPrice = Number(this.dataService.totalPrice.split(",").join(""));
      this.rate = await getConversion(this.dataService.currency, "USD")
      this.usdRate = Number(this.rate.conversion * totalPrice).toFixed(4)
    },

    toPaymentHistory () {
      this.$router.push({ name: "customer-payment-history" })
    },

    async onSubmit () {
      this.lastOrder = await queryLastOrderHashByCustomer(
        this.api,
        this.wallet.address
      )

      if(this.lastOrder){
        this.detailOrder = await queryOrderDetailByOrderID(this.api, this.lastOrder)
      }

      this.showReceipt = true
    },

    getCustomerPublicKey() {
      const identity = Kilt.Identity.buildFromMnemonic(this.mnemonicData.toString(CryptoJS.enc.Utf8))
      this.publicKey = u8aToHex(identity.boxKeyPair.publicKey)
      this.secretKey = u8aToHex(identity.boxKeyPair.secretKey)
      return u8aToHex(identity.boxKeyPair.publicKey)
    },

    onContinue() {
      this.$emit("onContinue")
    },

    async toInstruction (val) {

      const description = this.dataService.longDescription.split("||")

      if (description.length > 1) {
        window.open(description[1], "_blank")
        return
      }

      const dnaCollectionProcess = await getDNACollectionProcess()
      const link = dnaCollectionProcess.filter(e => e.collectionProcess === val)[0].link
      window.open(link, "_blank")
    },

    showCancelConfirmation () {
      this.cancelDialog = true
    },

    async setCancelled() {
      this.loading = true
      this.isCancelled = true
      if (this.orderCreated) {
        await cancelOrder(
          this.api, 
          this.wallet,
          this.$route.params.id
        )
      }
    },

    async getDataService() {
      const data = await getOrderDetail(this.$route.params.id)

      if (data.status !== "Unpaid") {
        this.$router.push({ name: "customer-payment-history" })
      }

      const service = {
        serviceId: data.service_id,
        serviceName: data.service_info.name,
        serviceRate: 0,
        serviceImage: data.service_info.image,
        serviceCategory: data.service_info.category,
        serviceDescription: data.service_info.description,
        labName: data.lab_info.name,
        labId: data.seller_id,
        labImage: data.lab_info.profile_image,
        labRate: 0,
        labAddress: data.lab_info.address,
        price: (data.service_info.prices_by_currency[0].total_price).replaceAll(",", ""),
        detailPrice: data.service_info.prices_by_currency[0],
        currency: data.service_info.prices_by_currency[0].currency,
        city: data.lab_info.city,
        country: data.lab_info.country,
        region: data.lab_info.region,
        countRateLab: 0,
        countServiceRate: 0,
        duration: data.service_info.expected_duration.duration,
        durationType: data.service_info.expected_duration.durationType,
        verificationStatus: "Verified",
        indexPrice: 0,
        dnaCollectionProcess: data.service_info.dna_collection_process
      }

      this.setProductsToRequest(service)

    }
  }
}
</script>

<style lang="sass" scoped>
  @import "@/common/styles/mixins.sass"

  .container-card
    width: 360px
    height: 328px
    border-radius: 8px

  .menu-card
    border-radius: 8px
    padding: 2px
    height: 320px

    &__title
      margin-top: 30px
      margin-bottom: 25px
      justify-content: center
      display: flex
      @include h6-opensans

    &__sub-title
      margin-left: 38px
      @include body-text-3-opensans

    &__sub-title-medium
      margin-left: 38px
      @include body-text-3-opensans-medium

    &__price
      margin-right: 38px
      @include body-text-3-opensans

    &__price-medium
      margin-right: 38px
      @include body-text-3-opensans-medium

    &__line
      margin: 1px 24px

    &__details
      display: flex
      justify-content: space-between

    &__rate
      display: flex
      align-items: center
      justify-content: flex-end
      margin-right: 38px
      @include tiny-reg

    &__operation
      margin-right: 24px
      display: flex
      justify-content: flex-end
      @include body-text-3-opensans-medium
</style>
