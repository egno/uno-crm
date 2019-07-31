<template>
  <v-container>
    <v-layout>
      <v-flex
        xs12
        sm10
        offset-sm1
        md8
        offset-md2
        lg6
        offset-lg3
        xl4
        offset-xl4
      >
        <v-card v-if="userID" flat>
          <v-card-title primary-title>
            <h3>Изменение телефона</h3>
          </v-card-title>

          <div v-if="!status">
            <v-card-text>
              <div v-if="oldPhone">
                <div>Ваш текущий телефон:</div>
                <div>+{{ oldPhone }}</div>
              </div>
              <div v-else>
                У вас нет зарегистрированного телефона
              </div>
            </v-card-text>
            <v-card-text>
              <v-layout column>
                <v-flex>
                  <v-text-field
                    v-model="phone"
                    label="Новый телефон"
                    prefix="+7"
                    mask="phone"
                    :rules="phoneRules"
                  />
                </v-flex>
              </v-layout>
            </v-card-text>
            <v-card-actions>
              <v-spacer />
              <v-btn :disabled="!success" textcolor="primary" @click="save">
                Сохранить
              </v-btn>
            </v-card-actions>
          </div>

          <div v-if="status === 'waiting'">
            <v-card-text>
              На телефон
              <span>+7{{ phone }}</span> отправлен код подтверждения.
            </v-card-text>
            <v-card-text>
              <v-text-field
                v-model="code"
                label="Код подтверждения"
                mask="####"
                :rules="codeRules"
              />
              <div v-if="counter !== undefined">
                Осталось количество попыток: {{ counter }}
              </div>
            </v-card-text>
            <v-card-text>
              Неправильно ввели номер телефона?
              <a @click="clear">
                Укажите другой телефон
              </a>
            </v-card-text>
            <v-card-text>
              Код не пришел? Проверьте, правильно ли вы указали номер телефона.
              <span v-if="timeDisplay">
                Повторно отправить код подтверждения можно будет через
                <span>{{ timeDisplay }}</span>.
              </span>
              <span v-else>
                <a
                  @click="
                    code = null
                    save()
                  "
                >
                  Повторить отправку
                </a>
              </span>
            </v-card-text>
            <v-card-actions>
              <v-spacer />
              <v-btn
                :disabled="!successCode"
                text
                color="primary"
                @click="save"
              >
                Подтвердить
              </v-btn>
            </v-card-actions>
          </div>

          <div v-if="status === 'fail'">
            <div v-if="response && response.error_code === '22U13'">
              <v-card-text>
                <div>
                  Невозможно сменить телефон, так как такой номер уже
                  зарегистрирован у другого пользователя.
                </div>
                <a @click="openMessageWindow">
                  Обратитетесь в техподдержку
                </a>
              </v-card-text>
            </div>
            <div v-else>
              <v-card-text>
                <div>Исчерпано количество попыток ввода кода.</div>
              </v-card-text>
              <v-card-text>
                <span v-if="timeDisplay">
                  Повторно отправить код подтверждения можно будет через
                  <span>{{ timeDisplay }}</span>.
                </span>
                <span v-else>
                  <a
                    href="#"
                    @click="
                      code = null
                      save()
                    "
                  >
                    Повторить отправку
                  </a>
                </span>
              </v-card-text>
            </div>

            <v-card-text>
              Неправильно ввели номер телефона?
              <a href="#" @click="clear">
                Укажите другой телефон
              </a>
            </v-card-text>
          </div>

          <div v-if="status === 'success'">
            <v-card-text>{{ response.info }}</v-card-text>
          </div>
        </v-card>
        <v-card v-else flat>
          Для смены телефона сначала войдите под существующей учетной записью
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import Api from '~/api/backend'

export default {
  data () {
    return {
      code: null,
      counter: undefined,
      phone: '',
      repeatphone: '',
      response: undefined,
      rules: {
        code: (value) => {
          const pattern = /^\d{4}$/
          return pattern.test(value) || 'Некорректный код подтверждения.'
        },
        required: value => !!value || 'Обязательно для заполнения.',
        phone: (value) => {
          const pattern = /^\d{10}$/
          return pattern.test(value) || 'Некорректный номер телефона.'
        },
        oldMatches: value =>
          !this.oldPhone ||
          value.trim().slice(-10) !== this.oldPhone.slice(-10) ||
          'Новый номер телефона совпадает с уже имеющимся.'
      },
      status: '',
      timeToRepeat: undefined
    }
  },
  computed: {
    ...mapGetters({ userID: 'user/userID', userInfo: 'user/userInfo' }),
    codeRules () {
      return [this.rules.required, this.rules.code]
    },
    phoneRules () {
      return [this.rules.required, this.rules.phone, this.rules.oldMatches]
    },
    oldPhone () {
      return (
        this.userInfo && this.userInfo.data && this.userInfo.data.phone.trim()
      )
    },
    success () {
      return (
        !!this.phone && !this.phoneRules.some(r => r(this.phone) !== true)
      )
    },
    successCode () {
      return !!this.code && !this.codeRules.some(r => r(this.code) !== true)
    },
    timeDisplay () {
      if (!this.timeToRepeat) { return }
      return `${this.timeToRepeat} мин`
    }
  },
  watch: {
    response: 'processResponse'
  },
  methods: {
    ...mapActions({
      loadUserInfo: 'user/loadUserInfo',
      openMessageWindow: 'layout/openMessageWindow'
    }),
    clear () {
      this.status = undefined
      this.timeToRepeat = undefined
      this.counter = undefined
      this.phone = ''
    },
    processResponse () {
      if (!this.response) { return }
      this.status = this.response.status
      if (this.response.error_code === '22U12') {
        this.setTime(+this.response.seconds.split(':')[1] + 1)
        return
      }
      if (this.response.error_code === '22U10') {
        this.counter = this.response.attempts
        return
      }
      if (this.response.error_code === '22U11') {
        this.counter = this.response.attempts
        return
      }
      if (this.response.error_code === '22U13') {
        return
      }
      if (this.response.status === 'success') {
        this.loadUserInfo()
      }
    },
    save () {
      if (!this.success) { return }
      const data = {
        login: this.phone.trim(),
        code: this.code
      }
      Api()
        .post('rpc/check_phone', data)
        .then(res => res.data)
        .then((res) => {
          this.response = res
        })
    },
    setTime (minutes) {
      if (!minutes) {
        this.timeToRepeat = undefined
        return
      }
      this.timeToRepeat = minutes
      setTimeout(() => {
        this.setTime(minutes - 1)
      }, 60 * 1000)
    }
  }
}
</script>
