<template>
  <div class="visit-log">
    <Spinner v-if="isLoadingEmployees" />
    <v-progress-linear
      :active="isLoading"
      height="2"
      indeterminate
      color="#5699FF"
    />
    <template v-if="!isLoading && !isLoadingEmployees">
      <div v-show="!showMobileMenu">
        <div class="visit-log__header">
          <div class="header">
            <VLayout row align-center class="header__right">
              <button
                type="button"
                :disabled="selectedDateObj.dateKey === todayString"
                class="calendar-controls__today"
                @click="goDate(todayString)"
              >
                Сегодня
              </button>
              <div class="calendar-controls__toggle desktop">
                <input
                  id="day-mode"
                  v-model="displayMode"
                  type="radio"
                  value="day"
                >
                <label for="day-mode">День</label>
                <input
                  id="week-mode"
                  v-model="displayMode"
                  type="radio"
                  value="week"
                >
                <label for="week-mode">Неделя</label>
              </div>
              <v-btn
                class="mobile calendar-controls__button"
                depressed
                text
                small
                @click.stop="addMonth(1)"
              >
                <v-icon>navigate_next</v-icon>
              </v-btn>
            </VLayout>
            <div class="header__button">
              <MainButton
                v-if="
                  businessEmployees &&
                    businessEmployees.length &&
                    selectedEmployee
                "
                class="button_attractive"
                @click="createVisit()"
              >
                Создать запись
              </MainButton>
            </div>
          </div>
          <div class="calendar-controls">
            <VLayout
              align-center
              justify-space-between
              row
              class="calendar-controls__container mobile"
            >
              <div class="calendar-controls__left">
                <v-btn
                  class="calendar-controls__button"
                  depressed
                  text
                  small
                  @click.stop="addMonth(-1)"
                >
                  <v-icon>navigate_before</v-icon>
                </v-btn>
                <v-btn
                  class="desktop calendar-controls__button"
                  depressed
                  text
                  small
                  @click.stop="addMonth(1)"
                >
                  <v-icon>navigate_next</v-icon>
                </v-btn>
                <div class="calendar-controls__heading">
                  {{ dateMonthHeader }}
                </div>
              </div>
              <VLayout row align-center class="calendar-controls__right">
                <button
                  type="button"
                  :disabled="selectedDateObj.dateKey === todayString"
                  class="calendar-controls__today"
                  @click="goDate(todayString)"
                >
                  Сегодня
                </button>
                <div class="calendar-controls__toggle desktop">
                  <input
                    id="day-mode"
                    v-model="displayMode"
                    type="radio"
                    value="day"
                  >
                  <label for="day-mode">День</label>
                  <input
                    id="week-mode"
                    v-model="displayMode"
                    type="radio"
                    value="week"
                  >
                  <label for="week-mode">Неделя</label>
                </div>
                <v-btn
                  class="mobile calendar-controls__button"
                  depressed
                  text
                  small
                  @click.stop="addMonth(1)"
                >
                  <v-icon>navigate_next</v-icon>
                </v-btn>
              </VLayout>
            </VLayout>

            <!-- desktop block with dates and change week buttons -->
            <VLayout>
              <!-- desktop change week buttons block goes below -->
              <div class="visit-log__controls">
                <v-btn
                  class="visit-log__controls-button"
                  depressed
                  text
                  small
                  @click.stop="changeWeek(-1)"
                >
                  <v-icon>navigate_before</v-icon>
                </v-btn>
                <v-btn
                  class="visit-log__controls-button"
                  depressed
                  text
                  small
                  @click.stop="changeWeek(1)"
                >
                  <v-icon>navigate_next</v-icon>
                </v-btn>
              </div>
              <VLayout
                row
                justify-space-between
                class="calendar-controls__days _desktop"
              >
                <!--todo make a component -->
                <template v-if="displayMode === 'day'">
                  <div
                    v-for="(day, dayIndex) in selectedWeek"
                    :key="dayIndex"
                    :class="{
                      'calendar-controls__day': true,
                      selected: day.dateKey === selectedDate,
                      out: day.outOfRange,
                      today: day.dateKey === todayString
                    }"
                    @click="goDate(day.dateKey)"
                  >
                    <div class="calendar-controls__number">
                      {{ day.display }}
                    </div>
                    <div class="calendar-controls__dow">
                      <!--<span class="mobile">{{ dow[dayIndex] }}</span>-->
                      <span class="desktop">{{
                        day.date.toLocaleString('ru-RU', { weekday: 'long' })
                      }}</span>
                    </div>
                  </div>
                </template>
                <template v-else>
                  <div
                    v-for="(day, dayIndex) in selectedWeek"
                    :key="dayIndex"
                    :class="{
                      'calendar-controls__day': true,
                      selected: day.dateKey === selectedDate,
                      active: showDateMenu[dayIndex],
                      out: day.outOfRange,
                      today: day.dateKey === todayString
                    }"
                  >
                    <v-menu
                      v-model="showDateMenu[dayIndex]"
                      :disabled="day.dateKey <= todayString"
                      offset-y
                      :attach="
                        `.calendar-controls__day:nth-child(${dayIndex + 1})`
                      "
                      max-width="100"
                    >
                      <template v-slot:activator="{ on }">
                        <div v-on="on">
                          <div class="calendar-controls__number">
                            {{ day.display }}
                          </div>
                          <div
                            :class="[
                              'calendar-controls__dow',
                              { 'day-off': isDayOff(day.dateKey, dayIndex) }
                            ]"
                          >
                            <span class="desktop">{{
                              day.date.toLocaleString('ru-RU', {
                                weekday: 'long'
                              })
                            }}</span>
                          </div>
                          <!--<div v-if="!isDayOff(day.dateKey, dayIndex)" class="day-column__schedule">
                            {{ employeeSchedule[0] }} – {{ employeeSchedule[1] }}
                          </div>
                          <div v-else class="day-column__schedule">
                            Выходной
                          </div>-->
                        </div>
                      </template>
                      <div
                        v-if="showDateMenu[dayIndex]"
                        class="calendar-controls__dropdown"
                        @click="
                          onDayEdit({
                            day,
                            isDayOff: isDayOff(day.dateKey, dayIndex)
                          })
                        "
                      >
                        <div>
                          {{
                            isDayOff(day.dateKey, dayIndex)
                              ? 'Сделать рабочим'
                              : 'Сделать выходным'
                          }}
                        </div>
                      </div>
                    </v-menu>
                  </div>
                </template>
              </VLayout>
              <div
                v-if="displayMode === 'week'"
                class="visit-log__week-spacer"
              />
            </VLayout><!-- end of desktop block with dates and change week buttons -->

            <div
              v-if="calendarMonth.length"
              class="calendar-controls__dates-container mobile"
            >
              <carousel
                :key="selectedDate"
                :pagination-enabled="false"
                :min-swipe-distance="25"
                :per-page="1"
                :navigate-to="activeSlide"
              >
                <slide
                  v-for="(week, weekIndex) in calendarMonth"
                  :key="weekIndex"
                >
                  <VLayout
                    row
                    justify-space-between
                    class="calendar-controls__days"
                  >
                    <div
                      v-for="(day, dayIndex) in week"
                      :key="selectedDate + weekIndex + dayIndex"
                      :class="{
                        'calendar-controls__day': true,
                        selected: day.dateKey === selectedDate,
                        out: day.outOfRange,
                        today: day.dateKey === todayString
                      }"
                      @click="goDate(day.dateKey)"
                    >
                      <!--todo make a component -->
                      <div class="calendar-controls__number">
                        {{ day.display }}
                      </div>
                      <div class="calendar-controls__dow">
                        <span class="mobile">{{ dow[dayIndex] }}</span>
                        <span class="desktop">{{
                          day.date.toLocaleString('ru-RU', { weekday: 'long' })
                        }}</span>
                      </div>
                    </div>
                  </VLayout>
                </slide>
              </carousel>
            </div>
          </div>
        </div>

        <VLayout
          v-if="
            !isLoadingEmployees &&
              businessEmployees &&
              !businessEmployees.length
          "
          class="visit-log__no-employees"
          align-center
          justify-space-between
          row
          fill-height
        >
          <div>У вас нет ни одного мастера.</div>
          <MainButton
            class="button_attractive"
            @click="
              $router.push({
                name: 'employeeProfile',
                params: { id: $route.params.id, employee: 'new' }
              })
            "
          >
            <span>Создать мастера</span>
          </MainButton>
        </VLayout>

        <div
          v-if="selectedEmployee && selectedEmployee.j"
          :class="[
            'main-table',
            { 'one-day': displayMode === 'day', week: displayMode === 'week' }
          ]"
        >
          <div class="employees">
            <button
              type="button"
              class="employee-menu-trigger"
              @click="showMobileMenu = true"
            />
            <div
              v-for="employee in businessEmployees"
              :key="employee.id"
              :class="[
                'employee',
                {
                  selected: selectedEmployee === employee,
                  disabled: !employee.j.services || !employee.j.services.length
                }
              ]"
              @click="selectedEmployee = employee"
            >
              <Avatar
                class="employee__avatar"
                :name="employee.j.name"
                :src="employee.j.image"
                size="44px"
              />
              <div class="employee__badge">
                <h2 class="employee__title">
                  <span>{{
                    employee.j.name && employee.j.name.length > 70
                      ? employee.j.name.substring(0, 70) + '...'
                      : employee.j.name
                  }}</span>
                </h2>
                <div v-if="employee.j.category" class="employee__subtitle">
                  {{ employee.j.category }}
                </div>
              </div>
            </div>
          </div>
          <div class="main-table__desktop-menu desktop">
            <div class="employees-selection">
              <v-menu
                v-model="showDesktopMenu"
                :close-on-content-click="false"
                min-width="182"
                max-width="200"
                offset-x
                attach=".main-table__desktop-menu .employees-selection"
              >
                <template v-slot:activator="{ on }">
                  <div class="employee-menu-trigger" v-on="on" />
                </template>
                <div class="employees-selection__menu">
                  <!--<div v-if="displayMode === 'day'" :class="['employees-selection__item', 'v-expansion-panel__header']" @click="toggleAll">
                    Все мастера
                  </div>-->
                  <v-expansion-panel expand>
                    <v-expansion-panel-content
                      v-for="category in employeesCategories"
                      :key="category"
                      :hide-actions="true"
                    >
                      <template v-slot:header>
                        <VLayout align-center justify-space-between>
                          <div>
                            {{ category }}
                            {{ groupedEmployees[category].length }}
                          </div>
                          <AppCheckbox
                            v-if="displayMode === 'day'"
                            :id="category"
                            :checked="
                              groupedEmployees[category].length ===
                                visibleEmployees.filter(
                                  (e) => e.j.category === category
                                ).length
                            "
                            label=""
                            :value="category"
                            @click.native.stop
                            @change="onGroupsChange(category, $event)"
                          />
                        </VLayout>
                      </template>

                      <VLayout
                        v-for="(emp, i) in groupedEmployees[category]"
                        :key="emp.id"
                        justify-space-between
                        align-center
                        class="employees-selection__item"
                      >
                        <VLayout row align-center>
                          <Avatar
                            class="employee__avatar"
                            :name="emp.j.name"
                            :src="emp.j.image"
                            size="44px"
                          />
                          <div class="employees-selection__emp-name">
                            {{ emp.j.name }}
                          </div>
                        </VLayout>

                        <AppCheckbox
                          v-if="displayMode === 'day'"
                          :id="emp.j.name + i"
                          :checked="
                            visibleEmployees.some((e) => e.id === emp.id)
                          "
                          label=""
                          :value="emp.id"
                          @change="changeVisibleEmployees(emp, $event)"
                        />
                        <AppCheckbox
                          v-else
                          :id="emp.j.name + i"
                          :checked="selectedEmployee.id === emp.id"
                          label=""
                          :value="emp.id"
                          @change="changeVisibleEmployees(emp, $event)"
                        />
                      </VLayout>
                    </v-expansion-panel-content>
                  </v-expansion-panel>
                </div>
              </v-menu>
            </div>
          </div>
          <template v-if="displayMode === 'day'">
            <div row class="main-table__times">
              <CalendarDayColumn
                v-for="employee in businessEmployees"
                v-show="visibleEmployees.some((e) => e.id === employee.id)"
                :key="employee.id"
                :employee="employee"
                :class="{
                  desktop: employee.id !== selectedEmployee.id,
                  selected: employee.id === selectedEmployee.id
                }"
                :show-time="true"
                :day="selectedDateObj"
                :now="now"
                :holiday="isHoliday(selectedDate, employee)"
                :visits="dayVisits(selectedDate, employee)"
                :employee-schedule="
                  getIrregularDay(selectedDate, employee)
                    ? getIrregularDay(selectedDate, employee).schedule
                    : employee.j.schedule.data[selectedDOW]
                "
                :display-from="displayTimes.start"
                :display-to="displayTimes.end"
                @onSlotClick="createVisit(employee.id, $event)"
                @onBreakClick="createBreak($event, employee.id)"
                @makeDayOffTry="notifyHasVisits = true"
              />
            </div>
          </template>
          <template v-else>
            <VLayout row>
              <div row class="main-table__times">
                <CalendarDayColumn
                  v-for="(day, i) in selectedWeek"
                  v-show="
                    day.dateKey === selectedDate || displayMode === 'week'
                  "
                  :key="selectedEmployee.j.name + day.dateKey"
                  :employee="!i ? selectedEmployee : {}"
                  :class="{
                    desktop: day.dateKey !== selectedDate,
                    selected: day.dateKey === selectedDate
                  }"
                  :show-time="!i || day.dateKey === selectedDate"
                  :day="day"
                  :now="now"
                  :holiday="isHoliday(day.dateKey, selectedEmployee)"
                  :visits="dayVisits(day.dateKey, selectedEmployee)"
                  :employee-schedule="
                    getIrregularDay(day.dateKey, selectedEmployee)
                      ? getIrregularDay(day.dateKey, selectedEmployee).schedule
                      : selectedEmployee.j.schedule.data[i]
                  "
                  :display-from="displayTimes.start"
                  :display-to="displayTimes.end"
                  @onSlotClick="createVisit(selectedEmployee.id, $event)"
                  @onBreakClick="createBreak($event, selectedEmployee.id)"
                  @makeDayOffTry="notifyHasVisits = true"
                />
              </div>
              <div class="main-table__employees-switch">
                <div class="visit-log__controls">
                  <v-btn
                    class="visit-log__controls-button"
                    depressed
                    text
                    small
                    @click="selectPrevEmployee"
                  >
                    <v-icon>navigate_before</v-icon>
                  </v-btn>
                  <v-btn
                    class="visit-log__controls-button"
                    depressed
                    text
                    small
                    @click="selectNextEmployee"
                  >
                    <v-icon>navigate_next</v-icon>
                  </v-btn>
                </div>
              </div>
            </VLayout>
          </template>
        </div>
      </div>

      <div v-show="showMobileMenu" class="modal-content">
        <div class="modal-content__header">
          <v-btn
            class="controls__button"
            depressed
            text
            small
            @click.stop="showMobileMenu = false"
          >
            <v-icon>navigate_before</v-icon>
          </v-btn>
          <h2 class="modal-content__heading">
            Выберите мастера
          </h2>
        </div>

        <div class="modal-content__body">
          <Accordion>
            <template slot="heading">
              <div>Все мастера</div>
            </template>
            <template slot="content">
              <AppCheckbox
                v-for="(category, i) in employeesCategories"
                :id="category"
                :key="i"
                :checked="selectedCategories.includes(category)"
                :label="category"
                name="employee_category"
                :value="category"
                @change="onGroupsChange(category, $event)"
              />
            </template>
          </Accordion>
          <div
            v-for="category in selectedCategories"
            :key="category"
            class="filter-results__group"
          >
            <template
              v-if="
                businessEmployees.some((e) => e.j && e.j.category === category)
              "
            >
              <div class="filter-results__group-name">
                {{ category ? category : '' }}
              </div>
              <div class="filter-results__cards">
                <div v-for="(employee, i) in businessEmployees" :key="i">
                  <EmployeeCard
                    v-if="employee.j.category === category"
                    :employee="employee"
                    :services-count="
                      employee.j.services ? employee.j.services.length : 0
                    "
                    @calendarClick="
                      selectedEmployee = employee
                      showMobileMenu = false
                    "
                  />
                </div>
              </div>
            </template>
          </div>
        </div>
      </div>
    </template>

    <VisitEdit
      v-if="currentVisit"
      :id="currentVisit.id"
      :visible="edit"
      :company-id="businessInfo.parent ? businessInfo.parent : businessId"
      :employees="
        businessEmployees.filter((e) => e.j.services && e.j.services.length)
      "
      :employee="
        businessEmployees.find((e) => e.id === currentVisit.business_id) ||
          selectedEmployee
      "
      :visit="currentVisit"
      :page="editVisitPage"
      @onSave="onVisitSave"
      @delete="onDelete"
      @close="
        edit = false
        currentVisit = null
        selectVisit(null)
      "
    />
    <Modal
      :visible="showSuccessModal"
      :template="{
        header: 'Запись создана',
        rightButton: 'Понятно'
      }"
      content-class="modal-notification"
      @rightButtonClick="closeModal"
      @close="closeModal"
    >
      <template slot="text">
        <div class="modal-notification__content">
          Запись на
          <b>{{ successTemplate.date }} {{ successTemplate.time }}</b> к мастеру
          <b>{{ successTemplate.master }}</b> успешно создана.
        </div>
      </template>
    </Modal>
    <Modal
      :visible="notifyHasVisits"
      :template="{
        header: 'На этот день есть записи!',
        rightButton: 'Понятно'
      }"
      content-class="modal-notification"
      @rightButtonClick="notifyHasVisits = false"
      @close="notifyHasVisits = false"
    >
      <template slot="text">
        <div class="modal-notification__content">
          Прежде чем изменить рабочее время, вам необходимо удалить или изменить
          время записи.
        </div>
      </template>
    </Modal>
    <BreakEdit
      v-if="selectedEmployee"
      :work-break="currentBreak"
      :start-time="currentBreak && currentBreak.ts_begin"
      :end-time="currentBreak && currentBreak.ts_end"
      :notes-prop="currentBreak && currentBreak.j.notes"
      :visible="showEditBreak"
      :employee-id="selectedEmployee.id"
      :employee-visits="
        visits.filter((v) => v.business_id === selectedEmployee.id)
      "
      @inputStart="currentBreak.ts_begin = $event"
      @inputEnd="onInputBreakEnd"
      @inputNotes="addNotesToBreak"
      @saved="fetchData"
      @close="onCloseBreakEdit"
    />
  </div>
