<template>
  <div class="steps">
    <button
      type="button"
      class="steps__button _prev"
      :disabled="currentStep === 0"
      @click="onDec"
    />
    <div class="steps__header">
      {{ header }} {{ currentStep + 1 }}/{{ length }}
    </div>
    <button
      type="button"
      class="steps__button _next"
      :disabled="currentStep === length - 1"
      @click="onInc"
    />
  </div>
</template>
<script>
export default {
  props: {
    currentStep: { type: Number, default: 0 },
    length: { type: Number, default: 0 },
    header: { type: String, required: true }
  },
  methods: {
    onInc () {
      if (this.currentStep + 1 < this.length) {
        this.$emit('changeStep', this.currentStep + 1)
      }
    },
    onDec () {
      if (this.currentStep > 0) {
        this.$emit('changeStep', this.currentStep - 1)
      }
    }
  }
}
</script>
<style lang="scss">
@import '~assets/styles/common.scss';

.steps {
  @extend %vertical-align;
  justify-content: center;

  &__button {
    position: relative;
    width: 24px;
    height: 24px;
    margin: 0 10px;
    border-radius: 50%;
    cursor: pointer;
    outline: none;
    border: 1px solid rgba(137, 149, 175, 0.1);
    background-color: #fff;
    background-position: center;
    background-repeat: no-repeat;
    transition: background-color 0.4s 0s;

    &:hover {
      background-color: rgba(137, 149, 175, 0.35);
    }

    &._prev {
      background-image: url('~assets/images/svg/next.svg');
      transform: rotate(180deg);
    }

    &._next {
      background-image: url('~assets/images/svg/next.svg');
    }

    &[disabled='disabled'] {
      opacity: 0.5;
      &:hover {
        background-color: #fff;
        cursor: default;
      }
    }
  }
  &__header {
    line-height: 24px;
  }
}
</style>
