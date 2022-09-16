.<template lang="pug">
  .menstrual-calendar
    .menstrual-calendar__wrapper
      ui-debio-card(block)
        template
          .menstrual-calendar__banner
            .menstrual-calendar__content
              .menstrual-calendar__title Menstrual Calendar  Payment
              .menstrual-calendar__sub-title Smart way to track menstrual cycles.

            v-img(
              alt="no-list-data"
              src="@/assets/menstrual-calendar-banner.svg"
              max-width="373px"
              max-height="132px"
            )
      ui-debio-modal.menstrual-calendar__modal(
        :show="showAlert"
        :show-title="false"
        :show-cta="false"
        disable-dismiss
      )
        .menstrual-calendar__modal-title Menstrual Calendar Subscription

        ui-debio-icon(
          :icon="alertTriangleIcon"
          size="90"
          color="#c400a5"
          stroke
        )
        .menstrual-calendar__modal-desc Are you sure you want to pay selected menstrual calendar subscription?

        .menstrual-calendar__modal-buttons(class=" justify-space-between align-center pa-10")
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
            @click="toPayment"
          ) Yes

      ui-debio-modal.menstrual-calendar__modal-success(
        :show="isSuccess"
        :show-title="false"
        :show-cta="false"
        disable-dismiss
      )
        .menstrual-calendar__modal-title Payment Success
        ui-debio-icon(
          :icon="checkCircleIcon"
          size="90"
          color="#c400a5"
          stroke
        )

        .menstrual-calendar__modal-desc Contratulations! Now you have unlocked menstrual calendar feature

        ui-debio-button(
          color="secondary" 
          width="100%"
          height="35"
          style="font-size: 10px;"
        ) Continue to Menstrual Calendar

      .menstrual-calendar__subscription
        ui-debio-card.menstrual-calendar__subscription-text(width="654")
          .menstrual-calendar__subscription-text-span Get my subscription plan!
          .menstrual-calendar__subscription-text-header Benefit of Subscription
          v-img.mt-10(
              block
              alt="no-list-data"
              src="@/assets/menstrual-calendar-brosure.svg"
              height="240px"
            )

          v-list.mt-5
            v-list-item-content Unlock Menstrual Calendar Tracking & Prediction anonymously in decentralized manner
            v-list-item-content Unlock Menstrual Calendar Cycle Report & Statistics
            v-list-item-content Unlock Menstrual Calendar Journaling & Mood Tracking

        ui-debio-card.menstrual-calendar__subscription-plan(width="480")
            template(v-if="!paymentPreview")
              .menstrual-calendar__subscription-plan-header Select Subscription Plan

            template(v-if="paymentPreview")
              v-btn.menstrual-calendar__subscription-payment-back(icon @click="paymentPreview = false")
                v-icon mdi-chevron-left
              span.menstrual-calendar__subscription-plan-header Select Payment Methods
            
            .menstrual-calendar__subscription-plan-breadcrumbs
              v-breadcrumbs(:items="breadcrumbs")
                template(v-slot:divider)
                  v-icon mdi-chevron-right

            template(v-if="!paymentPreview")
              .menstrual-calendar__plan-card
                v-radio-group(v-model="subscription")
                  template(v-for="(plan, idx) in plans" )
                    ui-debio-card(width="410" key="i").my-1
                      .menstrual-calendar__plan-card-wrapper
                        v-radio.menstrual-calendar__plan-card-radio(
                          :label="plan.text" 
                          :value="plan" 
                          color="secondary"
                        )
                        v-alert.menstrual-calendar__plan-card-alert(v-if="plan.promo" color="#E7FFE6" )
                          .menstrual-calendar__plan-card-alert-text {{ plan.promo }}
                        .menstrual-calendar__plan-card-price {{ plan.price }}
                      .menstrual-calendar__plan-card-desc.pt-1.ml-8 {{ plan.description }}

                ui-debio-button(
                  color="secondary"
                  width="100%"
                  @click="paymentPreview = true"
                ) Select Plan
            
            template(v-if="paymentPreview")
              v-card.menstrual-calendar__plan-payment-card
                .menstrual-calendar__plan-payment-card-title Purchase Detail
                .menstrual-calendar__plan-payment-card-detail
                  .menstrual-calendar__plan-payment-card-desc Menstrual Date {{ subscription.text }}
                  .menstrual-calendar__plan-card-price {{ subscription.price }} / {{ subscription.periode}}
                v-divider.ma-4
                .menstrual-calendar__plan-payment-card-total
                  .menstrual-calendar__plan-payment-card-total-text Total Today
                  .menstrual-calendar__plan-payment-card-total-price {{ subscription.price }}
                  

                .menstrual-calendar__plan-payment-card-notes Any eligible subscription credit will be applied until it runs out. Your subscription will renew for {{ subscription.price }} / {{ subscription.periode }} on Sept 23, 2023. Have any questions? 
                  a Contact our support team


              .menstrual-calendar__plan-payment-card-title PAY WITH CURRENCY
              
              v-chip-group.menstrual-calendar__plan-payment-card-chips(v-model="currency" column)
                v-chip.mr-8(label outlined large)
                  v-avatar(right width="30")
                    v-img.pr-5(
                      alt="no-list-data"
                      src="@/assets/near-logo.svg"
                      max-width="24px"
                      max-height="24px"
                    )
                  span.ma-3 USN (Near)
                  
                v-chip(label outlined large)
                  v-avatar(right width="30")
                    v-img.pr-5(
                      alt="no-list-data"
                      src="@/assets/tether-logo.svg"
                      max-width="24px"
                      max-height="24px"
                    )
                  span.ma-3 USDT (TETHER)

              .menstrual-calendar__trans-weight
                .menstrual-calendar__trans-weight-text Estimated transaction weight
                  v-tooltip.visible(bottom )
                    template(v-slot:activator="{ on, attrs }")
                      v-icon.dialog-confirmation__trans-weight-icon(
                        style="font-size: 12px;"
                        color="primary"
                        dark
                        v-bind="attrs"
                        v-on="on"
                      ) mdi-alert-circle-outline 
                    span(style="font-size: 10px;") Total fee paid in DBIO to execute this transaction.

                div( style="font-size: 12px;" ) 0 DBIO

              ui-debio-button(
                color="secondary"
                width="100%"
                @click="showAlert = true"
              ) Pay Now!