</template>

<script>
import { setInterval, clearInterval } from 'timers'
import { Carousel, Slide } from 'vue-carousel'
import { mapState, mapActions, mapGetters } from 'vuex'
import Api from '~/api/backend'
import MainButton from '~/components/common/MainButton.vue'
import Accordion from '~/components/common/Accordion.vue'
import AppCheckbox from '~/components/common/AppCheckbox.vue'
import Avatar from '~/components/avatar/Avatar.vue'
import CalendarDayColumn from '~/components/calendar/CalendarDayColumn.vue'
import EmployeeCard from '~/components/employee/EmployeeCard.vue'
import BreakEdit from '~/components/calendar/BreakEdit.vue'
import Modal from '~/components/common/Modal'
import VisitEdit from '~/components/calendar/VisitEdit.vue'
import Spinner from '~/components/common/Spinner.vue'
import { makeAlert } from '~/api/utils'
import { employeesCategorized } from '~/mixins/employee'
import calendarMixin from '~/mixins/calendar'
import {
  ceilMinutes,
  dateISOInLocalTimeZone,
  formatDate,
  hyphenStrToDay,
  hyphensStringToDate,
  visitInit
} from '~/components/calendar/utils'

export default {
  components: {
    Accordion,
    AppCheckbox,
    Avatar,
    BreakEdit,
    EmployeeCard,
    MainButton,
    Modal,
    CalendarDayColumn,
    VisitEdit,
    Carousel,
    Slide,
    Spinner
  },
  mixins: [calendarMixin, employeesCategorized],
  data () {
    return {
      currentBreak: undefined,
      currentVisit: undefined,
      displayMode: 'day' /* day or week */,
      dow: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'],
      edit: false,
      editVisitPage: undefined,
      now: new Date(),
      selectedEmployee: {},
      visibleEmployees: [],
      notifyHasVisits: false,
      formActions: [
        { label: 'Создать запись', action: 'newVisit', default: true }
      ],
      showEditBreak: false,
      showDateMenu: [false, false, false, false, false, false, false],
      showDesktopMenu: false,
      showMobileMenu: false,
      showSuccessModal: false,
      successTemplate: {
        master: '',
        date: '',
        time: ''
      },
      timerId: null,
      irregularDays: []
    }
  },
  computed: {
    ...mapState({
      businessServices: state => state.business.businessServices,
      isLoadingEmployees: state => state.business.isLoadingEmployees
    }),
    ...mapGetters({
      businessInfo: 'business/businessInfo',
      businessSchedule: 'business/businessSchedule',
      selectedBreak: 'common/selectedBreak',
      selectedVisit: 'common/selectedVisit'
    }),
    groupedEmployees () {
      const obj = {}

      this.businessEmployees.forEach((emp) => {
        if (!emp.j || !emp.j.category) {
          return
        }
        const category = emp.j.category

        if (!obj[category]) {
          obj[category] = []
        }

        if (!obj[category].includes(emp)) {
          obj[category].push(emp)
        }
      })

      return obj
    },
    selectedDOW () {
      if (!this.selectedWeek) {
        return
      }
      return this.selectedWeek.findIndex(
        day => day.dateKey === this.selectedDate
      )
    },
    selectedDateObj () {
      return hyphenStrToDay(this.selectedDate)
    },
    displayTimes () {
      const selectedEmployeeSchedule = this.selectedEmployee.j.schedule.data
      let start =
        selectedEmployeeSchedule &&
        selectedEmployeeSchedule.find(day => !!day[0])[0]
      let end =
        selectedEmployeeSchedule &&
        selectedEmployeeSchedule.find(day => !!day[1])[1]

      if (this.displayMode === 'day') {
        this.businessEmployees.forEach((employee) => {
          const schedule = employee.j.schedule.data

          schedule.forEach((day) => {
            if (!day[0] || !day[1]) {
              return
            }
            if (day[0] < start) {
              start = day[0]
            }
            if (day[1] > end) {
              end = day[1]
            }
          })
        })
      } else {
        selectedEmployeeSchedule.forEach((day) => {
          if (!day[0] || !day[1]) {
            return
          }
          if (day[0] < start) {
            start = day[0]
          }
          if (day[1] > end) {
            end = day[1]
          }
        })
      }

      return { start, end }
    },
    todayString () {
      return formatDate(this.now)
    }
  },
  watch: {
    '$route.params': {
      handler: 'fetchData',
      deep: true
    },
    businessEmployees: 'initEmployee',
    businessServices: 'initEmployee',
    selectedBreak () {
      if (this.selectedBreak) {
        this.currentBreak = {
          ...this.selectedBreak,
          j: { ...this.selectedBreak.j }
        }
        this.showEditBreak = true
      } else {
        this.currentBreak = null
        this.showEditBreak = false
      }
    },
    selectedDate: 'setDates',
    selectedVisit () {
      if (this.selectedVisit) {
        this.currentVisit = this.selectedVisit
        this.edit = true
      }
    },
    selectedWeek: {
      handler: 'fetchData',
      deep: true
    },
    selectedEmployee: {
      handler: 'getIrregularDays',
      deep: true
    }
  },
  mounted () {
    this.initEmployee()
    // TODO проверить, не утекает ли память
    this.fetchData()
    this.setActions(this.formActions)
    this.$root.$on('onAction', this.onAction)
    this.timerId = setInterval(this.updateStatus, 60 * 1000)
  },
  beforeDestroy () {
    this.$root.$off('onAction', this.onAction)
    clearInterval(this.timerId)
  },
  methods: {
    ...mapActions({
      alert: 'alerts/alert',
      setActions: 'common/setActions',
      selectBreak: 'common/selectBreak',
      selectVisit: 'common/selectVisit'
    }),
    addNotesToBreak (payload) {
      this.currentBreak.j.notes = payload
    },
    changeVisibleEmployees (employee, selected) {
      if (this.displayMode === 'week') {
        if (selected) {
          this.selectedEmployee = employee
        }
        return
      }
      if (selected) {
        if (!this.visibleEmployees.some(e => e.id === employee.id)) {
          this.visibleEmployees.push(employee)
        }
      } else {
        const i = this.visibleEmployees.findIndex(e => e.id === employee.id)

        if (i > -1) {
          this.visibleEmployees.splice(i, 1)
        }
      }
    },
    changeWeek (vector) {
      const dt = new Date(this.selectedDate)

      dt.setDate(dt.getDate() + 7 * vector)
      this.goDate(formatDate(dt))
    },
    closeModal () {
      this.showSuccessModal = false
      this.successTemplate = {
        master: '',
        date: '',
        time: ''
      }
    },
    createBreak (date, employeeId) {
      const newBreak = visitInit({
        ts_begin: dateISOInLocalTimeZone(date),
        business_id: this.selectedEmployee.id,
        j: {
          type: 'break'
        }
      })

      if (employeeId) {
        newBreak.business_id = employeeId
        this.selectedEmployee = this.businessEmployees.find(
          e => e.id === employeeId
        )
      }

      this.selectBreak(newBreak)
    },
    createVisit (employeeId, date) {
      const visit = visitInit({
        ts_begin: dateISOInLocalTimeZone(ceilMinutes(new Date()))
      })

      if (date) {
        visit.ts_begin = date.toISOString()
      }
      if (employeeId) {
        visit.business_id = employeeId
        this.selectedEmployee = this.businessEmployees.find(
          e => e.id === employeeId
        )
      }

      this.selectVisit(visit)
    },
    getIrregularDays () {
      if (
        !this.selectedEmployee ||
        !this.selectedEmployee.id ||
        !this.selectedWeek
      ) {
        return
      }
      const sunday = this.selectedWeek[6]
      const nextMonday = new Date(sunday.date)

      nextMonday.setDate(sunday.date.getDate() + 1)
      Api()
        .get(
          `/business_calendar?business_id=eq.${
            this.selectedEmployee.id
          }&changed=eq.true&dt=gte.${
            this.selectedWeek[0].dateKey
          }&dt=lt.${formatDate(nextMonday)}`
        )
        .then(({ data }) => {
          this.irregularDays = data.map(x => ({
            date: x.dt,
            schedule: x.j.schedule,
            employeeId: x.business_id
          }))
        })
    },
    initEmployee () {
      if (
        !this.businessEmployees ||
        !this.businessEmployees.length ||
        !this.businessServices ||
        !this.businessServices.length
      ) {
        return
      }
      const serviceWithEmployee =
        this.businessServices &&
        this.businessServices.find(s => s.j.employees && s.j.employees.length)

      if (!serviceWithEmployee) {
        return
      }
      for (const id of serviceWithEmployee.j.employees) {
        const employee = this.businessEmployees.find(e => e.id === id)

        if (employee) {
          this.selectedEmployee = employee
          break
        }
      }

      this.businessEmployees.forEach((employee) => {
        if (!this.visibleEmployees.some(emp => emp.id === employee.id)) {
          this.visibleEmployees.push(employee)
          if (!this.selectedCategories.includes(employee.j.category)) {
            this.selectedCategories.push(employee.j.category)
          }
        }
      })
    },
    isDayOff (dateString, dayIndex) {
      const irregularDay = this.getIrregularDay(
        dateString,
        this.selectedEmployee
      )
      const employeeSchedule = irregularDay
        ? irregularDay.schedule
        : (this.selectedEmployee &&
            this.selectedEmployee.j &&
            this.selectedEmployee.j.schedule.data[dayIndex]) ||
          false

      if (!employeeSchedule || !employeeSchedule[0] || !employeeSchedule[1]) {
        return true
      }

      return this.isHoliday(dateString, this.selectedEmployee)
    },
    onAction () {
      this.createVisit()
    },
    onCloseBreakEdit () {
      this.showEditBreak = false
      setTimeout(() => {
        this.selectBreak(null)
      }, 300)
    },
    onDayEdit ({ day, isDayOff }) {
      if (
        !isDayOff &&
        this.dayVisits(day.dateKey, this.selectedEmployee).length
      ) {
        this.notifyHasVisits = true
        return
      }

      const isWorkingDay = day => day && day[0] && day[1]
      const averageDay = this.selectedEmployee.j.schedule
        ? this.selectedEmployee.j.schedule.data.find(isWorkingDay)
        : this.businessSchedule.data.find(isWorkingDay)

      Api()
        .patch(
          `/business_calendar?business_id=eq.${this.selectedEmployee.id}&dt=eq.${day.dateKey}`,
          {
            j: { schedule: isDayOff ? averageDay : [] }
          }
        )
        .then(() => {
          this.getIrregularDays()
        })
    },
    onGroupsChange (category, selected) {
      if (selected) {
        if (!this.selectedCategories.includes(category)) {
          this.selectedCategories.push(category)
        }
      } else {
        const i = this.selectedCategories.indexOf(category)

        if (i > -1) {
          this.selectedCategories.splice(i, 1)
        }
      }
      this.groupedEmployees[category].forEach(e =>
        this.changeVisibleEmployees(e, selected)
      )
    },
    onInputBreakEnd (payload) {
      const time = payload.substring(11, 16)
      const endOfWorkDay = this.displayTimes.end

      this.currentBreak.ts_end =
        time <= endOfWorkDay
          ? payload
          : `${payload.substring(0, 10)}T${endOfWorkDay}`
    },
    onVisitSave (payload) {
      // todo move saving into Visit class
      const master = this.businessEmployees.find(
        e => e.id === payload.business_id
      )

      this.editVisitPage = undefined
      this.successTemplate.date = hyphensStringToDate(
        payload.ts_begin.substring(0, 10)
      ).toLocaleString('ru-RU', {
        day: 'numeric',
        month: 'long',
        weekday: 'short'
      })
      this.successTemplate.time = payload.ts_begin.substring(11, 16)
      this.successTemplate.master = master
        ? master.j.name
        : this.selectedEmployee.j.name
      this.sendData(payload)
        .then(() => {
          this.edit = false
          this.selectVisit(null)
          this.showSuccessModal = true
        })
        .then(() => this.fetchData())
        .catch((err) => {
          this.alert(makeAlert(err))
          if (
            err.response &&
            err.response.data &&
            err.response.data.code === '23P01'
          ) {
            this.editVisitPage = 1
          }
        })
    },
    onDelete () {
      this.edit = false
      Api()
        .delete(`visit?id=eq.${this.currentVisit.id}`)
        .then(() => {
          this.currentVisit = null
          this.selectVisit(null)
          this.fetchData()
        })
        .catch((err) => {
          this.alert(makeAlert(err))
        })
    },
    selectNextEmployee () {
      const index = this.businessEmployees.findIndex(
        e => e.id === this.selectedEmployee.id
      )

      this.selectedEmployee =
        index < this.businessEmployees.length - 1
          ? this.businessEmployees[index + 1]
          : this.businessEmployees[0]
    },
    selectPrevEmployee () {
      const index = this.businessEmployees.findIndex(
        e => e.id === this.selectedEmployee.id
      )

      this.selectedEmployee =
        index === 0
          ? this.businessEmployees[this.businessEmployees.length - 1]
          : this.businessEmployees[index - 1]
    },
    sendData (data) {
      if (data && data.id) {
        return Api().patch(`visit?id=eq.${data.id}`, data)
      } else {
        return Api().post('visit', data)
      }
    },
    updateStatus () {
      this.now = new Date()
    }
  }
}
</script>

