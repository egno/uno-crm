<template>
  <v-form>
    <div class="right-attached-panel__field-block">
      <VTextField
        ref="templateTitle"
        v-model="templateTitle"
        label="НАЗВАНИЕ ШАБЛОНА"
        :rules="isCreating? [
          rules.required,
          rules.uniqueTitle,
          rules.maxLength,
        ] : [
          rules.required,
          rules.onTitleEdited,
          rules.maxLength,
        ]"
        maxlength="50"
        class="businesscard-form__field"
        @update:error="onError"
      />
    </div>
    <div class="right-attached-panel__field-block dropdown-select">
      <VSelect
        v-model="templateType"
        :items="templateTypes"
        :item-text="(temp) => temp.name"
        label="ВИД"
        attach=".right-attached-panel__field-block.dropdown-select"
        :rules="[ rules.required ]"
      />
    </div>
    <div>
      <template v-if="templateType === 'week'">
        <div v-show="templateType" class="employees-schedule__warning">
          Заполните рабочее время сотрудника,
          или оставьте поля пустыми, если день
          является выходным
        </div>
        <div class="templates__times-inputs">
          <v-layout justify-space-between class="templates__heading">
            <span class="important-text">День недели</span> <span class="important-text">Время работы</span>
          </v-layout>
          <BusinessScheduleEdit
            :show-header="false"
            :show-tumbler="false"
            :week-schedule="weekTemplate"
            @editWeek="scheduleEdit"
          />
        </div>
      </template>
      <template v-else-if="templateType === 'shift'">
        <div class="employees-schedule__warning">
          Введите количество рабочих и&nbsp;выходных дней в шаблоне
        </div>
        <div class="templates__shift-days">
          <v-layout align-center justify-space-between class="templates__days">
            <div class="important-text">
              Рабочие дни
            </div>
            <v-text-field
              ref="templateWorkingDaysCount"
              v-model="templateWorkingDaysCount"
              mask="#" type="text"
              :rules="[ rules.minWorkDaysCount ]"
              placeholder="0"
              class="templates__input"
              @input="setShiftDays"
              @update:error="onError"
            />
          </v-layout>
          <v-layout align-center justify-space-between class="templates__days">
            <div class="important-text">
              Выходные
            </div>
            <v-text-field
              ref="templateDaysOffCount"
              v-model="templateDaysOffCount"
              mask="#" type="text"
              placeholder="0"
              class="templates__input"
              @input="setShiftDays"
              @update:error="onError"
            />
          </v-layout>
        </div>
        <div v-show="+templateWorkingDaysCount" class="templates__times-inputs">
          <v-layout justify-space-between class="templates__heading">
            <span class="important-text">День смены</span> <span class="important-text">Время работы</span>
          </v-layout>
          <div v-for="(day, index) in templateWorkingDays" :key="index" xs12 class="business-schedule">
            <div class="business-schedule__wrapper">
              <div class="business-schedule__dayname">
                {{ index | numberInWords }}
              </div>
              <div class="business-schedule__content">
                <DaySchedule
                  :day-schedule="day"
                  @editDay="onEditShiftDay(index, $event)"
                />
              </div>
            </div>
          </div>
          <!-- eslint-disable-next-line vue/no-unused-vars, vue/valid-v-for, vue/require-v-for-key -->
          <v-layout v-for="(dayOff, dayOffIndex) in templateDaysOff" justify-space-between align-center class="templates__days-off">
            <div class="important-text">
              {{ dayOffIndex + templateWorkingDays.length | numberInWords }}
            </div>
            <div class="templates__day-off">
              Выходной
            </div>
          </v-layout>
        </div>
      </template>
      <v-menu v-if="showStartDate">
        <template v-slot:activator="{ on }">
          <div class="right-attached-panel__field-block templates__date">
            <button type="button" v-on="on">
              <span class="important-text">Дата начала</span> {{ startDayFormatted(templateStartDate) }}
            </button>
          </div>
        </template>
        <v-date-picker
          v-model="templateStartDate"
          :allowed-dates="allowedDates"
          locale="ru-RU"
          no-title
          first-day-of-week="1"
        />
      </v-menu>
    </div>
    <div v-if="templateError" class="right-attached-panel__error">
      {{ templateError }}
    </div>
    <div class="right-attached-panel__buttons">
      <button
        type="button"
        class="right-attached-panel__save"
        :class="{ _disabled: isSaveDisabled }"
        @click="saveTemplateDebounced"
      >
        Сохранить
      </button>
      <button
        type="button"
        class="right-attached-panel__cancel"
        @click="$emit('cancel')"
      >
        Отмена
      </button>
    </div>
  </v-form>
</template>

<script>
import { cloneDeep, debounce } from 'lodash'
import { mapActions, mapGetters, mapState } from 'vuex'
import BusinessScheduleEdit from '~/components/business/BusinessScheduleEdit.vue'
import DaySchedule from '~/components/business/DaySchedule.vue'
import { hyphensStringToDate } from '~/components/calendar/utils'
import Business from '~/classes/business'

