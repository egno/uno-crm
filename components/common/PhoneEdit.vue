<template>
  <VLayout row align-center class="phone-edit">
    <div class="select-code" />
    <VFlex>
      <VTextField
        v-model="newPhone"
        :label="label"
        :placeholder="placeholder"
        :disabled="disabled"
        :error="error"
        mask="phone"
        prefix="+7"
        :rules="allRules"
        class="businesscard-form__field _phone"
        :required="!removable"
        @input="onEdit"
        @focus="focused = true"
        @blur="focused = false; $emit('blur')"
      />
    </VFlex>    
    <button v-show="removable" type="button" class="businesscard-form__delete" @mousedown="$emit('deletePhone')">
      <svg width="12" height="20" viewBox="0 0 12 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M8 0H4V2H0V4H12V2H8V0ZM0 6H12V20H0V6Z" fill="#8995AF" fill-opacity="0.2" />
      </svg>
    </button>
  </VLayout>
</template>

<script>
export default {
  props: {
    disabled: { type: Boolean, default: false },
    label: { type: String, default: null },
    placeholder: { type: String, default: '(000) 000-00-00' },
    phone: {
      type: String,
      default () {
        return ''
      }
    },
    removable: { type: Boolean, default: true },
    error: { type: Boolean, default: false }
  },
  data () {
    return {
      newPhone: '',
      rules: {
        required: value => !!value || 'Это поле обязательно для заполнения',
        counter: value => value.length === 10 || 'В номере должно быть 10 цифр'
      },
      focused: false
    }
  },
  computed: {
    allRules () {
      if (this.removable) {
        return [ this.rules.counter ]
      } else {
        return [ this.rules.required, this.rules.counter ]
      }
    }
  },
  watch: { phone: 'update' },
  mounted () {
    this.update()
  },
  methods: {
    onEdit () {
      this.$emit('onEdit', this.newPhone)
    },
    update () {
      this.newPhone = (this.phone || '').replace(/(\+?\d?)(\d{10})$/g, '$2')
    }
  }
}
</script>

