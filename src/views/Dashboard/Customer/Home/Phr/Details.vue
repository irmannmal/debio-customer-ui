<template lang="pug">
  .customer-phr-details
    ui-debio-modal(
      :show="!!messageError"
      :show-title="false"
      :show-cta="false"
      @onClose="$router.push({ name: 'customer-phr' })"
    )
      | {{ messageError }}

    .customer-phr-details__wrapper
      .customer-phr-details__phr
        .customer-phr-details__phr-title List of {{ phrDocument.title }}
        .customer-phr-details__phr-documents
          template(v-if="!phrDocument.files.length")
            .customer-phr-details__document.customer-phr-details__document--skeleton
            .customer-phr-details__document.customer-phr-details__document--skeleton
            .customer-phr-details__document.customer-phr-details__document--skeleton
          template(v-else)
            .customer-phr-details__document(
              v-for="(document, idx) in phrDocument.files"
              :key="idx"
              role="button"
              :title="document.title"
              :class="{ 'customer-phr-details__document--active': selected === idx }"
              @click="parseResult(idx, document)"
            )
              ui-debio-icon.customer-phr-details__document-icon(
                :icon="fileTextIcon"
                size="28"
                color="#D3C9D1"
                fill
              )
              label.customer-phr-details__document-title(
                :aria-label="document.title"
              ) {{ document.title }}
      keep-alive
        .customer-phr-details__viewer
          .customer-phr-details__viewer-wrapper(
            :class="{ 'customer-phr-details__viewer-wrapper--animated': isLoading }"
          )
            h3.customer-phr-details__viewer-loading.text-center(v-if="isLoading") {{ message }}
            embed.customer-phr-details__viewer-content(
              v-if="!isLoading && result"
              :src="`${result}#view=fitH`"
              type="application/pdf"
            )
</template>

<script>
import { mapState } from "vuex"
import Kilt from "@kiltprotocol/sdk-js"
import CryptoJS from "crypto-js"
import { u8aToHex } from "@polkadot/util"
import { fileTextIcon } from "@debionetwork/ui-icons"
import { downloadFile, decryptFile } from "@/common/lib/pinata-proxy"
import {
  queryElectronicMedicalRecordById,
  queryElectronicMedicalRecordFileById
} from "@debionetwork/polkadot-provider"

export default {
  name: "CustomerPHRDetails",

  data: () => ({
    fileTextIcon,

    isLoading: false,
    publicKey: null,
    secretKey: null,
    messageError: null,
    tempDocuments: [],
    result: null,
    message: "Please wait",
    selected: null,
    phrDocument: {}
  }),

  computed: {
    ...mapState({
      api: (state) => state.substrate.api,
      wallet: (state) => state.substrate.wallet,
      mnemonicData: (state) => state.substrate.mnemonicData,
      lastEventData: (state) => state.substrate.lastEventData,
      loadingData: (state) => state.auth.loadingData
    })
  },

  watch: {
    mnemonicData(val) {
      if (val) this.initialData()
    }
  },

  async created() {
    if (this.mnemonicData) this.initialData()
  },

  methods: {
    async initialData() {
      const cred = Kilt.Identity.buildFromMnemonic(this.mnemonicData.toString(CryptoJS.enc.Utf8))

      this.publicKey = u8aToHex(cred.boxKeyPair.publicKey)
      this.secretKey = u8aToHex(cred.boxKeyPair.secretKey)

      if (cred) await this.prepareData()
    },

    async prepareData() {
      const { id } = this.$route.params
      const data = await queryElectronicMedicalRecordById(this.api, id)
      let files = []

      if (!id || !data) {
        this.messageError = "Oh no! We can't find your selected order. Please select another one or try again"

        return
      }

      this.phrDocument = data

      for (const file of data.files) {
        const dataFile = await queryElectronicMedicalRecordFileById(this.api, file)

        files.push(dataFile)
      }

      this.phrDocument.files = files

      if (this.phrDocument?.files.length) await this.parseResult(
        0,
        { recordLink: this.phrDocument?.files[0].recordLink }
      )
    },

    async parseResult(idx, { recordLink }) {
      let fileBlob, dataFile, decryptedFile

      if (this.selected === idx) return

      this.selected = idx

      try {
        this.isLoading = true

        const pair = { publicKey: this.publicKey, secretKey: this.secretKey }
        const checkTempDocuments = this.tempDocuments.find(doc => doc.link === recordLink)
        if (!checkTempDocuments) {
          dataFile = await downloadFile(recordLink, true)
          decryptedFile = decryptFile(dataFile.data, pair, dataFile.type)
        }

        if (!checkTempDocuments) this.tempDocuments.push({ link: recordLink, file: decryptedFile, type: dataFile.type })

        if (checkTempDocuments) fileBlob = window.URL.createObjectURL(new Blob([checkTempDocuments.file], { type: checkTempDocuments.type }))
        else fileBlob = window.URL.createObjectURL(new Blob([decryptedFile], { type: dataFile.type }))

        this.result = fileBlob
      } catch {
        this.message = "Oh no! Something went wrong. Please try again later"
      } finally {
        this.isLoading = false
      }
    }
  }
}
</script>

<style lang="sass">
  @import "@/common/styles/mixins.sass"
  .customer-phr-details
    padding: 80px 35px
    background: #ffffff
    border-radius: 4px

    &__wrapper
      display: flex
      gap: 35px

    &__phr
      width: 255px

    &__phr-title
      @include body-text-medium-2

    &__phr-documents
      display: flex
      flex-direction: column
      gap: 10px
      margin-top: 20px

    &__document
      display: flex
      align-items: center
      gap: 20px
      padding: 18px 20px
      border: 1px solid #E9E9E9
      border-radius: 4px
      transition: all cubic-bezier(.7, -0.04, .61, 1.14) .3s

      &--skeleton
        height: 70px
        background: #F5F7F9
        border: none
        position: relative
        overflow: hidden

        &::before
          content: ""
          display: block
          position: absolute
          top: 0
          left: 0
          width: 300px
          height: 100%
          background: rgba(255, 255, 255, .5)
          animation: shine infinite 1s

      &:hover
        background: #F9F9F9
        border-radius: 1px
        border-style: solid
        border-color: #6F4CEC

      &--active
        background: #F9F9F9
        border-radius: 1px
        border-style: solid
        border-color: #6F4CEC

    &__document-title
      max-width: 165px
      overflow: hidden
      white-space: nowrap
      text-overflow: ellipsis
      -webkit-touch-callout: none
      -khtml-user-select: none
      -moz-user-select: none
      -ms-user-select: none
      user-select: none

      @include body-text-2

    &__viewer
      width: 100%

    &__viewer-wrapper
      display: flex
      align-items: center
      justify-content: center
      padding: 22px
      min-height: 500px
      background: #F5F7F9
      border-radius: 4px

      &--animated
        position: relative
        overflow: hidden

        &::before
          content: ""
          display: block
          position: absolute
          top: 0
          left: 0
          width: 300px
          height: 100%
          background: rgba(255, 255, 255, .5)
          animation: shine infinite 1s

    &__viewer-loading
      &::after
        content: ""
        animation: dots infinite 2s linear

        @keyframes dots
          0%
            content: "."
          50%
            content: ".."
          100%
            content: "..."

    &__viewer-content
      width: 100%
      min-height: 700px
      border-radius: 4px

    .modal-password
      &__cta
        gap: 20px

    @keyframes shine
      0%
        transform: skew(25deg) translateX(-1000px)
      100%
        transform: skew(25deg) translateX(1000px)
</style>
