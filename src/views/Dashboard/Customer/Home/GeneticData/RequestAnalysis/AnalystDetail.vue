<template lang="pug">
  v-dialog.analyst-detail(:value="show" width="440" persistent rounded )
    v-card.analyst-detail__card
      .analyst-detail__close
        v-btn.fixed-button(v-if="!isLoading" icon @click="closeDialog")
          v-icon mdi-close

      div(v-if="!isLoading")
        .analyst-detail__service
          .analyst-detail__service-name {{ service.serviceName }}

          .analyst-detail__service-description {{ service.description }}


          .analyst-detail__service-info
            v-row
              v-col(cols="8")
                v-icon(size="14" outlined ) mdi-timer 
                span.analyst-detail__service-info-duration {{ service.duration }} {{ service.durationType }}
              v-col(cols="4")
                b.analyst-detail__service-info-price {{ price }}
          hr

        v-row.analyst-detail__profil
          v-col(cols="3")
            ui-debio-avatar.service-analysis-card__avatar(
              :src="computeAvatar" 
              size="75"
              rounded
            )

          v-col(cols="9")
            .analyst-detail__profil-name {{ service.analystsInfo.info.firstName }} {{ service.analystsInfo.info.lastName }}
            .analyst-detail__profil-desc {{ service.analystsInfo.info.specialization }}

            a(:href="service.analystsInfo.info.profileLink" target="_blank")
              v-img.analyst-detail__profil-social(
                alt="linkedin"
                center
                src="@/assets/linkedin-logo.png"
                height="15" 
                width="15"
              )

        .analyst-detail__profil-experience Experience
        ul.analyst-detail__profil-experience-list(
          v-for="(experience, i) in experiences"
          :key="i"
        ) - {{ experience.title }}

        .analyst-detail__button
          ui-debio-button.analyst-detail__button-text(
            color="secondary" 
            width="48%"
            height="38"
            outlined
            @click="handleDownloadReport"
          ) Download Sample Report

          ui-debio-button.analyst-detail__button-text(
            color="secondary" 
            width="48%"
            height="38" 
            @click="onSelect"
          ) Checkout Order

      div(v-if="isLoading")
        .analyst-detail__loading-title Checkout in Progress...
        .analyst-detail__loading-spin
          SpinnerLoader(
            :color="'#C400A5'"
            :size="140"
          )

        .analyst-detail__loading-message
          b Please wait, do not close this tab. 
        .analyst-detail__loading-border-text It may take a while, 
            a.link(
              target="_blank"
              href="https://docs.debio.network/complete-guidelines/user-guideline/upload-and-encrypt-data"
              @click.stop
            )  here’s why
</template>

<script>

import { mapMutations, mapState } from "vuex"
import Kilt from "@kiltprotocol/sdk-js"
import CryptoJS from "crypto-js"
import cryptWorker from "@/common/lib/ipfs/crypt-worker"
import { u8aToHex } from "@polkadot/util"
import { downloadFile, uploadFile, getFileUrl } from "@/common/lib/pinata-proxy"
import { createGeneticAnalysisOrder } from "@debionetwork/polkadot-provider"
import { queryGeneticAnalysisOrderByCustomerId } from "@debionetwork/polkadot-provider"
import { queryGeneticAnalystByAccountId } from "@debionetwork/polkadot-provider"
import SpinnerLoader from "@bit/joshk.vue-spinners-css.spinner-loader"

