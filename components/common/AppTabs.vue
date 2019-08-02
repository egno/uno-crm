<template>
  <v-tabs
    :value="value"
    color="grey lighten-4"
    slider-color="primary"
    class="app-tabs"
    height="40px"
    @change="$emit('input', $event)"
  >
    <slot />
  </v-tabs>
</template>

<script>
export default {
  props: {
    value: { type: Number, default: 0 }
  }
}
</script>

<style lang="scss">
@import '~assets/styles/common.scss';
.app-tabs {
  border-bottom: 1px solid rgba(137, 149, 175, 0.1);
  .v-tabs__wrapper {
    background-color: #fff;
    @media only screen and (min-width: $desktop) {
      padding-left: 127px;
    }
  }
  .v-tabs__container {
    margin: 0 auto;
    @media only screen and (min-width: $tablet) {
      max-width: 524px;
    }
    @media only screen and (min-width: $desktop) {
      margin: 0;
    }
  }
  .v-tabs__slider-wrapper .primary {
    @extend %gold-gradient;
  }
  .v-tabs__div {
    flex: 1 1 auto;
    text-transform: none;
  }
  .v-tabs__item {
    padding: 0;
    color: #8995af;
    opacity: 1;
  }
  .v-tabs__item--active {
    font-weight: 900;
    color: #07101c;
  }
}
</style>
