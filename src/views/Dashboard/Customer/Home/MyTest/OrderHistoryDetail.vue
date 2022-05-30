<template lang="pug">
  .customer-orderHistoryDetail
    div.body
      ui-debio-card(
        width="100%"
        height="1000px"
      )
        div.headerSection
          span Test Summary
        div.bodyContent
          v-row
            v-col
              div.leftSection.box.fillColor
                div.topRow
                  div.topHead
                    span Lab Details
                  div.box
                    div.topBody
                      ui-debio-avatar.dataIcon.box(
                        v-if="!!myTest.order.labInfo.profileImage"
                        :src="myTest.order.labInfo.profileImage"
                        :size="92"
                      )
                      ui-debio-icon.dataIcon.box(
                        v-else
                        :icon="microscopeIcon"
                        :size="92"
                        stroke
                        :stroke-width="0"
                        color="linear-gradient(180deg, #716CFF 0%, #B267FF 100%)"
                        view-box="0 0 47 52"
                      )
                      div.topContentWraper
                        span {{ myTest.order.labInfo.name }}
                        span {{ myTest.order.labInfo.address }}
                div.middleRow
                  div.topHead
                    span Product Details
                  div.box
                    div.topBody
                      ui-debio-avatar.dataIcon.box(
                        v-if="!!myTest.order.serviceInfo.image"
                        :src="myTest.order.serviceInfo.image"
                        :size="92"
                      )
                      ui-debio-icon.dataIcon.box(
                        v-else
                        :icon="selectedIcon"
                        :size="92"
                        stroke
                        :stroke-width="0"
                        color="linear-gradient(180deg, #716CFF 0%, #B267FF 100%)"
                        :view-box="selectedIcon == dnaIcon? '0 0 32 40' : '0 0 55 55'"
                      )
                      div.topContentWraper
                        span {{ myTest.order.serviceInfo.name }}
                        span {{ myTest.order.serviceInfo.description }}
                div.bottomRow
                  span Specimen Number
                  span {{ myTest.order.dnaSampleTrackingId }}
            v-col
              div.rightSection.box
                div
                  div.imageBanner.box
                    ui-debio-icon(
                      :icon="statusDetails[myTest.order.dnaInfo.status].banner"
                      :size="statusDetails[myTest.order.dnaInfo.status].size"
                      :view-box="statusDetails[myTest.order.dnaInfo.status].viewBox"
                    )
                div.statusSection
                  span.status {{ statusDetails[myTest.order.dnaInfo.status].name }}
                  span.detail {{ statusDetails[myTest.order.dnaInfo.status].detail }}

                .progress
                  .step-indicator
                    .step
                      div(:class="[`step-icon`, statusDetails[myTest.order.dnaInfo.status].step > 1 && `active`]")
                        v-icon.icon(v-if="statusDetails[myTest.order.dnaInfo.status].step > 1") mdi-check
                      small Registered
                    .indicator-line
                    .step
                      div(:class="[`step-icon`, statusDetails[myTest.order.dnaInfo.status].step > 2 && `active`]")
                        v-icon.icon(v-if="statusDetails[myTest.order.dnaInfo.status].step > 2") mdi-check
                      small Received
                    .indicator-line
                    .step
                      div(:class="[`step-icon`, statusDetails[myTest.order.dnaInfo.status].step > 3 && `active`, isRejected()]")
                        v-icon.icon(v-if="statusDetails[myTest.order.dnaInfo.status].step > 3 && myTest.order.dnaInfo.status === `Rejected`") mdi-close
                        v-icon.icon(v-else-if="statusDetails[myTest.order.dnaInfo.status].step > 3") mdi-check
                      small Quality Control
                    div(:class="[`indicator-line`, isRejected()]")
                    .step
                      div(:class="[`step-icon`, statusDetails[myTest.order.dnaInfo.status].step > 4 && `active`, isRejected(true)]")
                        v-icon.icon(v-if="statusDetails[myTest.order.dnaInfo.status].step > 4") mdi-check
                      small Analyzed
                    div(:class="[`indicator-line`, isRejected()]")
                    .step
                      div(:class="[`step-icon`, statusDetails[myTest.order.dnaInfo.status].step > 5 && `active`, isRejected(true)]")
                        v-icon.icon(v-if="statusDetails[myTest.order.dnaInfo.status].step > 5") mdi-check
                      small Results Ready

                .button
                  v-btn(
                    v-if="myTest.order.dnaInfo.status === `Rejected`"
                    @click="showDetail = true"
                    color="primary"
                    large
                    width="100%"
                  ) View Details
                  v-btn(
                    v-else
                    @click="toViewResult"
                    color="secondary"
                    large
                    width="100%"
                    :disabled="myTest.order.dnaInfo.status !== `ResultReady`"
                  ) View Result

                ui-debio-modal(
                  title="Quality Control Issues"
                  @onClose="showDetail = false"
                  :ctaAction="closeModal"
                  :show="showDetail"
                  :show-title="true"
                  :show-cta="true"
                  ctaTitle="OK"
                )
                  .content
                    h4 Title
                    p {{ myTest.order.dnaInfo.rejectedTitle }}
                    h4 Description
                    p {{ myTest.order.dnaInfo.rejectedDescription }}
                  .content-detail
                    .border-bottom.ph15
                      p Details:
                    .border-bottom.mt10.ph15
                      .flex
                        p Service Price
                        p {{ totalPrice }}
                      .flex
                        p Quality Control Price
                        p {{ formatPrice(myTest.order.additionalPrices[0].value) }} {{ myTest.order.currency }}
                    .mt10.ph15.flex
                      p Amount to refund
                      p {{ totalPrice }}
