<template lang="pug">
  .main-layout
    ui-debio-modal.modal-error(
      :show="showModalError"
      disable-dismiss
      :show-title="false"
      :showCta="true"
      ctaTitle="Back To Home"
      :ctaOutlined="false"
      :ctaAction="goToDashboard"
    )
      ui-debio-icon(:icon="cableErrorIcon" fill size="100")
      h6.modal-error__title Aw, Snap!
      p.modal-error__subtitle An Internal error occured during your request! try again later!
    
    ui-debio-modal(
      :show="showModalPassword"
      title="Unlock Wallet"
      :icon="checkCircleIcon"
      :showCta="!success"
      :showTitle="!success"
      class="font-weight-bold"
      disable-dismiss
    )
      ui-debio-input(
        v-if="!success"
        :error="!!error"
        autofocus
        :errorMessages="!!error ? error : null"
        :rules="$options.rules.password"
        :type="showPassword ? 'text' : 'password'"
        variant="small"
        placeholder="Input Password"
        v-model="password"
        outlined
        block
        validate-on-blur
        @keyup.enter="handleSubmitPassword"
        @blur="error = null"
        @isError="handleError"
      )
        ui-debio-icon(
          slot="icon-append"
          role="button"
          size="18"
          @click="handleShowPassword"
          :icon="showPassword ? eyeIcon : eyeOffIcon"
          stroke
        )
      .modal-password__cta.d-flex.flex-column(slot="cta")
        .modal-password__cta.d-flex.align-center.justify-between
          ui-debio-button.router-link.modal-password__cta-submit(
            color="secondary"
            width="130"
            :to="{ name: 'forgot-password' }"
            outlined
          ) Forgot Password

          ui-debio-button.modal-password__cta-submit(
            color="secondary"
            width="130"
            @click="handleSubmitPassword"
          ) Submit

        .modal-password__cta.d-flex.align-center.justify-space-between
          div.modal-password__divider
          span.modal-password__cta-forgot OR
          div.modal-password__divider

        .modal-password__cta-change-account(
          @click="signOut"
        ) Not you? Try different account

    v-expansion-panels.main-layout__expantion(
      v-model="panel"
      flat
    )
      v-expansion-panel
        v-expansion-panel-header.main-layout__expantion-title
          span Announcement for users who stake $DBIO for a service request with the "Others" category.
        v-expansion-panel-content.main-layout__expantion-content
          p Due to the medical lab establishment and medical equipment procurement executing according to a specific service category, we will take down the “Others” option from the list of service categories. DAOGenics, Ltd will determine the available specific service categories. 
          p If you had staked $DBIO for request service with the "Others" category, please unstake your $DBIO by canceling your request.  Once unstaked, the $DBIO will be returned to your wallet after six days. After receiving your $DBIO, you can make another service request within the categories determined by DAOGenics, Ltd.
          p If you have any categories you want to add, feel free to contact science@debio.network.
          v-btn.main-layout__expantion-button(
            outlined
            @click="doClose"
          ) OK

    .layout-dashboard
      NavigationDrawer.layout-dashboard__sidebar(:items="computeNavs")
        template
          v-tooltip(top)
            template(v-slot:activator="{ on, attrs }")
              ui-debio-button(
                outlined
                height="35px"
                style="font-size: 13px"
                @click="goToRequestTestPage"
                class="font-weight-bold sidebar-text mt-4 dg-raleway-font"
                color="primary"
                :bind="attrs"
                :on="on"
              ) Request Test
            span Get your biological sample tested or stake $DBIO to request Lab

          v-tooltip(bottom)
            template(v-slot:activator="{ on, attrs }")
              ui-debio-button(
                outlined
                height="35px"
                style="font-size: 13px"
                @click="goToUploadPHR"
                class="font-weight-bold sidebar-text mt-4 dg-raleway-font"
                color="primary"
                :bind="attrs"
                :on="on"
              ) Upload PHR
            span Upload Personal Health Records

          v-tooltip(bottom)
            template(v-slot:activator="{ on, attrs }")
              ui-debio-button(
                style="font-size: 11px"
                outlined
                height="35px"
                @click="goToRequestAnalysis"
                class="font-weight-bold sidebar-text mt-4 dg-raleway-font"
                color="primary"
                :bind="attrs"
                :on="on"
              ) Request Genetic Analysis
            span Get your genetic data analyzed by Genetic Analyst

      .layout-dashboard__wrapper
        Navbar.layout-dashboard__navbar(:error="pageError" :notifications="localListNotification")
        .layout-dashboard__main
          transition(name="transition-slide-x" mode="out-in")
            maintenancePageLayout(v-if="pageError" :error="pageError")
            router-view(v-else @onPageError="handlePageError")
