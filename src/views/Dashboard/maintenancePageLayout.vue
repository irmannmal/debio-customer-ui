<template lang="pug">
  .error-page
    .error-page__wrapper
      h3.error-page__title Something awesome is in the work
      ui-debio-icon(:icon="constructIllustration" view-box="0 0 383 241" width="383" height="241" fill)
      .error-page__legend We'll let you know very soon
</template>

<script>
import { constructIllustration } from "@debionetwork/ui-icons"

export default {
  name: "maintenancePageLayout",

  props: {
    error: { type: [Object, Boolean], default: null }
  },

  data: () => ({ constructIllustration })
}
</script>

<style lang="sass">
  .error-page
    padding: 30px

    &__wrapper
      width: 100%
      height: calc(100vh - 10rem)
      display: flex
      flex-direction: column
      justify-content: center
      align-items: center
      gap: 1.375rem

    &__title
      margin-bottom: 20px
      font-size: 2rem

    &__legend
      margin-top: 10px
      font-size: 1.6rem
</style>
