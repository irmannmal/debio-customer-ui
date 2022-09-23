<template lang="pug">
  .parent
    v-btn.prev(icon @click='prevSelection')
      v-icon mdi-chevron-left
    .scroll-select
      .inner-scroll(:style="{'transform': `translateX(${scrollX-(gap/4)}px)`}")
        .select-box(:style="{'height': `${size}px`, 'width': `${size}px`}")
        .select-box(:style="{'height': `${size}px`, 'width': `${size}px`}")
        .select-box(
          v-for='i in 10' :key='i' 
          :style="{'height': ((i) === index) ? `${centerSize}px` : `${size}px`, 'width': ((i) === index) ? `${centerSize}px` : `${size}px`}"
          :class="{'selected-box': (i === index), 'first-selext-box': (i - 1 === index || i + 1 === index)}"
        ) {{ i + 20 }} Days
        .select-box(:style="{'height': `${size}px`, 'width': `${size}px`}")
        .select-box(:style="{'height': `${size}px`, 'width': `${size}px`}")
    v-btn.next(icon @click='nextSelection')
      v-icon mdi-chevron-right
</template>

<script>
export default {
  name: "DaySelectAverage",

  props: {
    gap: { type: Number, default: 12 },
    size: { type: Number, default: 100 },
    centerSize: { type: Number, default: 120 }
  },

  data: () => ({
    scrollX: 0,
    index: 1
  }),

  methods: {
    prevSelection() {
      if (this.index > 1) {
        this.scrollX = this.scrollX + this.size + this.gap
        this.index -= 1
        this.$emit("input", this.index)
      }
    },

    nextSelection() {
      if (this.index < 10) {
        this.scrollX = this.scrollX - this.size - this.gap
        this.index += 1
        this.$emit("input", this.index)
      }
    }
  }
}
</script>

<style lang="sass">
  @import "@/common/styles/mixins.sass"

  .day-select-average
    &__center-content
      width: 100%

  .parent
    display: flex
    width: 688px
    gap: 16px
    align-items: center

  .scroll-select
    overflow: hidden

  .inner-scroll
    white-space: nowrap
    display: inline-flex
    align-content: space-around
    align-items: center
    gap: 12px
    transition: transform 0.5s
    transition-timing-function: ease
    margin: 0 12px

  .select-box
    display: inline-flex
    background: #F3F3F3
    align-items: center
    align-content: space-around
    justify-content: center
    color: #D3C9D1

  .prev, .next
    width: 36px
    width: 36px
    border-radius: 18px
    background: #F5F7F9

  .selected-box
    font-weight: 600
    font-size: 16px
    line-height: 22px
    color: #363636

  .first-selext-box
    font-weight: 400
    font-size: 14px
    line-height: 20px
    color: #757274

</style>