</template>

<script>
import {mapState, mapMutations, mapActions} from "vuex"
import store from "@/store"
import {validateForms} from "@/common/lib/validate"
import {
  gridIcon,
  boxIcon,
  eyeIcon,
  eyeOffIcon,
  databaseIcon,
  checkCircleIcon,
  fileTextIcon,
  creditCardIcon,
  geneticDnaIcon,
  cableErrorIcon
} from "@debionetwork/ui-icons"

import NavigationDrawer from "@/common/components/NavigationDrawer"
import Navbar from "@/common/components/Navbar.vue"
import maintenancePageLayout from "@/views/Dashboard/maintenancePageLayout"
import errorMessage from "@/common/constants/error-messages"
import localStorage from "@/common/lib/local-storage"
import VueRouter from "@/router"

export default {
  name: "MainPage",

  mixins: [validateForms],

  components: {NavigationDrawer, Navbar, maintenancePageLayout},

  data: () => ({
    checkCircleIcon,
    eyeIcon,
    eyeOffIcon,
    cableErrorIcon,

    metamask: null,
    role: null,

    showModalError: false,
    showModalPassword: false,
    pageError: null,
    showPassword: false,
    success: false,
    error: null,
    password: null,
    panel: -1,

    navs: [
      { text: "Dashboard", disabled: false, active: false, route: "customer-dashboard", icon: gridIcon },
      { text: "My Test", disabled: false, active: false, route: "my-test", icon: boxIcon },
      { text: "My PHR", disabled: false, active: false, route: "customer-phr", icon: fileTextIcon },
      { text: "My Genetic Data", disabled: false, active: false, route: "customer-genetic-data", icon: geneticDnaIcon},
      { text: "Data Bounty", disabled: false, active: false, route: "maintenance", icon: databaseIcon }, // TO ADJUST ONCE THE FEATURE IS READY
      { text: "Payment History", disabled: false, active: false, route: "customer-payment-history", icon: creditCardIcon }
    ]
  }),

  computed: {
    ...mapState({
      lastEventData: (state) => state.substrate.lastEventData,
      wallet: (state) => state.substrate.wallet,
      localListNotification: (state) => state.substrate.localListNotification,
      mnemonicData: (state) => state.substrate.mnemonicData,
      api: (state) => state.api
    }),

    ...mapActions({
      clearAuth: "auth/clearAuth"
    }),

    computeNavs() {
      const setActive = (name) => {
        return this.$route.name === name || this.$route.meta.parent === name
      }

      return this.navs.map((nav) => ({...nav, active: setActive(nav.route)}))
    },

    computeButtonActive() {
      return !/(\/customer\/request-test)/.test(this.$route.path)
    }
  },

  watch: {
    $route() {
      const query = VueRouter?.history?.current?.query
      
      this.pageError = null
      if (query?.error) this.showModalError = true
    },
    

    lastEventData(event) {
      if (event !== null) {
        this.$store.dispatch("substrate/addListNotification", {
          address: this.wallet.address,
          event: event,
          role: "customer"
        })
      }
    }
  },

  async created() {
    if (!this.mnemonicData) this.showModalPassword = true
    await this.getListNotification()
  },

  rules: {
    password: [(val) => !!val || errorMessage.PASSWORD(8)]
  },

  methods: {
    ...mapMutations({
      clearWallet: "metamask/CLEAR_WALLET"
    }),

    handlePageError(error) {
      this.pageError = error
    },

    async getListNotification() {
      await this.$store.dispatch("substrate/getListNotification", {
        address: this.wallet.address,
        role: "customer"
      })
    },

    goToRequestTestPage() {
      this.$router.push({name: "customer-request-test"})
    },

    goToUploadPHR() {
      this.$router.push({name: "customer-phr-create"})
    },

    goToRequestAnalysis() {
      this.$router.push({ name: "customer-request-analysis"})
    },

    goToDashboard() {
      this.showModalError = false
      this.$router.push({ name: "customer-dashboard"})
    },

    handleShowPassword() {
      this.showPassword = !this.showPassword
    },

    async handleSubmitPassword() {
      try {
        await this.wallet.unlock(this.password)
        await store.dispatch("substrate/getEncryptedAccountData", {
          password: this.password
        })

        this.success = true

        setTimeout(() => {
          this.showModalPassword = false
        }, 1300)
      } catch (e) {
        if (e.message === "Unable to decode using the supplied passphrase") {
          return this.error = errorMessage.INCORRECT("Password")
        }
        this.error = e.message
      }
    },

    signOut() {
      this.$router.push({name: "landing-page"})
      const accounts = Object.keys(window.localStorage).filter((v) =>
        /account:/.test(v)
      )
      accounts.forEach((a) => {
        const detail = JSON.parse(window.localStorage.getItem(a))
        if (detail.address !== this.wallet.address) {
          window.localStorage.removeItem(a)
        }
      })

      localStorage.clear()
      this.clearAuth()
      this.clearWallet()
    },

    doClose () {
      this.panel = -1;
    }
  }
}
</script>

