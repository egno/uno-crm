<template>
  <div :class="['day-column', { today: isToday }]">
    <div class="day-column__employee">
      <template v-if="employee.j">
        <Avatar
          class="day-column__avatar"
          :name="employee.j.name || employee.j.email"
          :src="employee.j.image"
          size="40px"
        />
        <div class="day-column__badge">
          <div v-if="employee.j.category" class="day-column__emp-title">
            {{ employee.j.category }}
          </div>
          <h2 class="day-column__emp-name">
            {{
              employee.j.name && employee.j.name.length > 70
                ? employee.j.name.substring(0, 70) + '...'
                : employee.j.name
            }}
          </h2>
        </div>
      </template>
    </div>

    <div
      v-for="(time, i) in times"
      :key="i"
      :class="{ 'day-column__item': true, 'in-view': i === slotInView }"
    >
      <div class="day-column__time">
        <div v-if="displayTimeStamp(i)" class="time-mark">
          {{ time.begin.display }}
        </div>
      </div>

      <div v-if="time.visit" class="slot">
        <VisitCard
          :now="now"
          :selected="selectVisit"
          :visit="time.visit"
          :services="time.visit.services"
          @onDelete="onVisitDelete(time.visit.id)"
        />
      </div>
      <div
        v-else
        :class="[
          'slot',
          { working: isWorkingTime(i), clicked: time === selectedTime }
        ]"
        @click="onSlotClick(time, i)"
      >
        <div class="slot__time">
          {{ time.begin.display }}
        </div>
        <div v-show="time === selectedTime" class="slot__container">
          <div
            class="slot__add-visit"
            @click="$emit('onSlotClick', time.begin.date)"
          >
            +
          </div>
          <div
            class="slot__add-break"
            @click="$emit('onBreakClick', time.begin.date)"
          >
            Break
          </div>
        </div>
      </div>
    </div>
    <div
      v-if="offsetTop > 0"
      class="day-column__now"
      :style="{ top: offsetTop + 'px' }"
    />
  </div>
</template>

<script>
import { setInterval, clearInterval } from 'timers'
import { mapGetters } from 'vuex'
import VisitCard from '~/components/calendar/VisitCard.vue'
import {
  areSameDates,
  dateFromISO,
  formatDate,
  formatTime,
} from '~/components/calendar/utils'
import Avatar from '~/components/avatar/Avatar.vue'

