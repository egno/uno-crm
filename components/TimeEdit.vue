<template>
  <VTextField
    v-model="val"
    mask="##:##"
    class="time-edit"
    :placeholder="placeholder"
    return-masked-value
    :rules="[rules.time]"
    @input="onEdit"
  />
</template>

<script>
export default {
  props: {
    time: {
      type: String,
      default: ''
    },
    placeholder: { type: String, default: '00:00' }
  },
  data () {
    return {
      val: null,
      rules: {
        time: value => {
          if (!value) {
            return true
          }
          return !!value.match(/^(24:00|([01]?[0-9]|2[0-3]):[0-5][0-9])/) ||
            'Время должно быть в промежутке от 00:00 до 24:00'
        }
      }
    }
  },
  watch: {
    time: 'loadVal',
  },
  mounted () {
    this.loadVal()
  },
  methods: {
    loadVal () {
      this.val = this.time
    },
    onEdit () {
      const res = this.rules.time(this.val)
      if (res && typeof res === 'boolean') {
        this.$emit('correctInput', this.val)
      }
    }
  }
}
</script>

<style lang="scss">
.time-edit {
  margin-top: 0;
  padding: 0;
  & .v-input__slot:before {
    display: none;
  }
  & .v-text-field__details {
    display: none;
  }

  & .v-input__slot {
    margin-bottom: 0 !important;
  }

  &.error--text input {
    color: #ef4d37 !important;
  }
}

</style>
