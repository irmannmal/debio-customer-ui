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
      ui-debio-dialog(
        :show="showSuccessDialog"
        :width="289"
        title="Request service submitted!"
        message="Thanks for submitting request service! We are trying our best to find the nearest lab available. You can monitor your request here"
        btn-message="ok"
        @close="closingDialog"
        @click="toStakeService"
        )
  
</template>

<script>
import { mapState } from "vuex"
import { alertIcon } from "@debionetwork/ui-icons"
import AgreementDialog from "./AgreementDialog.vue"


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
    }
  }

}
</script>

<style lang="sass">
  @import "@/common/styles/mixins.sass"

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