<style lang="scss">
@import '~/assets/styles/common.scss';
@import '~/assets/styles/day-schedule.scss';

%round-arrow-button {
  float: left;
  min-width: 0;
  width: 24px;
  height: 24px;
  margin: 0;
  border: 1px solid rgba(137, 149, 175, 0.1);
  border-radius: 50%;
  color: #8995af;

  i {
    font-size: 19px;
  }
}
.visit-log {
  background-color: #e7eaef;

  &__header {
    @media only screen and (min-width: $desktop) {
      position: sticky;
      top: 57px;
      z-index: 2;
    }
  }
  &__no-employees {
    padding: 12px;
    background-color: #fff;
    @media only screen and (min-width: $desktop) {
      padding: 12px 40px 12px 126px;
    }

    .button_attractive {
      background: url('~assets/images/svg/plus-white.svg') no-repeat center/16px
        #ef4d37;
      span {
        display: none;
      }
      @media only screen and (min-width: $desktop) {
        position: static;
        background-image: none;
        span {
          display: inline;
        }
      }
    }
  }
  &__info-item {
    font-size: 12px;
    &:before {
      width: 16px;
      height: 16px;
      display: inline-block;
      vertical-align: middle;
      margin-right: 4px;
      content: '';
      border-left: 2px solid #fff;
      background-color: #fff;
    }
    &._missed:before {
      border-color: #ef4d37;
    }
    &._cancelled:before {
      border-color: #8995af;
    }
    &._day-off:before {
      background-color: rgba(137, 149, 175, 0.1);
      border-color: transparent;
    }
    &._break:before {
      background: url('~assets/images/svg/cup.svg') left center no-repeat;
      border-color: transparent;
    }
  }
  &__controls {
    display: none;
    width: 126px;
    height: 80px;
    padding: 0 14px 0 55px;
    justify-content: space-between;
    align-items: center;
    background-color: #fff;
    border-right: 1px solid rgba(137, 149, 175, 0.1);
    @media only screen and (min-width: $desktop) {
      display: flex;
    }
  }
  &__controls-button {
    @extend %round-arrow-button;
    color: #8995af !important;
    &:hover {
      background-color: rgba(137, 149, 175, 0.1);
    }
  }
  &__week-spacer {
    width: 140px;
  }

  .v-progress-linear {
    position: sticky;
    top: 56px;
    z-index: 1;
    margin: 0;
    background: #fff;
  }
  .header {
    display: none;
    justify-content: space-between;
    background-color: #fff;
    border-bottom: 1px solid #f4f5f7;
    @media only screen and (min-width: $desktop) {
      display: flex;
      min-height: 55px;
      padding: 0 40px 0 127px;
    }

    &__info {
      display: flex;
      min-height: 58px;
      flex-grow: 1;
      align-items: center;
    }
  }

  .calendar-controls {
    background-color: #fff;
    border-bottom: 1px solid rgba(137, 149, 175, 0.2);
    &__left {
      flex-grow: 1;
      display: flex;
      align-items: center;
      @media only screen and (min-width: $desktop) {
        padding-left: 11px;
      }
    }
    &__right {
      flex-grow: 0;
    }
    &__container {
      height: 44px;
    }
    &__button {
      width: 55px;
      box-sizing: border-box;
      min-width: 0;
      margin: 0;
      @media only screen and (min-width: $desktop) {
        width: 24px;
        padding: 0;
        margin: 8px 5px;
      }

      i {
        @media only screen and (min-width: $desktop) {
          font-size: 19px;
        }
      }
    }
    &__heading {
      font-family: $roboto;
      font-size: 14px;
      color: #07101c;
      text-transform: capitalize;
      @media only screen and (min-width: $tablet) {
        padding-left: 5px;
        font-size: 18px;
      }
    }
    &__today {
      height: 24px;
      padding: 0 25px;
      line-height: 24px;
      border: 1px solid #5699ff;
      border-radius: 16px;
      color: #5699ff;
      text-decoration: none;
      outline: none;
      @media only screen and (min-width: $tablet) {
        margin-right: 16px;
        padding: 0 35px;
      }
      &[disabled='disabled'] {
        border-color: rgba(137, 149, 175, 0.2);
        color: rgba(137, 149, 175, 0.35);
        cursor: default;
      }
    }
    &__toggle {
      height: 24px;
      padding: 1px;
      background: rgba(137, 149, 175, 0.1);
      border-radius: 20px;
      input {
        display: none;
        &:checked + label {
          background: #5699ff;
          color: #fff;
        }
      }
      label {
        position: relative;
        display: inline-block;
        width: 120px;
        line-height: 22px;
        cursor: pointer;
        background: transparent;
        text-align: center;
        color: #8995af;
        border-radius: 20px;
        transition: color 0.4s, background-color 0.4s;
      }
    }
    &__days {
      padding: 0 10px;
      @media only screen and (min-width: $tablet) {
        padding: 0 35px;
      }
      @media only screen and (min-width: $desktop) {
        padding: 0;
      }
      &._desktop {
        display: none;
        @media only screen and (min-width: $desktop) {
          display: flex;
        }
      }
    }
    &__day {
      padding: 10px 8px;
      margin: 0 2px;
      @media only screen and (min-width: $desktop) {
        position: relative;
        width: 14.28%;
        padding: 14px 20px;
        margin: 0;
        &:after {
          position: absolute;
          right: 0;
          bottom: 0;
          content: '';
          background: rgba(137, 149, 175, 0.2);
          width: 1px;
          height: 34px;
        }
      }
      &.today {
        background-color: #5699ff;
        border-radius: 4px;
        @media only screen and (min-width: $desktop) {
          background-color: #fff;
          border-left: 2px solid #5699ff;
          border-radius: 0;
        }
        * {
          color: #fff;
          font-weight: 900;
          @media only screen and (min-width: $desktop) {
            color: #5699ff;
          }
        }
      }
      &.selected {
        background-color: rgba(137, 149, 175, 0.35);
        border-radius: 4px;
        * {
          color: #07101c;
          font-weight: 900;
        }
      }
      &.out {
        color: rgba(137, 149, 175, 0.35);
      }
      .v-menu__content {
        min-width: 100% !important;
        left: 0 !important;
        top: 100% !important;
      }
    }
    &__number {
      font-size: 18px;
      font-family: $roboto;
    }
    &__dow {
      margin-top: 9px;
      font-weight: 900;
      text-transform: capitalize;
      @media only screen and (min-width: $desktop) {
        font-weight: normal;
      }
    }
    &__dropdown {
      padding: 17px 0;
      background-color: #fff;
      box-shadow: 0 2px 8px rgba(137, 149, 175, 0.1);
      cursor: pointer;
      & > div {
        padding: 3px 9px;
        text-align: center;
        font-size: 13px;
        font-weight: normal !important;
        color: #07101c;
        &:hover {
          background: rgba(137, 149, 175, 0.2);
        }
      }
    }
  }

  .mobile {
    @media only screen and (min-width: $desktop) {
      display: none;
    }
  }
  .desktop {
    display: none;
    @media only screen and (min-width: $desktop) {
      display: block;
    }
  }

  .main-table {
    position: relative;
    @media only screen and (min-width: $desktop) {
      height: calc(100vh - 195px);
      overflow: auto;
    }
    &__desktop-menu {
      position: sticky;
      top: 0;
      z-index: 3;
      background-color: #fff;
      .employee-menu-trigger {
        height: 100%;
        margin-left: 66px;
      }
    }

    &__times {
      position: relative;
      margin-left: 58px;
      @media only screen and (min-width: $desktop) {
        display: flex;
        flex: 1 0 auto;
        margin-left: 125px;
      }
    }

    &__employees-switch {
      position: sticky;
      top: 0;
      z-index: 1;
      height: 80px;
      .visit-log__controls {
        padding: 0 30px 0 40px;
        border-left: 1px solid rgba(137, 149, 175, 0.1);
      }
    }

    &.week {
      .day-column {
        position: relative;
        &:first-child {
          z-index: 2;
          .day-column__employee {
            box-shadow: none;
          }
        }
      }
      .day-column__employee {
        border-right: none;
      }
    }
  }

  .day-column {
    &__header {
      display: none;
      @media only screen and (min-width: $desktop) {
        display: block;
      }
    }
    .time-mark {
      display: none;
    }

    &:first-child .time-mark {
      @media only screen and (min-width: $desktop) {
        display: block;
      }
    }
    &.selected .time-mark {
      @media only screen and (max-width: ($desktop - 1px)) {
        display: block;
      }
    }
  }

  .employees {
    position: sticky;
    width: 100%;
    top: 56px;
    display: flex;
    align-items: center;
    padding: 0 18px;
    z-index: 1;
    background-color: #fff;
    @media only screen and (min-width: $desktop) {
      display: none;
    }
  }
  .employee {
    display: none;
    margin: 12px 0;
    justify-content: flex-start;
    align-items: center;
    cursor: pointer;
    @media only screen and (min-width: $desktop) {
      display: flex;
      width: 40px;
      height: 40px;
      padding: 7px;
      justify-content: center;
      border-radius: 50%;
      &.selected {
        background-color: #5699ff;
        .v-avatar {
          border: 1px solid rgba(255, 255, 255, 0.35);
        }
      }
    }

    &__avatar {
      @media only screen and (min-width: $desktop) {
        width: 24px !important;
        height: 24px !important;
      }
    }
    &__badge {
      max-width: 184px;
      padding-left: 12px;
      @media only screen and (min-width: $desktop) {
        display: none;
      }
    }
    &__title {
      font-weight: 900;
      font-size: 16px;
      color: #07101c;
      text-transform: capitalize;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    &__subtitle {
      font-weight: normal;
      font-size: 12px;
      color: #8995af;
    }
    &.selected {
      display: flex;
    }
    &.disabled {
      opacity: 0.35;
      pointer-events: none;
    }
  }

  .employees-selection {
    position: absolute;
    width: 126px;
    height: 79px;
    background: #fff;
    border-right: 1px solid rgba(137, 149, 175, 0.1);
    border-bottom: 1px solid rgba(137, 149, 175, 0.1);
    box-shadow: 0 2px 8px rgba(137, 149, 175, 0.1);
    &__menu {
      width: 182px;
      background-color: #fff;
    }
    &__item {
      padding: 7px 8px 8px 16px;
      border-bottom: 1px solid rgba(137, 149, 175, 0.1);
      /* &:last-child {
          border: none;
        }*/
    }
    &__emp-name {
      margin-left: 8px;
    }
    .v-menu__content {
      overflow: hidden;
    }
    .v-expansion-panel__header {
      min-height: 32px;
      padding: 7px 8px 8px 16px;
      border-bottom: 1px solid rgba(137, 149, 175, 0.1);
      background-color: rgba(137, 149, 175, 0.1);
    }
    .v-expansion-panel__container {
      border: none;
    }
    .v-expansion-panel__container--active .v-expansion-panel__header {
      background-color: #fff;
    }
    .checkbox {
      display: inline-flex;
    }
  }
  .checkbox__label {
    height: 16px;
    margin: 0;
    padding: 0 7px;
    border-radius: 2px;
    border: 1px solid rgba(137, 149, 175, 0.2);
    background-color: #fff;
  }
  .checkbox__input:checked + .checkbox__label {
    background: url('~assets/images/svg/selection.svg') center/10px 8px
      no-repeat #5699ff;
  }
  .employee-menu-trigger {
    width: 24px;
    height: 24px;
    background: url('~assets/images/svg/dots.svg') center no-repeat;
    outline: none;
    margin-right: 36px;
  }
}

.modal-content {
  &__header {
    display: flex;
    align-items: center;
    padding: 53px 12px 12px 17px;
    background-color: #fff;
  }
  &__heading {
    font-family: Roboto Slab;
    font-weight: normal;
    font-size: 24px;
    color: #07101c;
  }
  &__body {
    padding: 28px 30px;
  }

  .controls__button {
    @extend %round-arrow-button;
    margin-right: 15px;
  }
  .accordion__header,
  .accordion__container {
    background-color: #fff;
  }
  .accordion._expanded .accordion__header {
    border-bottom-color: rgba(137, 149, 175, 0.1);
  }
  .accordion__container {
    padding-bottom: 15px;
  }
  .checkbox__label {
    margin-bottom: 10px;
  }
  .filter-results__group-name {
    padding-left: 25px;
  }
  .delete-button {
    display: none;
  }
}

.modal-notification {
  &__content {
    margin-top: 30px;
  }
  .uno-modal {
    background: url('~assets/images/svg/broken.svg') center 52px no-repeat #fff;
  }
  .uno-modal__header {
    margin-top: 78px;
  }
  .uno-modal__buttons {
    justify-content: center;
  }
  .uno-modal__left {
    display: none;
  }
}
</style>
