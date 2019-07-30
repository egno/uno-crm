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
        <v-card
          v-if="userID"
          flat
        >
          <v-card-title primary-title>
            <h3>Изменение пароля</h3>
          </v-card-title>

          <div v-if="!status">
            <v-card-text>
              <v-layout column>
                <v-flex>
                  <v-text-field
                    v-model="password"
                    label="Новый пароль"
                    :append-icon="show1 ? 'visibility_off' : 'visibility'"
                    :type="show1 ? 'text' : 'password'"
                    hint="Не менее 6 символов"
                    :rules="passwordRules"
                    @click:append="show1 = !show1"
                  />
                </v-flex>
                <v-flex>
                  <v-text-field
                    v-model="repeatPassword"
                    label="Повторите новый пароль"
                    :append-icon="show2 ? 'visibility_off' : 'visibility'"
                    :type="show2 ? 'text' : 'password'"
                    :rules="repeatPasswordRules"
                  />
                </v-flex>
              </v-layout>
            </v-card-text>
            <v-card-actions>
              <v-spacer />
              <v-btn
                :disabled="!success"
                flat
                color="primary"
                @click="save"
              >
                Сохранить
              </v-btn>
            </v-card-actions>
          </div>

          <div v-if="status==='success'">
            <v-card-text>Пароль успешно изменен</v-card-text>
          </div>
        </v-card>
        <v-card
          v-else
          flat
        >
          Для изменения пароля сначала войдите под существующей учетной записью
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
      password: '',
      repeatPassword: '',
      response: undefined,
      rules: {
        required: value => !!value || 'Обязательно для заполнения.',
        password: value => value.length > 5 || 'Слишком короткий пароль.',
        repeatMatches: value =>
          value === this.password || 'Введенные пароли не совпадают.'
      },
      show1: false,
      show2: false,
      status: ''
    }
  },
  computed: {
    ...mapGetters({userID: 'user/userID'}),
    passwordRules () {
      return [this.rules.required, this.rules.password]
    },
    repeatPasswordRules () {
      return [
        this.rules.required,
        this.rules.password,
        this.rules.repeatMatches
      ]
    },
    success () {
      return (
        !!this.password &&
        !this.passwordRules.some(r => r(this.password) !== true) &&
        !!this.repeatPassword &&
        !this.repeatPasswordRules.some(r => r(this.repeatPassword) !== true)
      )
    }
  },
  watch: {
    response: 'processResponse'
  },
  methods: {
    processResponse () {
      if (!this.response) return
      this.status = this.response.status
    },
    save () {
      if (!this.success) return
      const data = {
        pass: this.password
      }
      Api()
        .post('rpc/passwd', data)
        .then(res => res.data)
        .then(res => {
          this.response = res
        })
    }
  }
}
</script>
