<template>
  <VLayout column class="calendar-wrapper">
    <VFlex
      v-if="showHeader"
      class="month-header"
      :class="{ _expanded: expanded }"
      @click="expanded = !expanded"
      @mouseenter="tooltip = true"
      @mouseleave="tooltip = false"
    >
      <VLayout align-center justify-space-between row class="cal-month">
        <div class="cal-head display-3">
          {{ dateMonthHeader }}
        </div>

        <div v-if="expanded">
          <v-btn
            class="cal-next-prev"
            depressed
            text
            small
            color="#ffffff"
            @click.stop="addMonth(-1)"
          />
          <v-btn
            class="cal-next-prev"
            color="#ffffff"
            depressed
            text
            small
            @click.stop="addMonth(1)"
          />
        </div>
        <v-tooltip
          v-if="!expanded"
          v-model="tooltip"
          attach=".month-header"
          top
          @input.stop=""
        >
          <span>Показать календарь</span>
        </v-tooltip>
      </VLayout>
    </VFlex>
    <VFlex v-if="calendarMonth">
      <VContainer class="calendar-container" :class="{ _expanded: expanded }">
        <VLayout
          v-show="period === 'month'"
          align-space-between
          justify-center
          fill-height
          column
        >
          <VFlex>
            <VLayout justify-center row class="week-wrapper dow">
              <VFlex
                v-for="(d, i) in dow"
                :key="i"
                xs2
                justify-center
                row
                class="text-xs-center"
              >
                <span class="dow" :class="{ weekend: i > 4 }">
                  {{ d }}
                </span>
              </VFlex>
            </VLayout>
          </VFlex>
          <VFlex v-for="(week, i) in calendarMonth" :key="i">
            <VLayout justify-center row class="week-wrapper">
              <VFlex v-for="(day, di) in week" :key="di" xs2 justify-center>
                <CalendarDayBtn
                  v-if="kind === 'mini'"
                  :counter="getBusinessDayVisits(day.dateKey)"
                  :day="day"
                  :holiday="isFilialHoliday(day.dateKey)"
                  :weekend="di > 4"
                  @onClickDate="goDate($event)"
                />
                <CalendarDayCard
                  v-else
                  :day="day"
                  :visits="day.visits"
                  @onClickDate="goDate($event)"
                />
              </VFlex>
            </VLayout>
          </VFlex>
        </VLayout>
      </VContainer>
    </VFlex>
  </VLayout>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import CalendarDayBtn from '~/components/calendar/CalendarDayBtn.vue'
import CalendarDayCard from '~/components/calendar/CalendarDayCard.vue'
import { visitInit } from '~/components/calendar/utils'
import calendarMixin from '~/mixins/calendar'

export default {
  components: {
    CalendarDayBtn,
    CalendarDayCard
  },
  mixins: [calendarMixin],
  props: {
    employee: {
      type: Array,
      default () {
        return []
      }
    },
    newVisit: { type: Boolean, default: false },
    kind: { type: String, default: 'mini' },
    period: { type: String, default: 'month' },
    showHeader: { type: Boolean, default: true }
  },
  data () {
    return {
      currentVisit: {},
      edit: false,
      expanded: true,
      timeEdit: false,
      visits: [],
      dow: ['пн', 'вт', 'ср', 'чт', 'пт', 'сб', 'вс'],
      tooltip: false
    }
  },
  computed: {
    ...mapGetters({
      businessInfo: 'business/businessInfo',
      calendar: 'common/calendar',
      businessDayVisits: 'business/businessDayVisits',
      schedule: 'common/schedule'
    }),
    currentEmployee () {
      return this.employee[0] || this.businessId
    }
  },
  watch: {
    workDate: 'fetchData',
    newVisit: 'onNewVisit',
    edit: 'onCloseEdit'
  },
  mounted () {
    this.fetchData()
  },
  methods: {
    ...mapActions({ setActualDate: 'common/setActualDate' }),
    getBusinessDayVisits (dt) {
      const cnt =
        this.businessDayVisits &&
        this.businessDayVisits.filter(x => x.dt === dt)[0] &&
        this.businessDayVisits.filter(x => x.dt === dt)[0].count
      return cnt
    },
    isFilialHoliday (dt) {
      if (!(this.calendar && this.calendar.filter(d => d.dt === dt).length)) { return }
      return this.calendar.filter(d => d.dt === dt)[0].j.holiday
    },
    onCloseEdit () {
      if (!this.edit) {
        this.$emit('closeEdit')
        this.currentVisit = visitInit()
      }
    },
    onNewVisit () {
      if (this.newVisit) {
        this.currentVisit = visitInit()
        this.edit = true
      }
    }
  }
}
</script>
<style lang="scss">
.dow {
  font-family: Lato;
  font-style: normal;
  font-weight: normal;
  line-height: normal;
  font-size: 12px;
  text-align: center;
  color: #fff;
  text-transform: capitalize;
  text-align: center;
  &.weekend {
    color: #8995af;
  }
}
.month-header {
  max-height: 40px;
  position: relative;
  display: flex;
  align-items: center;
  padding: 0 37px 0 39px;
  background: url('~assets/images/svg/calendar.svg') 199px center no-repeat,
    linear-gradient(270deg, #c9a15d -9.86%, #ba9462 103.49%);
  height: 40px;
  cursor: pointer;

  &._expanded {
    background: linear-gradient(270deg, #c9a15d -9.86%, #ba9462 103.49%);
  }
  .v-tooltip__content {
    position: absolute;
    top: 110% !important;
    right: 8px !important;
  }
}
.week-wrapper {
  width: 160px;
  margin: 2px auto;
  &.dow {
    margin-top: 14px;
    margin-bottom: 6px;
  }
}
.calendar-wrapper {
  padding-bottom: 22px;
  border-bottom: 1px solid rgba(137, 149, 175, 0.2);
  margin-bottom: 24px;
}
.calendar-container {
  padding: 4px 38px 4px 36px;
}
.cal-month {
  width: 160px;
  margin: 0 auto;
}
.cal-head {
  font-size: 18px;
  text-transform: capitalize;
  color: #fff;
  white-space: nowrap;
}
.cal-next-prev {
  position: relative;
  margin: 0;
  padding: 0;
  width: 16px;
  min-width: 16px;
  height: 16px;
  border-radius: 50%;
  &:hover {
    background-color: rgba(255, 255, 255, 0.3);
  }
  i {
    font-size: 16px;
  }

  .v-ripple__container {
    display: none !important;
  }
}
</style>