</template>

<script>
import { mapState } from "vuex"
import {
  queryOrderDetailByOrderID,
  queryServiceById,
  queryLabById,
  queryDnaSamples
} from "@debionetwork/polkadot-provider"
import {
  microscopeIcon,
  weightLifterIcon,
  hairIcon,
  dnaIcon,
  virusIcon,
  registeredBanner, //"0 0 182 135" size 185
  receivedBanner, //"-20 0 300 135" size 300
  wetworkBanner, //"-20 0 300 150" size 295
  resultReadyBanner, //"-20 0 300 150" size 295
  qualityControlBanner, //"-20 0 300 125" size 295
  rejectedQCBanner
} from "@debionetwork/ui-icons"

export default {
  name: "OrderHistoryDetail",
  data: () => ({
    microscopeIcon,
    hairIcon,
    dnaIcon,
    virusIcon,
    weightLifterIcon,
    registeredBanner,
    receivedBanner,
    wetworkBanner,
    resultReadyBanner,
    qualityControlBanner,
    rejectedQCBanner,
    selectedIcon: weightLifterIcon,
    showDetail: false,
    myTest: {},
    statusDetails: {
      Registered: {
        status: "Registered",
        name: "Registered",
        detail:
          "Your request has been registered. You may send your sample to selected lab.",
        size: 185,
        viewBox: "-10 -13 182 182",
        banner: registeredBanner,
        step: 2
      },
      Received: {
        status: "Received",
        name: "Received",
        detail: "Your chosen lab has received and confirmed your specimen. The lab will soon process your order.",
        size: 300,
        viewBox: "-18 -20 295 295",
        banner: receivedBanner,
        step: 3
      },
      QualityControlled: {
        status: "QualityControlled",
        name: "Quality Control",
        detail: "Your specimen is now being examined by the lab to see if it is sufficient enough to be analyzed in the next phase. The lab will perform several procedures such as examine the visual of your specimen, do extraction and amplification of your DNA.",
        size: 295,
        viewBox: "-18 -15 275 275",
        banner: qualityControlBanner,
        step: 4
      },
      WetWork: {
        status: "WetWork",
        name: "Wet Work",
        detail: "The lab is now analyzing your specimen.",
        size: 295,
        viewBox: "-15 -5 285 285",
        banner: wetworkBanner,
        step: 5
      },
      ResultReady: {
        status: "ResultReady",
        name: "Result Ready",
        detail: "Thank you for your patience. Your order has been fulfilled. You can click on this button below to see your result.",
        size: 295,
        viewBox: "-5 -5 295 295",
        banner: resultReadyBanner,
        step: 6
      },
      Rejected: {
        status: "Rejected",
        name: "Quality Control",
        detail: `Your sample has failed quality control. Your service fee of XX DAI will be refunded to your account.`,
        size: 295,
        viewBox: "-15 -5 260 260",
        banner: rejectedQCBanner,
        step: 4
      }
    }
  }),
  async created() {
    await this.prepareData()
    if (!this.myTest.order.serviceInfo.image) this.iconSwitcher()
  },

  computed: {
    ...mapState({
      api: (state) => state.substrate.api,
      web3: (state) => state.metamask.web3
    }),

    setDetail() {
      const detail = `Your sample has failed quality control. Your service fee of ${this.myTest.serviceInfo.pricesByCurrency[0].priceComponents[0].value - this.myTest.serviceInfo.pricesByCurrency[0].additionalPrices[0].value} ${this.myTest.serviceInfo.pricesByCurrency[0].currency} will be refunded to your account.`
      if (this.status.status === "Rejected") return detail
      return this.status.detail
    },

    totalPrice() {
      return `${this.formatPrice(this.myTest.order.prices[0].value) + this.formatPrice(this.myTest.order.additionalPrices[0].value)} ${this.myTest.order.currency}`
    }
  },

  methods: {
    async prepareData() {
      try {
        const order = await queryOrderDetailByOrderID(this.api, this.$route.params.id)
        const dnaInfo = await queryDnaSamples(this.api, order.dnaSampleTrackingId)
        const labInfo = await queryLabById(this.api, order.sellerId)
        const serviceInfo = await queryServiceById(this.api, order.serviceId)

        this.myTest = {
          order: {
            ...order,
            serviceInfo: { ...serviceInfo.info, ...serviceInfo },
            labInfo: { ...labInfo.info, ...labInfo },
            dnaInfo
          }
        }

        const rejectedDetails = `
          Your sample has failed quality control. Your service fee of 
          ${this.totalPrice}
          will be refunded to your account.
        `

        if (dnaInfo.status === "Rejected") this.statusDetails[dnaInfo.status].detail = rejectedDetails
      } catch (error) {
        console.error(error)
      }
    },

    toViewResult() {
      this.$router.push({ name: "test-result", params: {idOrder: this.myTest.orderId}})
    },

    isRejected(border) {
      if (border) return this.myTest?.order?.dnaInfo?.status === "Rejected" && `border-error`
      else return  this.myTest?.order?.dnaInfo?.status === "Rejected" && `error`
    },

    closeModal() {
      this.showDetail = false
    },

    iconSwitcher() {
      switch (this.myTest.order.serviceInfo.category) {
      case "Covid-19 Testing":
        this.selectedIcon = virusIcon
        break
      case "Whole Genome Sequencing":
        this.selectedIcon = dnaIcon
        break
      case "Diet":
        this.selectedIcon = weightLifterIcon
        break
      case "Skin":
        this.selectedIcon = hairIcon
        break
      case "SNP Microarray":
        this.selectedIcon = dnaIcon
        break
      default:
        this.selectedIcon = weightLifterIcon
        break
      }
    },

    formatPrice(price) {
      return parseInt(this.web3.utils.fromWei(String(price.replaceAll(",", "")), "ether"))
    }
  }
}
</script>

