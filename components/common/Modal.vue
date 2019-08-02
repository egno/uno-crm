<template>
  <VDialog :value="visible" max-width="440px" persistent v-bind="$attrs">
    <div class="uno-modal">
      <button type="button" class="uno-modal__close" @click="$emit('close')" />
      <div class="uno-modal__content">
        <div class="uno-modal__header">
          {{ template.header }}
        </div>
        <slot name="text" />
        <div class="uno-modal__buttons">
          <button
            type="button"
            class="uno-modal__left"
            @click="
              $emit('leftButtonClick')
              $emit('close')
            "
          >
            {{ template.leftButton }}
          </button>
          <button
            type="button"
            class="uno-modal__right"
            @click="
              $emit('rightButtonClick')
              $emit('close')
            "
          >
            {{ template.rightButton }}
          </button>
        </div>
      </div>
    </div>
  </VDialog>
</template>
<script>
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    template: {
      type: Object,
      default () {
        return {
          header: '',
          leftButton: '',
          rightButton: ''
        }
      }
    }
  }
}
</script>

<style lang="scss">
@import '~assets/styles/common.scss';
.uno-modal {
  position: relative;
  padding: 30px 30px 25px;
  background-color: #fff;
  text-align: center;
  @media only screen and (min-width: $desktop) {
    padding: 59px 62px 56px;
  }
  &__close {
    position: absolute;
    top: 16px;
    right: 17px;
    width: 24px;
    height: 24px;
    background: url('~assets/images/svg/cross.svg') center/14px no-repeat;
    outline: none;
  }

  &__header {
    font-family: $lato;
    font-style: normal;
    font-weight: 900;
    font-size: 16px;
    line-height: normal;
    color: #07101c;
  }

  &__text {
    max-width: 80%;
    margin: 36px auto 0;
    font-family: $lato;
    font-style: normal;
    font-weight: normal;
    font-size: 14px;
    line-height: normal;
    color: #07101c;
  }

  &__buttons {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    margin-top: 36px;
    button {
      @extend %button;
    }
  }

  &__left {
    color: #8995af;
    &:hover {
      color: #07101c;
    }
  }

  &__right {
    @extend %gold-gradient;
    color: #ffffff !important;
    &:hover {
      background: #07101c;
    }
  }
}
</style>