<style lang="sass" scoped>
@import url('https://fonts.googleapis.com/css2?family=Raleway:wght@300;400;500;600;700&display=swap')
@import "@/common/styles/variables.scss"
@import "@/common/styles/mixins.sass"

.main-layout
  display: flex
  flex-direction: column

  &__expantion-title,
  &__expantion-content
    background-color: #E3E3E3

  &__expantion-title
    font-weight: 600
    font-size: 14px

  &__expantion-content
    font-size: 13px
    font-weight: 400

  &__expantion-button
    width: 140px
    border-color: #5640A5

.layout-dashboard
  width: 100%
  min-height: 100vh
  background: #F5F7F9
  display: flex

  &__wrapper
    width: 70%
    flex: 1
    display: flex
    flex-direction: column

  &__navbar
    padding: 2.5rem 1.563rem 1.563rem !important

  &__main
    padding: 0 1.563rem 1.563rem !important



.modal-password
  &__cta
    gap: 20px
    align-items: center

  &__cta-forgot,
  &__cta-submit
    font-size: 10px

  &__cta-forgot,
  &__cta-change-account
    color: #5640A5 !important
    font-weight: bold
    text-transform: uppercase

  &__cta-change-account
    font-size: 12px
    cursor: pointer

  &__divider
    border-top: 1px solid #E9E9E9
    width: 110px


.transition-slide-x
  &-enter-active,
  &-leave-active
    transition: all cubic-bezier(.7, -0.04, .61, 1.14) .3s

  &-enter
    opacity: 0
    transform: translateX(1.563rem)

  &-leave-to
    opacity: 0
    transform: translateX(-12.813rem)

.modal-error 
  .ui-debio-modal__card 
    width: 300px
    gap: 1rem

  &__title
    @include h6-opensans
  
  &__subtitle 
    max-width: 200px
    text-align: center
    color: #595959
    @include body-text-3-opensans
</style>
