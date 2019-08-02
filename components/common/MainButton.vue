<template>
  <button v-bind="$attrs" @click="$emit('click')">
    <slot />
  </button>
</template>
<script></script>
<style lang="scss" scoped>
@import '~assets/styles/button.scss';
</style>
