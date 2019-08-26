<template>
  <v-dialog
    :value="visible"
    content-class="right-attached-panel businesscard-form _clients"
    transition="slide"
    light
    @input="$emit('close')"
  >
    <v-layout
      v-if="client"
      column
      align-space-around
      justify-start
      class="right-attached-panel__container"
    >
      <button
        type="button"
        class="right-attached-panel__close"
        @click="$emit('close')"
      />
      <div class="right-attached-panel__header">
        {{ create ? 'Добавить клиента' : 'Информация о клиенте' }}
      </div>
      <div class="businesscard-form__field _select dropdown-select">
        <SearchSelect
          :searching-value="client.fullName"
          searching-prop="j.name.fullname"
          :options="suggestedClients"
          :required="true"
          :max-length="50"
          label="ИМЯ И ФАМИЛИЯ"
          attach="._clients .businesscard-form__field._select"
          @input="onInputName(companyId, $event)"
          @blur="selectClient(client.fullName)"
          @select="selectClient"
        >
          <template v-slot:default="slotProps">
            <div>
              {{ slotProps.option.j.name.fullname }}
            </div>
            <div class="phone-number">
              {{ slotProps.option.j.phone ? slotProps.option.j.phone : slotProps.option.j.phones[0] | phoneFormat }}
            </div>
          </template>
        </SearchSelect>
      </div>
      <div>
        <div v-for="(phone, i) in client.phones" :key="i" class="phone-input">
          <PhoneEdit
            :phone="phone"
            :removable="i !== 0"
            :label="i === 0 ? 'Телефон*' : 'Телефон'"
            :error="
              client.phones.filter((p) => p.substr(-10) === phone.substr(-10))
                .length > 1
            "
            placeholder=""
            :class="{ 'no-default': !client.phone && filledPhones.length > 1 }"
            @onEdit="
              client.phones[i] = $event
              checkPhones($event)
            "
            @deletePhone="deletePhone(i, phone)"
          />
          <template v-if="phone && filledPhones.length > 1">
            <div
              v-if="
                client.phone && client.phone.substr(-10) === phone.substr(-10)
              "
              class="default"
            >
              Основной телефон
            </div>
            <button
              v-else-if="!clientWithSamePhone && phone.length >= 10"
              type="button"
              class="make-default"
              @click="client.phone = phone"
            >
              Сделать основным
            </button>
          </template>
          <div
            v-if="
              clientWithSamePhone &&
                clientWithSamePhone.phones.find(
                  (p) => p.substr(-10) === phone.substr(-10)
                )
            "
            class="error--text"
          >
            Найден 1 клиент с данным номером телефона
          </div>
        </div>

        <button
          v-show="!clientWithSamePhone && !duplicatedPhone"
          type="button"
          class="businesscard-form__add-field"
          :disabled="!hasPhone || hasEmptyPhone || client.phones.length >= 4"
          @click="
            client.phones.push('')
            hasEmptyPhone = true
          "
        >
          <svg
            width="10"
            height="10"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M9 0H7V7H0V9H7V16H9V9H16V7H9V0Z"
              fill="#8995AF"
              fill-opacity="1"
            />
          </svg>
          <span>Добавить телефон</span>
        </button>
        <Accordion v-if="clientWithSamePhone">
          <template slot="heading">
            <div>{{ clientWithSamePhone.fullName }}</div>
          </template>
          <template slot="content">
            <div>
              <div
                v-for="(phone, i) in clientWithSamePhone.phones"
                :key="i"
                class="phone-input"
              >
                <PhoneEdit
                  :class="{ 'error-color': phone === samePhone }"
                  :disabled="true"
                  :phone="phone"
                  :removable="false"
                  label=""
                  placeholder=""
                />
              </div>
              <div>
                <v-layout
                  v-if="clientWithSamePhone.lastVisit"
                  column
                  class="visit"
                >
                  <v-flex>Визит</v-flex>
                  <v-flex class="visit__date">
                    <span>{{ clientWithSamePhone.lastVisit.date }}</span>
                    <span> — </span>
                    <span>{{
                      clientWithSamePhone.lastVisit.displayStatus
                    }}</span>
                  </v-flex>
                  <v-flex v-if="clientWithSamePhone.lastVisit.timeInterval">
                    <span class="visit__interval">{{
                      clientWithSamePhone.lastVisit.timeInterval.replace(
                        '-',
                        '—'
                      )
                    }}</span>
                  </v-flex>
                </v-layout>
              </div>
            </div>
          </template>
          <template slot="footer">
            <nuxt-link
              :to="{
                name: 'id-businessClient',
                params: {
                  id: clientWithSamePhone.business_id,
                  client: clientWithSamePhone.id
                }
              }"
            >
              Перейти в полную карту клиента
            </nuxt-link>
          </template>
        </Accordion>
      </div>
      <div class="businesscard-form__field">
        <v-text-field
          :value="client.birth_date"
          label="Дата рождения"
          mask="##.##.####"
          placeholder="ДД.ММ.ГГГГ"
          :rules="[validateBirthDay]"
          validate-on-blur
          @input="onInputBirthDate"
        />
      </div>
      <div class="businesscard-form__field">
        <div class="right-attached-panel__field-name">
          Пол
        </div>
        <v-btn-toggle v-model="client.sex">
          <v-btn v-for="(sex, n) in client.sexList" :key="n" text>
            {{ sex.display }}
          </v-btn>
        </v-btn-toggle>
      </div>
      <div class="businesscard-form__field">
        <v-text-field
          :value="client.discount"
          mask="###"
          label="Персональная скидка"
          maxlength="3"
          suffix="%"
          :rules="[rules.discount]"
          @input="onInputPercent"
        />
      </div>
      <div class="businesscard-form__field">
        <v-textarea
          v-model="client.notes"
          label="Комментарий"
          maxlength="500"
          :rules="[rules.maxLength(500)]"
          counter="500"
          auto-grow
          rows="1"
        />
      </div>
      <div>
        <MainButton
          class="button save-info"
          :class="{
            button_disabled: !hasPhone || clientWithSamePhone || duplicatedPhone
          }"
          @click="onSave"
        >
          Сохранить
        </MainButton>
      </div>
    </v-layout>
  </v-dialog>
