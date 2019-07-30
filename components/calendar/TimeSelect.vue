<template>
  <v-layout column class="time-select">
    <v-btn-toggle v-model="timeOfDay">
      <v-btn
        v-for="t in timesOfDay"
        :key="t.value"
        :value="t.value"
        flat
        round
      >
        {{ t.display }}
      </v-btn>
    </v-btn-toggle>

    <div v-if="progress" class="text-xs-center">
      <v-progress-circular
        indeterminate
        color="primary"
      />
    </div> 
    <template v-else> 
      <v-layout
        row
        wrap
      >
        <v-flex
          v-for="(time, n) in availableFreeTimesInDayPart"
          :key="n"
          xs3 
        >
          <button
            type="button"
            :class="{'time-checkbox': true, 'selected': time === selectedTime }"
            @click="$emit('selectedTime', time)"
          >
            {{ time }}
          </button>
        </v-flex>
      </v-layout>
    </template> 
  </v-layout>
</template>

<script>
import { displayRESTTime, dateISOInLocalTimeZone, ceilMinutes } from "~/components/calendar/utils"

export default { 
  props: {
    selectedTime: {
      type: String, 
      default: ''
    },
    times: {
      type: Array,
      default () {
        return []
      }
    },
    progress: { type: Boolean, default: false }
  },
  data () {
    return {
      timeOfDay: 2,
      timesOfDay: [
        { display: "Утро", value: 2 },
        { display: "День", value: 3 },
        { display: "Вечер", value: 4 },
        { display: "Ночь", value: 1 }
      ], 
    }
  },
  computed: {
    availableFreeTimes () {
      const today = dateISOInLocalTimeZone(ceilMinutes(new Date()))
      return (
        this.times && [
          ...new Set(
            this.times
              .filter(x => x.time.begin >= today)
              .map(x => displayRESTTime(x.time.begin))
          )
        ]
      )
    },
    availableFreeTimesInDayPart () {
      return this.availableFreeTimes.filter(
        x => !this.timeOfDay || this.dayPart(x) == this.timeOfDay
      )
    },
  },
  watch: {
    times: "init", 
  },
  methods: {
    dayPart (tsISO) {
      const defaultTime = "09:00"
      const time = tsISO || /*this.time ||*/ defaultTime
      const hours = time.length === 5 ? time.slice(0, 2) : time.slice(11, 13)
      return ~~(+hours / 6) + 1
    },
    init () {
      this.timeOfDay = this.timeOfDay || this.dayPart()
    }
  }
}
</script>

<style lang="scss">
  @import '~/assets/styles/common.scss';

  .time-select {
    .v-item-group {
      margin-bottom: 40px;
    }
    .time-checkbox {
      @extend %filter;
      padding: 0 12px;
      margin-bottom: 24px;
      outline: none;
      &.selected {
        background-color: #5699FF;
        color: #fff;
      }
    }
  }
</style>
