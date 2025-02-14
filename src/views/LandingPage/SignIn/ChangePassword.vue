<style scoped lang="scss">
.pop-up-main{
    p {
        width: 504px;
        height: 27px;
        margin-bottom: 28px;
    }
    & > .password-field {
        width: 504px;
    }
}
</style>

<template lang="pug">
     LandingPagePopUp(:previous='previous')
        template(v-slot:header) Change Password
        template(v-slot:main)
          v-form.pop-up-main(v-model="isPasswordsValid" ref="passwordForm")
            p Type and confirm a secure new password for your account.
            v-text-field(
                label="Type in your password"
                v-model="password"
                class="password-field"
                :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                :type="showPassword ? 'text' : 'password'"
                :rules="passwordRules"
                :disabled="isLoading"
                @click:append="showPassword = !showPassword"
                @keyup.enter="onPasswordSet"
                outlined
            )
            v-text-field(
                label="Confirm your password"
                v-model="passwordConfirm"
                class="password-field"
                :append-icon="showPasswordConfirm ? 'mdi-eye' : 'mdi-eye-off'"
                :type="showPasswordConfirm ? 'text' : 'password'"
                :rules="[passwordConfirmRule]"
                :disabled="isLoading"
                @click:append="showPasswordConfirm = !showPasswordConfirm"
                @keyup.enter="onPasswordSet"
                outlined
            )
            ui-debio-recaptcha(
              :sitekey="sitekey"
              :verify="onVerifyRecaptcha"
            )
            v-btn(
                :disabled="!buttonDisabled || !isPasswordsValid"
                class='white--text' 
                elevation='0' 
                color='primary' 
                @click="register"
            ) Continue
</template>

<script>
import apiClientRequest from "@/common/lib/api"
import { mapActions, mapState, mapMutations } from "vuex"
import LandingPagePopUp from "@/views/LandingPage/LandingPagePopUp.vue"
import errorMessage from "@/common/constants/error-messages"
import getEnv from "@/common/lib/utils/env"
import localStorage from "@/common/lib/local-storage"

export default {
  name: "ChangePassword",
  components: {
    LandingPagePopUp
  },

  data: () => ({
    passwordsValid: false,
    password: "",
    passwordConfirm: "",
    showPassword: false,
    showPasswordConfirm: false,
    recaptchaVerified: false,
    isPasswordsValid: false,
    errorMessage
  }),

  computed: {
    buttonDisabled(){
      return this.recaptchaVerified && this.isPasswordConfirmed
    },

    isPasswordConfirmed() {
      if(!!this.password && this.password == this.passwordConfirm) {
        return true
      }
      return false
    },

    passwordRules() {
      return [
        val => !!val || errorMessage.REQUIRED,
        val => (val && val.length >= 8) && /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/.test(val) || errorMessage.PASSWORD(8, " UPPER/lowercase characters, number and special character in (!@#$%^&*)")
      ]
    },

    passwordConfirmRule() {
      if(this.isPasswordConfirmed) {
        return true
      }
      return "Passwords must match."
    },
    
    ...mapState({
      substrateApi: (state) => state.substrate.api,
      isLoading: (state) => state.substrate.isLoadingWallet,
      wallet: (state) => state.substrate.wallet
    }),

    sitekey() {
      return getEnv("VUE_APP_RECAPTCHA_SITE_KEY")
    }
  },

  methods: {
    ...mapActions({
      registerMnemonic: "substrate/registerMnemonic"
    }),

    ...mapMutations({
      setIsLoading: "substrate/SET_LOADING_WALLET"
    }),

    previous() {
      this.$router.push({name: "forgot-password"})
    },

    async register() {
      try {
        const dataAccountExist = localStorage.getKeystore() !== null
        const result = await this.registerMnemonic({
          mnemonic: this.$route.params.mnemonic,
          password: this.password
        })
        if (!result.success) {
          throw("Mnemonic registration failed!")
        }
        
        const accounts = Object.keys(window.localStorage).filter((v) =>
          /account:/.test(v)
        )

        accounts.forEach((a) => {
          const detail = JSON.parse(window.localStorage.getItem(a))
          if (detail?.address !== this.wallet?.address) {
            window.localStorage.removeItem(a)
          }
        })

        this.$router.push({name: "registration-successful", params: { flag: "changed",
          openInfo: dataAccountExist ? "close" : "open"}})

      } 
      catch (err) {
        console.error(err)
      }
    },
    
    async onVerifyRecaptcha(response) {
      const result = await apiClientRequest.post("/recaptcha", { response })

      if (result.data.success) this.recaptchaVerified = true
    }
  }
}
</script>
