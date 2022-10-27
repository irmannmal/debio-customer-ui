<template lang="pug">
  v-dialog.dialog-payment(:value="show" width="400" rounded persistent )
    v-card.dialog-payment__card(v-if="!isLoading")
      v-app-bar(flat dense color="white")
        v-spacer
        v-btn(icon @click="closeDialog")
          v-icon mdi-close

      .dialog-payment__title Payment
      .dialog-payment__lab
        .dialog-payment__lab-name {{ selectedService.labName }} 
        .dialog-payment__lab-address {{ selectedService.labAddress }}
        .dialog-payment__lab-address {{ selectedService.city }}
        .dialog-payment__detail-medium Details
        
        hr.dialog-payment__line
      
        .dialog-payment__desc
          .dialog-payment__detail Service Price
          .dialog-payment__detail
            | {{ serviceDetail.servicePrice }} 
            | {{ serviceDetail.currency }} 

        .dialog-payment__desc
          .dialog-payment__detail Quality Control Price
          .dialog-payment__detail
            | {{ serviceDetail.qcPrice }} 
            | {{ serviceDetail.currency }}
       
        .dialog-payment__operation +

        hr.dialog-payment__line

        .dialog-payment__desc
          .dialog-payment__total Total Pay
          .dialog-payment__total-detail
            | {{ serviceDetail.totalPrice }} 
            | {{ serviceDetail.currency }}

        .dialog-payment__desc
          .dialog-payment__trans-weight Estimated Transaction Weight
            v-tooltip.visible(bottom)
              template(v-slot:activator="{ on, attrs }")
                v-icon.dialog-payment__icon(
                  color="primary"
                  dark
                  v-bind="attrs"
                  v-on="on"
                ) mdi-alert-circle-outline 
              span(style="font-size: 10px;") Total fee paid in DBIO to execute this transaction.
          .dialog-payment__trans-weight-amount {{ Number(txWeight).toFixed(4) }} DBIO

        ui-debio-button.mt-10(
          color="secondary" 
          width="100%"
          height="38"
          @click="onSubmit"
        ) Pay

    v-card.dialog-payment__card(v-if="isLoading")
      .dialog-payment__card-loading
        SpinnerLoader(
          :color="'#C400A5'"
          :size="140"
        )
      .dialog-payment__card-loading-text Loading...
      .dialog-payment__card-loading-desc Please wait while we're processing your payment

    ui-debio-error-dialog(
      :show="showError"
      :title="errorTitle"
      :message="errorMsg"
      @close="showError = false"
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

import { mapState } from "vuex"
import { serviceHandlerMixin } from "@/common/lib/polkadot-provider"
import { 
  queryLastOrderHashByCustomer,
  queryOrderDetailByOrderID
} from "@debionetwork/polkadot-provider"
import CryptoJS from "crypto-js"	
import Kilt from "@kiltprotocol/sdk-js"
import { u8aToHex } from "@polkadot/util"
import { errorHandler } from "@/common/lib/error-handler"
import SpinnerLoader from "@bit/joshk.vue-spinners-css.spinner-loader"
import { setOrderPaid, setOrderPaidFee } from "@/common/lib/polkadot-provider/command/order"

export default {
  name: "PaymentReceiptDialog",

  components: {
    SpinnerLoader
  },

  mixins: [serviceHandlerMixin],

  props: {
    show: Boolean,
    serviceDetail: Object,
    orderDetail: Object
  },

  data: () => ({
    error: "",
    ethSellerAddress: null,
    ethAccount: null,
    isCompleted: false,
    isLoading: false,
    lastOrder: null,
    detailOrder: null,
    status: "",
    orderId: "",
    txHash: "",
    showError: false,
    showAlert: false,
    errorTitle: "",
    errorMsg: "",
    txWeight: "",
    customerBoxPublicKey: null,
    isLoadingButton: false
  }),

  computed: {
    ...mapState({
      api: (state) => state.substrate.api,
      wallet: (state) => state.substrate.wallet,
      lastEventData: (state) => state.substrate.lastEventData,
      mnemonicData: (state) => state.substrate.mnemonicData,
      selectedService: (state) => state.testRequest.products,
      stakingData: (state) => state.lab.stakingData,
      web3: (state) => state.metamask.web3,
      usnBalance: (state) => state.substrate.usnBalance,
      usdtBalance: (state) => state.substrate.usdtBalance
    })
  },

  watch: {
    async lastEventData(event) {
      if (event) {
        const dataEvent = JSON.parse(event.data.toString())

        if (event.method === "OrderPaid") {

          this.isLoading = false
          this.$router.push({ 
            name: "customer-request-test-success",
            params: {
              hash: dataEvent[0].id
            }
          })
        }

        if (event.method === "EthAddressSet") {
          this.isLoadingButton = false
        }
      }
    }
  },

  async created() {
    if (this.selectedService) {
      await this.calculateTxWeight()
    }

    if (this.mnemonicData) {
      await this.getCustomerPublicKey()
    }
  },

  methods: {

    async getCustomerPublicKey() {
      const identity = Kilt.Identity.buildFromMnemonic(this.mnemonicData.toString(CryptoJS.enc.Utf8))
      this.customerBoxPublicKey = u8aToHex(identity.boxKeyPair.publicKey)
    },

    async calculateTxWeight() {
      this.txWeight = "Calculating..."

      this.lastOrder = await queryLastOrderHashByCustomer(
        this.api,
        this.wallet.address
      )
      
      const txWeight = await setOrderPaidFee(
        this.api,
        this.wallet,
        this.selectedService.serviceId
      )
      this.txWeight = this.web3.utils.fromWei(String(txWeight.partialFee), "ether")
    },

    async onSubmit () {
      this.isLoading = true
      this.error = ""

      try {

        this.lastOrder = await queryLastOrderHashByCustomer(
          this.api,
          this.wallet.address
        )

        if (this.lastOrder) {
          this.detailOrder = await queryOrderDetailByOrderID(this.api, this.lastOrder)
          this.status = this.detailOrder.status
          if (this.status === "Unpaid" && !this.$route.params.id) {
            this.showAlert = true
            this.closeDialog()
            return
          }

          const balance =  this.detailOrder.currency === "USN" ? this.usnBalance : this.usdtBalance
          
          if (Number(balance) - 1 <= Number(this.serviceDetail.totalPrice.replaceAll(",", ""))) {
            this.isLoading = false
            this.showError = true
            const error = await errorHandler("Insufficient Balance")
            this.error = error.message
            this.errorTitle = error.title
            this.errorMsg = error.message
            return
          }

          await setOrderPaid(this.api, this.wallet, this.lastOrder)
          return
        }
        
      } catch (err) {
        this.isLoading = false
        const error = await errorHandler(err.message)
        this.showError = true
        this.errorTitle = error.title
        this.errorMsg = error.message
      }
    },

    closeDialog(){
      this.$emit("close")
    },

    toPaymentHistory() {
      this.$router.push({ name: "customer-payment-history" })
    }
  }
}
</script>

<style lang="sass" scoped>
  @import "@/common/styles/mixins.sass"

  .visible
    height: 3em
    width: 3em
    background-color: white
  
  .dialog-payment
    width: 400
    height: 500
    
    &__card
      background-color: white
      padding-bottom: 51px
    
    &__title
      display: flex
      justify-content: center
      margin-top: 21.25px
      @include h6-opensans

    &__lab
      padding-left: 50px
      padding-right: 50px

    &__lab-name
      padding-top: 30px
      @include button-2

    &__lab-address
      max-width: 350px
      @include body-text-3-opensans

    &__detail-medium
      margin-top: 35px
      @include body-text-3-opensans-medium
    
    &__detail
      margin-right: 15px
      @include body-text-3-opensans
    
    &__desc
      margin-top: 5px
      display: flex
      justify-content: space-between
    
    &__total
      @include body-text-3-opensans-medium

    &__total-detail
      margin-right: 15px
      @include body-text-3-opensans-medium


    &__operation
      display: flex
      justify-content: flex-end
      @include body-text-3-opensans-medium

    &__trans-weight
      margin-bottom: 20px
      @include tiny-reg

    &__trans-weight-amount
      margin-right: 15px
      margin-bottom: 20px
      @include tiny-reg

    &__icon
      margin-left: 5px
      @include body-text-3-opensans-medium

    &__card-loading
      padding: 125px 130px 0px 130px

    &__card-loading-text
      padding: 46.67px 153px 0px 153px
      @include h6

    &__card-loading-desc
      padding: 35px 84px 118px 84px
      text-align: center
      letter-spacing: -0.0044em
      @include body-text-2

  .modal-switch-network
    width: 523px
    gap: 1rem
    border-radius: 10px

    &__title
      @include body-text-2-opensans

    &__subtitle 
      max-width: 427px
      text-align: center
      color: #595959
      @include body-text-3-opensans
</style>
