<template lang="pug">
  .payment-history-details
    ui-debio-modal(
      :show="!!messageError"
      :show-title="false"
      :show-cta="false"
      @onClose="$router.push({ name: 'customer-payment-history' })"
    )
      | {{ messageError }}

    .payment-history-details__wrapper(v-if="hasPaymentDetails")
      ui-debio-card(block centered-content)
        .payment-details
          .payment-details__title {{ computeDetailsTitle }}
          .payment-details__order
            .order-section
              .order-detail
                span.order-detail__label Order ID
                .d-flex.align-baseline
                  p.order-detail__value(:title="payment.id") {{ payment.formated_id }}
                  ui-debio-icon.ml-2.mt-1(
                    role="button"
                    :icon="copyIcon"
                    stroke
                    size="16"
                    color="#5640A5"
                    title="Copy ID"
                    @click="handleCopy"
                  )
              .order-detail(v-if="payment.section === 'order'")
                span.order-detail__label Specimen Number
                p.order-detail__value(:title="payment.dna_sample_tracking_id") {{ payment.dna_sample_tracking_id.slice(0, 10) }}
              .order-detail
                span.order-detail__label Order Date
                p.order-detail__value {{ payment.created_at }}
              .order-detail
                span.order-detail__label Payment status
                p.order-detail__value(
                  :class="payment.status_class"
                ) {{ payment.status }}
              .order-detail
                span.order-detail__label Test Status
                p.order-detail__value(:class="payment.test_status_class") {{ payment.test_status || "-" }}

            .product-section
              div
                p.product-detail__title Service Provider
                .product-detail__provider(v-if="payment.section === 'order'") {{ payment.lab_info.name }}
                .product-detail__provider(v-else) {{ payment.genetic_analyst_info.name }}
              div
                p.product-detail__title Service Name
                .product-detail__provider {{ payment.service_info.name }}


          .payment-details__price
            .price
              h5.price__title Total Payment
              .price__detail
                .price__block
                  .price__label Paid Amount
                  .price__value.success--text
                    | {{ computeTotalPrices }}
                    | {{ payment.currency }}
                .price__block
                  .price__label Service Price
                  .price__value
                    | {{ formatPrice(payment.prices[0].value) }}
                    | {{ payment.currency }}
                .price__block
                  .price__label QC Price
                  .price__value
                    | {{ payment.additional_prices.length ? formatPrice(payment.additional_prices[0].value) : "0" }}
                    | {{ payment.currency }}

                hr.mb-4

                .price__block
                  .price__label Refund Amount
                  .price__value.primary--text
                    | 0 {{ payment.currency }}

                ui-debio-button.payment-details__etherscan-link(
                  color="secondary"
                  v-if="payment.section === 'order'"
                  @click="handleCTA"
                  :loading="isLoading"
                  :disabled="payment.status === 'Cancelled'"
                  outlined
                  block
                ) {{ payment.status === "Unpaid" ? "Pay" : "VIEW ON ETHERSCAN" }}
</template>

<script>
import { copyIcon } from "@debionetwork/ui-icons"
import { fetchPaymentDetails, fetchTxHashOrder } from "@/common/lib/api"
import { getRatingService } from "@/common/lib/api"
import {
  queryDnaSamples,
  queryGeneticAnalysisByGeneticAnalysisTrackingId
} from "@debionetwork/polkadot-provider"
import { mapState } from "vuex"

import {
  COVID_19,
  DRIED_BLOOD,
  URINE_COLLECTION,
  FECAL_COLLECTION,
  SALIVA_COLLECTION,
  BUCCAL_COLLECTION
} from "@/common/constants/instruction-step.js"

import metamaskServiceHandler from "@/common/lib/metamask/mixins/metamaskServiceHandler"

// NOTE: Use anchor tag with "noreferrer noopener nofollow" for security
let timeout
const anchor = document.createElement("a")
anchor.target = "_blank"
anchor.rel = "noreferrer noopener nofollow"

