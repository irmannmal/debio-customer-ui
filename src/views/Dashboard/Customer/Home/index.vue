<template lang="pug">
.customer-home
  ui-debio-banner(
    title="Dashboard"
    subtitle="DeBio is the Most Privacy secured Platform for Personal Biomedical Testing!"
    with-decoration
    gradient-color="violet"
  )
    template(slot="illustration")
      ui-debio-icon(:icon="doctorDashboardIllustrator" :size="cardBlock ? 250 : 180" view-box="0 0 180 180" fill)

    template(slot="cta")
      ui-debio-card(
        :to="{ name: 'customer-request-test'}"
        title="Request a Test"
        sub-title="Get your biological sample tested or stake $DBIO to request a Lab"
        tiny-card
        with-icon
        width="250"
        :block="cardBlock"
      )
        ui-debio-icon(:icon="creditCardIcon" slot="icon" size="34" color="#C400A5" fill)
      ui-debio-card(
        :to="{ name: 'customer-phr-create' }"
        title="Upload PHR"
        sub-title="Upload Personal Health Records"
        tiny-card
        with-icon
        width="250"
        :block="cardBlock"
      )
        ui-debio-icon(:icon="layersIcon" slot="icon" size="34" color="#C400A5" stroke)
  .customer-home-__content
    div.body
      ui-debio-card.leftTable
        div.bodyHeader
          v-row
            v-col(cols="9")
              v-row
                span.topHead Recent Payments
              v-row
                span.botomHead {{ titlePaymentWording }}
            v-col(cols="3")
              ui-debio-button.btnHead(
                :width="'75px'"
                :height="'25px'"
                color="#5640A5"
                outlined
                :to="{ name: 'customer-payment-history' }"
              ) View All

        div
          ui-debio-data-table.content(
            :headers="headers"
            :items="paymentHistory"
            :sort-by="[true]"
            :disableSort="true"
            :showFooter="false"
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
                  .d-flex.flex-column.customer-home__order-service-name
                    span {{ item.serviceName }}
                  .d-flex.flex-column.customer-home__order-service-sample-id
                    span {{ item.dnaSampleTrackingId}}

            template(v-slot:[`item.orderDate`]="{item}")
              .d-flex.flex-column.customer-home__order
                span {{ item.orderDate }}

            template(class="status" v-slot:[`item.status`]="{item}") 
              .d-flex.flex-column.customer-home__order
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


      ui-debio-card.rightTable
        div.bodyHeader
          v-row
            v-col(cols="9")
              v-row
                span.topHead Recent Tests
              v-row
                span.botomHead {{ titleTestWording }}
            v-col(cols="3")
              ui-debio-button.btnHead(
                width="75px"
                height="25px"
                outlined
                color="#5640A5"
                :to="{ name: 'my-test' }"
              ) View All

        div
          ui-debio-data-table.content(
            :headers="headers"
            :items="testList"
            :disableSort="true"
            :showFooter="false"
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
                  .d-flex.flex-column.customer-home__order-service-name
                    span {{ item.serviceName }}
                  .d-flex.flex-column.customer-home__order-service-sample-id
                    span {{ item.dnaSampleTrackingId}}

            template(v-slot:[`item.labName`]="{item}")
              .d-flex.flex-column.customer-home__order
                span {{ item.labName }}

            template(v-slot:[`item.orderDate`]="{item}")
              .d-flex.flex-column.customer-home__order
                span {{ item.orderDate }}

            template(class="status" v-slot:[`item.status`]="{item}") 
              .d-flex.flex-column.customer-home__order
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
</template>

<script>
import { creditCardIcon, layersIcon, labIllustration, doctorDashboardIllustrator, eyeIcon } from "@debionetwork/ui-icons"
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
    eyeIcon,
    cardBlock: false,
    orderList: [],
    testList: [],
    paymentHistory: [],
    titlePaymentWording: "",
    titleTestWording: "",
    doctorDashboardIllustrator,
    headers: [
      { text: "Service Name", value: "serviceName",sortable: true },
      { text: "Lab Name", value: "labName", sortable: true },
      { text: "Date", value: "orderDate", sortable: true },
      { text: "Status", value: "status", sortable: true },
      { text: "Actions", value: "actions", sortable: false, align: "center", width: "5%" }
    ],
    isLoadingPayments: false,
    isLoadingTest: false
  }),

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
        
        recentTest.forEach(async (order) => {
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
          this.testList.sort(
            (a, b) => parseInt(b.timestamp) - parseInt(a.timestamp)
          )
  
          if (!this.testList.length) {
            this.titleTestWording = "You dont have any test result yet"
            return
          }
          this.titleTestWording = "Your recent tests"
        })
        this.isLoadingTest = false
      } catch (error) {
        console.error(error)
        this.isLoadingTest = false
      }
    },

    async getDataPaymentHistory() {
      this.isLoadingPayments = true
      try {
        this.orderList.orders.data.forEach(async(payment) => {
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
          this.paymentHistory.sort(
            (a, b) => parseInt(b.timestamp) - parseInt(a.timestamp)
          )
        })
  
        this.isLoadingPayments = false
        if(!this.paymentHistory.length) {
          this.titlePaymentWording = "You haven't made any order yet"
        } else {
          this.titlePaymentWording = "Your recent payments"
        }
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
  },

  computed: {
    ...mapState({ 
      api: (state) => state.substrate.api
    })
  }
}
</script>

<style lang="sass" scoped>
  @import "@/common/styles/mixins.sass"

  .customer-home
    &::v-deep
      .banner__illustration

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
