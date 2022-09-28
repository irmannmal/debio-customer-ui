<template lang="pug">
  .select-menstrual-calendar
    .select-menstrual-calendar__wrapper
      MenstrualCalendarBanner
      .select-menstrual-calendar__selection
        template(v-if="selectAverage")
          ui-debio-card.select-avarage-menstrual__avarage-selection(width="740")
            .select-avarage-menstrual__head-text
              span.select-avarage-menstrual__head-text-primary How long is your average cycle?
              span.select-avarage-menstrual__head-text-secondary A little hint, cycles usually last 24-38 days
            .select-avarage-menstrual__line-divider
            .select-avarage-menstrual__text-avarage Average Cycle
            .select-avarage-menstrual__triangle-down
              v-img.checked(
                alt="menstruation"
                src="@/assets/triangle-down.svg"
                max-width="16px"
                max-height="16px"
              )
            .select-avarage-menstrual__selection-wrapper
              DaySelectAverage(v-model="selected")
            .select-avarage-menstrual__submit
              v-btn(
                color="secondary"
                elevation='0'
                width="180"
                height="44"
                class='white--text mnemonic-list-item'
                @click="onSubmitAverage"
              ) Submit
        template(v-if="!selectAverage")
          ui-debio-card.select-menstrual-calendar__calendar-selection(width="740")
            template(v-if="!submitPreview")
              .select-menstrual-calendar__head
                v-btn(
                  @click="backButton"
                  icon
                )
                  v-icon mdi-chevron-left
                .select-menstrual-calendar__head-text
                  span.select-menstrual-calendar__head-text-primary When did your last period start?
                  span.select-menstrual-calendar__head-text-secondary Choose date to perform action
            template(v-if="submitPreview")
              .select-menstrual-calendar__head
                .select-menstrual-calendar__head-text
                  span.select-menstrual-calendar__head-text-primary Calculating Calendar...
                  span.select-menstrual-calendar__head-text-secondary Kindly wait during calculating calendar
            .select-menstrual-calendar__line-divider
            .select-menstrual-calendar__options
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
                :disabled="submitPreview"
              )
              span.select-menstrual-calendar__year {{ selectedYear }}
            .select-menstrual-calendar__calendar-wrapper
              Calendar(
                :year="selectedYear" 
                :month="selectedMonth"
                :isLoading="submitPreview"
                v-model="selectedDates"
                :menstrualData="null"
              )
            .select-menstrual-calendar__icon-description
              .select-menstrual-calendar__icon-description-item
                v-img.checked(
                  alt="today"
                  src="@/assets/today.svg"
                  max-width="16px"
                  max-height="16px"
                )
                span Today
              .select-menstrual-calendar__icon-description-item
                v-img.checked(
                  alt="menstruation"
                  src="@/assets/menstruation.svg"
                  max-width="16px"
                  max-height="16px"
                )
                span Menstruation
              .select-menstrual-calendar__icon-description-item
                v-img.checked(
                  alt="prediction"
                  src="@/assets/prediction.svg"
                  max-width="16px"
                  max-height="16px"
                )
                span Prediction
              .select-menstrual-calendar__icon-description-item
                v-img.checked(
                  alt="fertility"
                  src="@/assets/fertility.svg"
                  max-width="16px"
                  max-height="16px"
                )
                span Fertility
              .select-menstrual-calendar__icon-description-item
                v-img.checked(
                  alt="ovulation"
                  src="@/assets/ovulation.svg"
                  max-width="16px"
                  max-height="16px"
                )
                span Ovulation
            .select-menstrual-calendar__note
              span(style='font-weight: 600;font-size: 14px;line-height: 20px;') Note
              span your previous menstrual cycle does not guarantee your future menstrual cycle medically or diagnostically
            template(v-if="!submitPreview")
              .select-menstrual-calendar__submit
                v-btn(
                  color="secondary"
                  elevation='0'
                  width="180"
                  height="44"
                  :disabled="!submitEnabled"
                  class='white--text mnemonic-list-item'
                  @click="onSubmit" 
                ) Submit
        ui-debio-card.select-menstrual-calendar__step(width="394")
          .select-menstrual-calendar__small-head
            v-img(
              alt="fertility"
              src="@/assets/calendar-circle.svg"
              max-width="44px"
              max-height="44px"
            )
            .select-menstrual-calendar__small-head-text
              span.select-menstrual-calendar__small-head-text-primary Menstrual Calendar Settings
              span.select-menstrual-calendar__small-head-text-secondary Update menstruation day and subscription
          .select-menstrual-calendar__line-divider
          span.select-menstrual-calendar__small-content-text Help us get to know you more deeply, complete these steps now!
          .select-menstrual-calendar__step-wrapper
            .select-menstrual-calendar__step-box(:class="{'select-menstrual-calendar__step-box-selected': !selectAverage}")
            .select-menstrual-calendar__step-box(:class="{'select-menstrual-calendar__step-box-selected': submitPreview}")
