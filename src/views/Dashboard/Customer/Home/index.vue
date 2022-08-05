<template lang="pug">
.customer-dashboard
  ui-debio-banner.customer-dashboard__banner(
    title="Dashboard"
    subtitle="DeBio is the Most Privacy secured Platform for Personal Biomedical Testing!"
    with-decoration
    gradient-color="violet"
  )

    template(slot="cta")
      .banner-card
        router-link.banner-card__container(v-for="banner in banners" :key="banner.id" :to="{ name: banner.link}")
          ui-debio-icon.banner-card__icon(
            :icon="banner.icon"
            size="50"
          )
          .banner-card__text {{ banner.text }}

  .customer-dashboard__tables
    .tables
      .tables__tabs
        v-tabs(v-model="tabs")
          v-tab.tab-section Recent Order
          v-tab.tab-section Recent Payments
        v-tabs-items.tables__contents(v-model="tabs")
          v-tab-item
            ui-debio-data-table.content(
              :headers="headers"
              :items="testList"
              :page="1"
              :loading="isLoadingTest"
            )
              template(class="status" v-slot:[`item.serviceName`]="{item}")
                div(class="d-flex align-center")
                  ui-debio-avatar.serviceImage(
                    :src="setServiceImage(item.serviceImage)"
                    size="41"
                    rounded
                  )
                  div(class="fluid")
                    .d-flex.flex-column.customer-dashboard__order-service-name
                      span {{ item.serviceName }}
                    .d-flex.flex-column.customer-dashboard__order-service-sample-id
                      span {{ item.dnaSampleTrackingId}}

              template(v-slot:[`item.labName`]="{item}")
                .d-flex.flex-column.customer-dashboard__order
                  span {{ item.labName }}

              template(v-slot:[`item.orderDate`]="{item}")
                .d-flex.flex-column.customer-dashboard__order
                  span {{ item.orderDate }}

              template(class="status" v-slot:[`item.status`]="{item}") 
                .d-flex.flex-column.customer-dashboard__order
                  span(:style="{color: setStatusColor(item.status)}") {{ setTestStatus(item.status) }}

              template(v-slot:[`item.actions`]="{item}")
                ui-debio-icon.iconTable(
                  :icon="eyeIcon"
                  role="button"
                  slot="icon" size="20"
                  color="#C400A5"
                  stroke
                  @click="goToOrderDetail(item)"
                )
          v-tab-item
            ui-debio-data-table(
              :headers="headers"
              :items="paymentHistory"
              :page="2"
              :loading="isLoadingPayments"
            )
              template(class="status" v-slot:[`item.serviceName`]="{item}")
                div(class="d-flex align-center")
                  ui-debio-avatar.serviceImage(
                    :src="setServiceImage(item.serviceImage)"
                    size="41"
                    rounded
                  )
                  div(class="fluid")
                    .d-flex.flex-column.customer-dashboard__order-service-name
                      span {{ item.serviceName }}
                    .d-flex.flex-column.customer-dashboard__order-service-sample-id
                      span {{ item.dnaSampleTrackingId}}

              template(v-slot:[`item.orderDate`]="{item}")
                .d-flex.flex-column.customer-dashboard__order
                  span {{ item.orderDate }}

              template(class="status" v-slot:[`item.status`]="{item}") 
                .d-flex.flex-column.customer-dashboard__order
                  span(:style="{color: setPaymentStatusColor(item.status)}") {{ item.status }}

              template(v-slot:[`item.actions`]="{item}")
                ui-debio-icon.iconTable(
                  :icon="eyeIcon"
                  role="button"
                  slot="icon"
                  size="20"
                  color="#C400A5"
                  stroke
                  @click="goToPaymentDetail(item)"
                )
</template>

<script>
import {
  creditCardIcon,
  layersIcon,
  labIllustration,
  bookGradient,
  cardGradient,
  partialBookGradient,
  doctorDashboardIllustrator,
  eyeIcon
} from "@debionetwork/ui-icons"
import { queryDnaSamples } from "@debionetwork/polkadot-provider"
import { mapState } from "vuex"
import { ORDER_STATUS_DETAIL, PAYMENT_STATUS_DETAIL } from "@/common/constants/status"
import { getOrderList } from "@/common/lib/api"