export default {
  name: "AnalystDetail",

  data: () => ({
    price: null,
    publicKey: "",
    privateKey: "",
    fileType: "",
    fileName: "",
    links: [],
    files: [],
    file: "",
    geneticLink: "",
    isLoading: false
  }),

  components: {
    SpinnerLoader
  },

  props: {
    show: Boolean,
    service: Object,
    experiences: Array
  },

  mounted() {
    this.getCustomerPublicKey()
    this.price = `${this.formatBalance(this.service.priceDetail[0].totalPrice)} ${this.service.priceDetail[0].currency}`
  },

  computed: {
    ...mapState({
      api: (state) => state.substrate.api,
      wallet: (state) => state.substrate.wallet,
      web3: (state) => state.metamask.web3,
      mnemonicData: (state) => state.substrate.mnemonicData,
      lastEventData: (state) => state.substrate.lastEventData,
      selectedGeneticData: (state) => state.geneticData.selectedData

    }),

    computeAvatar() {
      const profile = this.service.analystsInfo.info.profileImage

      return profile ? profile : require("@/assets/defaultAvatar.svg")
    }

  },

  watch: {
    lastEventData(e) {
      if (e !== null) {
        const dataEvent = JSON.parse(e.data.toString())
        if (e.method === "GeneticAnalysisOrderCreated") {
          if (dataEvent[0].customerId === this.wallet.address) {
            this.isLoading = false
            this.show = false
            this.toCheckoutPage()
          }
        }
      }
    }

  },

  methods: {
    ...mapMutations({
      setSelectedAnalysisService: "geneticData/SET_SELECTED_SERVICE"
    }),

    getCustomerPublicKey() {
      const identity = Kilt.Identity.buildFromMnemonic(this.mnemonicData.toString(CryptoJS.enc.Utf8))
      this.publicKey = u8aToHex(identity.boxKeyPair.publicKey)
      this.privateKey = u8aToHex(identity.boxKeyPair.secretKey)
    },

    async getAnalystPublicKey () {
      const id = this.service.analystId
      const analystDetail = await queryGeneticAnalystByAccountId(this.api, id)
      const analystPublicKey = analystDetail.info.boxPublicKey
      return analystPublicKey
    },

    closeDialog() {
      this.$emit("close")
    },

    async handleDownloadReport() {
      window.open(this.service.testResultSample)
    },

    async onSelect() {
      this.isLoading = true
      this.geneticLink = ""
      this.links = []
      const links = JSON.parse(this.selectedGeneticData.reportLink)

      let download = []
      let fileType
      let fileName
      for (let i = 0; i < links.length; i++) {
        const { name, type, data } = await downloadFile(links[i], true)
        fileType = type
        fileName = name
        download.push(data)
      }

      let arr = []
      for (let i = 0; i < download.length; i++) {
        let { box, nonce } = download[i].data
        box = Object.values(box) // Convert from object to Array
        nonce = Object.values(nonce) // Convert from object to Array

        const toDecrypt = {
          box: Uint8Array.from(box),
          nonce: Uint8Array.from(nonce)
        }

        console.log("Decrypting...")
        const decryptedObject = await Kilt.Utils.Crypto.decryptAsymmetric(
          toDecrypt,
          this.publicKey,
          this.privateKey
        )
        arr = [...arr, ...decryptedObject]
      }
      console.log("Decrypted!")

      const unit8Arr = new Uint8Array(arr)
      const blob = new Blob([unit8Arr], { type: fileType })
      this.file = new File([blob], fileName)

      const dataFile = await this.setupFileReader(this.file)
      
      console.log("HA:::::")
      console.log(dataFile)
      console.log("_____")
      
      await this.upload({
        encryptedFileChunks: dataFile.chunks,
        fileName: dataFile.fileName,
        fileType: fileType
      })
    },

    setupFileReader(file) {
      return new Promise((res, rej) => {
        const context = this
        const fr = new FileReader()
        fr.onload = async function () {
          try {
            const encrypted = await context.encrypt({
              text: fr.result,
              fileType: file.type,
              fileName: file.name
            })


            console.log("encrypted.. ==>>", encrypted)

            const { chunks, fileName, fileType } = encrypted
            const dataFile = {
              title: "title",
              description: "description",
              file,
              chunks,
              fileName,
              fileType,
              createdAt: new Date().getTime()
            }

            console.log("data file ", dataFile)

            res(dataFile)
          } catch (e) {
            console.error(e)
          }
        }
        fr.onerror = rej
        fr.readAsArrayBuffer(file)
      })
    },

    async encrypt({ text, fileType, fileName}) {
      console.log("encrypting..")
      const analystPublicKey = await this.getAnalystPublicKey()
      const context = this
      const arrChunks = []
      let chunksAmount
      const pair = {
        secretKey: this.privateKey,
        publicKey: analystPublicKey
      }

      return await new Promise((res, rej) => {
        try {
          cryptWorker.workerEncryptFile.postMessage({
            pair,
            text,
            fileType
          })

          cryptWorker.workerEncryptFile.onmessage = async (event) => {
            if (event.data.chunksAmount) {
              chunksAmount = event.data.chunksAmount
              return
            }

            arrChunks.push(event.data)
            context.encryptProgress = (arrChunks.length / chunksAmount) * 100

            if (arrChunks.length === chunksAmount ) {
              res({
                fileName: fileName,
                chunks: arrChunks,
                fileType: fileType
              })
            }
          }
          console.log("encrypted")
        } catch (e) {
          rej(new Error(e.message))
        }
      })

    },

    async upload({ encryptedFileChunks, fileName, fileType }) {
      for (let i = 0; i < encryptedFileChunks.length; i++) {
        const data = JSON.stringify(encryptedFileChunks[i]) // not working if the size is large
        const blob = new Blob([data], { type: fileType })

        // UPLOAD TO PINATA API
        const result = await uploadFile({
          title: fileName,
          type: fileType,
          file: blob
        })
        const link = await getFileUrl(result.IpfsHash)
        this.links.push(link)
      }

      this.geneticLink = JSON.stringify(this.links)
      if (this.geneticLink) {
        await this.createOrder()
      }
    },

    formatBalance(balance) {
      const formatedBalance = this.web3.utils.fromWei(String(balance.replaceAll(",", "")), "ether")
      return Number(formatedBalance).toPrecision()
    },

    async createOrder() {
      const priceIndex = 0
      await createGeneticAnalysisOrder(
        this.api,
        this.wallet,
        this.selectedGeneticData.id,
        this.service.serviceId,
        priceIndex,
        this.publicKey,
        this.geneticLink
      )
    },

    async toCheckoutPage() {                  
      const lastOrder = await queryGeneticAnalysisOrderByCustomerId(this.api, this.wallet.address)
      this.$router.push({name: "customer-request-analysis-payment", params: { id: lastOrder}})
    }
  }
}
</script>

