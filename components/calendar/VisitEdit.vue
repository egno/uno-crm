<template>
  <VDialog
    :value="visible"
    content-class="right-attached-panel businesscard-form visit-edit"
    transition="slide"
    light
    @input="$emit('close')"
  >
    <VForm ref="visitEditForm" class="right-attached-panel__container">
      <button
        type="button"
        class="right-attached-panel__close"
        @click="$emit('close')"
      />
      <div class="right-attached-panel__header">
        {{ visit.id ? 'Изменить запись' : 'Создать запись' }}
      </div>
      <template v-if="!visit.id || !visit.j.client.phone">
        <input
          id="express"
          v-model="expressRecord"
          type="checkbox"
          value="express"
          class="filters__item right-attached-panel__sex"
        >
        <label
          for="express"
          class="right-attached-panel__checkbox-label"
        >Экспресс-запись</label>
      </template>
      <div class="right-attached-panel__field-block">
        <!--todo filter employees by selected service if any -->
        <VSelect
          v-model="selectedEmployee"
          :items="employees"
          :item-text="(e) => e.j.name"
          return-object
          label="имя и фамилия мастера"
        />
      </div>
      <div class="right-attached-panel__field-block _service">
        <VSelect
          v-model="selectedServices"
          :items="
            selectedEmployee
              ? businessServices.filter(
                (s) =>
                  s.j.employees && s.j.employees.includes(selectedEmployee.id)
              )
              : businessServices
          "
          :item-text="
            (service) =>
              service.name.length > 30
                ? service.name.substring(0, 30) + '...'
                : service.name
          "
          :required="true"
          return-object
          multiple
          chips
          deletable-chips
          label="ВЫБЕРИТЕ УСЛУГУ"
          attach=".right-attached-panel__field-block._service"
          light
        />
      </div>
      <div class="right-attached-panel__field-block">
        <div class="right-attached-panel__field-name">
          Дата и время начала визита
        </div>
        <VLayout row justify-space-between>
          <v-menu>
            <template v-slot:activator="{ on }">
              <button type="button" v-on="on">
                {{ selectedDayFormatted }}
              </button>
            </template>
            <v-date-picker
              v-model="selectedDate"
              :allowed-dates="allowedDates"
              locale="ru-RU"
              no-title
              first-day-of-week="1"
              @change="selectedTime = ''"
            />
          </v-menu>
          <div v-if="selectedTime" class="visit-edit__time">
            <div>{{ selectedTime }}</div>
            <button
              type="button"
              class="visit-edit__clear"
              @click="
                selectedTime = ''
                message = ''
                loadFreeTimes()
              "
            />
          </div>
        </VLayout>
      </div>
      <div v-if="!selectedTime" class="visit-edit__time-selection">
        <TimeSelect
          :selected-time="selectedTime"
          :times="freeTimes"
          @selectedTime="selectedTime = $event"
        />
      </div>

      <div v-if="message" class="error-message error--text">
        {{ message }}
      </div>
      <div
        v-if="!expressRecord"
        class="right-attached-panel__field-block _client-name dropdown-select"
      >
        <!-- todo use SearchSelect as in ClientCardEdit -->
        <v-combobox
          v-if="visit.j"
          ref="clientFullName"
          :value="name"
          :items="suggestedClients"
          :item-text="clientDisplay"
          label="ИМЯ И ФАМИЛИЯ"
          return-object
          required
          attach=".visit-edit ._client-name"
          light
          @update:searchInput="nameInput = onInputName(companyId, $event)"
          @blur="selectClient(nameInput)"
          @input="selectClient('name', $event)"
        >
          <template v-slot:selection="{ item, parent, selected }">
            {{ item }}
          </template>
          <template v-slot:item="{ index, item }">
            <div>
              {{ item.j.name.fullname }}
            </div>
            <div class="phone-number">
              {{
                normalizedPhone(item.j.phone ? item.j.phone : item.j.phones[0])
                  | phoneFormat
              }}
            </div>
          </template>
        </v-combobox>
      </div>
      <div
        v-if="!expressRecord"
        class="right-attached-panel__field-block _client-phone dropdown-select"
      >
        <PhoneEdit
          v-if="visit.j"
          :phone="phone"
          :removable="false"
          label="Телефон"
          placeholder=""
          @onEdit="onInputPhone"
          @blur="suggestedClientsByPhone = []"
        />
        <div
          v-if="suggestedClientsByPhone.length"
          class="custom-select__dropdown"
        >
          <div
            v-for="(client, clientIndex) in suggestedClientsByPhone"
            :key="clientIndex"
            class="custom-select__item"
            @mousedown="
              selectClient('phone', client)
              suggestedClientsByPhone = []
            "
          >
            <div>
              {{ client.j.name.fullname }}
            </div>
            <div class="phone-number">
              {{
                normalizedPhone(
                  client.j.phone ? client.j.phone : client.j.phones[0]
                ) | phoneFormat
              }}
            </div>
          </div>
        </div>
      </div>
      <div v-if="visit.id" class="right-attached-panel__field-block _reminder">
        <v-switch
          v-if="visit.isFuture"
          v-model="status"
          label="Клиент подтвердил запись"
          color="#5BCD5E"
          value="confirmed"
        />
        <v-switch
          v-if="!visit.isFuture"
          v-model="status"
          label="Клиент не пришел"
          color="#EF4D37"
          value="unvisited"
        />
        <v-switch
          v-if="visit.isFuture"
          v-model="status"
          label="Клиент отменил запись"
          color="#8995AF"
          value="canceled"
        />
      </div>
      <div
        v-if="!expressRecord"
        class="right-attached-panel__field-block _reminder"
      >
        <VSelect
          v-model="remind"
          :items="reminders"
          label="напоминание"
          attach=".right-attached-panel__field-block._reminder"
        />
      </div>
      <div class="right-attached-panel__field-block">
        <v-textarea
          v-model="notes"
          label="Комментарий"
          maxlength="500"
          counter="500"
          auto-grow
          rows="1"
        />
      </div>
      <div class="right-attached-panel__field-block">
        <div class="right-attached-panel__field-name">
          Цветовое выделение
        </div>
        <div class="visit-edit__colors">
          <div
            v-for="col in colors"
            :key="col"
            class="visit-edit__color-block"
          >
            <input
              :id="col"
              v-model="color"
              type="radio"
              :value="`#${col}`"
            >
            <label :for="col" class="visit-edit__color-label">
              <div :style="{ background: `#${col}` }" />
            </label>
          </div>
        </div>
      </div>
      <div class="right-attached-panel__buttons">
        <button
          type="button"
          class="right-attached-panel__save"
          :class="{ _disabled: saveDisabled }"
          @click="onSave"
        >
          Сохранить
        </button>
        <button
          type="button"
          class="right-attached-panel__cancel"
          @click="$emit('close')"
        >
          Отмена
        </button>
        <button
          v-if="
            status === 'canceled' ||
              status === 'unvisited' ||
              visit.displayStatus === 'Завершен'
          "
          type="button"
          class="right-attached-panel__delete"
          @click="$emit('delete')"
        >
          Удалить запись
        </button>
      </div>
    </VForm>
  </VDialog>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'
