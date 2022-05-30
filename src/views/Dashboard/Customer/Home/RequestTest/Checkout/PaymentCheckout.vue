<template lang="pug">
  .customer-payment-checkout
    .customer-payment-checkout__title(v-if="isCancelled") You have cancelled your order!
    .customer-payment-checkout__title(v-else) Checkout your order!

    template
      v-row.customer-payment-checkout__row
        LabDetailCard(
          :serviceDetail="service"
        )
        PaymentDetailCard(
          :serviceDetail="service"
          :orderDetail="detailOrder"
          :loading="isLoading"
          @cancel="isCancelled = true"
          @onContinue="onContinue"
        )
</template>

<script>

import { mapState, mapMutations } from "vuex"
import LabDetailCard from "../LabDetailCard.vue"
import PaymentDetailCard from "../PaymentDetailCard.vue"
import { queryLabById, queryOrderDetailByOrderID, queryServiceById } from "@debionetwork/polkadot-provider"


export default {
  name: "PaymentCheckout",

  components: {
    LabDetailCard,
    PaymentDetailCard
  },

  computed: {
    ...mapState({
      api: (state) => state.substrate.api,
      web3: (state) => state.metamask.web3,
      dataService: (state) => state.testRequest.products
    })
  },

  data: () => ({
    isCancelled: false,
    isLoading: false,
    detailOrder: {},
    service: {}
  }),

  async mounted () {
    if (!this.$route.params.id) {
      this.service = this.dataService
    }

    if (this.$route.params.id) {
      this.detailOrder = await queryOrderDetailByOrderID(this.api, this.$route.params.id)

      this.setOrderDetail(this.detailOrder)

      if (this.detailOrder.status === "Cancelled") {
        this.isCancelled = true
      }
      await this.getServiceDetail()
    }
  },

  methods: {
    ...mapMutations({
      setProductsToRequest: "testRequest/SET_PRODUCTS",
      setOrderDetail: "testRequest/SET_ORDER"
    }),

    onContinue () {
      this.$router.push({ name: "customer-request-test-service"})
    },

    async getServiceDetail() {
      this.isLoading = true
      const labDetail = await queryLabById(this.api, this.detailOrder.sellerId)
      const serviceDetail = await queryServiceById(this.api, this.detailOrder.serviceId)

      let {
        accountId: labId,
        info: {
          name: labName,
          address: labAddress,
          city,
          region,
          country,
          profileImage: labImage
        },
        verificationStatus,
        stakeStatus
      } = labDetail

      let {
        id: serviceId,
        info: {
          name: serviceName,
          category: serviceCategory,
          description: serviceDescription,
          longDescription,
          image: serviceImage,
          dnaCollectionProcess,
          testResultSample: resultSample,
          expectedDuration: {
            duration,
            durationType
          },
          pricesByCurrency
        },
        serviceFlow
      } = serviceDetail

      const labRateData = await this.$store.dispatch("rating/getLabRate", labId)
      const serviceData = await this.$store.dispatch("rating/getServiceRate", serviceId)
      const detailPrice = pricesByCurrency[0]
      
      this.service = {
        serviceId, 
        serviceName, 
        serviceRate: serviceData.rating_service,
        serviceImage, 
        serviceCategory, 
        serviceDescription, 
        longDescription, 
        labId,
        labName,
        labRate: labRateData.rating,
        labAddress,
        labImage,
        totalPrice: this.formatPrice(detailPrice.totalPrice.replaceAll(",", "")),
        servicePrice: this.formatPrice(detailPrice.priceComponents[0].value.replaceAll(",","")),
        qcPrice: this.formatPrice(detailPrice.additionalPrices[0].value.replaceAll(",","")),
        currency: detailPrice.currency.toUpperCase(),
        city,
        country,
        region,
        countRateLab: labRateData.count,
        countServiceRate: serviceData.count_rating_service,
        duration, 
        durationType,
        verificationStatus,
        stakeStatus,
        indexPrice: 0,
        dnaCollectionProcess, 
        resultSample,
        serviceFlow
      }

      this.setProductsToRequest(this.service)
      this.isLoading = false
    },

    formatPrice(price) {
      return this.web3.utils.fromWei(price, "ether")
    }
  }
}
</script>

<style lang="sass">
  @import "@/common/styles/mixins.sass"

  .customer-payment-checkout
    width: 100%
    height: 100% 
    display: flex
    flex-direction: column
    align-items: center

    &__title
      display: flex
      flex-direction: column
      align-items: center
      text-align: center
      letter-spacing: 0.0044em !important
      margin-top:55px
      @include h6-opensans

    &__row
      margin-top: 3.5rem !important
      display: flex
      justify-content: center

</style>
