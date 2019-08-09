<template>
  <div class="custom-select">
    <VTextField
      ref="textfield"
      :value="searchingValue"
      :label="label"
      :rules="
        required
          ? [rules.required, rules.maxLength(maxLength)]
          : [rules.maxLength(maxLength)]
      "
      :maxlength="maxLength"
      class="dropdown-select"
      :attach="attach"
      :error="error"
      light
      @input.native="onInput"
      @blur="onBlur"
    />
    <div
      v-show="visible && filteredOptions && filteredOptions.length"
      class="custom-select__dropdown"
      tabindex="0"
      @blur="closeDropdown"
      @scroll="isScrolling = true"
    >
      <div
        v-for="(option, i) in filteredOptions"
        :key="i"
        :class="['custom-select__item']"
        @mousedown="select(option)"
      >
        <slot :option="option">
          {{ option }}
        </slot>
      </div>
    </div>
  </div>
</template>

<script>
function deepFind (obj, path) {
  const paths = path.split('.')
  let current = obj

  for (let i = 0; i < paths.length; ++i) {
    if (!current[paths[i]]) {
      return current[paths[i]]
    } else {
      current = current[paths[i]]
    }
  }
  return current
}

export default {
  model: {
    prop: 'searchingValue',
    event: 'input'
  },
  props: {
    searchingValue: {
      type: String,
      default: ''
    },
    searchingProp: {
      type: String,
      default: ''
    },
    options: {
      type: Array,
      default () {
        return []
      }
    },
    required: {
      type: Boolean,
      default: false
    },
    label: {
      type: String,
      default: ''
    },
    maxLength: {
      type: Number,
      default: 200
    },
    attach: {
      type: String,
      default: ''
    },
    error: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      isScrolling: false,
      visible: false,
      rules: {
        required: value => !!value || 'Это поле обязательно для заполнения',
        maxLength: length => value =>
          (value && (value.length <= length || 'Слишком длинный текст')) || true
      },
      selected: null
    }
  },
  computed: {
    filteredOptions () {
      if (!this.searchingValue || !this.options) {
        return
      }
      const searchString = this.searchingValue.trim().toLowerCase()
      if (this.searchingProp) {
        return this.options.filter((option) => {
          return deepFind(option, this.searchingProp).toLowerCase().includes(searchString)
        })
      }

      return this.options.filter(option =>
        option.toLowerCase().includes(searchString)
      )
    }
  },
  methods: {
    closeDropdown () {
      this.visible = false
      this.isScrolling = false
    },
    onBlur (event) {
      if (this.required && !this.searchingValue) {
        this.$emit('error', 'Необходимо заполнить все обязательные поля')
      }
      this.$emit('blur', event)
      setTimeout(() => {
        if (!this.isScrolling) {
          this.closeDropdown()
        }
      }, 50)
    },
    onInput (e) {
      this.visible = true
      this.$emit('input', e.target.value)
      if (this.$refs.textfield.errorBucket.length) {
        this.$emit('error', this.$refs.textfield.errorBucket[0])
      }
    },
    select (option) {
      this.closeDropdown()
      this.$emit('select', option)
    }
  }
}
</script>

<style lang="scss">
@import '~assets/styles/dropdown-select.scss';

.custom-select {
  position: relative;

  &__dropdown {
    position: absolute;
    top: 100%;
    left: 0;
    width: 100%;
    max-height: 220px;
    overflow-y: auto;
    background: #fff;
    z-index: 1000000;
  }
  &__item {
    cursor: pointer;
    padding: 6px 0 5px 32px;
    text-align: left;
    background: rgba(137, 149, 175, 0.1);
    color: #8995af;
    font-family: Lato, sans-serif;
    font-style: normal;
    font-weight: normal;
    font-size: 14px;
    line-height: normal;
    transition: background-color 0.4s 0s;
    &:hover {
      background: rgba(137, 149, 175, 0.2);
    }
  }
}
</style>
