<template lang="pug">
  .service-card
    .service-card__label Service Provider
      .service-card__service-provider
        ui-debio-avatar.service-card__service-provider-avatar(
          :src="computeAvatar"
          size="92" 
          rounded
        )

        .service-card__service-provider-info
          .service-card__service-provider-name {{ service.analystName }}
          .service-card__service-provider-speciality {{ service.analystSpecialization }}

    .service-card__label Service Details
    .service-card__service-details
      p.service-card__service-details-name {{ service.serviceName }}
      p.service-card__service-details-desc {{ service.serviceDescription }}

      .service-card__service-details-info
        .service-card__service-details-timer 
          v-icon(size="14") mdi-timer
          span.service-card__service-details-duration  {{ service.serviceDuration }}

        b.service-card__service-details-price {{ service.servicePrice }}


</template>

<script>

export default {
  name: "ServiceCard",
  
  props: {
    service: Object
  },

  computed: {
    computeAvatar() {
      return this.service?.analystProfileImage ? this.service?.analystProfileImage : require("@/assets/defaultAvatar.svg")
    }
  }
}
</script>

<style lang="sass" scoped>
  @import "@/common/styles/mixins.sass"
  @import "@/common/styles/functions.sass"

  .service-card
    border: solid 0.5px #E4E4E4
    background-color: #FFFFFF
    padding: toRem(16px)
    width: toRem(511px)

    &__label
      padding: toRem(2px)
      margin-bottom: toRem(10px)
      @include h6-opensans


    &__service-provider
      border: solid 0.5px #E4E4E4
      display: flex
      padding: toRem(10px)
      margin-bottom: toRem(16px)
      margin-top: toRem(5px)

    &__service-provider-avatar
      border: solid 0.5px #E4E4E4
      width: toRem(94px)
      margin-right: toRem(11px)

    &__service-provider-name
      @include button-2 

    &__service-provider-speciality
      margin-top: toRem(3px)
      @include body-text-3

    &__service-details
      border: solid 0.5px #E4E4E4
      margin-top: toRem(5px)
      padding: toRem(24px)
      height: toRem(193px)

    &__service-details-name
      @include body-text-medium-1

    &__service-details-desc
      height: toRem(66px)
      @include new-body-text-2

    &__service-details-duration
      letter-spacing: -0.004em
      margin-left: 5px
      @include body-text-3-opensans-medium

    &__service-details-info
      margin-top: toRem(5px)
      display: flex
      justify-content: space-between

    &__service-details-price
      color: #F006CB
      @include body-text-3-opensans
</style>
