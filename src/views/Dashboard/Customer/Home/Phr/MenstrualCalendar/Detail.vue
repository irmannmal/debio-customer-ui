<template lang="pug">
  .menstual-calendar-detail
    .menstrual-calendar-detail__wrapper
      ui-debio-card(block)
        template
          .menstrual-calendar-detail__banner
            .menstrual-calendar-detail__content
              .menstrual-calendar-detail__title Menstrual Calendar
              .menstrual-calendar-detail__sub-title Smart way to track menstrual cycles.

            v-img(
              alt="no-list-data"
              src="@/assets/menstrual-calendar-banner.svg"
              max-width="373px"
              max-height="132px"
            )

      .menstrual-calendar-detail__details
        ui-debio-card.menstrual-calendar-detail__subscription(width="740")
          p Calendar Here...

        .menstrual-calendar-detail__menu
          ui-debio-card.menstrual-calendar-detail__summary(width="394")
            .menstrual-calendar-detail__summary-header
              v-img.menstrual-calendar-detail__summary-img(
                alt="no-list-data"
                src="@/assets/calendar.svg"
                max-width="44px"
                max-height="44px"
              )
              .menstrual-calendar-detail__summary-text
                .menstrual-calendar-detail__summary-title Summary
                .menstrual-calendar-detail__summary-desc Today Overview
          
          ui-debio-card(width="394")
            .menstrual-calendar-detail__text Today is your menstruation day, you have low probabilition of pergancy during sexual intercourse.


          ui-debio-card.menstrual-calendar-detail__setting(width="394")
            .menstrual-calendar-detail__summary-header
              v-img.menstrual-calendar-detail__summary-img(
                alt="no-list-data"
                src="@/assets/drink-coffee.svg"
                max-width="44px"
                max-height="44px"
              )

              .menstrual-calendar-detail__setting-text
                .menstrual-calendar-detail__summary-title What is happening today ?
                .menstrual-calendar-detail__summary-desc you can choose more than 1 emoticon

            v-divider.menstrual-calendar-detail__navigation
            .menstrual-calendar-detail__emoticons
              v-row
                .menstrual-calendar-detail__emoticons-row(v-for="emoji in emojis")
                  v-col.menstrual-calendar-detail__emoticons-col(cols="3" )
                    .menstrual-calendar-detail__emoji(align="center")
                      v-img.menstrual-calendar-detail__emoji-img(
                        max-width="32px"
                        type="button"
                        @click="addEmoji(emoji)"
                        :src="require(`../../../../../../assets/${emoji.name}-${emoji.disabled}.svg`)"
                      )
                      .menstrual-calendar-detail__emoji-text.mt-3(:style="{color: emoji.color}") {{ emoji.text}} 

          ui-debio-card.menstrual-calendar-detail__setting(width="394")
            .menstrual-calendar-detail__summary-header
              v-img.menstrual-calendar-detail__summary-img(
                alt="no-list-data"
                src="@/assets/calendar.svg"
                max-width="44px"
                max-height="44px"
              )

              .menstrual-calendar-detail__setting-text
                .menstrual-calendar-detail__summary-title Menstrual Calendar Settings
                .menstrual-calendar-detail__summary-desc Update menstruation day and subscription
           
            v-divider.menstrual-calendar-detail__navigation
            
            ui-debio-button.menstrual-calendar-detail__button(
              color="#F3F3F3" 
              height="48"
              width="100%"
            ) 
              .menstrual-calendar-detail__button-text Update Menstruation Day
              v-icon mdi-chevron-right

            ui-debio-button.menstrual-calendar-detail__button(
              color="#F3F3F3" 
              height="48"
              width="100%"
            ) 
              .menstrual-calendar-detail__button-text Subscription Settings
              v-icon mdi-chevron-right

            ui-debio-button.menstrual-calendar-detail__button(
              color="#F3F3F3" 
              height="48"
              width="100%"
              disabled
            ) 
              .menstrual-calendar-detail__button-text Journaling
              v-alert.menstrual-calendar-detail__alert(color="#FFE6E6" )
                .menstrual-calendar-detail__alert-text Coming Soon

              v-icon mdi-chevron-right
</template>

<script>

import emojis from "@/common/constants/menstrual-symptoms-emoji"

export default {
  name: "MenstrualCalendarDetail",

  data: () => ({
    emojis
  }),

  methods: {
    addEmoji(emoji) {
      if (emoji.disabled === "active") {
        emoji.disabled = "inactive"
        emoji.color = "#363636"
        return
      }
      emoji.disabled = "active"
      emoji.color = "#E27625"
    }
  }
}
</script>

<style lang="sass" scoped>
  @import "@/common/styles/mixins.sass"

  .menstrual-calendar-detail
    &__wrapper
      height: 100%

    &__banner
      display: flex
      justify-content: space-between
    
    &__title
      @include h5-opensans

    &__subscription
      height: 593px

    &__details
      margin-top: 16px
      display: flex
      gap: 16px
      
    &__menu
      max-width: 400px 

    &__summary
      height: 70px
      background: linear-gradient(93.58deg, #FF94E6 12.06%, #DF9AFF 100%)
      border-radius: 4px 4px 0px 0px
      color: #FFFFFF

    &__summary-header
      display: flex

    &__summary-img
      margin-top: -10px
      margin-right: 16px

    &__summary-title
      margin-top: -10px
      @include button-1
    
    &__summary-desc
      @include new-body-text-2

    &__text
      color: #C400A5
      @include button-1

    &__setting
      margin-top: 16px

    &__emoticons
      max-width: 394px

    &__emoticons-row
      display: flex
      justify-content: center
      max-width: 394px    
    
    &__emoticons-col
      display: flex
      max-width: 394px

    &__emoji
      width: 36px
    
    &__emoji-img
      padding: 10px
      
    &__emoji-text
      text-align: center
      width: 36px
      @include tiny-reg

    &__navigation
      margin: 16px 0

    &__button
      display: flex
      justify-content: space-between
      margin-bottom: 16px

    &__button-text
      font-size: 15px
      font-weight: 600
      text-transform: none !important

    &__alert
      height: 20px
      padding: 2px
      margin-left: -80px
      margin-bottom: 1px

    &__alert-text
      color: #FF8F8F
      font-size: 12px
      text-transform: none !important

</style>
