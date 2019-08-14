<template>
  <div class="schedule-edit">
    <div>
      <h2 class="schedule-edit__heading">
        Определите рабочее время
      </h2>
    </div>
    <VLayout class="schedule-edit__tumbler">
      <VFlex xs12>
        <Tumbler
          v-model="forAllDays"
          label="Для всех дней недели"
          class="day-schedule__for-all"
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
      class="schedule-edit__main"
    >
      <div v-for="(day, index) in days" :key="index" xs12 class="day-schedule">
        <div class="day-schedule__wrapper">
          <div class="day-schedule__dayname">
            {{ day.dayName }}
          </div>
          <div class="schedule-edit__content">
            <DaySchedule
              :day-schedule="day.value"
              @editDay="onEditDay(index, $event)"
            />
            <div class="schedule-edit__clear" @click="onClearDay(index)" />
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
  data () {
    return {
      forAllDays: false,
    }
  },
  methods: {
    onClearDay (index) {
      this.newWeekSchedule.data[index] = { start: '', end: '' }
      this.$emit('editWeek', this.newWeekSchedule)
    },
    onEditDay (dayIndex, newDay) {
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
.schedule-edit {
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
    margin-top: 31px;
    padding: 0 11px;
  }

  &__tumbler {
    padding: 0 11px;
  }

  &__content {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  &__clear {
    width: 16px;
    height: 16px;
    margin-top: -1px;
    margin-left: 7px;
    cursor: pointer;
    background: url('~assets/images/svg/cross.svg') center/10px no-repeat;
  }

  &__description {
    margin-top: 17px;
    padding-top: 6px;
    border-top: 1px solid rgba(137, 149, 175, 0.1);
    font-family: Lato;
    font-style: normal;
    font-weight: normal;
    font-size: 12px;
    line-height: normal;
    text-align: center;
    color: #8995af;
  }
}
</style>
