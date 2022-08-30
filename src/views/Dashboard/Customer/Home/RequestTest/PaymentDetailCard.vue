<template lang="pug">
  v-container.container-card
    v-card.menu-card
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

      .menu-card__rate ( {{ (this.usdRate * dataService.totalPrice).toFixed(3) }} USD )

      .menu-card__details(v-if="stakingFlow")
        .menu-card__sub-title Staking Amount
        .menu-card__price
          | {{ stakingAmount }}
          | {{ dataService.currency}}

      .menu-card__operation(v-if="stakingFlow") -
      hr.menu-card__line(v-if="stakingFlow")

      .menu-card__details(v-if="isDeficit && stakingFlow" style="color: red")
        .menu-card__sub-title-medium Remaining Amount
        .menu-card__price-medium
          | {{ remainingAmount }}
          | {{ dataService.currency}}

      .menu-card__details(v-if="isBalanced && stakingFlow")
        .menu-card__sub-title-medium Remaining Amount
        .menu-card__price-medium
          | 0
          | {{ dataService.currency}}

      .menu-card__details(v-if="isExcess" style="color: green")
        .menu-card__sub-title-medium Excess Amount
        .menu-card__price-medium
          | {{ excessAmount }}
          | {{ dataService.currency}}

      
      div(class="text-center" v-if="status === 'Cancelled'")
        div(class="d-flex justify-space-between align-center pa-4 ms-3 me-3")
          ui-debio-button(
            color="secondary"
            width="49%"
            height="35"
            @click="$router.push({name: 'customer-dashboard'})"
            style="font-size: 10px;"
            outlined 
            ) Go to Dashboard

          ui-debio-button(
            color="secondary"
            width="49%"
            height="35"
            style="font-size: 9px;"
            @click="toPaymentHistory"
            ) Go To Payment History

      div(class="text-center" v-else)
        div(v-if="!success && !isCreated" class="mt-3 d-flex justify-center align-center")
          ui-debio-button(
            :class="setMargin"
            color="secondary"
            width="280"
            height="35"
            @click="onSubmit"
            ) Submit Order

        div(v-if="success && status === 'Paid'" class="d-flex justify-space-between align-center pa-4 ms-3 me-3")
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

      PayRemainingDialog(
        :show="showPayRemainingDialog"
        :amount="remainingDbio"
        :amountInDai="remainingAmount"
        @onContinue="onContinue"
        @close="showPayRemainingDialog = false"
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
import { processRequest } from "@debionetwork/polkadot-provider"
import { queryLastOrderHashByCustomer, queryOrderDetailByOrderID } from "@debionetwork/polkadot-provider"
import PayRemainingDialog from "./PayRemainingDialog.vue"
import { getConversion, getOrderDetail, fetchTxHashOrder } from "@/common/lib/api"
import { getDNACollectionProcess } from "@/common/lib/api"
import { formatPrice } from "@/common/lib/price-format.js"

export default {
  name: "PaymentDetailCard",
  
  components: {
    PaymentReceiptDialog,
    PayRemainingDialog,
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
    stakingFlow: false,
    stakingAmount: 0,
    remainingDbio: 0,
    remainingAmount: 0,
    showPayRemainingDialog: false,
    orderId: "",
    isDeficit: false,
    isExcess: false,
    isBalanced: false,
    excessAmount: 0,
    showAlert: false,
    isCreated: false,
    success: false,
    loading: false,
    rate: null,
    usdRate: null
  }),

  async mounted () {
    this.stakingFlow = false
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

    if (this.dataService.serviceFlow === "StakingRequestService") {
      this.stakingFlow = true
      const debioBalance = await getConversion()
      const stakingAmount = Number(formatPrice(this.stakingData.staking_amount))
      this.stakingAmount = (stakingAmount * debioBalance.dbioToDai).toFixed(3)
      this.remainingAmount = this.dataService.totalPrice - this.stakingAmount
      this.remainingDbio = (this.remainingAmount / debioBalance.dbioToDai).toFixed(3)
      this.excessAmount = this.stakingAmount - this.dataService.totalPrice

      if (this.excessAmount > 0) {
        this.isExcess = true
      }


      if (Number(this.stakingAmoung) > Number(this.dataService.totalPrice)) {
        this.isExcess = true
      }

      if (Number(this.stakingAmount) === Number(this.dataService.totalPrice)) {
        this.isBalanced = true
      }

      if (Number(this.stakingAmount) < Number(this.dataService.totalPrice)) {
        this.isDeficit = true
      }
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
    }),

    setMargin() {
      if (this.stakingFlow) {
        return "mt-2"
      }
      return "mt-12"
    }
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
    }
  },

  methods: {
    ...mapMutations({
      setProductsToRequest: "testRequest/SET_PRODUCTS"
    }),

    async getUsdRate() {
      this.rate = await getConversion()
      if (this.rate) this.usdRate = this.rate.daiToUsd
    },

    async toEtherscan () {
      const { transaction_hash } = await fetchTxHashOrder(this.$route.params.hash)

      const anchor = document.createElement("a")
      anchor.target = "_blank"
      anchor.rel = "noreferrer noopener nofollow"
      // eslint-disable-next-line camelcase
      anchor.href = `${process.env.VUE_APP_ETHERSCAN}${transaction_hash}`
      anchor.click()
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

      if (this.isExcess) {
        await this.processRequestService()
        return
      }

      if (this.remainingAmount && this.remainingAmount > 0) {
        this.showPayRemainingDialog = true
        return
      }
      this.showReceipt = true
    },

    async processRequestService() {
      const lastOrder = await queryLastOrderHashByCustomer(
        this.api,
        this.wallet.address
      )

      const detailOrder = await queryOrderDetailByOrderID(
        this.api,
        lastOrder
      )

      await processRequest(
        this.api,
        this.wallet,
        this.stakingData.lab_address,
        this.stakingData.hash,
        detailOrder.id,
        detailOrder.dnaSampleTrackingId
      )

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