export default {
  name: "CustomerHome",

  data: () => ({
    creditCardIcon,
    layersIcon,
    labIllustration,
    doctorDashboardIllustrator,
    bookGradient,
    cardGradient,
    partialBookGradient,
    eyeIcon,
    cardBlock: false,
    orderList: [],
    testList: [],
    paymentHistory: [],
    tabs: 0,
    headers: [
      { text: "Service Name", value: "serviceName",sortable: true },
      { text: "Lab Name", value: "labName", sortable: true },
      { text: "Date", value: "orderDate", sortable: true },
      { text: "Status", value: "status", sortable: true },
      { text: "Actions", value: "actions", sortable: false, align: "center", width: "5%" }
    ],
    banners: [
      {
        icon: bookGradient,
        text: "Request Genetic Analysis",
        link: "customer-request-analysis"
      },
      {
        icon: cardGradient,
        text: "Request Genetic Test",
        link: "customer-request-test"
      },
      {
        icon: partialBookGradient,
        text: "Upload Personal Health Record",
        link: "customer-emr-create"
      }
    ],
    isLoadingPayments: false,
    isLoadingTest: false
  }),

  computed: {
    ...mapState({
      api: (state) => state.substrate.api
    })
  },

  mounted() {
    window.addEventListener("resize", () => {
      if (window.innerWidth <= 959) this.cardBlock = true
      else this.cardBlock = false
    })
  },

  async created() {
    await this.getOrderList()
    await this.fetchRecentTest()
    await this.getDataPaymentHistory()
  },

  methods: {
    formatDate(date) {
      const formattedDate = new Date(parseInt(date.replace(/,/g, ""))).toLocaleDateString("en-GB", {
        day: "numeric", month: "short", year: "numeric"
      })
      return formattedDate
    },

    setServiceImage(image) {
      return image ? image : require("@/assets/debio-logo.png")
    },

    setTestStatus(status) {
      if (status === "Rejected") {
        const detail = ORDER_STATUS_DETAIL[status.toUpperCase()]
        return detail().name
      }
      return ORDER_STATUS_DETAIL[status.toUpperCase()].name
    },

    setStatusColor(status) {
      if (status === "Rejected") {
        const detail = ORDER_STATUS_DETAIL[status.toUpperCase()]
        return detail().color
      }
      return ORDER_STATUS_DETAIL[status.toUpperCase()].color
    },

    setPaymentStatusColor(status) {
      return PAYMENT_STATUS_DETAIL[status.toUpperCase()]
    },

    async getOrderList() {
      this.orderList = await getOrderList()
    },

    async fetchRecentTest() {
      this.isLoadingTest = true
      try {
        const recentTest = this.orderList.orders.data.filter(test => test._source.status !== "Unpaid" && test._source.status !== "Cancelled")

        for (const order of recentTest) {
          const {
            id: orderId,
            lab_info: {
              name: labName
            },
            service_info: {
              name: serviceName,
              image: serviceImage,
              dna_collection_process: dnaCollectionProcess
            },
            dna_sample_tracking_id: dnaSampleTrackingId,
            created_at: createdAt
          } = order._source

          const dnaSample = await queryDnaSamples(this.api, dnaSampleTrackingId)
          const orderDetail = {
            orderId,
            dnaSampleTrackingId,
            labName,
            serviceName,
            serviceImage,
            dnaCollectionProcess,
            status: dnaSample.status,
            orderDate: this.formatDate(createdAt),
            timestamp: new Date (parseInt(createdAt.replaceAll(",", ""))).getTime().toString()
          }

          this.testList.push(orderDetail)
        }

        this.testList.sort((a, b) => parseInt(b.timestamp) - parseInt(a.timestamp))
        this.isLoadingTest = false
      } catch (error) {
        console.error(error)
        this.isLoadingTest = false
      }
    },

    async getDataPaymentHistory() {
      this.isLoadingPayments = true
      try {
        for (const payment of this.orderList.orders.data) {
          const {
            id: orderId,
            lab_info: { name: labName },
            service_info: {
              name: serviceName,
              image: serviceImage,
              dna_collection_process: dnaCollectionProcess
            },
            dna_sample_tracking_id: dnaSampleTrackingId,
            created_at: createdAt,
            status
          } = payment._source

          const paymentDetail = {
            orderId,
            dnaSampleTrackingId, 
            labName,
            serviceName,
            serviceImage,
            status,
            dnaCollectionProcess,
            orderDate: this.formatDate(createdAt),
            timestamp: new Date (parseInt(createdAt.replaceAll(",", ""))).getTime().toString()
          }

          this.paymentHistory.push(paymentDetail)
        }

        this.paymentHistory.sort((a, b) => {
          if (b.status === "Unpaid") return
          else return parseInt(b.timestamp) - parseInt(a.timestamp)
        })

        this.isLoadingPayments = false
      } catch (error) {
        console.error(error)
        this.isLoadingPayments = false
      }
    },

    goToOrderDetail(item) {
      this.$router.push({ name: "order-history-detail", params: { id: item.orderId }}) //go to order history detail page
    },

    goToPaymentDetail(item) {
      const id = item.orderId
      this.$router.push({ name: "customer-payment-details", params: { id } }) //go to payment detail
    }
  }
}
</script>