import { isEqual, debounce, cloneDeep } from 'lodash'
import TimeSelect from '~/components/calendar/TimeSelect.vue'
import {
  dateFromISO,
  formatDate,
  formatTime,
  visitInit,
  hyphensStringToDate
} from '~/components/calendar/utils'
import Api from '~/api/backend'
import { makeAlert } from '~/api/utils'
import clientMixin from '~/mixins/client'
import Visit from '~/classes/visit'

import PhoneEdit from '~/components/common/PhoneEdit.vue'

export default {
  components: { PhoneEdit, TimeSelect },
  mixins: [clientMixin],
  model: {
    prop: 'visible',
    event: 'close'
  },
  props: {
    companyId: { type: String, default: '' },
    id: { type: String, default: '' },
    visible: {
      type: Boolean,
      default: false,
      required: true
    },
    visit: {
      type: Object,
      default () {
        return visitInit()
      }
    },
    page: { type: Number, default: null },
    employees: {
      type: Array,
      default () {
        return []
      }
    },
    employee: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      active: 0,
      color: '',
      colors: [
        'DFC497',
        'F3AA57',
        '85CA86',
        '49C9B7',
        '5A96DF',
        'F36B6B',
        'F37F6B',
        'DF8CB2',
        'B88AB2',
        '8589DF'
      ],
      error: '',
      expressRecord: false,
      freeTimes: [],
      message: '',
      name: '',
      notes: '',
      phone: '',
      remind: 0,
      reminders: [
        {
          value: 60,
          text: 'За час'
        },
        {
          value: 180,
          text: 'За 3 часа'
        },
        {
          value: 360,
          text: 'За 6 часов'
        },
        {
          value: 720,
          text: 'За 12 часов'
        },
        {
          value: 1440,
          text: 'За сутки'
        },
        {
          value: null,
          text: 'Не напоминать'
        }
      ],
      selectedDate: null,
      selectedEmployee: null,
      selectedServices: [],
      selectedTime: null,
      status: '',
      suggestedClientsByPhone: [],
      lastFreeTimesRequest: {}
    }
  },
  computed: {
    ...mapState({
      businessServices: state => state.business.businessServices
    }),
    ...mapGetters({
      businessId: 'business/businessId',
      businessServiceCategories: 'business/businessServiceCategories'
    }),
    duration () {
      const reducer = (accumulator, currentService) =>
        accumulator + currentService.j.duration

      return this.selectedServices.reduce(reducer, 0)
    },
    selectedDayFormatted () {
      if (!this.selectedDate) { return '' }
      const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'short'
      }
      return hyphensStringToDate(this.selectedDate).toLocaleString(
        'ru',
        options
      )
    },
    hasPhone () {
      if (!this.phone) {
        return 0
      }
      return this.phone.length >= 10
    },
    saveDisabled () {
      return (
        this.message ||
        (!this.expressRecord && !this.name) ||
        (!this.expressRecord && !this.hasPhone) ||
        !(
          this.visit.j.client &&
          this.selectedServices &&
          this.selectedServices.length &&
          this.selectedDate &&
          this.selectedTime
        )
      )
    },
    todayString () {
      return formatDate(new Date())
    }
  },
  watch: {
    visit: 'setSelectedValues',
    page: 'setPage',
    employee () {
      if (this.employee.j.services && this.employee.j.services.length) {
        this.selectedEmployee = this.employee
        this.loadFreeTimes()
      }
    },
    selectedDate: 'loadFreeTimes',
    'selectedServices.length': 'loadFreeTimes',
    selectedEmployee: 'loadFreeTimes'
  },
  created () {
    this.debouncedGetClientsByPhone = debounce(this.getClientsByPhone, 350)
  },
  mounted () {
    this.setSelectedValues()
  },
  methods: {
    ...mapActions({ alert: 'alerts/alert' }),
    allowedDates (dateStr) {
      return dateStr >= this.todayString
    },
    getClientsByPhone (newPhone) {
      Api()
        .get(
          `/client_phone?company_id=eq.${this.companyId}&phone=ilike.*7${newPhone}*&limit=10`
        )
        .then(({ data }) => {
          this.suggestedClientsByPhone = data
        })
        .catch(e => console.log(e))
    },
    loadFreeTimes () {
      if (!(this.businessId && this.selectedDate)) { return }

      const params = {
        dt: `${this.selectedDate}${
          this.selectedTime ? 'T' + this.selectedTime + ':00' : ''
        }`,
        business_id: this.businessId
      }

      if (this.selectedEmployee) {
        params.employee_id = this.selectedEmployee.id
      }
      if (this.selectedServices.length) {
        params.duration = this.duration
      }
      if (isEqual(this.lastFreeTimesRequest, params)) {
        return
      }
      this.lastFreeTimesRequest = params
      this.message = ''
      this.loadingTimes = true
      Api()
        .post('rpc/free_times', params)
        .then(({ data }) => {
          this.freeTimes = data
          if (!this.freeTimes.length) {
            this.message =
              'На эту дату или время записаться нельзя. Выберите другую дату или время'

            if (this.selectedServices.length > 1) {
              this.message += ', или уменьшите количество услуг'
            }
          }
        })
        .catch((err) => {
          this.alert(makeAlert(err))
        })
        .finally(() => {
          this.loadingTimes = false
        })
    },
    normalizedPhone (phone) {
      return phone.length === 10 ? `7${phone}` : phone
    },
    onInputPhone (val) {
      this.phone = val

      if (!val || val.length < 3 || val.length === 10) {
        this.suggestedClientsByPhone = []
        return
      }
      this.debouncedGetClientsByPhone(val)
    },
    onSave () {
      const duration = this.duration
      const startTime = `${this.selectedDate}T${this.selectedTime}:00`
      const ts1 = dateFromISO(startTime)
      const ts2 = new Date()
      const newVisit = new Visit(cloneDeep(this.visit))

      ts2.setTime(ts1.getTime() + 60000 * duration)
      newVisit.business_id = this.selectedEmployee
        ? this.selectedEmployee.id
        : this.businessId
      newVisit.j.duration = duration
      newVisit.j.client.name = this.expressRecord ? null : this.name.trim()
      newVisit.j.client.phone = this.expressRecord ? null : this.phone.trim()
      newVisit.ts_begin = startTime
      newVisit.ts_end = `${formatDate(ts2)}T${formatTime(ts2)}`
      newVisit.j.services = this.selectedServices
      newVisit.j.color = this.color
        ? this.color
        : '#' + this.colors[Math.floor(Math.random() * this.colors.length)]
      if (this.status) {
        newVisit.status = this.status
      }
      if (this.remind) {
        newVisit.j.remind = this.remind
      }
      newVisit.j.notes = this.notes

      this.$emit('onSave', newVisit)
    },
    selectClient (field, value) {
      if (value && typeof value === 'object') {
        const { j } = value

        this.name = j.name.fullname
        this.phone = j.phone ? j.phone.substr(-10) : j.phones[0].substr(-10)
      } else {
        this[field] = value
      }
    },
    setPage () {
      if (this.page !== undefined) {
        this.active = this.page
        this.message =
          'На эту дату или время записаться нельзя. Выберите другую дату или время'
        if (this.selectedServices.length > 1) {
          this.message += ', или уменьшите количество услуг'
        }
      }
    },
    setSelectedValues () {
      this.$refs.visitEditForm.resetValidation()
      if (this.visit.ts_begin) {
        const ts1 = new Date(this.visit.ts_begin)
        this.selectedDate = formatDate(ts1)
        this.selectedTime = formatTime(ts1)
      } else {
        this.selectedDate = ''
        this.selectedTime = ''
      }
      this.active = 0
      if (this.visit.services && this.visit.services.length) {
        const visitServices = this.visit.services.map(s => s.id)

        this.selectedServices = this.businessServices.filter(s =>
          visitServices.includes(s.id)
        )
      } else {
        this.selectedServices = []
      }

      if (this.visit.j && this.visit.j.master) {
        this.selectedEmployee = this.employees.find(
          e => e.id === this.visit.j.master.id
        )
      } else if (this.employee.j.services && this.employee.j.services.length) {
        this.selectedEmployee = this.employee
      }
      if (this.visit.clientName) {
        this.name = this.visit.clientName
      } else {
        this.name = ''
      }
      if (this.visit.clientPhone) {
        this.phone = this.visit.clientPhone
      } else {
        this.phone = ''
      }
      if (this.visit.id && !this.visit.clientPhone) {
        this.expressRecord = true
      }
      if (this.visit.status) {
        this.status = this.visit.status
      }
      if (this.visit.j) {
        if (this.visit.j.remind) {
          this.remind = this.visit.j.remind
        }
        if (this.visit.j.color) {
          this.color = this.visit.j.color
        }
        if (this.visit.j.notes) {
          this.notes = this.visit.j.notes
        }
      }
      this.loadFreeTimes()
    }
  }
}
</script>