</template>

<script>
import Calendar from "@/common/components/Calendar"
import DaySelectAverage from "@/common/components/DaySelectAverage"
import MenstrualCalendarBanner from "./Banner"

export default {
  name: "SelectMenstrualCalendar",

  components: {
    Calendar,
    DaySelectAverage,
    MenstrualCalendarBanner
  },

  data: () => ({
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
    selectedMonthText: "",
    selectedMonth: new Date().getMonth(),
    selectedYear: new Date().getFullYear(),
    selectedDates: null,
    submitEnabled: false,
    submitPreview: false,
    selectAverage: true
  }),

  watch: {
    selectedMonthText(newMonth) {
      this.selectedMonth = this.monthList.find((value) => value.text === newMonth).value
    },
    selectedDates(newSelected) {
      this.submitEnabled = newSelected !== null && newSelected.length > 0
    }
  },

  async created() {
    document.querySelector("html").style.overflowY = null
    const today = new Date()
    this.selectedMonthText = this.monthList[today.getMonth()].text
    this.currentYear = today.getFullYear().toString()
  },

  methods: {
    onSubmit() {
      this.submitPreview = true
      setTimeout(() => {
        this.$router.push({ name: "menstrual-calendar-detail" })
      }, 10000)
    },

    backButton() {
      this.selectAverage = true
    },

    onSubmitAverage() {
      this.selectAverage = false
    }
  }
}
</script>