export default {
  name: 'TemplateEdit',
  components: { BusinessScheduleEdit, DaySchedule },
  filters: {
    numberInWords (n) {
      const indexes = [ 'Первый', 'Второй', 'Третий', 'Четвертый', 'Пятый', 'Шестой', 'Седьмой', 'Восьмой', 'Девятый', 'Десятый', 'Одиннадцатый', 'Двенадцатый', 'Тринадцатый', 'Четырнадцатый' ]
      return indexes[n]
    },
  },
  props: {
    template: {
      type: Object,
      default () {
        return {}
      },
    },
    showStartDate: {
      type: Boolean,
      default: false,
    },
  },
  data () {
    return {
      hasEmptyWorkingDays: true,
      isCreating: false,
      rules: {
        required: value => !!value || 'Обязательно для заполнения',
        minWorkDaysCount: value => (!value || (+value > 0)) || 'Введите не менее 1 рабочего дня',
        uniqueTitle: value => !this.businessInfo.scheduleTemplates.some(t => t.title === value) || 'Название шаблона должно быть уникально',
        onTitleEdited: value => (value === this.template.title || typeof this.rules.uniqueTitle(value) === 'boolean') || 'Название шаблона должно быть уникально',
        maxLength: value => (!!value && value.length <= 20) || 'Слишком длинное название',
      },
      shiftScheduleHasErrors: false,
      templateError: '',
      templateTitle: '',
      templateType: '',
      templateStartDate: '',
      templateDaysOff: [ { start: '', end: '' }, { start: '', end: '' } ],
      templateDaysOffCount: 2,
      templateWorkingDays: [ { start: '', end: '' }, { start: '', end: '' } ],
      templateWorkingDaysCount: 2,
      templateTypes: [
        { value: 'week', name: 'Недельный' },
        { value: 'shift', name: 'Сменный' },
      ],
      weekTemplate: { data: [] },
    }
  },
  computed: {
    ...mapGetters({
      actualDate: 'common/actualDate',
    }),
    ...mapState({
      businessInfo: state => state.business.businessInfo,
    }),
    isSaveDisabled () {
      return !this.templateTitle || !this.templateType || (this.templateType === 'shift' && this.shiftScheduleHasErrors) || this.hasEmptyWorkingDays || this.templateError
    },
  },
  created () {
    this.saveTemplateDebounced = debounce(this.saveTemplate, 300)
  },
  beforeMount () {
    const template = this.template
    this.templateTitle = template.title
    this.templateType = template.type
    this.templateStartDate = template.startDate || this.actualDate
    if (template.type === 'shift') {
      const workDaysCount = template.data.findIndex(d => !d.start)
      this.templateWorkingDays = template.data.slice(0, workDaysCount)
      this.templateWorkingDaysCount = this.templateWorkingDays.length
      this.templateDaysOff = template.data.slice(workDaysCount)
      this.templateDaysOffCount = this.templateDaysOff.length
    } else if (template.data) {
      this.weekTemplate = template
    }
    this.isCreating = !template.title
    this.calcEmptyWorkingDays()
  },
  methods: {
    ...mapActions({
      alert: 'alerts/alert',
      saveBusiness: 'business/saveBusiness',
    }),
    allowedDates (dateStr) {
      return dateStr > this.actualDate
    },
    calcEmptyWorkingDays () {
      this.hasEmptyWorkingDays = this.templateType === 'shift'
        ? this.templateWorkingDays.some(d => !d.start || !d.end)
        : !this.weekTemplate.data.some(d => d.start && d.end)
    },
    onEditShiftDay (dayIndex, { newDaySchedule, errors }) {
      if (!this.templateWorkingDays || !this.templateWorkingDays.length) {
        return
      }
      this.$set(this.templateWorkingDays, dayIndex, newDaySchedule)
      this.shiftScheduleHasErrors = !!errors.length
      this.calcEmptyWorkingDays()
    },
    onError () {
      const titleError = !this.templateTitle ? 'Введите название шаблона' : this.rules.uniqueTitle(this.templateTitle)
      if (typeof titleError === 'string') {
        this.templateError = titleError
        return
      }

      this.templateError = this.$refs.templateWorkingDaysCount && this.$refs.templateWorkingDaysCount.errorBucket.length
        ? this.$refs.templateWorkingDaysCount.errorBucket[0]
        : this.$refs.templateDaysOffCount && this.$refs.templateDaysOffCount.errorBucket[0]
    },
    saveTemplate () {
      const newTemplate = {
        title: this.templateTitle,
        type: this.templateType,
        data: this.templateType === 'shift' ? this.templateWorkingDays.concat(this.templateDaysOff) : this.weekTemplate.data,
      }

      const newBusiness = new Business(cloneDeep(this.businessInfo))

      if (newBusiness.scheduleTemplates) {
        const index = newBusiness.scheduleTemplates.findIndex(t => t.title === newTemplate.title)
        if (index > -1) {
          newBusiness.scheduleTemplates.splice(index, 1, newTemplate)
        } else {
          newBusiness.scheduleTemplates.push(newTemplate)
        }
      } else {
        newBusiness.scheduleTemplates = [ newTemplate ]
      }
      this.saveBusiness(newBusiness)
        .then(() => {
          this.$emit('saved', { ...newTemplate, startDate: this.templateStartDate })
        })
    },
    scheduleEdit (newWeek) {
      this.weekTemplate = newWeek
      this.calcEmptyWorkingDays()
    },
    setShiftDays () {
      let newLength = +this.templateWorkingDaysCount
      const length = this.templateWorkingDays.length

      if (+this.templateDaysOffCount > 7) {
        this.templateDaysOffCount = '7'
      }
      this.templateDaysOff = new Array(+this.templateDaysOffCount).fill({ start: '', end: '' })

      if (!newLength) {
        return
      }
      if (newLength > 7) {
        this.templateWorkingDaysCount = '7'
        newLength = 7
      }
      if (newLength < length) {
        this.templateWorkingDays = this.templateWorkingDays.slice(0, newLength)
      } else {
        const arr = new Array(newLength - length).fill({ start: '', end: '' })
        this.templateWorkingDays = this.templateWorkingDays.concat(arr)
      }
      this.calcEmptyWorkingDays()
    },
    startDayFormatted (startDate) {
      if (!startDate) { return '' }
      const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'short',
      }
      return hyphensStringToDate(startDate).toLocaleString(
        'ru',
        options
      )
    },
  },
}
</script>

<style scoped>

</style>
