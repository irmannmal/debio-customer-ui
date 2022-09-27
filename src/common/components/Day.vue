<template lang="pug">
  .wrap
    span.skeleton-loader(
      v-if="isLoading" 
      v-for="_ in countDay"
    )

    div.day-card(
      v-if="!isLoading"
      v-for="day in countDay" 
      :class="{ day: (dates[day - 1] !== undefined && dates[day - 1].thisMonth), none: !(dates[day - 1] !== undefined && dates[day - 1].thisMonth), selected: (dates[day - 1] !== undefined && dates[day - 1].isSelected) }" 
      @click="dayClick(dates[day - 1] !== undefined && dates[day - 1].thisMonth && dates[day - 1].isPast, dates[day - 1].date, dates[day - 1].index)"
    )
      div(
        v-if="dates[day - 1] !== undefined && dates[day - 1].thisMonth"
      )
        v-img.today(
          v-if="dates[day - 1] !== undefined && dates[day - 1].today"
          alt="today"
          src="@/assets/today.svg"
          max-width="23px"
          max-height="23px"
        )
        v-img.checked(
          v-if="(dates[day - 1] !== undefined && dates[day - 1].isSelected) && !menstrualData"
          alt="checked"
          src="@/assets/tick-circle.svg"
          max-width="16px"
          max-height="16px"
        )
        span(
          :class="{ past: (dates[day - 1] !== undefined && dates[day - 1].isPast && !dates[day - 1].isSelected) }"
        ) {{ dates[day - 1].text.toString().trim() }}
</template>

<script>
export default {
  name: "Day",

  props: {
    dates: {type: Array},
    isLoading: {type: Boolean, default: false},
    menstrualData: {type: Object, default: null}
  },

  data: () => ({
    selectedIndex: -1,
    countDay: 7

  }),

  methods: {
    dayClick(active, date, index) {
      if (index === this.selectedIndex) {
        active && this.$emit("on-unselected")
        this.selectedIndex = -1
      } else {
        const selectedDate = []
        for (let currNum = 0; currNum <= 4; currNum++) {
          selectedDate.push(new Date(date.getFullYear(), date.getMonth(), (date.getDate() + currNum)))
        }
        active && this.$emit("on-selected", selectedDate, index)
        this.selectedIndex = index
      }
    }
  }
}
</script>

<style scoped>
  .wrap {
    display: flex;
    gap: 5.33px;
  }

  .day-card {
    max-width: 92px;
    max-height: 72px;
  }

  .skeleton-loader {
    position: relative;
    width: 92px;
    height: 72px;
    display: flex;
    border-radius: 4px;
    cursor: progress; 
    background: 
      linear-gradient(0.25turn, transparent, #fff, transparent),
      linear-gradient(#eee, #eee),
      radial-gradient(38px circle at 19px 19px, #eee 50%, transparent 51%),
      linear-gradient(#eee, #eee);  
    background-repeat: no-repeat;
    background-size: 315px 250px, 315px 180px, 100px 100px, 225px 30px; 
    background-position: -315px 0, 0 0, 0px 190px, 50px 195px; 
    animation: loading 1.5s infinite;
  }
  
  @keyframes loading {  
    to {
      background-position: 315px 0, 0 0, 0 190px, 50px 195px;
    }
  }

  .past {
    color: #363636;
  }

  .day {
    position: relative;
    width: 92px;
    height: 72px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color:#F7F7F7;
    border-radius: 4px;
    color: #D3C9D1;
    font-weight: 600;
    font-size: 14px;
    cursor: pointer;
    user-select: none;
  }

  .selected {
    background-color: #FFC4F9;
    color: #F7F7F7;
  }

  .none {
    position: relative;
    width: 92px;
    height: 72px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 4px;
    color: #D3C9D1;
    font-weight: 600;
    font-size: 14px;
    cursor: not-allowed;
    user-select: none;
  }

  .today {
    position: absolute;
    width: 23px;
    height: 23px;
    top: 0px;
    right: 0;
  }

  .checked {
    position: absolute;
    width: 16px;
    height: 16px;
    bottom: 0;
    right: 0;
    margin: 0 4px 4px 0;
  }

  .drop {
    position: absolute;
    width: 16px;
    height: 16px;
    top: 0;
    left: 0;
    margin: 4px 0 0 4.67px;
  }
</style>