<style lang="sass" scoped>
  @import "@/common/styles/mixins.sass"

  .select-menstrual-calendar
    &__wrapper
      height: 100%

    &__selection
      margin-top: 16px
      display: flex
      gap: 16px

    &__calendar-selection
      width: 740px

    &__head
      display: flex
      height: 60px
      align-content: center
      align-items: center
      gap: 27.33px
    
    &__head-text
      display: flex
      flex-direction: column
      gap: 8px

    &__head-text-primary
      height: 32px
      font-family: 'Open Sans'
      font-style: normal
      font-weight: 600
      font-size: 20px
      line-height: 32px
      display: flex
      align-items: center
      letter-spacing: 0.0044em
      color: #363636

    &__head-text-secondary
      height: 20px
      font-family: 'Open Sans'
      font-style: normal
      font-weight: 400
      font-size: 14px
      line-height: 20px
      display: flex
      align-items: center
      letter-spacing: -0.0044em
      color: #757274

    &__options
      display: flex
      justify-content: space-between
      align-items: center

    &__year
      font-style: normal
      font-weight: 600
      font-size: 20px
      line-height: 32px
      color: #363636

    &__calendar-wrapper
      padding: 33px 0 35px 0

    &__icon-description
      padding: 0 0 14px 0
      display: flex
      gap: 24px
    
    &__icon-description-item
      display: flex
      gap: 8px
      font-weight: 600
      font-size: 14px
      line-height: 20px

    &__note
      display: flex
      text-align: left
      gap: 8px
      font-size: 14px

    &__submit
      display: flex
      margin: 18px 0 0 0
      justify-content: flex-end

    &__step
      height: 210px

    &__line-divider::after
      content: ""
      display: block
      border: 1px solid #E9E9E9
      margin: 24px auto

    &__small-head
      display: flex
      height: 44px
      align-content: center
      align-items: center
      gap: 16px
    
    &__small-head-text
      display: flex
      flex-direction: column
      gap: 4px

    &__small-head-text-primary
      font-family: 'Open Sans'
      font-style: normal
      font-weight: 600
      font-size: 16px
      line-height: 22px
      display: flex
      align-items: center
      letter-spacing: 0.0044em
      color: #363636

    &__small-head-text-secondary
      font-family: 'Open Sans'
      font-style: normal
      font-weight: 400
      font-size: 14px
      line-height: 20px
      display: flex
      align-items: center
      letter-spacing: -0.0044em
      color: #757274

    &__small-content-text
      height: 44px
      font-weight: 600
      font-size: 14px
      line-height: 22px
      align-items: center
      color: #7A7A7A
      display: flex
      align-items: center

    &__step-wrapper
      padding: 16px 0 0  0
      display: flex
      gap: 12px

    &__step-box
      height: 8px
      width: 162px
      background: #E0E0E0
    
    &__step-box-selected
      background: #FFC4F9

  .select-avarage-menstrual
    &__wrapper
      height: 100%
      display: flex

    &__banner
      display: flex
      justify-content: space-between

    &__title
      @include h5-opensans

    &__sub-title
      @include body-text-2

    &__selection
      margin-top: 16px
      display: flex
      gap: 16px

    &__avarage-selection
      width: 740px

    &__head
      display: flex
      height: 60px
      align-content: center
      align-items: center
      gap: 27.33px
    
    &__head-text
      display: flex
      flex-direction: column
      gap: 8px

    &__head-text-primary
      height: 32px
      font-family: 'Open Sans'
      font-style: normal
      font-weight: 600
      font-size: 20px
      line-height: 32px
      display: flex
      align-items: center
      letter-spacing: 0.0044em
      color: #363636

    &__head-text-secondary
      height: 20px
      font-family: 'Open Sans'
      font-style: normal
      font-weight: 400
      font-size: 14px
      line-height: 20px
      display: flex
      align-items: center
      letter-spacing: -0.0044em
      color: #757274

    &__line-divider::after
      content: ""
      display: block
      border: 1px solid #E9E9E9
      margin: 24px auto

    &__text-avarage
      display: flex
      padding: 12px 0 8px 0
      font-style: normal
      font-weight: 400
      font-size: 14px
      line-height: 20px
      color: #000000
      justify-content: center

    &__triangle-down
      display: flex
      justify-content: center
      line-height: 20px

    &__selection-wrapper
      margin: 16px 0 0 0

    &__submit
      display: flex
      margin: 137px 0 0 0
      justify-content: flex-end

    &__step
      height: 210px

    &__small-head
      display: flex
      height: 44px
      align-content: center
      align-items: center
      gap: 16px
    
    &__small-head-text
      display: flex
      flex-direction: column
      gap: 4px

    &__small-head-text-primary
      font-family: 'Open Sans'
      font-style: normal
      font-weight: 600
      font-size: 16px
      line-height: 22px
      display: flex
      align-items: center
      letter-spacing: 0.0044em
      color: #363636

    &__small-head-text-secondary
      font-family: 'Open Sans'
      font-style: normal
      font-weight: 400
      font-size: 14px
      line-height: 20px
      display: flex
      align-items: center
      letter-spacing: -0.0044em
      color: #757274

    &__small-content-text
      height: 44px
      font-weight: 600
      font-size: 14px
      line-height: 22px
      align-items: center
      color: #7A7A7A
      display: flex
      align-items: center

    &__step-wrapper
      padding: 16px 0 0  0
      display: flex
      gap: 12px

    &__step-box
      height: 8px
      width: 162px
      background: #E0E0E0
    
    &__step-box-selected
      background: #FFC4F9
      
</style>
