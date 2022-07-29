<template lang="pug">
  v-dialog.staking-dialog(:value="show" width="400" persistent rounded )
    v-card.staking-dialog__dialog
      v-app-bar(flat dense color="white" )
        v-toolbar-title.staking-dialog__title Staking Coin Agreement
        v-spacer
        v-btn(icon @click="closeDialog")
          v-icon mdi-close

      .staking-dialog__card
        ol.staking-dialog__card-text.ml-3
          li.staking-dialog__card-text-content There's no locking period. Your fund can be unstaked anytime with your consent but there will be a period of 6 days to process it.
          li.staking-dialog__card-text-content Upon receiving your test result, you will be rewarded with DBIO as a token of gratitude for using our service. By unstaking your fund, you will lose this privilege.
          li.staking-dialog__card-text-content You will receive notification when requested service is available. You can proceed to request a test. If the staked amount is bigger than the service price, you will get refund for overpayment. If staked amount is smaller than the service price, to complete the purchase, you should pay for the outstanding amount to complete the purchase.

      .staking-dialog__input
        .staking-dialog__input-label Enter your Amount 
        ui-debio-input.staking-dialog__input-field(
          :rules="amountRules"
          variant="small"
          width="100%"
          type="number"
          min="0"
          step=".001"
          v-model="amount"
          placeholder="Amount (DBIO)"
          outlined
        )

        v-checkbox(v-model="agree")
          template(v-slot:label) 
            div(style="font-size: 12px;") I have read and agree to the 
              a.link(href="https://docs.debio.network/legal/terms-and-condition" target="_blank" rel="noreferrer noopener nofollow") terms and conditions

        .staking-dialog__trans-weight 
          .staking-dialog__trans-weight-text Estimated transaction weight
            v-tooltip.visible(bottom )
              template(v-slot:activator="{ on, attrs }")
                v-icon.staking-dialog__trans-weight-icon(
                  style="font-size: 12px;"
                  color="primary"
                  dark
                  v-bind="attrs"
                  v-on="on"
                ) mdi-alert-circle-outline 
              span(style="font-size: 10px;") Total fee paid in DBIO to execute this transaction.

          div( style="font-size: 12px;" ) {{ Number(txWeight).toFixed(4) }} DBIO

        v-btn.staking-dialog__input-button(
          depressed
          color="secondary"
          large
          width="100%"
          height="35" 
          @click="submitServiceRequestStaking"
          :loading="isLoading"
          :disabled="!agree"
        ) Stake

        v-progress-linear(
        v-if="isLoading"
        indeterminate
        color="primary"
      )
    ui-debio-error-dialog(
      :show="showError"
      :title="errorTitle"
      :message="errorMsg"
      @close="showError = false"
    )

</template>

<script>
import { mapState } from "vuex"
import { createRequest } from "@/common/lib/polkadot-provider/command/service-request"
import { createRequestFee } from "@debionetwork/polkadot-provider"
import errorMessage from "@/common/constants/error-messages"
import {errorHandler} from "@/common/lib/error-handler"

export default {
  name: "AgreementDialog",

  props: {
    show: Boolean
  },

  data: () => ({
    errorMessage,
    currencyList: ["DBIO"], 
    currencyType: "DBIO",
    agree: false,
    amount: "",
    dialogAlert: false,
    isLoading: false,
    transactionStep: "",
    txWeight: 0,
    showError: false,
    errorTitle: "",
    errorMsg: ""
  }),

  computed: {
    ...mapState({
      api: (state) => state.substrate.api,
      pair: (state) => state.substrate.wallet,
      country: state => state.lab.country,
      region: state => state.lab.region,
      city: state => state.lab.city,
      category: state => state.lab.category,
      lastEventData: (state) => state.substrate.lastEventData,
      web3: (state) => state.metamask.web3
    }),

    amountRules() {
      return [
        val => !!val || this.errorMessage.REQUIRED,
        val => !!/^[0-9]\d*(\.\d{0,9})?$/.test(val) || this.errorMessage.INPUT_CHARACTER("Numbers (e.g. 20.005)")
      ]
    }
  },

  async mounted () {
    const txWeight = await createRequestFee(this.api, this.pair, this.country, this.region, this.city, this.category)
    this.txWeight = this.web3.utils.fromWei(String(txWeight.partialFee), "ether")
  },

  watch: {
    lastEventData() {
      if (this.lastEventData) {
        if (this.lastEventData.method === "ServiceRequestCreated") {
          this.isLoading = false
          this.dialogAlert = true
          this.$emit("click")
        }
      }      
    }
  },
  
  methods: {
    closeDialog() {
      this.$emit("close")
    },

    async submitServiceRequestStaking() {
      this.isLoading = true

      try {
        await createRequest(
          this.api,
          this.pair,
          this.country,
          this.region,
          this.city,
          this.category,
          this.amount
        )

      } catch (err) {
        const error = await errorHandler(err.message)
        
        this.errorTitle = error.title
        this.errorMsg = error.message
        this.showError = true
        this.isLoading = false
      }
    }
  }
}
</script>

<style lang="sass" scoped>
  @import "@/common/styles/mixins.sass"
  
  .staking-dialog
    &__title
      display: flex
      align-items: center
      letter-spacing: 0.0075em
      margin-left: 20px
      margin-top: 10px
      @include button-1
    
    &__dialog
      padding-bottom: 20px

    &__card
      background-color: #F5F7F9
      margin: 0px 30px

    &__card-text
      padding: 18px 12px
      letter-spacing: -0.004em

    &__card-text-content
      margin-bottom: 4px
      @include body-text-3-opensans

    &__input
      margin: 11px 30px

    &__input-label
      display: flex
      align-items: center
      letter-spacing: -0.0075em
      margin-bottom: 11px
      @include button-2
    
    &__input-field
      max-height: 18px
      letter-spacing: -0.004em
      margin-bottom: 25px
      @include body-text-3-opensans
   
    &__trans-weight
      margin-bottom: 20px
      display: flex
      justify-content: space-between

    &__trans-weight-text
      letter-spacing: -0.004em
      display: flex
      align-items: center
      @include body-text-3-opensans

    &__input-button
      display: flex
      align-items: center
      text-align: center
      letter-spacing: -0.015em
      @include tiny-semi-bold

    &__trans-weight-icon
      margin-left: 5px

</style>