<style lang="sass">
.customer-orderHistoryDetail
  margin: 10px
  &::v-deep
    .banner__subtitle
      max-width: 36.188rem !important
  .headerSection
    text-align: center
    margin: 25px 0 50px 0
    font-weight: 600
    font-size: 24px
  .box
    border: solid 0.5px #E4E4E4
    box-sizing: border-box
    margin: 0px
  .fillColor
    height: 456px
  .bodyContent
    margin: 0 0 0 0
  .leftSection
    padding: 17px
    height: 456px
    .topRow
      margin: 0px
    .middleRow
      margin: 25px 0 0 0
    .bottomRow
      display: flex
      margin-top: 21px
      font-weight: 600
      font-size: 14px
      line-height: 20px
      justify-content: space-between
  .rightSection
    padding: 17px
    height: 456px
  .bodyWraper
    padding: 10px
  .dataIcon
    padding: 10px
    margin: 10px
    min-width: 92px
    .dataContent
      margin: 0 0 0 5px
  .topHead
    margin: 0 0 10px 0
    font-weight: 600
    font-size: 20px
    line-height: 32px
  .topBody
    display: flex
  .topContentWraper
    display: flex
    flex-direction: column
    margin: 5px 0 5px 5px
    justify-content: space-evenly
    font-size: 14px
  .imageBanner
    height:184px
    margin-bottom: 15px
    align-items: center
    display: flex
    flex-direction: column
    background: linear-gradient(81.43deg, #6344D0 2.53%, #9D82FF 100%)

  .statusSection
    display: flex
    flex-direction: column
    .status
      font-size: 14px
      font-weight: 600
      line-height: 20px
      margin: 0 0 10px 0
    .detail
      font-size: 12px
      font-weight: 400
      line-height: 16px
      min-height: 50px
  
  .button
    margin-top: 13px

  .progress
    width: 100%
    min-width: 100px
    padding: 17px
    margin-top: 30px
  .step-indicator
    display: flex
    align-items: center
    .step-icon
      box-sizing: border-box
      display: flex
      align-items: center
      justify-content: center
      width: 20px
      height: 20px
      border: 1px solid #A868FF
      border-radius: 50%
      background: #FFF
      .icon
        font-size: 10px
        color: #ffffff
        font-weight: 500

    .active
      background: linear-gradient(225deg, #D665FF 0%, #4C6FFF 100%)
      border: none
    .error
      background: red
    .border-error
      border: 1px solid red

  .step
    display: flex
    align-items: center
    flex-direction: column
    z-index: 1
    position: relative
    small
      position: absolute
      text-align: center
      font-size: 10px
      top: -30px
      color: #595959
      font-weight: 600
      width: 75px
  .indicator-line
    width: 100%
    height: 1px
    background: #A868FF
    flex: 1

  .content
    background: #F5F7F9
    padding: 20px 15px
    width: 338px
    color: #595959
    font-size: 14px
  
  .content-detail
    text-align: left
    width: 100%
    font-size: 12px
    font-weight: 600
  .flex
    display: flex
    justify-content: space-between
  .border-bottom
    border-bottom: 0.5px solid #D3C9D1
  .ph15
    padding: 0px 15px
  .mt10
    margin-top: 10px
</style>
