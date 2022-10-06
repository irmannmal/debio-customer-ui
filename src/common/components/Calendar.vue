<template lang="pug">
  .calendar
    .calendar__days
      .calendar__text(v-for="day in days") {{ day }}
    .calendar__content
      .calendar__list-day(v-for="date in dateList")
        Day(
          :dates="date" 
          @on-selected="onSelect" 
          @on-unselected="onUnselect"
          @on-remove-select="onRemoveSelect"
          @on-day-select="onDaySelect"
          :isLoading="isLoading"
          :isMenstrualData="isMenstrualData"
        )
</template>

<script>
import Day from "./Day.vue"

export default {
  name: "Calendar",

  components: {
    Day
  },

  props: {
    month: {type: Number, default: 0},
    year: {type: Number, default: new Date().getFullYear()},
    isLoading: {type: Boolean, default: false},
    menstrualData: {type: Object, default: null}
  },

  data: () => ({
    days: ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"],
    dateList: [],
    selectedMonth: 0,
    selectedYear: 0,
    selectedDate: null,
    isMenstrualData: false
  }),

  async created() {
    this.selectedMonth = this.month
    this.selectedYear = this.year

    if (this.menstrualData) {
      this.isMenstrualData = true
      this.processFromData(this.year, this.month)
    } else {
      this.updateCalendar(-1, -1, this.year, this.month)
    }
  },

  watch: {
    month(newMonth) {
      this.updateCalendar(-1, -1, this.year, newMonth)
    },
    isLoading(newLoad) {
      console.log("loading", newLoad)
    },
    menstrualData() {
      if (this.menstrualData) {
        this.isMenstrualData = true
        this.processFromData(this.year, this.month)
      }
    }
  },

  methods: {
    updateCalendar(selectStart, selectEnd, year, month) {
      this.dateList.splice(0, this.dateList.length)
      const today = new Date()
      const firstDateCurrentMonth = new Date(year, month, 1)
      const firstDateNextMonth = new Date(year, month + 1, 0)

      const dayFirstDateCurrentMonth = firstDateCurrentMonth.getDay() === 0 ? 6 : firstDateCurrentMonth.getDay() - 1
      const dayFirstDateNextMonth = firstDateNextMonth.getDay() === 0 ? 6 : firstDateNextMonth.getDay() - 1
      const startDate = new Date(year, month, -(dayFirstDateCurrentMonth - 1))
      const endDate = new Date(year, month + 1, (6 - dayFirstDateNextMonth))

      let weekDays = []
      let date = startDate
      let indexDate = 0

      while (date.getTime() < endDate.getTime()) {
        date = new Date(year, month, (-(dayFirstDateCurrentMonth - 1) + indexDate))

        if (weekDays.length === 7) {
          this.dateList.push(weekDays)
          weekDays = []
        }

        weekDays.push({
          index: indexDate,
          isPast: date < today, 
          date: date,
          indexStartSelected: selectStart === indexDate,
          thisMonth: date.getMonth() === month,
          isSelected: indexDate >= selectStart && indexDate <= selectEnd,
          text: date.getDate(),
          today: today.getDate() === date.getDate() && today.getMonth() === date.getMonth(),
          previousDay: today.getDate() <= date.getDate() && today.getMonth() <= date.getMonth() && today.getFullYear() <= date.getFullYear()
        })

        indexDate++
      }

      this.dateList.push(weekDays)
    },

    processFromData(year, month) {
      this.dateList.splice(0, this.dateList.length)
      const today = new Date()
      const firstDateCurrentMonth = new Date(year, month, 1)
      const firstDateNextMonth = new Date(year, month + 1, 0)

      const dayFirstDateCurrentMonth = firstDateCurrentMonth.getDay() === 0 ? 6 : firstDateCurrentMonth.getDay() - 1
      const dayFirstDateNextMonth = firstDateNextMonth.getDay() === 0 ? 6 : firstDateNextMonth.getDay() - 1
      const startDate = new Date(year, month, -(dayFirstDateCurrentMonth - 1))
      const endDate = new Date(year, month + 1, (6 - dayFirstDateNextMonth))

      // let dayInMonth = []
      let weekDays = []
      let date = startDate
      let indexDate = 0
      let indexMenstrualData = 0
      let dateList = []

      const lastIndexCycleLog = this.menstrualData.cycleLog.length - 2
      while (date.getTime() < endDate.getTime()) {
        date = new Date(year, month, (-(dayFirstDateCurrentMonth - 1) + indexDate))

        if (weekDays.length === 7) {
          dateList.push(weekDays)
          weekDays = []
        }

        const data = {
          isMenstruation: false,
          isPrediction: false,
          isFertility: false,
          isOvulation: false,
          symptoms: []
        }

        if (indexMenstrualData < lastIndexCycleLog) {
          const selectedMenstrualData = this.menstrualData.cycleLog[indexMenstrualData]

          if (selectedMenstrualData.date === date.getTime()) {
            data.isMenstruation = selectedMenstrualData.menstruation === 1
            data.isPrediction = selectedMenstrualData.prediction === 1
            data.isFertility = selectedMenstrualData.fertility === 1
            data.isOvulation = selectedMenstrualData.ovulation === 1
            data.symptoms = selectedMenstrualData.symptoms

            indexMenstrualData++
          }
        }

        weekDays.push({
          index: indexDate,
          isPast: date.getTime() < today.getTime(), 
          date: date,
          thisMonth: date.getMonth() === month,
          text: date.getDate(),
          today: today.getDate() === date.getDate() && today.getMonth() === date.getMonth(),
          previousDay: today.getDate() <= date.getDate() && today.getMonth() <= date.getMonth() && today.getFullYear() <= date.getFullYear(),
          isSelected: this.selectedDate !== null ? this.selectedDate.getTime() === date.getTime() : false,
          data: data
        })
        
        indexDate++
      }
      
      dateList.push(weekDays)
      this.dateList = dateList
    },

    onSelect(selectedDate, index) {
      this.selectedDate = selectedDate
      this.updateCalendar(index, index + 4, this.year, this.month)
      this.$emit("input", selectedDate)
    },

    onUnselect() {
      this.startSelectDate = null
      this.updateCalendar(-1, -1, this.year, this.month)
      this.$emit("input", null)
    },

    onRemoveSelect() {
      this.selectedDate = null
      this.processFromData(this.year, this.month)
      this.$emit("input", null)
    },

    onDaySelect(selectedDate) {
      console.log("select", selectedDate)
      this.selectedDate = selectedDate
      this.processFromData(this.year, this.month)
      this.$emit("input", selectedDate)
    }
  }
}
</script>

<style lang="sass">
  @import "@/common/styles/mixins.sass"

  .calendar
    display: inline-flex
    flex-direction: column

    &__days
      display: flex
      align-items: center
      text-align: center
      gap: 5.33px
      color: #D3C9D1
      font-weight: 600
      font-size: 14px
      line-height: 20px

    &__text
      width: 92px
      margin: 0 0 16px 0

    &__content
      width: 100%
      display: flex
      flex-direction: column
      align-items: center
      gap: 5.33px

    &__list-day
      width: 100%
      display: flex
      gap: 5.33px
    
</style>
