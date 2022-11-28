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
          :isUpdate="isUpdate"
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
    menstrualData: {type: Object, default: null},
    isUpdate:  {type: Boolean, default: false}
  },

  data: () => ({
    days: ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"],
    dateList: [],
    selectedMonth: 0,
    selectedYear: 0,
    selectedDate: null,
    isMenstrualData: false,
    indexList: [],
    listDate: [],
    selectedMenstrualData: null,
    listUnselectDate: [],
    reselectDate: null
  }),

  async created() {
    this.selectedMonth = this.month
    this.selectedYear = this.year

    if (this.menstrualData) {
      this.isMenstrualData = true
      this.processFromData(this.year, this.month)
    } else {
      this.updateCalendar(this.year, this.month)
    }
  },

  watch: {
    month(newMonth) {
      if (this.menstrualData) {
        this.isMenstrualData = true
        this.processFromData(this.year, newMonth)
      } else {
        this.updateCalendar(this.year, newMonth)
      }
    },

    isLoading(newLoad) {
      console.log("loading", newLoad)
    },

    async menstrualData() {
      if (this.menstrualData) {
        this.isMenstrualData = true
        await this.processFromData(this.year, this.month)
      }

      if(this.isUpdate) {
        await this.updateCalendar(this.year, this.month)
      }
    }
  },

  methods: {
    async updateCalendar(year, month) {
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

        const selectedMenstrualData = this.menstrualData ? this.menstrualData.cycleLog[indexDate] : null
        const data = {
          index: indexDate,
          isPast: date < today, 
          date: date,
          indexStartSelected: this.indexList[0] === indexDate,
          thisMonth: date.getMonth() === month,
          isMenstruation: selectedMenstrualData?.date === date.getTime() && selectedMenstrualData?.menstruation === 1 ? true : false,
          isSelected: this.indexList.find(i => i === indexDate) ? true : false,
          text: date.getDate(),
          today: today.getDate() === date.getDate() && today.getMonth() === date.getMonth(),
          previousDay: today.getDate() <= date.getDate() && today.getMonth() <= date.getMonth() && today.getFullYear() <= date.getFullYear()
        }

        if(this.reselectDate === date.getTime()) {
          data.isMenstruation = true
          data.isSelected = false
          this.reselectDate = null
        }

        if(this.listUnselectDate.find(d => d === date.getTime())) {
          data.isMenstruation = false
          data.isSelected = false
        }
        weekDays.push(data)

        indexDate++
      }

      this.dateList.push(weekDays)
    },

    async processFromData(year, month) {
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

      if (!this.menstrualData) {
        await this.updateCalendar(this.year, this.month)
        return
      }

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

    functionSort(val) {
      return val.sort(function(a, b){return a - b})
    },

    async onSelect(date, index) {
      this.selectedDate = date.getTime()
      if (this.indexList.find(i => i === index)) {
        this.indexList = this.functionSort(this.indexList.filter(i => i !== index))
        this.listDate = this.listDate.filter(d => d.getTime() !== date.getTime() )
        await this.updateCalendar(this.year, this.month)
        this.$emit("input", date)
        return
      }

      if (this.listUnselectDate.length > 0) {        
        this.listUnselectDate = this.listUnselectDate.filter(d => d !== this.selectedDate)
        this.reselectDate = this.selectedDate
      }

      this.indexList.push(index)
      this.listDate.push(date)
      await this.updateCalendar(this.year, this.month)
      this.$emit("input", date)
    },

    async onUnselect(date) {
      this.listUnselectDate.push(date.getTime())
      await this.updateCalendar(this.year, this.month)
      this.$emit("input", date)
    },

    async onRemoveSelect() {
      this.selectedDate = null
      await this.processFromData(this.year, this.month)
      this.$emit("input", null)
    },

    async onDaySelect(selectedDate) {
      this.selectedDate = selectedDate
      await this.processFromData(this.year, this.month)
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
