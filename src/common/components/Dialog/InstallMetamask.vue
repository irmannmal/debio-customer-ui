<template lang="pug">
  v-dialog(:value="show", width="340", persistent)
    v-card.pb-5
      v-app-bar(flat, dense, color="white")
        v-toolbar-title
        v-spacer
        v-btn(icon @click="closeDialog")
          v-icon mdi-close
            
      div.mt-10.mb-10(align="center")
        div
          div(align="center")
            div(style="font-size: 20px") {{ title }}
            v-img.mt-5.mb-3(src="@/assets/metamask-icon.png" max-width="80")
            span.grey--text Metamask

          div(align="center" class="mt-5 grey--text") Haven't got a metamask wallet yet ?
          div(align="center" class="mt-5")
            a(href="https://docs.debio.network/getting-started" target="_blank"): u Learn How to Install and Connect

          div.mb-5.ml-8.mr-8.mt-8
            ui-debio-button(
              class="mt-5 align-center"
              color="secondary"
              :loading="loading"
              @click="onClick"
            ) {{ button }}
</template>

<script>

export default {
  name: "InstallMetamask",

  props: {
    show: Boolean,
    button: String,
    title: String,
    loading: Boolean
  },

  methods: {
    onClick() {
      if (this.button === "Install") {
        window.open("https://metamask.io/download/", "_blank", "noopener")
        return
      }
      this.$emit("onClick")
    },

    closeDialog() {
      this.$emit("close")
    }
  }
}
</script>
