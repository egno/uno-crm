<template>
  <div v-if="newDaySchedule" class="day-schedule__times">
    <TimeEdit
      :class="{
        'error--text':
          errors.includes('intervalError') ||
          (newDaySchedule.end && !newDaySchedule.start)
      }"
      :time="newDaySchedule.start"
      placeholder="––:––"
      @correctInput="onEdit('start', $event)"
    />
    <div>—</div>
    <TimeEdit
      :class="{
        'error--text':
          errors.includes('intervalError') ||
          (newDaySchedule.start && !newDaySchedule.end)
      }"
      :time="newDaySchedule.end"
      placeholder="––:––"
      @correctInput="onEdit('end', $event)"
    />
  </div>
</template>

<script>
import { scheduleMixin } from './mixins'
import TimeEdit from '~/components/TimeEdit.vue'
import ScheduleDay from '~/classes/scheduleDay'

export default {
  components: { TimeEdit },
  mixins: [scheduleMixin],
  props: {
    daySchedule: {
      type: Object,
      default () {
        return new ScheduleDay({
          start: '',
          end: ''
        })
      }
    }
  },
  data () {
    return {
      newDaySchedule: new ScheduleDay(this.daySchedule),
      errors: []
    }
  },
  computed: {},
  watch: {
    daySchedule: 'update'
  },
  methods: {
    onEdit (prop, value) {
      this.newDaySchedule[prop] = value
      this.errors = this.getDayScheduleErrors(this.newDaySchedule)
      this.$emit('editDay', this.newDaySchedule)
    },
    update () {
      this.newDaySchedule = new ScheduleDay(this.daySchedule)
    }
  }
}
</script>

<style lang="scss">
@import '~assets/styles/day-schedule.scss';
</style>
