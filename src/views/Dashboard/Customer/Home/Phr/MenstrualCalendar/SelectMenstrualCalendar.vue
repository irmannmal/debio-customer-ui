<template lang="pug">
  .select-menstrual-calendar
    .select-menstrual-calendar__wrapper
      MenstrualCalendarBanner
      ui-debio-modal.select-menstrual-calendar__modal(
        :show="showAlertUnsaved"
        :show-title="false"
        :show-cta="false"
        disable-dismiss
      )
        .select-menstrual-calendar__modal-title Unsaved Progress

        ui-debio-icon(
          :icon="alertTriangleIcon"
          size="90"
          color="#c400a5"
          stroke
        )
        .select-menstrual-calendar__modal-desc Are you sure you want to quit unsaved? you can continue this progress later

        .select-menstrual-calendar__modal-buttons(class=" justify-space-between align-center pa-10")
          ui-debio-button(
            color="secondary" 
            width="100px"
            height="35"
            style="font-size: 10px;"
            outlined 
            @click="cancelUnsaved()"
          ) No

          ui-debio-button(
            color="secondary" 
            width="100px"
            height="35"
            style="font-size: 10px;"
            @click="goToNextRoute()"
          ) Yes

      ui-debio-modal.select-menstrual-calendar__modal(
        :show="showAlertCancel"
        :show-title="false"
        :show-cta="false"
        disable-dismiss
      )
        .select-menstrual-calendar__modal-title Cancel Update

        ui-debio-icon(
          :icon="alertTriangleIcon"
          size="90"
          color="#c400a5"
          stroke
        )
        .select-menstrual-calendar__modal-desc Are you sure you want to cancel updating your menstrual calendar?

        .select-menstrual-calendar__modal-buttons(class=" justify-space-between align-center pa-10")
          ui-debio-button(
            color="secondary" 
            width="100px"
            height="35"
            style="font-size: 10px;"
            outlined 
            @click="showAlertCancel = false"
          ) No

          ui-debio-button(
            color="secondary" 
            width="100px"
            height="35"
            style="font-size: 10px;"
            @click="goToDetailMenstrual()"
          ) Yes

      ui-debio-modal.select-menstrual-calendar__modal(
        :show="showAlert"
        :show-title="false"
        :show-cta="false"
        disable-dismiss
      )
        .select-menstrual-calendar__modal-title Update Menstrual Calendar

        ui-debio-icon(
          :icon="alertTriangleIcon"
          size="90"
          color="#c400a5"
          stroke
        )
        .select-menstrual-calendar__modal-desc Are you sure you want update your menstrual calendar?

        .select-menstrual-calendar__modal-buttons(class=" justify-space-between align-center pa-10")
          ui-debio-button(
            color="secondary" 
            width="100px"
            height="35"
            style="font-size: 10px;"
            outlined 
            @click="showAlert = false"
          ) No

          ui-debio-button(
            color="secondary" 
            width="100px"
            height="35"
            style="font-size: 10px;"
            @click="toUpdateMenstrual()"
          ) Yes

      ui-debio-modal.select-menstrual-calendar__modal-success(
        :show="isSuccess"
        :show-title="false"
        :show-cta="false"
        disable-dismiss
      )
        .select-menstrual-calendar__modal-title Menstrual Calendar Updated!
        ui-debio-icon(
          :icon="checkCircleIcon"
          size="90"
          color="#c400a5"
          stroke
        )

        .select-menstrual-calendar__modal-desc Congratulations! you have updated your menstrual calendar succesfully!

        ui-debio-button(
          color="secondary" 
          width="100%"
          height="35"
          style="font-size: 10px;"
          @click="updateMenstrualSuccess()"
        ) Continue to Menstrual Calendar

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
              DaySelectAverage(
                v-model="daySelectedAverage"
                :startSelected="startDaySelectedAverage"
              )
            .select-avarage-menstrual__submit
              ui-debio-button(
                v-if="isUpdate"
                outlined
                height="44"
                width="180"
                style="font-size: 13px"
                @click="showAlertCancel = true"
                color="error"
                :bind="attrs"
                :on="on"
              ) Cancel
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
                ui-debio-button(
                  v-if="isUpdate"
                  outlined
                  height="44"
                  width="180"
                  style="font-size: 13px"
                  @click="showAlertCancel = true"
                  color="error"
                  :bind="attrs"
                  :on="on"
                ) Cancel
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
              alt="calendar-circle"
              src="@/assets/calendar-circle.svg"
              max-width="44px"
              max-height="44px"
            )
            .select-menstrual-calendar__small-head-text
              span.select-menstrual-calendar__small-head-text-primary Menstrual Calendar Settings
              span.select-menstrual-calendar__small-head-text-secondary Update menstruation day and subscription
          .select-menstrual-calendar__line-divider
          span.select-menstrual-calendar__small-content-text {{ stepText }}
          .select-menstrual-calendar__step-wrapper
            .select-menstrual-calendar__step-box(:class="{'select-menstrual-calendar__step-box-selected': !selectAverage}")
            .select-menstrual-calendar__step-box(:class="{'select-menstrual-calendar__step-box-selected': submitPreview}")
</template>