<style lang="sass" scoped>
  @import "@/common/styles/mixins.sass"

  .analyst-detail
    &__service
      padding: 15px 35px 0 35px

    &__service-name
      @include button-2

    &__service-description
      height: 100px
      overflow-y: scroll
      margin-top: 8px
      @include body-text-3-opensans

      &::-webkit-scrollbar-track
        background-color: #f2f2ff

      &::-webkit-scrollbar
        width: 0.25rem

      &::-webkit-scrollbar-thumb
        border-radius: 0.625rem
        background: #a1a1ff

    &__service-info
      margin-top: 16px
      margin-bottom: 20px

    &__service-info-duration
      letter-spacing: -0.004em
      margin-left: 5px
      @include body-text-3-opensans-medium

    &__service-info-price
      color: #F006CB
      @include body-text-3-opensans

    &__profil
      margin-left: 0 !important
      padding: 12px 23px

    &__profil-name
      margin-top: 12px
      @include body-text-1

    &__profil-desc
      color: #8C8C8C
      @include body-text-3

    &__profil-social
      margin-top: 16px
      
    &__img
      margin-top: 12px


    &__profil-experience
      margin-left: 0 !important
      padding: 12px 35px
      @include button-2

    &__profil-experience-list
      margin-left: 0 !important
      padding-left: 35px
      @include body-text-3
    
    &__button
      display: flex
      align-items: center
      justify-content: space-between
      padding: 29px 35px 55px 35px
      gap: 10px

    &__button-text
      @include body-text-5-opensans

    &__close
      display: flex
      justify-content: flex-end
      padding: 1.013rem !important

    &__loading-title
      display: flex
      justify-content: center
      align-items: center
      letter-spacing: 0.0044em
      margin-top: 80px
      @include h6-opensans

    &__loading-spin
      display: flex
      justify-content: center
      align-items: center
      padding: 50px 0px

    &__loading-message
      display: flex
      flex-direction: column
      justify-content: center
      align-items: center
      text-align: center
      letter-spacing: -0.0075em
      text-transform: initial
      @include button-2

    &__loading-border-text
      display: flex
      padding: 24px 0 154px 0
      justify-content: center
      letter-spacing: -0.004em
      @include body-text-3-opensans
    

    
  .fixed-button
    position: fixed
    width: 50px

</style>