<style lang="sass" scoped>
  @import "@/common/styles/mixins.sass"
  @import "@/common/styles/function.sass"

  ::v-deep
    .v-tabs-slider-wrapper
      height: 5px !important

    .v-tab
      align-items: unset

    .degenics-data-table
      margin-top: 0

  .banner-card
    display: flex

    &__container
      width: toRem(220px)
      height: toRem(100px)
      border-radius: toRem(4px)
      backdrop-filter: blur(20px)
      -webkit-backdrop-filter: blur(20px)
      background: rgba(255, 255, 255, .9)
      position: relative
      z-index: 2
      display: inherit
      text-decoration: none
      align-items: center
      justify-content: center
      overflow: hidden
      transition: 250ms ease-in-out

      &:hover
        border: solid 1.9px transparent
        text-shadow: -3px 4px 5px rgba(0, 0, 0, .1)
        box-shadow: 0 1px 2px rgba(252, 146, 233, .4), 0 2px 4px rgba(252, 146, 233, .4), 0 4px 8px rgba(252, 146, 233, .4), 0 8px 16px rgba(252, 146, 233, .4) inset

      &:not(:last-of-type)
        margin-right: toRem(20px)

    &__icon
      margin-right: toRem(24px)

      &::v-deep
        svg
          transition: 250ms ease-in-out
          filter: drop-shadow(rgba(252, 146, 233, .045) -1px 1px) drop-shadow(rgba(252, 146, 233, .045) -2px 2px) drop-shadow(rgba(252, 146, 233, .045) -3px 3px) drop-shadow(rgba(252, 146, 233, .045) -3px 3px) drop-shadow(rgba(252, 146, 233, .045) -4px 4px) drop-shadow(rgba(252, 146, 233, .045) -5px 5px) drop-shadow(rgba(252, 146, 233, .045) -6px 6px) drop-shadow(rgba(252, 146, 233, .045) -7px 7px) drop-shadow(rgba(252, 146, 233, .045) -8px 8px) drop-shadow(rgba(252, 146, 233, .045) -9px 9px) drop-shadow(rgba(252, 146, 233, .045) -10px 10px) drop-shadow(rgba(252, 146, 233, .045) -11px 11px) drop-shadow(rgba(252, 146, 233, .045) -12px 12px) drop-shadow(rgba(252, 146, 233, .045) -13px 13px) drop-shadow(rgba(252, 146, 233, .045) -14px 14px) drop-shadow(rgba(252, 146, 233, .045) -15px 15px) drop-shadow(rgba(252, 146, 233, .045) -16px 16px) drop-shadow(rgba(252, 146, 233, .045) -17px 17px) drop-shadow(rgba(252, 146, 233, .045) -18px 18px) drop-shadow(rgba(252, 146, 233, .045) -19px 19px) drop-shadow(rgba(252, 146, 233, .045) -20px 20px) drop-shadow(rgba(252, 146, 233, .045) -21px 21px) drop-shadow(rgba(252, 146, 233, .045) -22px 22px) drop-shadow(rgba(252, 146, 233, .045) -23px 23px)

    &__text
      color: #595959
      max-width: toRem(115px)
      @include button-2

  .tables
    &__tabs
      margin-top: toRem(30px)
      background: #fff
      border-radius: toRem(4px)
      padding: toRem(30px)

  .customer-dashboard
    &::v-deep
      .banner__subtitle
        max-width: toRem(322px)
        margin-top: toRem(24px)
        @include body-text-medium-1

      .banner__content
        align-items: center

      .body
        margin-top: 25px
        display: flex
        width: 100%
        flex-wrap: wrap
        gap: 20px

      .content
        margin: 0 5px 5px -5px

      .bodyHeader
        margin-left: 15px

      .leftTable
        width: 545
        flex: 1

      .rightTable
        width: 545
        flex: 1

      .topHead
        font-size: 15px

      .botomHead
        font-size: 10px

      .btnHead
        font-size: 10px
        margin-left: 25px
        margin-top: -15px

      .iconTable
        margin-left: 8px
        margin-top: -2px

      .status
        color: #48A868 !important

      .textBox
        margin-top: 14px

      .subTextBox
        margin-top: -40px

      .serviceImage
        margin: 0 10px 0 0
        border-radius: 5px

    &__order
      @include tiny-reg

    &__order-service-sample-id
      color: #757274

  .degenics-datatable
    margin: 20px 0 0 0
  .degenics-datatable-card
    padding: 0px
</style>
