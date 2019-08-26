<template>
  <v-dialog
    :value="visible"
    content-class="create-break"
    max-width="440px"
    @input="close"
  >
    <VForm v-if="workBreak" class="create-break__content uno-modal">
      <button type="button" class="uno-modal__close" @click="close" />
      <div class="create-break__header">
        {{ workBreak.id ? 'Изменить перерыв' : 'Добавить перерыв' }}
      </div>
      <div class="create-break__subheader">
        Дата и время
      </div>
      <VLayout justify-space-between class="create-break__date-time">
        <div>{{ selectedDateFormatted }}</div>
        <VLayout row align-center class="create-break__right">
          <div class="create-break__times day-schedule__times">
            <div>{{ start }}</div>
            <div style="margin: 0 5px">
              —
            </div>
            <div :style="!end && { color: 'rgba(137, 149, 175, 0.35)' }">
              {{ end ? end : '00:00' }}
            </div>
          </div>
        </VLayout>
      </VLayout>
      <div class="create-break__subheader">
        Длительность (мин)
      </div>
      <Counter
        id="create-break-duration"
        :input-disabled="true"
        :round-counter="true"
        :value="duration"
        :min-value="15"
        :max-value="720"
        :interval="15"
        :class="{ _invalid: duration < 15 || duration > 720 }"
        @changeCount="duration = $event"
      />

      <div :class="['create-break__error', { _visible: error }]">
        <span class="error--text">{{ error }}</span>
      </div>
      <VLayout justify-center class="create-break__notes">
        <v-textarea
          v-model="notes"
          label="КОММЕНТАРИЙ"
          maxlength="500"
          auto-grow
          rows="1"
        />
      </VLayout>
      <div class="uno-modal__buttons">
        <button
          :disabled="disabled"
          type="button"
          class="uno-modal__right"
          @click="saveBreak"
        >
          Сохранить
        </button>
        <DeleteButton
          v-if="workBreak.id"
          :is-dark="true"
          @delete="deleteBreak"
        />
      </div>
    </VForm>
  </v-dialog>
</template>

<script>
import { mapActions } from 'vuex'
import Api from '~/api/backend'
import { makeAlert } from '~/api/utils'
import {
  dateISOInLocalTimeZone,
  dateFromISO,
} from '~/components/calendar/utils'
import Counter from '~/components/common/Counter'
import DeleteButton from '~/components/common/DeleteButton'

