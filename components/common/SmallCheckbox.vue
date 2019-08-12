<template>
  <div :class="{ checked, 'default-checkbox': true}">
    <input
      :id="id"
      :checked="checked"
      :name="name"
      :value="value"
      v-bind="$attrs"
      type="checkbox"
      class="default-checkbox__input"
    >
    <label class="default-checkbox__label">
      <span>
        <slot name="default" />
      </span>
      <span class="default-checkbox__checkbox" @click.stop="$emit('change', !checked)" />
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
    margin-top: 8px;
    &__input {
      position: absolute;
      z-index: -1;
      opacity: 0;
    }

    &__label {
      display: flex;
      justify-content: space-between;
      color: #8995AF;
    }

    &__checkbox {
      display: inline-flex;
      width: 16px;
      height: 16px;
      flex-shrink: 0;
      border: 1px solid rgba(137, 149, 175, 0.8);
      background: #fff;
    }

    &__input:checked + label{
      color: #07101c;
      &>.default-checkbox__checkbox {
        border-color: #5699FF;
        background: url('~assets/images/svg/selection.svg') center/10px auto no-repeat #5699FF;
      }
    }
  }
</style>