</template>

<script>
import Accordion from '~/components/common/Accordion.vue'
import { newClient } from '~/components/client/utils'
import MainButton from '~/components/common/MainButton.vue'
import PhoneEdit from '~/components/common/PhoneEdit.vue'
import Api from '~/api/backend'
import Client from '~/classes/client'
import clientMixin from '~/mixins/client'
import SearchSelect from '~/components/common/SearchSelect.vue'

export default {
  components: { Accordion, MainButton, PhoneEdit, SearchSelect },
  mixins: [ clientMixin ],
  model: {
    prop: 'visible',
    event: 'close',
  },
  props: {
    visible: {
      type: Boolean,
      default: false,
      required: true,
    },
    client: {
      type: Object,
      default () {
        return newClient()
      },
    },
    create: {
      type: Boolean,
      default: false,
      required: true,
    },
    filial: {
      type: String,
      default: '',
    },
    companyId: {
      type: String,
      default: '',
    },
  },
  data () {
    return {
      active: 0,
      clientWithSamePhone: undefined,
      duplicatedPhone: '',
      hasPhone: undefined,
      hasEmptyPhone: undefined,
      filledPhones: [],
      rules: {
        required: value => !!value || 'Это поле обязательно для заполнения',
        maxLength: length => value =>
          (value && (value.length <= length || 'Слишком длинный текст')) ||
          true,
        discount: val =>
          !val || ((val > 0 && val <= 100) || 'Неверное количество процентов'),
      },
      samePhone: '',
    }
  },
  watch: {
    'client.id': 'checkPhones',
    'client.phones': {
      handler: 'checkPhones',
      deep: true,
    },
  },
  beforeMount () {
    this.checkPhones()
  },
  methods: {
    checkPhones (newPhone) {
      const phones = this.client.phones

      this.samePhone = ''
      this.clientWithSamePhone = null
      this.duplicatedPhone = ''

      if (!phones || !phones.length) {
        this.hasPhone = false
        this.hasEmptyPhone = true
        this.filledPhones = []
        return
      }
      this.hasPhone = phones.some(phone => phone.length >= 10)
      this.hasEmptyPhone = phones.some(x => !x || x.length < 10)
      this.filledPhones = phones.filter(p => p && p.length >= 10)

      if (
        newPhone &&
        typeof newPhone === 'string' &&
        newPhone.length >= 10 &&
        newPhone.length < 12
      ) {
        this.getClientsByPhone(newPhone)
      }

      phones.forEach((p, i) => {
        if (i === phones.length - 1 || !p) {
          return
        }

        for (let j = i + 1; j < phones.length; j++) {
          if (phones[j] && p.substr(-10) === phones[j].substr(-10)) {
            this.duplicatedPhone = p
            return
          }
        }
      })
    },
    deletePhone (i, phone) {
      this.client.phones.splice(i, 1)
      if (this.client.phone && (this.client.phone.substr(-10) === phone.substr(-10))) {
        this.client.phone = ''
      }
    },
    getClientsByPhone (newPhone) {
      if (newPhone && newPhone.length >= 10) {
        Api()
          .get(
            `/client_phone?and=(company_id.eq.${this.companyId},phone.eq.7${newPhone})`
          )
          .then(({ data }) => {
            const companyClients = data.filter(
              c => c.company_id === this.companyId && c.id !== this.client.id
            )

            if (companyClients.length) {
              this.clientWithSamePhone = new Client(companyClients[0])
              this.samePhone = '7' + newPhone
            }
          })
          .catch(e => console.log(e))
      }
    },
    onDelete () {
      this.$emit('onDelete', this.client)
    },
    onInputBirthDate (newVal) {
      if (this.validateBirthDay(newVal) === true) {
        this.client.birth_date = newVal
      } else {
        this.client.birth_date = ''
      }
    },
    validateBirthDay (value) {
      const dateFormat = /^(0?[1-9]|[12][0-9]|3[01])(0?[1-9]|1[012])(19\d{2}|20\d{2})$/
      const currentYear = new Date().getFullYear()
      let match

      if (!value) {
        return true
      }

      // eslint-disable-next-line prefer-const
      match = value.match(dateFormat)

      if (!match) {
        return 'Неправильная дата рождения'
      }
      const day = match[1]
      const month = match[2]
      const year = match[3]
      const age = currentYear - year
      const monthLength = [ 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ]

      // Adjust for leap years
      if (year % 400 === 0 || (year % 100 !== 0 && year % 4 === 0)) {
        monthLength[1] = 29
      }

      // Check the range of the day
      if (day > monthLength[month - 1]) {
        return 'Неправильная дата рождения'
      }

      if (age >= 0 && age < 101) {
        return true
      } else {
        return 'Неправильная дата рождения'
      }
    },
    onInputPercent (val) {
      if (this.rules.discount(val) === true) {
        this.client.discount = val
      } else {
        this.client.discount = null
      }
    },
    onSave () {
      setTimeout(() => {
        this.client.business_id = this.filial
        if (!this.client.phone && this.filledPhones.length) {
          this.client.phone = this.client.phones.find(
            p => p && p.length >= 10
          )
        }
        this.$emit('onSave', this.client)
      }, 100)
    },
    reset () {
      this.clientWithSamePhone = null
      this.samePhone = ''
    },
    selectClient (client) {
      if (client && typeof client === 'object') {
        const { id, visit, j } = client
        this.client.id = id
        this.client.visit = visit
        this.client.fullName = j.name.fullname
        this.client.phone = j.phone
        this.client.phones = j.phones
        this.client.birth_date = j.birth_date
        this.client.discount = j.discount
        this.client.sex = j.sex
        this.client.notes = j.notes
      } else {
        this.client.fullName = client
      }
    },
  },
}
</script>