export default {
  components: { Avatar, VisitCard },
  props: {
    day: {
      type: Object,
      default () {
        return {}
      },
    },
    displayFrom: {
      type: String,
      default: '',
    },
    displayTo: {
      type: String,
      default: '',
    },
    employee: {
      type: Object,
      default () {
        return {}
      },
    },
    employeeSchedule: {
      type: Array,
      default () {
        return []
      },
    },
    holiday: {
      type: Boolean,
      default: false,
    },
    now: {
      type: Date,
      default () {
        return new Date()
      },
    },
    showTime: { type: Boolean, default: true },
    visits: {
      type: Array,
      default () {
        return []
      },
    },
  },
  data () {
    const minutesOffset = this.getMinutesOffset()
    const slotDuration = 15

    return {
      headerHeight: 80 /* height of column header in pixels */,
      hours: 24,
      minutes: 60,
      offsetTop: 0,
      slotDuration,
      slotHeight: 56 /* slot height in pixels */,
      displayStep: 4,
      selectVisit: false,
      timeEditBlock: false,
      selectedTime: undefined,
      slotInView: Math.floor(minutesOffset / slotDuration) + 1,
      timerId: 0,
      today: new Date(),
      dayHeaderOptions: {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long',
      },
    }
  },
  computed: {
    ...mapGetters({
      apiTimeZone: 'common/apiTimeZone',
      calendar: 'common/calendar',
    }),
    minuteHeight () {
      /* height in pixels */
      return this.slotHeight / this.slotDuration
    },
    isDayOff () {
      if (
        !this.employeeSchedule ||
        !this.employeeSchedule[0] ||
        !this.employeeSchedule[1]
      ) {
        return true
      }

      return this.holiday
    },
    isToday () {
      return areSameDates(this.today, this.day.date)
    },
    times () {
      const isVisible = (time) => {
        if (!(this.displayFrom || this.displayTo)) { return true }

        return (
          time.begin.display <= this.displayTo &&
          time.end.display >= this.displayFrom
        )
      }

      const times = [
        ...Array((this.hours * this.minutes) / this.slotDuration),
      ].map((x, i) => {
        const dateTime = this.day.date.getTime()
        const d1 = new Date(dateTime + 60000 * (i * this.slotDuration))
        const d2 = new Date(dateTime + 60000 * ((i + 1) * this.slotDuration))
        const displayTime1 = this.timeDisplay(d1)
        const displayTime2 = this.timeDisplay(d2)

        return {
          begin: {
            date: d1,
            display: displayTime1,
          },
          end: {
            date: d2,
            display: displayTime2,
          },
          visit: this.visits.find(v => v.time === displayTime1),
        }
      })

      return times.filter(isVisible)
    },
    todayString () {
      return formatDate(this.today)
    },
  },
  created () {
    this.timerId = setInterval(this.setTopOffset, 60 * 1000)
  },
  mounted () {
    this.setTopOffset()
    if (this.offsetTop > 0) {
      const elem = this.$el.querySelector('.today.selected .in-view')
      const top =
        (elem && this.documentOffsetTop(elem) - window.innerHeight / 2) || 0

      if (!elem || !top) {
        return
      }

      if (window.innerWidth < 1300) {
        window.scrollTo({ top, behavior: 'smooth' })
      } else {
        elem &&
          elem.closest('.main-table').scrollTo({ top, behavior: 'smooth' })
      }
    }
  },
  beforeDestroy () {
    clearInterval(this.timerId)
  },
  methods: {
    displayTimeStamp (i) {
      return this.showTime && !((i - 1) % this.displayStep)
    },
    getMinutesOffset () {
      const startTime = this.parseTime(this.displayFrom)
      const currentTime = Date.now()
      const offset = currentTime - startTime

      return offset / 60000
    },
    setTopOffset () {
      if (!areSameDates(new Date(), this.day.date)) {
        this.offsetTop = -10
        return
      }

      const minutes = this.getMinutesOffset()
      if (minutes / this.slotDuration > this.times.length) {
        this.offsetTop = 0
        return
      }

      /* we show one slot before the first (displayFrom) slot, for the first time mark to be visible,
        so we have to add slot's height here */
      this.offsetTop = minutes * this.minuteHeight + this.slotHeight
    },
    isWorkingTime (i) {
      if (!this.employeeSchedule) {
        return false
      }
      const dayEnd = this.employeeSchedule[this.employeeSchedule.length - 1]

      return this.isDayOff
        ? false
        : this.employeeSchedule[0] <= this.times[i].begin.display &&
            (dayEnd === '00:00' ? '24:00' : dayEnd) >= this.times[i].end.display
      // && !(
      //   this.lunchTime.length &&
      //   (this.lunchTime[0] <= this.times[i].begin.display &&
      //     this.lunchTime[1] >= this.times[i].end.display)
      // )
    },
    documentOffsetTop (elem) {
      return (
        elem.offsetTop +
        (elem.offsetParent ? this.documentOffsetTop(elem.parentElement) : 0)
      )
    },
    onClickDate (dt) {
      this.$emit('onClickDate', dt)
    },
    onSlotClick (time, i) {
      if (
        !this.isDayOff &&
        time.begin.date.getTime() > Date.now() &&
        this.isWorkingTime(i)
      ) {
        this.selectedTime = time
      }
    },
    onVisitDelete (id) {
      this.$emit('onVisitDelete', id)
    },
    timeDisplay (date) {
      return formatTime(date)
    },
    parseTime (timeString) {
      return dateFromISO(`${this.day.dateKey}T${timeString}:00`).getTime()
    },
  },
}
</script>

