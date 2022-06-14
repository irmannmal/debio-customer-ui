<template lang="pug">
     LandingPagePopUp(:previous='previous')
        template(v-slot:header) Verify Mnemonic Phrase
        template(v-slot:main): div.pop-up-main
            h3 Tap the words to put them next to each other in the correct order.
            MnemonicInput(:mnemonicCollection="mnemonicInputs" @click="(inputs) => validate(inputs)")
            small.error-message(v-if="isIncorrect") {{ error }}
            v-btn(
                :disabled='!mnemonicValid'
                class='white--text' 
                elevation='0' 
                color='primary' 
                @click="setPassword"
            ) Continue
</template>

<script>
import { shuffle } from "@/common/lib/arrays"
import MnemonicInput from "./MnemonicInput"
import LandingPagePopUp from "@/views/LandingPage/LandingPagePopUp.vue"
import errorMessage from "@/common/constants/error-messages"


export default {
  name: "GenerateAccount",
  components: {
    LandingPagePopUp,
    MnemonicInput
  },
  data: () => ({
    mnemonicCollection: [],
    mnemonicInputs: [],
    mnemonicValid: false,
    isIncorrect: false,
    error: null
  }),
  mounted(){
    this.mnemonicCollection.push(...this.$route.params.mnemonicCollection)
    const mnemonicCollection = shuffle(this.$route.params.mnemonicCollection)
    this.mnemonicInputs.push(...mnemonicCollection)

  },
  methods: {
    previous() {
      this.$router.push({name: "generate-mnemonic"})
    },

    setPassword() {
      this.$router.push({
        name: "set-password",
        params: { 
          mnemonic: this.$route.params.mnemonic
        }
      })
    },

    validate(inputs){
      this.mnemonicValid = false
      if(inputs.length < this.mnemonicCollection.length) {
        this.isIncorrect = false
        this.error = null
        return
      }

      for(let i = 0; i < inputs.length; i++){
        if(inputs[i] != this.mnemonicCollection[i]) {
          this.isIncorrect = true
          this.error = errorMessage.INCORRECT("Mnemonic")
          return
        }
      }
      this.mnemonicValid = true
    }
  }
}
</script>

<style lang="sass" scoped>
  .error-message
    margin-top: -30px
    margin-left: -250px
    color: red
</style>
