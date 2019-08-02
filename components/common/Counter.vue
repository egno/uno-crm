<template>
  <div class="counter">
    <div class="counter__control _down" @click="onDecrement" />

    <input
      :id="id"
      type="text"
      :value="value"
      :disabled="inputDisabled"
      @input.prevent="setNewValue"
    >

    <div class="counter__control _up" @click="onIncrement" />
  </div>
</template>

<script>
export default {
  name: 'Counter',
  props: {
    id: {
      type: String,
      required: true
    },
    inputDisabled: {
      type: Boolean,
      default: false
    },
    value: {
      type: Number,
      default: 0
    },
    maxValue: {
      type: Number,
      default: 999
    },
    minValue: {
      type: Number,
      default: 0
    },
    interval: {
      type: Number,
      default: 1
    },
    roundCounter: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    findResult (realResult) {
      const quotient = realResult / this.interval

      const res1 = Math.ceil(quotient) * this.interval
      const diff1 = Math.abs(realResult - res1)
      const res2 = Math.floor(quotient) * this.interval
      const diff2 = Math.abs(realResult - res2)

      return diff1 < diff2 ? res1 : res2
    },
    onIncrement () {
      const realResult = this.value + this.interval
      let res

      if (this.roundCounter) {
        res = this.findResult(realResult)
      } else {
        res = realResult
      }

      if (res <= this.maxValue) {
        this.$emit('changeCount', res)
      }
    },
    onDecrement () {
      const realResult = this.value - this.interval
      let res

      if (this.roundCounter) {
        res = this.findResult(realResult)
      } else {
        res = realResult
      }

      if (res >= this.minValue) {
        this.$emit('changeCount', res)
      }
    },
    setNewValue (event) {
      let value = event.target.value.replace(/\D/g, '')
      let newVal

      value = parseInt(value)

      if (!event.target.value) {
        newVal = 0
        event.target.value = ''
      } else if (value <= this.maxValue) {
        newVal = value
        event.target.value = value
      } else {
        newVal = this.maxValue
        event.target.value = this.maxValue
      }
      this.$emit('changeCount', newVal)
    }
  }
}
</script>

<style lang="scss">
@import '~assets/styles/common.scss';

.counter {
  @extend %vertical-align;

  input {
    width: 74px;
    text-align: center;
    outline: none;
  }

  &__control {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    cursor: pointer;
    outline: none;
    background-color: #8995af;
    background-position: center;
    background-repeat: no-repeat;

    &._down {
      left: 0.0625rem;
      background-image: url('~assets/images/svg/minus-white.svg');
    }

    &._up {
      right: 0.0625rem;
      background-image: url('~assets/images/svg/plus-white.svg');
      background-size: 12px;
    }
  }
}
</style>
