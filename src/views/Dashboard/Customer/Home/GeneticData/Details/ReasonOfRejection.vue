<template lang="pug">
  v-dialog.reason-of-rejection(:value="show" width="440" persistent rounded )
    v-card    
      .reason-of-rejection__title Rejected Order

      .reason-of-rejection__card
        .reason-of-rejection__card-text 
          b.reason-of-rejection__text Title
          .reason-of-rejection__text.mb-10 {{ title }}

          b.reason-of-rejection__textReason of Rejection
          .reason-of-rejection__text {{ reason }}

      .reason-of-rejection__button
        ui-debio-button(
          width="340"
          height="35" 
          color="secondary" 
          @click="closeDialog"
        ) Dismiss

</template>



<script>
import { mapState } from "vuex"
import { queryGeneticAnalysisOrder, queryGeneticAnalysisByGeneticAnalysisTrackingId } from "@debionetwork/polkadot-provider"

export default {
  name: "ReasonOfRejection",

  props: {
    show: Boolean
  },

  data: () => ({
    title: "",
    reason: "",
    trackingId: null
  }),

  computed: {
    ...mapState({
      api: (state) => state.substrate.api,
      wallet: (state) => state.substrate.wallet
    })
  },

  async mounted() {
    await this.getGAOrderDetail()
  },

  methods: {
    closeDialog() {
      this.$emit("close")
    },

    onSubmit() {
      this.$emit("click")
    },

    async getGAOrderDetail() {
      const analysisOrderId = this.$route.params.id
      const analysisOrderDetail = await queryGeneticAnalysisOrder(this.api, analysisOrderId)

      if (analysisOrderDetail) {
        this.trackingId = analysisOrderDetail.geneticAnalysisdTrackingId
      }
      
      const GAStorage = await queryGeneticAnalysisByGeneticAnalysisTrackingId(this.api, this.trackingId)

      this.title = GAStorage.rejectedTitle
      this.reason = GAStorage.rejectedDescription
    }
  }
}
</script>


<style lang="sass" scoped>
  @import "@/common/styles/mixins.sass"

  .reason-of-rejection
    margin-top: 0 !important
    width: 440px
    height: 570px

    &__title
      padding: 66px 0px 24px 0px
      display: flex
      align-items: center
      justify-content: center
      letter-spacing: 0.0075em
      @include button-1

    &__card
      width: 440px
      height: 280px
      margin: 0 50px 
      padding: 10px 14px 0px 14px

    &__card-text
      height: 380px
      text-align: justify
      letter-spacing: -0.0044em
      @include new-body-text-2-medium

    &__button
      margin-top: 32px
      padding-bottom: 26px
      display: flex
      align-items: center
      justify-content: center

    &__close
      display: flex
      justify-content: flex-end
      padding: 1.013rem !important

    &__text
      margin-bottom: 10px
  
  .fixed-button
    position: fixed
    width: 50px

</style>
