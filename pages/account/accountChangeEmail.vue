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
            <h3>Изменение email</h3>
          </v-card-title>

          <div v-if="!status">
            <v-card-text>
              <div v-if="oldEmail">
                <div>Ваш текущий e-mail:</div>
                <div>{{ oldEmail }}</div>
              </div>
              <div v-else>
                У вас нет зарегистрированного e-mail
              </div>
            </v-card-text>
            <v-card-text>
              <v-layout column>
                <v-flex>
                  <v-text-field
                    v-model="email"
                    label="Новый e-mail"
                    :rules="emailRules"
                  />
                </v-flex>
                <v-flex>
                  <v-text-field
                    v-model="repeatEmail"
                    label="Повторите новый e-mail"
                    :rules="repeatEmailRules"
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
              На адрес e-mail
              <span>{{ email }}</span> отправлено письмо с ссылкой для
              подтверждения.
            </v-card-text>
            <v-card-text>
              Ошиблись?
              <a @click="clear">
                Укажите другой e-mail
              </a>
            </v-card-text>
            <v-card-text>
              Ссылка не пришла? Проверьте, правильно ли вы указали адрес
              электронной почты. Посмотрите, не попало ли письмо от нас в
              "спам".
              <span v-if="timeDisplay">
                Повторно отправить ссылку для подтверждения можно будет через
                <span>{{ timeDisplay }}</span>.
              </span>
              <span v-else>
                <a @click="save">
                  Повторить отправку
                </a>
              </span>
            </v-card-text>
          </div>
        </v-card>
        <v-card v-else flat>
          Для смены e-mail сначала войдите под существующей учетной записью
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'
import Api from '~/api/backend'

export default {
  data () {
    return {
      email: '',
      repeatEmail: '',
      response: undefined,
      rules: {
        required: value => !!value || 'Обязательно для заполнения.',
        email: (value) => {
          const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          return pattern.test(value) || 'Некорректный e-mail.'
        },
        oldMatches: value => !this.oldEmail ||
          value.trim().toUpperCase() !== this.oldEmail.toUpperCase() ||
          'Введенные адрес e-mail уже используется вами.',
        repeatMatches: value => value.trim().toUpperCase() === this.email.trim().toUpperCase() ||
          'Введенные адреса e-mail не совпадают.',
      },
      status: '',
      timeToRepeat: undefined,
    }
  },
  computed: {
    ...mapGetters({ userID: 'user/userID', userInfo: 'user/userInfo' }),
    emailRules () {
      return [ this.rules.required, this.rules.email, this.rules.oldMatches ]
    },
    oldEmail () {
      return (
        this.userInfo && this.userInfo.data && this.userInfo.data.email.trim()
      )
    },
    repeatEmailRules () {
      return [ this.rules.required, this.rules.email, this.rules.repeatMatches ]
    },
    success () {
      return (
        !!this.email &&
        !this.emailRules.some(r => r(this.email) !== true) &&
        !!this.repeatEmail &&
        !this.repeatEmailRules.some(r => r(this.repeatEmail) !== true)
      )
    },
    timeDisplay () {
      if (!this.timeToRepeat) { return }
      return `${this.timeToRepeat} мин`
    },
  },
  watch: {
    response: 'processResponse',
  },
  methods: {
    clear () {
      this.status = undefined
      this.timeToRepeat = undefined
    },
    processResponse () {
      if (!this.response) { return }
      this.status = this.response.status
      if (this.response.error_code === '22U12') {
        this.setTime(+this.response.seconds.split(':')[1] + 1)
      }
    },
    save () {
      if (!this.success) { return }
      const data = {
        login: this.email.trim(),
        code: null,
      }
      Api()
        .post('rpc/check_email', data)
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
    },
  },
}
</script>