export default {
  components: { Counter, DeleteButton },
  model: {
    prop: 'visible',
    event: 'close',
  },
  props: {
    workBreak: {
      type: Object,
      default () {
        return {}
      },
    },
    employeeId: {
      type: String,
      default: '',
    },
    employeeVisits: {
      type: Array,
      default () {
        return []
      },
    },
    startTime: {
      type: String,
      default: '',
    },
    endTime: {
      type: String,
      default: '',
    },
    notesProp: {
      type: String,
      default: '',
    },
    visible: {
      type: Boolean,
      default: false,
      required: true,
    },
  },
  data () {
    return {
      error: '',
    }
  },
  computed: {
    date () {
      return this.workBreak && this.workBreak.ts_begin
        ? dateFromISO(this.workBreak.ts_begin)
        : new Date()
    },
    dateString () {
      return this.workBreak.ts_begin
        ? this.workBreak.ts_begin.substring(0, 10)
        : ''
    },
    disabled () {
      return !this.start || !this.end || !!this.error
    },
    duration: {
      set (newVal) {
        this.$emit('inputEnd', dateISOInLocalTimeZone(this.addMinutes(newVal)))

        this.$nextTick(() => {
          this.validate()
        })
      },
      get () {
        if (
          !(this.workBreak && this.workBreak.ts_begin && this.workBreak.ts_end)
        ) {
          return 0
        }
        return (
          (dateFromISO(this.workBreak.ts_end).getTime() -
            dateFromISO(this.workBreak.ts_begin).getTime()) /
          (1000 * 60)
        )
      },
    },
    selectedDateFormatted () {
      const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'short',
      }
      return this.date.toLocaleString('ru', options)
    },
    start: {
      set (newVal) {
        this.$emit(
          'inputStart',
          newVal ? `${this.dateString}T${newVal}:00` : `${this.dateString}T`
        )
      },
      get () {
        return this.workBreak && this.workBreak.ts_begin
          ? this.startTime.substring(11, 16)
          : ''
      },
    },
    end: {
      set (newVal) {
        this.$emit(
          'inputEnd',
          newVal ? `${this.dateString}T${newVal}:00` : `${this.dateString}T`
        )
      },
      get () {
        return this.workBreak && this.workBreak.ts_end
          ? this.endTime.substring(11, 16)
          : ''
      },
    },
    notes: {
      set (newVal) {
        this.$emit('inputNotes', newVal)
      },
      get () {
        const n = this.workBreak && this.workBreak.j ? this.notesProp : ''
        return n
      },
    },
    dayVisits () {
      return this.employeeVisits.filter(v =>
        v.ts_begin.includes(this.dateString)
      )
    },
  },
  methods: {
    ...mapActions({ alert: 'alerts/alert' }),
    addMinutes (minutes) {
      return new Date(this.date.getTime() + minutes * 60000)
    },
    close () {
      this.error = ''
      this.$emit('close')
    },
    validate () {
      const endTime = this.endTime
      const existingVisit = this.dayVisits.find(
        v =>
          v.id !== this.workBreak.id &&
          ((endTime > v.ts_begin && endTime <= v.ts_end) ||
            (this.startTime < v.ts_begin && endTime > v.ts_end))
      )

      this.error = ''
      if (!existingVisit) {
        return
      }
      if (!existingVisit.j.type) {
        this.error = 'На это время уже запланирован визит'
      } else {
        this.error = 'На это время уже запланирован перерыв'
      }
    },
    send () {
      return this.workBreak.id
        ? Api().patch(`visit?id=eq.${this.workBreak.id}`, this.workBreak)
        : Api().post('visit', this.workBreak)
    },
    saveBreak () {
      // todo проверить случай, когда диапазон выходит за пределы рабочего времени
      // todo проверять не перекрывает ли диапазон имеющиеся визиты
      this.send()
        .then(() => {
          this.$emit('saved')
          this.close()
        })
        .catch((err) => {
          console.log(err)
          this.alert(makeAlert(err))
        })
    },
    deleteBreak () {
      Api()
        .delete(`visit?id=eq.${this.workBreak.id}`)
        .then(() => {
          this.$emit('saved')
          this.close()
        })
        .catch((err) => {
          this.alert(makeAlert(err))
        })
    },
  },
}
</script>

<style lang="scss">
@import '~assets/styles/common.scss';
@import '~assets/styles/day-schedule.scss';

.create-break {
  color: #07101c;

  &__header {
    margin-top: 78px;
    margin-bottom: 10px;
    font-family: $roboto;
    font-style: normal;
    font-weight: normal;
    font-size: 18px;
    line-height: 24px;
    text-align: center;
  }
  &__subheader {
    margin-top: 25px;
    margin-bottom: 16px;
    font-size: 16px;
    font-weight: 900;
    text-align: center;
  }
  &__content {
    display: flex;
    flex-direction: column;
    justify-content: center;
    background: url('~assets/images/svg/cup-gold.svg') center 52px no-repeat
      #fff;
  }
  &__date-time {
    margin-top: 10px;
    padding: 0 30px;
  }
  &__right {
    flex-grow: 0;
  }
  &__clear {
    width: 10px;
    height: 10px;
    margin-left: 7px;
    cursor: pointer;
    background: url('~assets/images/svg/cross.svg') center no-repeat;
  }
  &__error {
    min-height: 17px;
    margin: 20px 0 0;
    .error--text {
      color: transparent;
    }
    &._visible {
      .error--text {
        color: #ef4d37;
      }
    }
  }
  &__notes {
    margin-top: 20px;
  }
  .v-label {
    max-width: 100%;
    letter-spacing: 0.25em;
    text-align: center;
    font-size: 12px;
  }
  .counter {
    width: 125px;
    margin: 0 auto;
    &._invalid input {
      color: #ef4d37;
    }
  }
  .uno-modal__buttons {
    justify-content: center;
  }
  .uno-modal__right[disabled='disabled'] {
    @extend %button-disabled;
  }
  .delete-button {
    min-width: 56px;
    margin-left: 12px;
    padding: 0;
  }
}
</style>
