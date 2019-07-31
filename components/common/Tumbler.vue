<template>
  <div>
    <input
      id="checkbox"
      :checked="checked"
      v-bind="$attrs"
      type="checkbox"
      class="tumbler"
      @change="$emit('change', $event.target.checked)"
    >
    <label for="checkbox">{{ label }}</label>
  </div>
</template>
<script>
export default {
  model: {
    prop: 'checked',
    event: 'change'
  },
  props: {
    label: { type: String, default: '' },
    checked: { type: Boolean, default: false }
  }
}
</script>
<style lang="scss" scoped>
$checkbox-height: 16px;
.tumbler {
  position: absolute;
  z-index: -1;
  opacity: 0;
}
.tumbler + label {
  position: relative;
  display: block;
  min-width: 24px;
  min-height: $checkbox-height;
  padding-left: 44px;
  cursor: pointer;
  font-family: Lato, sans-serif;
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  line-height: normal;
  color: #07101c;
}
.tumbler + label:before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 32px;
  height: $checkbox-height;
  border-radius: 13px;
  background: #cdd1da;
  transition: 0.2s;
}
.tumbler + label:after {
  content: '';
  position: absolute;
  top: 1px;
  left: 1px;
  width: 14px;
  height: 14px;
  border-radius: 10px;
  background: #fff;
  box-shadow: 0px 0px 4px rgba(137, 149, 175, 0.2);
  transition: 0.2s;
}
.tumbler:checked + label:before {
  background: #5699ff;
}
.tumbler:checked + label:after {
  left: 17px;
}
</style>
