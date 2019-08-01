<template>
  <VBadge :value="counter" overlap>
    <v-tooltip
      v-if="noWorkingDay"
      v-model="tooltip"
      right
      :position-x="x"
      :position-y="y"
    >
      <span class="text-primary">
        Выходной день
      </span>
      <br>
      <a class="blue-link" href="#" @click="tooltip = false">
        Сделать рабочим
      </a>
    </v-tooltip>
    <v-btn
      :class="{ weekend: weekend, badge: counter > 0 }"
      class="calendar-btn"
      fab
      small
      block
      depressed
      text
      :color="color"
      :outlined="day.today"
      @click="onClickDate(day.dateKey)"
      @mouseup="move"
      @mouseleave="tooltip = false"
    >
      {{ day.display }}
    </v-btn>
  </VBadge>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  props: {
    counter: { type: Number, default: 0 },
    holiday: { type: Boolean },
    weekend: { type: Boolean, default: false },
    day: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      noWorkingDay: false, // для тултипа в нерабочих днях
      tooltip: false,
      x: 0,
      y: 0
    }
  },
  computed: {
    ...mapGetters({
      actualDate: 'common/actualDate',
      calendar: 'common/calendar'
    }),
    isDayOff () {
      return this.holiday
    },
    color () {
      return this.day.outOfRange ? 'grey' : this.isDayOff ? 'red' : ''
    }
  },
  methods: {
    move (e) {
      console.log(51651)
      console.log(e)
      this.x = e.x + 10
      this.y = e.y + 20
    },
    onClickDate (dt) {
      this.tooltip = true
      this.$emit('onClickDate', dt)
    }
  }
}
</script>
<style lang="scss" scoped>
.calendar-btn {
  width: 20px;
  height: 20px;
  font-size: 12px;
  font-weight: 300;
  border: none;
  &:hover {
    background-color: rgba(255, 255, 255, 0.3);
  }

  &.v-btn--block {
    color: #fff;
    margin: 2px 0 !important;
    line-height: 11px;
    &.weekend {
      &.red--text {
        color: #8995af !important;
      }
    }
    &.red--text {
      color: #8995af !important;
    }
    &.grey--text {
      color: rgba(137, 149, 175, 0.35) !important;
    }
    /*цвет для выходного для*/
    &.v-btn--no-working {
      color: #8995af;
    }
    &.v-btn--outline {
      background: #fff !important;
      color: #142941;
      font-weight: 900;
      &.badge {
        &:after {
          top: 20px;
        }
      }
    }
    &.badge {
      position: relative;
      &:after {
        content: '';
        position: absolute;
        width: 4px;
        height: 4px;
        border-radius: 4px;
        top: 16px;
        background: #5699ff;
      }
    }
  }
}
</style>
