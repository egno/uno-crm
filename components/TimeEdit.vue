<template>
  <VTextField
    :value="time"
    mask="##:##"
    class="time-edit"
    :placeholder="placeholder"
    return-masked-value
    :disabled="disabled"
    :rules="[rules.time]"
    @input="onEdit"
    @focus="$emit('focus')"
    @blur="$emit('blur')"
  />
</template>

<script>
export default {
  model: {
    prop: 'time',
    event: 'correctInput',
  },
  props: {
    time: {
      type: String,
      default: '',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    placeholder: { type: String, default: '00:00' },
  },
  data () {
    return {
      val: null,
      rules: {
        time: (value) => {
          if (!value) {
            return true
          }
          return (
            !!value.match(/^(24:00|([01]?[0-9]|2[0-3]):[0-5][0-9])/) ||
            'Время должно быть в промежутке от 00:00 до 24:00'
          )
        },
      },
    }
  },
  methods: {
    onEdit (newVal) {
      const res = this.rules.time(newVal)
      if (res && typeof res === 'boolean') {
        this.$emit('correctInput', newVal)
      }
    },
  },
}
</script>

<style lang="scss">
.time-edit {
  margin-top: 0;
  padding: 0 2px;
  & .v-input__slot:before {
    display: none;
  }
  & .v-text-field__details {
    display: none;
  }

  & .v-input__slot {
    margin-bottom: 0 !important;
    border: 1px solid transparent;
  }

  input {
    padding: 0;
    &::placeholder {
      font-size: 10px !important;
    }
  }

  &.error--text input {
    color: #ef4d37 !important;
  }
}
</style>
