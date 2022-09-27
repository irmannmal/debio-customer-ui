<template lang="pug">
  .menstual-calendar-detail
    .menstrual-calendar-detail__wrapper
      MenstrualCalendarBanner
      ui-debio-modal(
        :show="showStart"
        :show-title="false"
        :show-cta="false"
        disable-dismiss
      )
        .menstrual-calendar-detail__modal-title Your menstrual calendar has been set!
        v-img(
          block
          alt="no-list-data"
          src="@/assets/menstrual-calendar-dialog.svg"
          height="160px"
        )
        
        .menstrual-calendar-detail__modal-desc Choose date to perform action, select preffered action in the right of the calendar
        ui-debio-button(
          color="secondary"
          width="336px"
          style="font-size: 14px;"
          @click="showStart = false"
        ) Start Action

      .menstrual-calendar-detail__details
        ui-debio-card(width="740")
          .menstrual-calendar-detail__head-text
            span.menstrual-calendar-detail__head-text-primary When did your last period start?
            span.menstrual-calendar-detail__head-text-secondary Choose date to perform action
          
          v-divider.menstrual-calendar-detail__divider

          .menstrual-calendar-detail__options
            ui-debio-dropdown(
              :items="monthList"
              variant="small"
              label=""
              v-model="selectedMonthText"
              placeholder=""
              item-text="text"
              item-value="text"
              outlined
              close-on-select
              width="140"
            )

            span.menstrual-calendar-detail__year {{ selectedYear }}

        
          Calendar.menstrual-calendar-detail__calendar(
            :year="selectedYear" 
            :month="selectedMonth"
            v-model="selectedDates"
            :menstrualData="menstrualCalendarData"
          )

          .menstrual-calendar-detail__icons
            .menstrual-calendar-detail__icon
              v-img(
                alt="today"
                src="@/assets/today.svg"
                max-width="16px"
                max-height="16px"
              )
              span Today
            
            .menstrual-calendar-detail__icon
              v-img(
                alt="menstruation"
                src="@/assets/menstruation.svg"
                max-width="16px"
                max-height="16px"
              )
              span Menstruation

            .menstrual-calendar-detail__icon
              v-img(
                alt="prediction"
                src="@/assets/prediction.svg"
                max-width="16px"
                max-height="16px"
              )
              span Prediction

            .menstrual-calendar-detail__icon
              v-img(
                alt="fertility"
                src="@/assets/fertility.svg"
                max-width="16px"
                max-height="16px"
              )
              span Fertility

            .menstrual-calendar-detail__icon
              v-img(
                alt="ovulation"
                src="@/assets/ovulation.svg"
                max-width="16px"
                max-height="16px"
              )
              span Ovulation

          .menstrual-calendar-detail__note
            .menstrual-calendar-detail__note-text Note
            span.menstrual-calendar-detail__note-desc your previous menstrual cycle does not guarantee your future menstrual cycle medically or diagnostically
            

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
import MenstrualCalendarBanner from "./Banner.vue"
import Calendar from "@/common/components/Calendar"

export default {
  name: "MenstrualCalendarDetail",

  data: () => ({
    emojis,
    selectedMonthText: "",
    selectedMonth: new Date().getMonth(),
    selectedYear: new Date().getFullYear(),
    selectedDates: null,
    submitEnabled: false,
    submitPreview: false,
    selectAverage: true,
    showStart: true,
    monthList: [
      {value: 0, text: "January"},
      {value: 1, text: "February"},
      {value: 2, text: "March"},
      {value: 3, text: "April"},
      {value: 4, text: "May"},
      {value: 5, text: "June"},
      {value: 6, text: "July"},
      {value: 7, text: "August"},
      {value: 8, text: "September"},
      {value: 9, text: "October"},
      {value: 10, text: "November"},
      {value: 11, text: "December"}
    ],
    menstrualCalendarData: {
      addressId: "",
      averageCycle: 28,
      cycleLog: [
        {
          date: 1661915168,
          menstruation: 1,
          symptoms: [
            "depressed",
            "hungry",
            "sad"
          ]
        },
        {
          date:1661828768, 
          menstruation:0, 
          symptoms: [
            "sex with condim",
            "happy"
          ]
        },
        {
          date:1662605496,
          menstruation:1,
          symptoms : [] 
        }
      ],
      createdAt: 1662605496,
      updatedAt: 1662605496
    }
  }),

  watch: {
    selectedMonthText(newMonth) {
      this.selectedMonth = this.monthList.find((value) => value.text === newMonth).value
    },
    selectedDates(newSelected) {
      this.submitEnabled = newSelected !== null && newSelected.length > 0
    }
  },

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
  },
  async created() {
    const today = new Date()
    this.selectedMonthText = this.monthList[today.getMonth()].text
    this.currentYear = today.getFullYear().toString()
  },

  components: {
    MenstrualCalendarBanner,
    Calendar
  }
}
</script>

<style lang="sass" scoped>
  @import "@/common/styles/mixins.sass"

  .menstrual-calendar-detail
    &__wrapper
      height: 100%
    
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

    &__modal-title
      text-align: center
      max-width: 264px
      @include h3-opensans

    &__modal-desc
      max-width: 336px
      @include new-body-text-2

    &__head-text
      display: flex
      flex-direction: column
      gap: 8px

    
    &__head-text-primary
      height: 32px
      display: flex
      align-items: center
      @include h6

    &__head-text-secondary
      height: 20px
      display: flex
      align-items: center
      @include body-text-2

    &__divider
      margin: 24px 0

    &__options
      display: flex
      justify-content: space-between
      align-items: center
      margin-bottom: 33px

    &__year
      @include h6

    &__icons
      margin-top: 35px
      padding: 0 0 14px 0
      display: flex
      gap: 24px

    &__icon
      display: flex
      gap: 8px
      font-weight: 600
      font-size: 14px
      line-height: 20px


    &__calendar-wrapper
      padding: 33px 0 35px 0

    &__note
      display: flex
      text-align: left
      gap: 8px

    &__note-text
      @include button-2

    &__note-desc
      @include new-body-text-2

</style>
