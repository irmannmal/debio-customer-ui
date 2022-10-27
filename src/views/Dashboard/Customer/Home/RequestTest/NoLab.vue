<template lang="pug">
  v-card.no-lab-card
    div.card-title Oops!
    div.card-sub-title.d-flex
      ui-debio-icon.mr-2.mt-1(
        :icon="alertIcon"
        size="14"
        stroke
        color="#F5222D"
      )
      span There is no available lab providing this service in your area.

    ol.card-body
      li You can request a lab to register to DeBio by clicking the "Request a Service" button.
      li Additionally, you can stake any amount of DBIO, which will be given as an incentive to labs registering in your location.
      li Labs will use the result of this form, filled-in by you and other DeBio users, to evaluate the demand in the area you designated. 

    v-row(class="d-flex justify-center mt-16")
      ui-debio-button.mt-5.mb-10(
        color="secondary" 
        width="150"
        height="35"
        style="font-size: 12px;"
        @click="showingAgreementDialog"
        ) Request a service

    template
      AgreementDialog(
        :show="showAgreement"
        @fetch="getService"
        @close="closingDialog"
        @click="onClickDialogButton"
      )

    template
      v-dialog(:value="true" :height="276" :width="289" persistent)
        v-card.dialog-card
          .dialog-card__title Request service submitted
          .dialog-card__message Thanks for submitting request service! We are trying our best to find the nearest lab available. You can monitor your request 
            a(@click="toLabRequestService") here
          .dialog-card__button
            ui-debio-button(
              color="secondary"
              width="150"
              @click="toStakeService"
              ) ok
  
</template>

<script>
import { mapState } from "vuex"
import { alertIcon } from "@debionetwork/ui-icons"
import AgreementDialog from "./AgreementDialog.vue"
import getEnv from "@/common/lib/utils/env"

export default {
  name: "NoLab",

  components: {
    AgreementDialog
  },

  data: () => ({
    showAgreement: false,
    showSuccessDialog: false,
    alertIcon
  }),

  computed: {
    ...mapState({
      country: (state) => state.lab.country,
      city: (state) => state.lab.city,
      category: (state) => state.lab.category,
      labs: (state) => state.lab.labs
    })
  },

  async mounted () {
    if(!this.labs) return
    if(!this.labs.length) this.showNoLab = true
  },

  methods: {
    showingAgreementDialog () {
      this.showAgreement = true
    },

    getService() {
      this.showAgreement = false
      this.$emit("fetch")
    },

    closingDialog() {
      this.showAgreement = false
    },

    onClickDialogButton() {
      this.showAgreement = false
      this.showSuccessDialog = true
    },

    toStakeService () {
      this.$router.push({ 
        name: "my-test",
        params: {
          page: 1
        }
      })
    },

    toLabRequestService() {
      window.open(`${getEnv("VUE_APP_SERVICE_REQUEST_LINK")}`, "__blank")
    }
  }

}
</script>

<style lang="sass">
  @import "@/common/styles/mixins.sass"

  .dialog-card
    padding: 55px 1px
    &__title
      display: flex
      align-items: center
      text-align: center
      letter-spacing: -0.0044em
      margin: 0px 47px
      width: 205px
      height: 40px
      @include body-text-medium-1
    &__message
      text-align: center
      letter-spacing: -0.004em
      padding-top: 18px
      margin: 18px 33px
      @include body-text-3-opensans
    &__button
      display: flex
      justify-content: center
      align-items: center
      text-align: center
      padding-top: 37px

  .card-no-lab
    display: flex
    flex-direction: column
    align-items: center

  .card-title 
    @include h6-opensans

  .card-sub-title 
    margin-bottom: 2%
    margin-top: 2%
    color:#F92020
    @include body-text-2

  .card-body 
    @include body-text-2
    
  .no-lab-card 
    padding: 5%
    margin: 4%
    border-radius: 4

</style>