<style lang="scss">
@import '~assets/styles/common.scss';
@mixin active-header {
  background-color: rgba(137, 149, 175, 0.35);
  border-radius: 4px;
}

.time-mark {
  position: absolute;
  right: 100%;
  top: -1px;
  font-size: 12px;
  color: #8995af;
  padding: 7px 8px 0 0;
  border-top: 1px solid rgba(137, 149, 175, 0.2);
}
.slot {
  height: 100%;
  border-right: 1px solid rgba(137, 149, 175, 0.1);
  border-bottom: 1px solid rgba(137, 149, 175, 0.1);
  font-size: 0.75em;

  &.working {
    background: #fff;
    &:hover {
      .slot__time {
        display: block;
      }
    }
  }
  &.clicked:hover {
    .slot__time {
      display: none;
    }
  }

  &__time {
    position: absolute;
    z-index: 0;
    display: none;
    padding: 20px 14px 0;
    color: rgba(137, 149, 175, 0.35);
    font-size: 12px;
  }

  &__container {
    position: relative;
    z-index: 2;
    display: flex;
    flex-wrap: nowrap;
    height: 100%;
    justify-content: space-between;
    padding: 2px 0;
    & > div {
      width: 50%;
      margin: 0 2px;
      height: 100%;
      border-radius: 4px;
      color: transparent;
      &:hover {
        background-color: rgba(137, 149, 175, 0.1);
      }
    }
  }
  &__add-visit {
    background: url('~assets/plus.svg') center/14px no-repeat;
    cursor: pointer;
  }
  &__add-break {
    position: relative;
    background: url('~assets/images/svg/cup.svg') center no-repeat;

    &:before {
      content: '';
      position: absolute;
      left: -2px;
      top: 0;
      height: 100%;
      width: 1px;
      background: rgba(137, 149, 175, 0.1);
    }
  }
}

.day-column {
  @media only screen and (min-width: $desktop) {
    width: 14.28%;
    flex-grow: 1;
    flex-shrink: 0;
  }
  &__item {
    height: 56px;
    /*&:nth-child(odd) {
      .slot {
        border-bottom: 1px solid rgba(137, 149, 175, .20);
      }
    }*/
  }
  &__time {
    position: relative;
  }

  &__now {
    position: absolute;
    z-index: 0;
    right: 0;
    left: 0;
    border-top: 2px solid #ef4d37;
    pointer-events: none;
    &::before {
      position: absolute;
      top: -5px;
      left: -4px;
      width: 8px;
      height: 8px;
      background-color: #ef4d37;
      content: '';
      border-radius: 50%;
    }
    @media only screen and (min-width: $desktop) {
      margin-top: 80px;
    }
  }
  &__employee {
    display: none;
    @media only screen and (min-width: $desktop) {
      position: sticky;
      top: 0;
      z-index: 1;
      display: flex;
      height: 80px;
      padding-left: 18px;
      justify-content: flex-start;
      align-items: center;
      font-family: Lato, sans-serif;
      font-style: normal;
      line-height: normal;
      background-color: #fff;
      border-right: 1px solid rgba(137, 149, 175, 0.1);
      border-bottom: 1px solid rgba(137, 149, 175, 0.1);
      box-shadow: 4px 2px 8px rgba(137, 149, 175, 0.1);
    }
  }
  &__badge {
    padding-left: 10px;
  }
  &__emp-title {
    font-size: 12px;
    color: #8995af;
  }
  &__emp-name {
    font-size: 14px;
    color: #07101c;
    font-weight: 400;
    text-transform: capitalize;
  }
  .day-off {
    color: #8995af;
  }
}
</style>