<script>
import { mapState, mapMutations } from "vuex"
import { alertTriangleIcon, checkCircleIcon } from "@debionetwork/ui-icons"
import { addMenstrualCalendar, addMenstrualCycleLog, updateMenstrualCalendar, updateMenstrualCycleLog } from "@/common/lib/polkadot-provider/command/menstrual-calendar"
import { getLastMenstrualCalendarByOwner, getLastMenstrualCalendarCycleLogByOwner, getMenstrualCalendarById } from "@/common/lib/polkadot-provider/query/menstrual-calendar"
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

  props: {
    isUpdate: {type: Boolean, default: false}
  },

  data: () => ({
    alertTriangleIcon, checkCircleIcon,
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
    selectAverage: true,
    showAlertUnsaved: false,
    showAlertCancel: false,
    showAlert: false,
    isSuccess: false,
    stepText: "",
    routeStateSave: null,
    nextStatus: false,
    daySelectedAverage: 21,
    startDaySelectedAverage: 21,
    lastMenstrualCalendar: null,
    lastMenstrualCalendarCycle: null,
    menstrualCalendarDetail: null
  }),
  computed: {
    ...mapState({
      api: (state) => state.substrate.api,
      pair: (state) => state.substrate.wallet
    })
  },

  beforeRouteLeave(to, _, next) {
    if (this.isUpdate && !this.routeStateSave) {
      this.showAlertUnsaved = true
      this.routeStateSave = to
    }

    next(this.nextStatus)
  },

  watch: {
    selectedMonthText(newMonth) {
      this.selectedMonth = this.monthList.find((value) => value.text === newMonth).value
    },
    selectedDates(newSelected) {
      this.submitEnabled = newSelected !== null && newSelected.length > 0
    }
  },

  async created() {
    this.stepText = this.isUpdate ? "By choosing your average cycle day, you’ll get your menstrual calendar information" : "Help us get to know you more deeply, complete these steps now!"
    document.querySelector("html").style.overflowY = null
    const today = new Date()
    this.selectedMonthText = this.monthList[today.getMonth()].text
    this.currentYear = today.getFullYear().toString()
  },

  async beforeMount() {
    if (this.isUpdate) {
      const lastMC = (await getLastMenstrualCalendarByOwner(this.api, this.pair.address)).at(-1)
      const lastMCC = (await getLastMenstrualCalendarCycleLogByOwner(this.api, lastMC)).at(-1)
      this.lastMenstrualCalendar = lastMC
      this.lastMenstrualCalendarCycle = lastMCC
      const menstrualDetail = await getMenstrualCalendarById(this.api, lastMC)
      this.menstrualCalendarDetail = menstrualDetail
      this.startDaySelectedAverage = Number(menstrualDetail.averageCycle)
    }
  },

  methods: {
    ...mapMutations({
      setIsStart: "menstrualCalendar/SET_ISSTART"
    }),

    prev() {
      this.selectedMonth--
      this.selectedMonthText = this.monthList[this.selectedMonth].text
    },

    next() { 
      this.selectedMonth++
      this.selectedMonthText = this.monthList[this.selectedMonth].text
    },    

    async onSubmit() {
      const menstrualCalendarInfo = []
      this.selectedDates.forEach(d => {
        menstrualCalendarInfo.push({
          date: d.getTime(),
          symptoms: [],
          menstruation: true
        })}
      );

      if (this.isUpdate) {
        this.showAlert = true
      } else {
        this.submitPreview = true
        this.nextStatus = true
        
        await addMenstrualCalendar(
          this.api,
          this.pair,
          this.daySelectedAverage,
          async () => {
            const idMenstrualCalendar = (await getLastMenstrualCalendarByOwner(this.api, this.pair.address)).at(-1)

            await addMenstrualCycleLog(
              this.api,
              this.pair,
              idMenstrualCalendar,
              menstrualCalendarInfo,
              () => {
                this.$router.push({ name: "menstrual-calendar-detail" })
              }
            )

            this.setIsStart(true)
          }
        )
      }
    },

    backButton() {
      this.selectAverage = true
    },

    async onSubmitAverage() {
      this.startDaySelectedAverage = this.daySelectedAverage
      this.selectAverage = false
      this.stepText = "By choosing your menstrual day, you’ll get your menstrual calendar information"
    },

    goToDetailMenstrual() {
      this.nextStatus = true
      this.$router.push({ name: "menstrual-calendar-detail" })
    },

    async toUpdateMenstrual() {
      this.showAlert = false
      this.submitPreview = true

      await updateMenstrualCalendar(
        this.api,
        this.pair,
        this.lastMenstrualCalendar,
        this.daySelectedAverage,
        async () => {
          await updateMenstrualCycleLog(
            this.api,
            this.pair,
            this.lastMenstrualCalendar,
            this.lastMenstrualCalendarCycle,
            this.selectedDates[0].getTime(),
            [],
            true,
            () => {
              this.isSuccess = true
            }
          )
        }
      )
    },

    async updateMenstrualSuccess() {
      this.isSuccess = false
      this.submitPreview = true
      this.nextStatus = true
      setTimeout(() => {
        this.$router.push({ name: "menstrual-calendar-detail" })
      }, 10000)
    },

    goToNextRoute() {
      this.showAlertUnsaved = false
      if (this.isUpdate) {
        this.nextStatus = true
        this.routeStateSave && this.$router.push({ name: this.routeStateSave.name })
      }
    },

    cancelUnsaved() {
      this.routeStateSave = null
      this.showAlertUnsaved = false
      this.$router.push({ name: "menstrual-calendar-detail" })
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
      gap: 16px

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

    &__modal
      display: flex
      align-items: center
      justify-content: center

    &__modal-desc
      max-width: 264px
      font-weight: 600
      font-size: 14px
      line-height: 20px
      color: #000000
      align-items: center
      text-align: center
      letter-spacing: -0.0075em

    &__modal-title
      text-align: center
      max-width: 264px
      @include h3-opensans
    
    &__modal-buttons
      display: flex
      justify-content: space-between
      gap: 20px

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
      gap: 16px

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