<style lang="scss">
@import '~assets/styles/businesscard-form.scss';
@import '~assets/styles/phone-input.scss';
@import '~assets/styles/right-attached-panel.scss';
@import '~assets/styles/dropdown-select.scss';

.right-attached-panel._clients {
  .businesscard-form__field {
    margin-top: 20px;
    padding-top: 20px;
  }
  .v-btn-toggle {
    .v-btn {
      @extend %filter;
      padding: 0 12px;
      margin: 0 12px 15px;
      border-radius: 14px !important;
      text-transform: capitalize;
      opacity: 1;
      &:hover {
        @extend %filter-active;
      }
      &.v-btn--active {
        @extend %filter-active;
      }
    }
  }
  .v-btn-toggle--selected {
    box-shadow: none;
  }
  .error--text {
    font-size: 12px;
  }
  .phone-input {
    .v-input--is-disabled .v-input__slot:before {
      display: none;
    }
    .layout {
      align-items: flex-end;
    }
    .businesscard-form__delete {
      margin-left: 10px;
    }
  }
  .accordion {
    text-align: left;
    &__container {
      padding-top: 15px;
    }
    &__footer a {
      font-size: 13px;
      text-decoration: none;
      &:hover {
        text-decoration: underline;
      }
    }
    .v-text-field__prefix {
      padding-left: 0;
    }
    ._phone.v-text-field
      > .v-input__control
      > .v-input__slot
      > .v-text-field__slot {
      padding-left: 0;
    }
    input {
      color: #07101c;
    }
    .error-color {
      .v-text-field__prefix,
      input {
        color: #ef4d37;
      }
    }
    .businesscard-form__field {
      margin-top: 5px;
      padding-top: 0;
    }
    .visit {
      margin-top: 22px;
      color: #8995af;
      &__date {
        margin-top: 7px;
        color: #07101c;
      }
      &__interval {
        font-size: 12px;
      }
    }
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
  .no-default {
    .v-text-field__slot {
      background: url('~assets/images/svg/attention.svg') 10% center no-repeat
        transparent !important;
    }
  }
  .default {
    position: relative;
    margin-top: 8px;
    font-size: 14px;
    color: #8995af;
    &:before {
      content: '';
      display: inline-block;
      vertical-align: baseline;
      width: 12px;
      height: 12px;
      margin-right: 3px;
      background: url('~assets/images/svg/selection-grey.svg') center no-repeat
        transparent;
    }
  }
  .make-default {
    margin-top: 8px;
    font-size: 14px;
    color: #5699ff;
  }
}
</style>