export default {
  name: "CustomerPaymentDetails",

  mixins: [metamaskServiceHandler],

  data: () => ({
    COVID_19,
    DRIED_BLOOD,
    URINE_COLLECTION,
    FECAL_COLLECTION,
    SALIVA_COLLECTION,
    BUCCAL_COLLECTION,

    copyIcon,
    messageError: null,
    txHash: null,
    rewardPopup: false,
    payment: {}
  }),

  computed: {
    ...mapState({
      api: (state) => state.substrate.api,
      rating: (state) => state.rating.rate,
      web3: (state) => state.metamask.web3
    }),

    computeDetailsTitle() {
      return this.payment?.status === "Paid"
        ? `[ ${this.payment?.status} Order ] - Thank you for your order`
        : `${this.payment?.status} Order`
    },

    hasPaymentDetails() {
      return Object.keys(this.payment)?.length
    },

    computeTotalPrices() {
      if (!this.payment?.additional_prices?.length) return this.formatPrice(this.payment?.prices[0].value)
      return this.formatPrice(this.payment?.prices[0].value) + this.formatPrice(this.payment?.additional_prices[0].value)
    }
  },

  beforeMount() {
    if (!this.$route.params.id) this.$router.push({ name: "customer-payment-history" })
  },

  async mounted() {
    await this.fetchDetails()
  },

  methods: {
    async fetchDetails() {
      try {
        let data
        let rating
        let txDetails
        let isNotGAOrders = false
        const dataPayment = await this.metamaskDispatchAction(fetchPaymentDetails, this.$route.params.id)
        const classes = Object.freeze({
          PAID: "success--text",
          UNPAID: "warning--text",
          REFUNDED: "secondary--text",
          CANCELLED: "error--text",
          FULFILLED: "info--text",
          RESULTREADY: "success--text",
          INPROGRESS: "info--text",
          REGISTERED: "success--text",
          WETWORK: "secondary--text",
          REJECTED: "error--text",
          QUALITYCONTROLLED: "info--text"
        })

        if (Object.keys(dataPayment.order).length) {
          try {
            isNotGAOrders = true
            rating = await getRatingService(dataPayment.order.service_id)
            txDetails = await this.metamaskDispatchAction(fetchTxHashOrder, dataPayment.order.id)
            data = await queryDnaSamples(this.api, dataPayment.order.dna_sample_tracking_id)
          } catch (error) {
            console.error(error)
          }

          this.txHash = txDetails.transaction_hash
        } else {
          try {
            console.log(dataPayment.orderGA.genetic_analysis_tracking_id);
            data = await queryGeneticAnalysisByGeneticAnalysisTrackingId(
              this.api,
              dataPayment.orderGA.genetic_analysis_tracking_id
            )
            console.log("data", data)
          } catch (error) {
            console.error(error)
          }
        }

        this.payment = isNotGAOrders
          ? {
            ...dataPayment.order,
            section: "order",
            formated_id: `${dataPayment.order.id.substr(0, 3)}...${dataPayment.order.id.substr(dataPayment.order.id.length - 4)}`,
            test_status: data?.status.replace(/([A-Z]+)/g, " $1").trim(),
            test_status_class: classes[data?.status.toUpperCase()],
            rating,
            status_class: classes[dataPayment.order.status.toUpperCase()],
            created_at: new Date(parseInt(dataPayment.order.created_at.replaceAll(",", ""))).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "short",
              year: "numeric"
            })
          }
          : {
            ...dataPayment.orderGA,
            formated_id: `${dataPayment.orderGA.id.substr(0, 3)}...${dataPayment.orderGA.id.substr(dataPayment.orderGA.id.length - 4)}`,
            status_class: classes[dataPayment.orderGA.status.toUpperCase()],
            test_status: data?.status.replace(/([A-Z]+)/g, " $1").trim(),
            test_status_class: classes[data?.status.toUpperCase()],
            genetic_analyst_info: {
              ...dataPayment.orderGA.genetic_analyst_info,
              name: `${dataPayment.orderGA.genetic_analyst_info.first_name} ${dataPayment.orderGA.genetic_analyst_info.last_name}`
            },
            section: "orderGA",
            created_at: new Date(parseInt(dataPayment.orderGA.created_at.replaceAll(",", ""))).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "short",
              year: "numeric"
            })
          }
      } catch(e) {
        if (e.response.status === 404)
          this.messageError = "Oh no! We can't find your selected order. Please select another one"

        else this.messageError = "Something went wrong. Please try again later"
      }
    },

    handleSampleInstruction() {
      const dnaCollectionProcess = this.payment.service_info.dna_collection_process

      if (dnaCollectionProcess === "Covid 19 Saliva Test") {
        anchor.href = this.COVID_19
        anchor.click()
      }
      if (dnaCollectionProcess === "Blood Cells - Dried Blood Spot Collection Process") {
        anchor.href = this.DRIED_BLOOD
        anchor.click()
      }
      if (dnaCollectionProcess === "Epithelial Cells - Buccal Swab Collection Process") {
        anchor.href = this.BUCCAL_COLLECTION
        anchor.click()
      }
      if (dnaCollectionProcess === "Fecal Matters - Stool Collection Process") {
        anchor.href = this.FECAL_COLLECTION
        anchor.click()
      }
      if (dnaCollectionProcess === "Saliva - Saliva Collection Process") {
        anchor.href = this.SALIVA_COLLECTION
        anchor.click()
      }
      if (dnaCollectionProcess === "Urine - Clean Catch Urine Collection Process") {
        anchor.href = this.URINE_COLLECTION
        anchor.click()
      }
    },


    async handleCopy() {
      await navigator.clipboard.writeText(this.payment?.id)
      this.payment.formated_id = "Copied!"

      clearTimeout(timeout)
      timeout = setTimeout(() => {
        this.payment.formated_id = `${this.payment.id.substr(0, 3)}...${this.payment.id.substr(this.payment.id.length - 4)}`
      }, 1000)
    },

    formatPrice(price) {
      return parseInt(this.web3.utils.fromWei(String(price.replaceAll(",", "")), "ether"))
    },

    async handleCTA() {
      if (this.payment?.status === "Unpaid") {
        this.$router.push({
          name: "customer-request-test-checkout",
          params: { id: this.$route.params.id }
        })

        return
      }

      anchor.href = `${process.env.VUE_APP_ETHERSCAN}${this.txHash}`
      anchor.click()
    }
  }
}
</script>

