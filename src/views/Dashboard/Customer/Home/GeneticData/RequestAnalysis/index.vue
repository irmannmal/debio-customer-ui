<template lang="pug">
  .customer-request-analysis
    .customer-request-analysis__wrapper
      .customer-request-analysis__nav
        .customer-request-analysis__nav-button(@click="handleBack")
          v-icon.customer-request-analysis__nav-icon mdi-chevron-left


      .customer-request-analysis__main
        .customer-request-analysis__stepper
          ui-debio-stepper(
            :items="stepperItems"
          )

        .customer-request-analysis__title {{ !isEmpty ? "Select Genetic Data" : "" }}

        EmptyDataCard(v-if="isEmpty" )
        ui-debio-data-table.customer-request-analysis__table(v-if="!isEmpty"
          :headers="headers"
          :items="items"
          @click="selectData"
        ) 
          template(v-slot:[`item.title`]="{ item }")
            .d-flex.flex-column.customer-request-analysis__table-item-title
              span {{ item.title }}

          template(v-slot:[`item.description`]="{ item }")
            .d-flex.flex-column.customer-request-analysis__table-item-description
              span {{ item.description }}

          template(v-slot:[`item.uploadDate`]="{ item }")
            .d-flex.flex-column.customer-request-analysis__table-item-upload
              span {{ item.uploadAt }}


</template>

<script>
import { mapMutations, mapState } from "vuex"
import { queryGeneticDataByOwnerId } from "@debionetwork/polkadot-provider"
import EmptyDataCard from "./EmptyDataCard"

export default {
  name: "RequestAnalysis",

  data: () => ({
    stepperItems: [
      { number: 1, title: "Select Genetic Data", active: true },
      { number: 2, title: "Select Service & Analyst", active: false },
      { number: 3, title: "Checkout and Payment", active: false },
      { number: 4, title: "Summary/Instruction", active: false }
    ],
    isEmpty: false,
    headers: [
      {
        text: "Title",
        value: "title",
        sortable: true
      },
      {
        text: "Description",
        value: "description",
        sortable: false
      },
      {
        text: "Uploaded",
        value: "uploadDate",
        sortable: true
      }
    ],
    items: []
  }),

  computed: {
    ...mapState({
      api: (state) => state.substrate.api,
      wallet: (state) => state.substrate.wallet
    })
  },

  async mounted() {
    await this.fetchGeneticData()
  },

  components: {
    EmptyDataCard
  },

  methods: {
    ...mapMutations({
      setSelectedGeneticData: "geneticData/SET_SELECTED_DATA"
    }),

    async fetchGeneticData() {
      this.items = []
      const accountId = this.wallet.address
      let dataList

      try {
        dataList = await queryGeneticDataByOwnerId(this.api, accountId)

        for (const { id, owenerId, reportLink, title, description, createdAt, updatedAt } of dataList ) {

          let uploadAt
          if (updatedAt !== "0") {
            uploadAt = this.formatDate(updatedAt)
          } else {
            uploadAt = this.formatDate(createdAt)
          }

          const item = { id, owenerId, reportLink, title, description, uploadAt }
          this.items.push(item)        
        }

        this.items.sort((a, b) => {
          if(new Date(a.uploadAt) < new Date(b.uploadAt)) {
            return 1
          } 
          if  (new Date(a.uploadAt) > new Date(b.uploadAt)) {
            return -1
          } 
          return 0
        })
      } catch (error) {
        this.isEmpty = true
      }
    },

    selectData(item){
      this.setSelectedGeneticData(item)
      this.$router.push({ name: "customer-request-analysis-service"})  
    },

    handleBack() {
      this.$router.push({ name: "customer-genetic-data" })
    },

    formatDate(date) {
      const formattedDate = new Date(parseInt(date.replace(/,/g, ""))).toLocaleDateString("en-GB", {
        day: "numeric", month: "short", year: "numeric"
      })
      return formattedDate
    }
  }
}
</script>

<style lang="sass">
  @import "@/common/styles/mixins.sass"

  .customer-request-analysis
    width: 100%
    height: 100%
    background: #FFFFFF

    &__wrapper
      width: 100%
      height: 100%
      background: #FFFFFF
      box-shadow: 0 0.125rem 0.625rem rgba(0, 0, 0, 0.1)
      border-radius: 0.25rem

    &__nav
      padding: 2.313rem 3.125rem

    &__nav-button
      display: flex
      align-items: center
      gap: 0.625rem
      max-width: max-content
      color: #757274
      cursor: pointer
      @include body-text-3

    &__main
      padding-bottom: 100px
      width: 100%
      display: flex
      flex-direction: column
      align-items: center

    &__title
      display: flex
      flex-direction: column
      align-items: center
      margin-top:50px
      @include h6-opensans

    &__table
      padding: 40px 135px
      width: 100%


    &__table-item-title
      cursor: pointer
      width: 120px

    &__table-item-description
      cursor: pointer
      width: 480px

    &__table-item-upload
      cursor: pointer
      width: 80px

</style>
