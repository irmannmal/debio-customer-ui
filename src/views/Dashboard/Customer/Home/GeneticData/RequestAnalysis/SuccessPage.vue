<template lang="pug">
  .customer-request-analyst-success
    .customer-request-analyst-success__wrapper
      .customer-request-analyst-success__nav
        .customer-request-analyst-success__nav-button
          
      .customer-request-analyst-success__main
        .customer-request-analyst-success__stepper
          ui-debio-stepper(
            :items="stepperItems"
          )

        div(v-if="orderStatus === 'Paid' && !isRejected")
          .customer-request-analyst-success__title Thank you for your order!
          .customer-request-analyst-success__sub-title(v-if="isRegistered") Please wait, Genetic Analyst will confirm your order soon
          .customer-request-analyst-success__sub-title(v-if="isInProgress") Please wait while your genetic data is being analyzed

        
        div(v-if="orderStatus === 'Cancelled'")
          .customer-request-analyst-success__title Your service has been Cancelled!


        div(v-if="isRejected")
          .customer-request-analyst-success__title Your service has been Rejected!

          v-card.customer-request-analyst-success__reject.mt-5
            .customer-request-analyst-success__reject-title Title
            .customer-request-analyst-success__reject-text {{ rejectTitle }}

            .customer-request-analyst-success__reject-title.mt-5 Reason of Rejection
            .customer-request-analyst-success__reject-text {{ rejectDesc }}

        
        .customer-request-analyst-success__cards
          ServiceAnalysisCard
          PaymentCard
        

  

</template>

<script>
import { mapState } from "vuex"
import ServiceAnalysisCard from "./ServiceAnalysisCard.vue"
import PaymentCard from "./PaymentCard"
import { queryGeneticAnalysisOrderById } from "@debionetwork/polkadot-provider"
import { queryGeneticAnalysisByGeneticAnalysisTrackingId } from "@debionetwork/polkadot-provider"


export default {
  name: "SuccessPage",

  data: () => ({
    stepperItems: [
      { number: 1, title: "Select Genetic Data", active: false },
      { number: 2, title: "Select Service & Analyst", active: false },
      { number: 3, title: "Checkout and Payment", active: false },
      { number: 4, title: "Success", active: true }
    ],
    geneticOrderAnalysisDetail: null,
    serviceAnalysis: null,
    geneticData: null,
    service: null,
    orderStatus: null,
    geneticAnalysis: null,
    rejectTitle: null,
    rejectDesc: null,
    isRejected: false,
    isRegistered: false,
    isInProgress: false
  }),

  computed: {
    ...mapState({
      api: (state) => state.substrate.api,
      wallet: (state) => state.substrate.wallet
    })
  },

  components: {
    ServiceAnalysisCard,
    PaymentCard
  },

  async mounted() {
    await this.getAnalysisOrderDetail()

    if (this.orderStatus === "Cancelled") {
      this.stepperItems[3].title = "Cancelled"
    }

    if (this.orderStatus === "Paid") {
      this.getAnalysisStatus()
    }
  },

  methods: {
    async getAnalysisOrderDetail() {
      const analysisOrderId = this.$route.params.id
      const analysisOrderDetail = await queryGeneticAnalysisOrderById(this.api, analysisOrderId)

      if (analysisOrderDetail) {
        this.orderStatus = analysisOrderDetail.status
        this.geneticOrderAnalysisDetail = analysisOrderDetail
        this.trackingId = this.geneticOrderAnalysisDetail.geneticAnalysisdTrackingId
      }
    },

    async getAnalysisStatus() {
      this.isRegistered = false
      this.isRejected = false
      this.isInProgress = false

      this.geneticAnalysis = await queryGeneticAnalysisByGeneticAnalysisTrackingId(this.api, this.trackingId)

      if (this.geneticAnalysis.status === "Rejected") {
        this.stepperItems[3].title = "Rejected"
        this.isRejected = true
        this.rejectTitle = this.geneticAnalysis.rejectedTitle
        this.rejectDesc = this.geneticAnalysis.rejectedDescription
      }

      if (this.geneticAnalysis.status === "Registered") {
        this.isRegistered = true
      }

      if (this.geneticAnalysis.status === "InProgress") {
        this.isInProgress = true
      }
    }
  }


}
</script>


<style lang="sass" scoped>
  @import "@/common/styles/mixins.sass"

  .customer-request-analyst-success
    width: 100%
    height: 100%
    background: #FFFFFF

    &__wrapper
      width: 100%
      height: 100%
      background: #FFFFFF
      box-shadow: 0 0.125rem 0.625rem rgba(0, 0, 0, 0.1)
      border-radius: 0.25rem

    &__nav
      padding: 2.313rem 3.125rem

    &__nav-button
      display: flex
      align-items: center
      gap: 0.625rem
      max-width: max-content
      color: #757274
      cursor: pointer
      @include body-text-3

    &__main
      padding-bottom: 100px
      width: 100%
      display: flex
      flex-direction: column
      align-items: center

    &__title
      display: flex
      flex-direction: column
      align-items: center
      margin-top:50px
      @include h6-opensans

    &__sub-title
      display: flex
      flex-direction: column
      align-items: center
      @include body-text-3-opensans

    &__cards
      display: flex
      align-items: center
      justify-content: space-between
      padding: 29px 35px 55px 35px
      gap: 32px

    &__reject
      width: 704px
      padding: 30px
    
    &__reject-title
      @include button-2

    &__reject-text
      @include new-body-text-2

</style>
