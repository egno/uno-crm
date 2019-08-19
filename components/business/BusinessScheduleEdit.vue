<template>
  <div class="business-schedule">
    <div v-if="showHeader">
      <h2 class="business-schedule__heading">
        Определите рабочее время
      </h2>
    </div>
    <VLayout v-if="showTumbler" class="business-schedule__tumbler">
      <VFlex xs12>
        <Tumbler
          v-model="forAllDays"
          label="Для всех дней недели"
          class="business-schedule__for-all"
          @change="onToggleForAll"
        />
      </VFlex>
    </VLayout>
    <VLayout
      v-if="newWeekSchedule && newWeekSchedule.data"
      align-space-between
      justify-space-around
      column
      fill-height
      :class="{ 'business-schedule__main': true, 'with-margin': showTumbler || showHeader }"
    >
      <div v-for="(day, index) in days" :key="index" xs12 class="">
        <div class="business-schedule__wrapper">
          <div class="business-schedule__dayname">
            {{ day.dayName }}
          </div>
          <div class="business-schedule__content">
            <DaySchedule
              :day-schedule="day.value"
              @editDay="onEditDay(index, $event)"
            />
          </div>
        </div>
      </div>
    </VLayout>
  </div>
</template>

<script>
import { scheduleMixin } from './mixins'
import DaySchedule from '~/components/business/DaySchedule.vue'
import Tumbler from '~/components/common/Tumbler.vue'

export default {
  components: { DaySchedule, Tumbler },
  mixins: [ scheduleMixin ],
  props: {
    showHeader: {
      type: Boolean,
      default: true,
    },
    showTumbler: {
      type: Boolean,
      default: true,
    },
  },
  data () {
    return {
      forAllDays: false,
    }
  },
  methods: {
    onEditDay (dayIndex, { newDaySchedule: newDay }) {
      if (!this.newWeekSchedule || !this.newWeekSchedule.data) {
        return
      }
      if (!this.forAllDays) {
        this.newWeekSchedule.data[dayIndex] = newDay
      } else {
        this.newWeekSchedule.data.fill(newDay)
      }
      this.$emit('editWeek', this.newWeekSchedule)
    },
    onToggleForAll (forAll) {
      if (!forAll) {
        return
      }

      const filled = this.filledDays()
      let repeated

      if (!this.newWeekSchedule.data.length) {
        this.newWeekSchedule.data = new Array(7)
      }

      switch (filled.length) {
        case 0:
          this.newWeekSchedule.data.fill({ start: '09:00', end: '21:00' })
          break
        case 1:
          this.newWeekSchedule.data.fill(filled[0].value)
          break
        default:
          repeated = this.checkRepeated()
          if (repeated) {
            this.newWeekSchedule.data.fill(repeated.value)
          } else {
            this.newWeekSchedule.data.fill({ start: '09:00', end: '21:00' })
          }
      }

      this.$emit('editWeek', this.newWeekSchedule)
    },
    filledDays () {
      if (!(this.days && this.days.length)) {
        return
      }

      return this.days.filter(
        day => day.value && day.value.start && day.value.end
      )
    },
    checkRepeated () {
      for (let i = 0; i < this.days.length - 1; i++) {
        const day = this.days[i]

        if (!day.value.start || !day.value.end) {
          continue
        }

        let j = i + 1
        let hasNextValues = false

        for (; j < this.days.length; j++) {
          const nextDay = this.days[j]

          if (!nextDay.value.start || !nextDay.value.end) {
            continue
          }

          hasNextValues = true
          if (
            day.value.start !== nextDay.value.start ||
            day.value.end !== nextDay.value.end
          ) {
            break
          }
        }

        if (hasNextValues && j === this.days.length) {
          return day
        }
      }

      return false
    },
  },
}
</script>
<style lang="scss">
@import '~assets/styles/common.scss';

.business-schedule {
  &__heading {
    margin: 23px 0 0;
    padding: 0;
    font-family: Lato, sans-serif;
    font-style: normal;
    font-weight: 900;
    font-size: 16px;
    line-height: normal;
    text-align: center;
    color: #07101c;
  }

  &__main {
    padding: 0 11px;
    &.with-margin {
      margin-top: 31px;
    }
  }

  &__tumbler {
    padding: 0 11px;
  }

  &__for-all {
    width: 240px;
    padding-top: 32px;
  }

  &__wrapper {
    @extend %vertical-align;
    justify-content: space-between;
    padding: 7px 0;
  }

  &__dayname {
    font-family: Lato, sans-serif;
    font-style: normal;
    font-weight: 600;
    font-size: 14px;
    line-height: normal;
    color: #07101C;
    text-align: center;
    text-transform: capitalize;
  }

  &__content {

  }
}
</style>
