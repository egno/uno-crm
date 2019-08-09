<template>
  <div class="default-checkbox">
    <input
      :id="id"
      :checked="checked"
      :name="name"
      :value="value"
      v-bind="$attrs"
      type="checkbox"
      class="default-checkbox__input"
    >
    <label class="default-checkbox__label" @click="$emit('change', !checked)">
      <slot name="default" />
    </label>
  </div>
</template>
<script>
export default {
  model: {
    prop: 'checked',
    event: 'change'
  },
  props: {
    checked: { type: Boolean, default: false },
    id: { type: String, required: true },
    name: { type: String, default: '' },
    value: { type: String, default: '' }
  }
}
</script>
<style lang="scss">
  @import '~assets/styles/common.scss';
  .default-checkbox {
    &__input {
      position: absolute;
      z-index: -1;
      opacity: 0;
    }

    &__label {
      &:after {
        display: inline-block;
        vertical-align: baseline;
        width: 16px;
        height: 16px;
        border: 1px solid rgba(137, 149, 175, 0.2);
        content: '';
      }
    }

    &__input:checked + &__label:after {
      border-color: #5699FF;
      background: url('~assets/images/svg/selection.svg') center/10px auto no-repeat #5699FF;
    }
  }
</style>
