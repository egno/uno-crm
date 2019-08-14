<template>
  <div>
    <div v-for="(phone, i) in newPhones" :key="i" class="phone-input">
      <PhoneEdit
        :phone="phone"
        :removable="i !== 0"
        :label="i === 0 ? 'Телефон*' : 'Телефон'"
        @onEdit="onEdit(i, $event)"
        @deletePhone="deletePhone(i)"
      />
    </div>
    <button
      type="button"
      class="businesscard-form__add-field"
      :disabled="hasEmptyPhone || hasWrongPhone || newPhones.length >= 4"
      @click="newPhones.push('')"
    >
      <svg
        width="10"
        height="10"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M9 0H7V7H0V9H7V16H9V9H16V7H9V0Z"
          fill="#8995AF"
          fill-opacity="1"
        />
      </svg>
      <span>Добавить телефон</span>
    </button>
  </div>
</template>

<script>
import PhoneEdit from '~/components/common/PhoneEdit.vue'
export default {
  components: {
    PhoneEdit,
  },
  props: {
    captionClass: {
      type: String,
      default:
        'caption font-weight-bold text-no-wrap grey--text text--lighten-1',
    },
    phones: {
      type: Array,
      default () {
        return [ '' ]
      },
    },
  },
  data () {
    return {
      newPhones: [ '' ],
    }
  },
  computed: {
    hasEmptyPhone () {
      return this.newPhones.some(x => !x)
    },
    hasWrongPhone () {
      return this.newPhones.some(x => !x.match(/^7?\d{10}$/))
    },
  },
  watch: { phones: 'update' },
  mounted () {
    this.update()
  },
  methods: {
    onEdit (i, payload) {
      this.$set(this.newPhones, i, payload)
      this.$emit('onEdit', this.newPhones)
    },
    deletePhone (index) {
      this.newPhones.splice(index, 1)
      this.$emit('onEdit', this.newPhones)
    },
    update () {
      this.newPhones = this.phones
      if (!this.newPhones.length) {
        this.newPhones.push('')
      }
    },
  },
}
</script>
<style lang="scss">
@import '~assets/styles/phone-input.scss';
</style>
