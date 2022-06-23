<template lang="pug">
  .customer-order-canceled
    .customer-order-canceled__title You have cancelled your order!
      

    template
      v-row.customer-order-canceled__row
        LabDetailCard(
          :serviceDetail="selectedService"
        )
        PaymentDetailCard(
          :serviceDetail="selectedService"
          :orderDetail="detailOrder"
        )

  
</template>
<script>

import { mapState } from "vuex"
import LabDetailCard from "../LabDetailCard.vue"
import PaymentDetailCard from "../PaymentDetailCard.vue"

export default {
  name: "OrderCanceled",

  components: {
    LabDetailCard,
    PaymentDetailCard
  },

  created() {
    if (!this.selectedService) this.$router.push({ name: "customer-payment-history" })
  },

  computed: {
    ...mapState({
      selectedService: (state) => state.testRequest.products,
      detailOrder: (state) => state.testRequest.order
    })
  }
}
</script>

<style lang="sass">
  @import "@/common/styles/mixins.sass"

  .customer-order-canceled
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
