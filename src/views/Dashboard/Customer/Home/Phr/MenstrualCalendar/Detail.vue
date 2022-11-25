<template lang="pug">
  .menstrual-calendar-detail
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
            span.menstrual-calendar-detail__head-text-primary My Menstrual Calendar
            span.menstrual-calendar-detail__head-text-secondary Choose date to perform action
          
          v-divider.menstrual-calendar-detail__divider

          .menstrual-calendar-detail__options
            .menstrual-calendar-detail__month
              v-btn( 
                fab
                text
                small
                color="grey darken-2"
                @click="prev"
              )
                v-icon(small) mdi-chevron-left
              span {{ selectedMonthText }}

              v-btn( 
                fab
                text
                small
                color="grey darken-2"
                @click="next"
              )
                v-icon(small) mdi-chevron-right

            span.menstrual-calendar-detail__year {{ selectedYear }}

          Calendar.menstrual-calendar-detail__calendar(
            :year="selectedYear" 
            :month="selectedMonth"
            v-model="selectedDates"
            :menstrualData="menstrualCalendarData"
          )

          .menstrual-calendar-detail__icons
            .menstrual-calendar-detail__icon(v-for="description in descriptions")
              v-img(
                :alt="description.toLowerCase()"
                :src="require(`../../../../../../assets/${description.toLowerCase()}.svg`)"
                max-width="16px"
                max-height="16px"
              )
              span {{ description}}

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
            .menstrual-calendar-detail__text {{ getSummary() }}


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
              @click="toMenstrualSelectionUpdate()"
            ) 
              .menstrual-calendar-detail__button-text Update Menstruation Day
              v-icon mdi-chevron-right

            ui-debio-button.menstrual-calendar-detail__button(
              color="#F3F3F3" 
              height="48"
              width="100%"
              disabled
              @click="toSubscriptionSetting()"
            ) 
              .menstrual-calendar-detail__button-text Subscription Settings
              v-alert.menstrual-calendar-detail__alert.ml-1(color="#FFE6E6" )
                .menstrual-calendar-detail__alert-text Coming Soon
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
import moods from "@/common/constants/menstruation-moods"
import MenstrualCalendarBanner from "./Banner.vue"
import Calendar from "@/common/components/Calendar"
import { mapState } from "vuex"
import { getLastMenstrualCalendarByOwner, getMenstrualCalendarById, getLastMenstrualCalendarCycleLogByOwner, getMenstrualCycleLog } from "@/common/lib/polkadot-provider/query/menstrual-calendar"