<style lang="sass" scoped>
  @import "@/common/styles/mixins.sass"
  @import "@/common/styles/function.sass"

  .payment-history-details
    &__title
      margin-top: toRem(35px)

    &__content
      min-width: toRem(575px)
      max-width: toRem(800px)
      padding: toRem(30px)
      margin-top: toRem(60px)
      border: toRem(1px) solid #E9E9E9
      border-radius: toRem(4px)

    &::v-deep
      .ui-debio-card__body
        display: flex
        flex-direction: column
        align-items: center
        padding-bottom: toRem(100px)

  .payment-details
    width: toRem(815px)
    display: grid
    grid-template-columns: repeat(3, 1fr)
    grid-template-rows: toRem(77px) minmax(308px, 1fr)
    grid-column-gap: 0px
    grid-row-gap: 0px

    &__title
      grid-area: 1 / 1 / 2 / 4
      display: flex
      align-items: center
      background: #F8FBFF
      padding: toRem(30px)
      @include body-text-medium-1

    &__order
      grid-area: 2 / 1 / 3 / 3
      border: solid toRem(1px) #E9E9E9
      border-top: 0
      border-right: 0

    &__price
      grid-area: 2 / 3 / 3 / 4

  .order-section
    width: 100%
    display: grid
    grid-template-columns: repeat(3, 1fr)
    padding: toRem(26px) toRem(30px)
    gap: toRem(20px) toRem(70px)

  .product-section
    display: grid
    grid-template-columns: 1fr 1.95fr

  .product-detail
    &__title
      background: #F8FBFF
      padding: 12px 30px
      @include body-text-medium-3

    &__provider
      padding: 12px 30px
      color: #595959
      @include button-2

  .order-detail
    height: max-content

    &__label
      color: #8C8C8C
      @include body-text-3

    &__value
      @include button-1

  .price
    height: 100%
    border: solid toRem(1px) #E9E9E9
    border-top: 0

    &__title
      padding: toRem(16px)
      border-bottom: solid toRem(1px) #E9E9E9
      @include button-2

    &__detail
      padding: toRem(16px)
      padding-bottom: toRem(24px)

    &__block
      display: flex
      justify-content: space-between
      margin-bottom: toRem(8px)

      &:last-of-type
        margin-bottom: toRem(50px)

    &__label,
    &__value
      @include button-2

    &__label
      color: #595959

  .product
    &__details
      width: calc(100% - toRem(175px))
      display: flex
      flex-direction: column
      gap: toRem(15px)

    &__name
      @include h3-opensans

    &__lab
      width: 100%
      display: flex
      align-items: center
      justify-content: space-between
      gap: toRem(80px)

    &__provider
      @include body-text-2
</style>