</template>

<script>
import { alertTriangleIcon, checkCircleIcon } from "@debionetwork/ui-icons"


export default {
  name: "MenstrualCalendar",

  data: () => ({
    alertTriangleIcon, checkCircleIcon,
    plans: [
      {text: "Monthly", description: "For users on a budget who want to try out menstrual date", price: "8 USD", promo: "", periode: "Month"},
      {text: "Quarterly", description: "For users on a budget who want to track menstrual cycle quarterly", price: "21.6 USD", promo: "Save 10%", periode: "3 Months"},
      {text: "Annualy", description: "For users on a budget who want to keep tracking menstrual cycle annualy", price: "48 USD", promo: "Save 50%", periode: "Year"}
    ],
    subscription: "",
    paymentPreview: false,
    showAlert: false,
    breadcrumbs: [
      {
        text: "Subscription Plan",
        disabled: false,
        href: "breadcrumbs-subs"
      },
      {
        text: "Payment Preview",
        disabled: true,
        href: "breadcrumbs-plan"
      }
    ]
  }),

  methods: {
    async toPayment() {
      this.showAlert = false
      this.isSuccess = true
    }
  }
}
</script>

<style lang="sass" scoped>
  @import "@/common/styles/mixins.sass"
 
  .menstrual-calendar
    &__wrapper
      height: 100%

    &__banner
      display: flex
      justify-content: space-between

    &__title
      @include h5-opensans

    &__sub-title
      @include body-text-2

    &__subscription
      margin-top: 16px
      display: flex
      gap: 16px
      height: 593px

    &__subscription-text
      height: 593px

    &__subscription-text-span
      color: #FF8FCD
      @include button-2

    &__subscription-text-header
      @include h4-opensans

    &__subscription-plan-header
      @include h6-opensans

    &__plan-card-wrapper
      display: flex
      justify-content: space-between

    &__plan-card-desc
      color: #757274
      @include body-text-3

    &__subscription-plan-breadcrumbs
      margin: -22px

    &__plan-card-price
      @include button-2
    
    &__plan-card-alert
      height: 24px
      margin-left: -98px

    &__plan-card-alert-text
      margin-top: -12px
      color: #32D47D
      font-size: 12px

    &__subscription-payment
      display: flex

    &__plan-payment-card
      margin-top: 20px

    &__plan-payment-card-title
      padding: 16px
      margin: 4px 0
      @include button-1

    &__plan-payment-card-detail
      display: flex
      justify-content: space-between
      margin: 2px 16px
      

    &__plan-payment-card-desc
      @include new-body-text-2

    &__plan-payment-card-total
      display: flex
      justify-content: space-between
      margin: 2px 16px
      @include button-1
    
    &__plan-payment-card-total-price
      color: #FF56E0

    &__plan-payment-card-notes
      padding: 24px 16px
      @include tiny-reg

    &__plan-payment-card-chips
      margin-top: -10px
      margin-left: 16px

    &__trans-weight
      padding: 24px 16px
      display: flex
      justify-content: space-between

    &__trans-weight-text
      margin-right: 5px
      color: #595959
      letter-spacing: -0.004em
      display: flex
      align-items: center
      @include body-text-3-opensans

    &__modal
      display: flex
      align-items: center
      justify-content: center

    &__modal-desc
      text-align: center
      max-width: 264px

    &__modal-title
      text-align: center
      max-width: 264px
      @include h3-opensans
    
    &__modal-buttons
      display: flex
      justify-content: space-between
      gap: 20px


</style>