export default {
  name: "MenstrualCalendarDetail",

  data: () => ({
    emojis,
    moods,
    selectedMonthText: "",
    selectedMonth: new Date().getMonth(),
    selectedYear: new Date().getFullYear(),
    selectedDates: null,
    submitEnabled: false,
    submitPreview: false,
    selectAverage: true,
    showStart: false,
    averageCycle: 0,
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
    menstrualCalendarData: null,
    menstruationPeriodeIndex: [],
    todaySum: null,
    emojiDays: {},
    emojiSelected: [],

    days: ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"],
    descriptions: ["Today", "Menstruation", "Prediction", "Fertility", "Ovulation"]
  }),

  computed: {
    ...mapState({
      api: (state) => state.substrate.api,
      wallet: (state) => state.substrate.wallet
    })  
  },

  watch: {
    async selectedMonthText(newMonth) {
      this.menstruationPeriodeIndex = []
      this.selectedMonth = this.monthList.find((value) => value.text === newMonth).value
      await this.getMenstruationCalendarData()
    },

    selectedDates(newSelected) {
      this.submitEnabled = newSelected !== null && newSelected.length > 0
      this.emojiSelected = this.emojiDays[newSelected?.getTime()] ?? []
    },

    emojiSelected() {
      this.updateEmojis()
    },

    async emojiDays() {
      await this.getMenstruationCalendarData()
    }
  },

  methods: {
    prev() {
      this.selectedMonth--
      this.selectedMonthText = this.monthList[this.selectedMonth].text
    },

    next() { 
      this.selectedMonth++
      this.selectedMonthText = this.monthList[this.selectedMonth].text
    },

    async addEmoji(emoji) {
      if (!this.selectedDates) return

      if (emoji.disabled === "active") {
        emoji.disabled = "inactive"
        emoji.color = "#363636"
        await this.removeSymptoms(this.selectedDates, emoji)
      } else {
        emoji.disabled = "active"
        emoji.color = "#E27625"
        await this.addSymptoms(this.selectedDates, emoji)
      }
    },

    async addSymptoms(date, emoji) {
      let emojiDaysCopy = {...this.emojiDays}
      const time = date.getTime()
      let emojiCollection = emojiDaysCopy[time] ?? []
      emojiCollection.push(emoji)
      emojiDaysCopy[time] = emojiCollection

      this.emojiDays = emojiDaysCopy
    },

    async removeSymptoms(date, emoji) {
      let emojiDaysCopy = {...this.emojiDays}
      const time = date.getTime()
      let emojiCollection = emojiDaysCopy[time]?.filter((val) => val.name !== emoji.name) ?? []
      emojiDaysCopy[time] = emojiCollection

      this.emojiDays = emojiDaysCopy
    },

    getSummary() {
      if(this.todaySum.menstruation) return moods.MENSTRUATION(this.todaySum.days)
      if(this.todaySum.fertility) return moods.FERTILITY
      if(this.todaySum.ovulation) return moods.OVULATION
      return moods.NONE
    },

    async getMenstruationCalendarData() {
      try {
        const menstrualCalendar = await getLastMenstrualCalendarByOwner(this.api, this.wallet.address)
        const data = await getMenstrualCalendarById(this.api, menstrualCalendar[0])
        const today = new Date()
        const firstDateCurrentMonth = new Date(this.selectedYear, this.selectedMonth, 1)
        const firstDateNextMonth = new Date(this.selectedYear, this.selectedMonth + 1, 0)
        
        const dayFirstDateCurrentMonth = firstDateCurrentMonth.getDay() === 0 ? 6 : firstDateCurrentMonth.getDay() - 1
        const dayFirstDateNextMonth = firstDateNextMonth.getDay() === 0 ? 6 : firstDateNextMonth.getDay() - 1

        const startDate = new Date(this.selectedYear, this.selectedMonth, -(dayFirstDateCurrentMonth - 1))
        const endDate = new Date(this.selectedYear, this.selectedMonth + 1, (6 - dayFirstDateNextMonth))
        const menstrualCalendarData = {
          addressId: data.addressId,
          averageCycle: data.averageCycle,
          cycleLog: []
        }

        let date = startDate
        let indexDate = 0
        this.menstruationPeriodeIndex = []

        const menstrualCycleLogByOwner = await getLastMenstrualCalendarCycleLogByOwner(this.api, menstrualCalendar[menstrualCalendar.length-1])
        const cycle = []

        for (let i = 0; i < menstrualCycleLogByOwner.length; i++) {
          const test = await getMenstrualCycleLog(this.api, menstrualCycleLogByOwner[i])
          cycle.push(test)
        }

        cycle.sort((a, b) => parseInt(a.date.replaceAll(",", "")) - parseInt(b.date.replaceAll(",", "")))
        const lastMens = cycle.find(c => (new Date(Number(c.date.replaceAll(",", "")))).getMonth() === this.selectedMonth - 1)
        let firstDayOfLastPeriod =  new Date(Number(lastMens.date.replaceAll(",", "")))
        let lastMonthPrediction = []
        if(lastMens) {
          for (let i = 0; i < 16; i++) {
            if (i < 5) lastMonthPrediction.push(firstDayOfLastPeriod.setDate(firstDayOfLastPeriod.getDate() + Number(data.averageCycle) + i))
            firstDayOfLastPeriod = new Date(Number(lastMens.date.replaceAll(",", "")))
          }          
        }

        
        while(date.getTime() < endDate.getTime()) {
          date = new Date(this.selectedYear, this.selectedMonth, (-(dayFirstDateCurrentMonth - 1) + indexDate))
          const log = cycle.filter(log => Number(log.date.replaceAll(",", "")) === date.getTime())
          const menstruation = log[0]
          const symptoms = this.emojiDays[date.getTime()] ?? []

          if (menstruation) this.menstruationPeriodeIndex.push(indexDate)

          let currentData

          if(lastMens) {
            currentData = {
              date: date.getTime(),
              menstruation: menstruation ? 1: 0,
              prediction: lastMonthPrediction.find(pred => pred === date.getTime()) || (indexDate >= this.menstruationPeriodeIndex[0] + Number(data.averageCycle) &&  indexDate < this.menstruationPeriodeIndex[0] + Number(data.averageCycle) + 5) ? 1 : 0,
              fertility:  indexDate >= this.menstruationPeriodeIndex[0] + 8 && indexDate <= this.menstruationPeriodeIndex[0] + 16 ? 1 : 0,
              ovulation: indexDate >= this.menstruationPeriodeIndex[0] + 13 && indexDate <= this.menstruationPeriodeIndex[0] + 15 ? 1 : 0,
              symptoms: symptoms
            }
          } else {
            currentData = {
              date: date.getTime(),
              menstruation: menstruation ? 1: 0,
              prediction: indexDate >= this.menstruationPeriodeIndex[0] + Number(data.averageCycle) &&  indexDate < this.menstruationPeriodeIndex[0] + Number(data.averageCycle) + 5 ? 1 : 0,
              fertility: indexDate >= this.menstruationPeriodeIndex[0] + 8 && indexDate <= this.menstruationPeriodeIndex[0] + 16 ? 1 : 0,
              ovulation: indexDate >= this.menstruationPeriodeIndex[0] + 13 && indexDate <= this.menstruationPeriodeIndex[0] + 15 ? 1 : 0,
              symptoms: symptoms
            }
          }

          menstrualCalendarData.cycleLog.push(currentData)

          if (today.getDate() === date.getDate()) {
            this.todaySum = currentData
            this.menstruationPeriodeIndex.map((num, i) => {
              this.todaySum.index = num
              this.todaySum.days = i
            })
            
          }
          indexDate++
        }
        this.menstrualCalendarData = menstrualCalendarData
      } catch (err) {
        console.log(err.message)
      }
    },

    toSubscriptionSetting() {
      this.$router.push({ name: "menstrual-calendar-subscription-setting" })
    },

    toMenstrualSelectionUpdate() {
      this.$router.push({ name: "menstrual-calendar-selection-update" })
    },

    updateEmojis() {
      const emojies = this.emojis.map((value) => {
        const active = this.emojiSelected.some(({name}) => name === value.name)
        
        value.disabled = active ? "active" : "inactive"
        value.color = active ? "#E27625" : "#363636"
        
        return value
      })

      this.emojis = emojies
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

    &__month
      width: 200px

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