<style lang="scss">
@import '~assets/styles/right-attached-panel.scss';
@import '~assets/styles/dropdown-select.scss';

.visit-edit.right-attached-panel {
  ._service,
  ._client-name,
  ._reminder {
    position: relative;
  }

  input[type='radio'] {
    display: none;
    &:checked + label {
      background-color: rgba(137, 149, 175, 0.2);
    }
  }
  .visit-edit__colors {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    padding: 0 10px;
    margin-top: 20px;
  }
  .visit-edit__color-label {
    display: inline-block;
    width: 32px;
    height: 32px;
    margin: 0 6px;
    border-radius: 50%;
    padding: 4px;
    cursor: pointer;
    & > div {
      height: 24px;
      border-radius: 50%;
    }
  }
  .visit-edit__time-selection {
    margin-top: 30px;
  }
  .visit-edit__time {
    display: flex;
    margin-left: 10px;
  }
  .visit-edit__clear {
    width: 16px;
    height: 16px;
    margin-left: 7px;
    cursor: pointer;
    background: url('~assets/images/svg/cross.svg') center no-repeat;
  }
  .right-attached-panel__buttons {
    margin-top: 50px;
  }
  .right-attached-panel__checkbox-label {
    margin: 28px auto 20px;
    padding: 0 50px;
    height: 24px;
    line-height: 24px;
  }
  .error-message {
    margin-top: 10px;
  }
  .dropdown-select {
    .v-menu__content {
      top: 100% !important;
    }
    .v-list__tile {
      display: block;
      padding: 5px 16px 5px 37px;
      text-align: left;
      text-transform: capitalize;
      color: #8995af;
      font-size: 14px;
      &:hover {
        background-color: rgba(137, 149, 175, 0.2);
      }
      .phone-number {
        font-weight: normal;
        font-size: 12px;
      }
    }
  }
  .custom-select {
    position: relative;

    &__dropdown {
      position: absolute;
      top: 100%;
      left: 0;
      width: 100%;
      max-height: 220px;
      overflow-y: auto;
      background: #fff;
      z-index: 1000000;
    }
    &__item {
      cursor: pointer;
      padding: 6px 0 5px 32px;
      text-align: left;
      background: rgba(137, 149, 175, 0.1);
      color: #8995af;
      font-family: $lato;
      font-style: normal;
      font-weight: normal;
      font-size: 14px;
      line-height: normal;
      transition: background-color 0.4s 0s;
      &:hover {
        background: rgba(137, 149, 175, 0.2);
      }
    }
  }
}
</style>
