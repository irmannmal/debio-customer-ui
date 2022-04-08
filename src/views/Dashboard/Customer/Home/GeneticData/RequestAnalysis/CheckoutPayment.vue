<template lang="pug">
  .customer-request-analyst-checkout
    .customer-request-analyst-checkout__wrapper
      .customer-request-analyst-checkout__nav
        .customer-request-analyst-checkout__nav-button(@click="handleBack")
          v-icon mdi-chevron-left

      .customer-request-analyst-checkout__main
        .customer-request-analyst-checkout__stepper
          ui-debio-stepper(
            :items="stepperItems"
          )

        .customer-request-analyst-checkout__title Checkout and Payment
        
        .customer-request-analyst-checkout__cards
          ServiceAnalysisCard
          PaymentCard(
            @click="showLoading"
          )

          PaymentDialog(
            :show="isloading"
          )

</template>

<script>

import { mapState } from "vuex"
import ServiceAnalysisCard from "./ServiceAnalysisCard.vue"
import PaymentCard from "./PaymentCard"
import PaymentDialog from "@/common/components/Dialog/PaymentDialog"


export default {
  name: "CheckoutPayment",

  data: () => ({
    stepperItems: [
      { number: 1, title: "Select Genetic Data", active: false },
      { number: 2, title: "Select Service & Analyst", active: false },
      { number: 3, title: "Checkout and Payment", active: true },
      { number: 4, title: "Success", active: false }
    ],
    isloading: false
  }),

  components: {
    ServiceAnalysisCard,
    PaymentCard,
    PaymentDialog
  },


  computed: {
    ...mapState({
      selectedGeneticData: (state) => state.geneticData.selectedData
    })
  },

  methods: {
    handleBack() {
      this.$router.push({ name: "customer-request-analysis-service" })
    },
    showLoading() {
      this.isloading = true
    }
  }
}

</script>

<style lang="sass" scoped>
  @import "@/common/styles/mixins.sass"

  .customer-request-analyst-checkout
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

    &__cards
      display: flex
      align-items: center
      justify-content: space-between
      padding: 29px 35px 55px 35px
      gap: 32px

</style>
