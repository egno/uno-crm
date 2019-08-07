<template>
  <div class="register-form text-xs-center businesscard-form">
    <VForm v-if="!sended && !keyCode" ref="formLogin">
      <div>
        <h1 class="register-form__h1">
          {{ restoreMode ? 'Восстановление пароля' : 'Регистрация Бизнеса' }}
        </h1>
        <template v-if="!restoreMode">
          <div>
            <VTextField
              v-model="companyName"
              label="Название компании"
              :rules="[
                rules.required,
                (value) =>
                  (!!value && value.length <= 50) ||
                  'Слишком длинное наименование'
              ]"
              maxlength="50"
              class="businesscard-form__field"
            />
          </div>
          <div class="">
            <VTextField
              v-model="userName"
              label="Имя и фамилия"
              required
              :rules="[rules.required]"
              class="businesscard-form__field"
            />
          </div>
        </template>
        <div class="">
          <PhoneEdit
            :phone="flogin"
            :removable="false"
            label="Телефон"
            placeholder=""
            @onEdit="flogin = $event"
          />
          <div v-if="alreadyUsedPhone" class="error-message">
            На данный номер уже зарегистрирована компания.
            <router-link :to="{ name: 'login' }">
              Авторизоваться
            </router-link>
          </div>
        </div>
        <!--show disclaimer with animation v-show="companyName && userName && flogin"-->
        <v-layout
          v-show="$route.name !== 'restorePassword' && !alreadyUsedPhone"
          justify-center
          class="offer-checkbox"
        >
          <v-checkbox v-model="offerAgree" class="default-checkbox" />
          <p class="register-form__disclaimer text-sm-left">
            Нажимая кнопку «Создать», вы соглашаетесь с
            <a
              href="https://docs.google.com/document/d/1Ioe9v58FGXfI7o1ExWPGR9aMkeYyU6LCJenMniPSsl4"
              target="_blank"
            >правилами</a>, политикой
            <a
              href="https://docs.google.com/document/d/1JWxq7uHt7H9CKhqyJLIozc-JeAT9aNXUszZ1m2Dd4Os"
              target="_blank"
            >конфиденциальности</a>
            и разрешаете проводить аналитику своих персональных данных.
          </p>
        </v-layout>
        <v-layout v-show="!alreadyUsedPhone" justify-center>
          <MainButton
            v-if="restoreMode"
            :class="{
              button_disabled: !flogin || !loginIsCorrect
            }"
            class="button"
            type="button"
            @click="sendLogin"
          >
            Восстановить
          </MainButton>
          <MainButton
            v-else
            id="send_regform"
            :class="{
              button_disabled:
                !offerAgree ||
                !flogin ||
                !loginIsCorrect
            }"
            class="button"
            type="button"
            @click="sendLogin"
          >
            Создать
          </MainButton>
        </v-layout>
      </div>
    </VForm>

    <VForm
      v-if="loginIsEmail === false && !showPasswordInputs && !keyCode"
      ref="formCode"
    >
      <h2 class="register-form__h1">
        Введите код подтверждения
      </h2>
      <div class="register-form__confirm-code">
        На ваш номер <strong>{{ ('7' + flogin) | phoneFormat }}</strong>
        был отправлен код подтверждения.
      </div>
      <VTextField
        id="fcode"
        v-model="fcode"
        name="fcode"
        label="код"
        type="code"
        :rules="fcodeRules"
        :error-messages="badCode"
      />
      <v-btn
        v-if="codeTries"
        type="button"
        class="button"
        :class="{ button_disabled: !fcode }"
        @click="sendCode"
      >
        Проверить
      </v-btn>
      <div>Не пришёл код?</div>
      <a href="#" @click="sendLogin">
        Отправить еще раз
      </a>
      <br>
    </VForm>

    <VForm v-if="showPasswordInputs" ref="passwords" v-model="valid">
      <h2 class="register-form__h1">
        Придумайте пароль для входа
      </h2>
      <VTextField
        id="fpassword"
        v-model="fpassword"
        name="fpassword"
        :rules="passRules"
        label="Пароль"
        type="password"
        autocomplete="new-password"
        required
      />
      <VTextField
        id="fpasswordRepeat"
        v-model="fpasswordRepeat"
        :rules="passRepeatRules"
        name="fpasswordRepeat"
        label="Повторите пароль"
        type="password"
        autocomplete="new-password"
        required
      />
      <v-btn
        id="regbutton_enter"
        type="button"
        class="button"
        :class="{
          button_disabled:
            !fpassword || !fpasswordRepeat || fpassword !== fpasswordRepeat
        }"
        @click="registerAndLogin"
      >
        Войти
      </v-btn>
    </VForm>

    <div v-show="!alreadyUsedPhone">
      Уже есть аккаунт?
      <router-link :to="{ name: 'login' }">
        Войти
      </router-link>
    </div>
    <div v-if="keyCode">
      {{ badCode }}
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import Api from '~/api/backend'
import { makeAlert } from '~/api/utils'
import PhoneEdit from '~/components/common/PhoneEdit.vue'
import MainButton from '~/components/common/MainButton.vue'

export default {
  components: { PhoneEdit, MainButton },
  props: {
    frole: { type: String, default: 'business' }
  },
  data () {
    return {
      rules: {
        phone: (value) => {
          const pattern = /^[+]*([0-9]){11}$/
          const val = '7' + value.replace(/[^0-9]/g, '')
          return pattern.test(val) || 'Введите действительный номер телефона.'
        },
        required: value => !!value || 'Обязательно для заполнения'
      },
      companyName: '',
      fpasswordRepeat: '',
      fpassword: '',
      sended: false,
      badCode: '',
      valid: false,
      snackbar: false,
      showPasswordInputs: false,
      ftype: '',
      codeTries: 1,
      flogin: '',
      fcode: null,
      fcodeRules: [v => !!v || 'Введите код.'],
      froleRules: [v => !!v || 'Выберите тип бизнеса'],
      loginRules: [
        v => !!v || 'Введите действительный номер телефона или e-mail',
        v =>
          (v && v.length >= 6) ||
          'Введите действительный номер телефона или e-mail'
      ],
      passRules: [
        v => !!v || 'Пароль должен содержать не менее 6 символов',
        v =>
          (v && v.length >= 6) || 'Пароль должен содержать не менее 6 символов'
      ],
      passRepeatRules: [
        v => (!!v && v === this.fpassword) || 'Пароли не совпадают'
      ],
      offerAgree: false,
      userAlreadyInitialized: false,
      userName: '',
      alreadyUsedPhone: false
    }
  },
  computed: {
    ...mapGetters({
      loggedIn: 'user/loggedIn',
      roles: 'business/businessCategories',
      avatar: 'user/userAvatar',
      userID: 'user/userID',
      userInfo: 'user/userInfo'
    }),
    keyCode () {
      return this.$route.params.code
    },
    url () {
      return this.flogin.includes('@') ? 'rpc/check_email' : 'rpc/check_phone'
    },
    loginIsEmail () {
      if (this.sended === true) {
        return this.flogin.includes('@')
      } else {
        return undefined
      }
    },
    loginIsCorrect () {
      return this.rules.phone(this.flogin) === true
    },
    restoreMode () {
      return this.$route && this.$route.name === 'restorePassword'
    }
  },
  watch: {
    userID (newVal, oldVal) {
      if (!oldVal && newVal && oldVal !== newVal) {
        this.userAlreadyInitialized = true
        return
      }

      if (this.userAlreadyInitialized && newVal && oldVal !== newVal) {
        this.goHome()
      }
    },
    keyCode: 'checkKeyCode'
  },
  mounted () {
    this.checkKeyCode()
  },
  methods: {
    ...mapActions({
      alert: 'alerts/alert',
      login: 'user/login',
      logout: 'user/logout',
      openMessageWindow: 'common/openMessageWindow',
      register: 'common/register'
    }),
    checkKeyCode () {
      if (!this.keyCode) {
        return
      }
      this.sendKeyCode(this.keyCode)
    },
    goHome () {
      this.$router.push({
        name: 'home'
      })
    },
    registerAndLogin () {
      if (this.$refs.passwords.validate()) {
        this.register({
          role: this.frole,
          login: this.flogin,
          pass: this.fpassword
        }).then(() => {
          this.$router.push({ name: 'login' })
        })
      }
    },
    sendLogin () {
      this.alreadyUsedPhone = false
      if (!this.loginIsEmail || this.$refs.formLogin.validate()) {
        const data = {
          login: this.flogin,
          code: null,
          j: {
            business_category: this.ftype,
            company_name: this.companyName,
            user_name: this.userName
          }
        }
        if (this.restoreMode) {
          data.j.restore = true
        }
        Api()
          .post(this.url, data)
          .then(({ data }) => {
            this.fcode = ''
            this.badCode = ''
            this.codeTries = data.attempts

            if (data.seconds) {
              this.alert({
                message: 'Новый код можно будет отправить через ' + data.seconds
              })
            }
            this.$nextTick(function () {
              this.$refs.formCode && this.$refs.formCode.resetValidation()
            })

            if (data.info && data.info.phone && data.info.phone.phone) {
              this.alreadyUsedPhone = true
              return
            }
            this.sended = true
          })
          .catch((err) => {
            this.alert(makeAlert(err))
          })
      }
    },
    sendCode () {
      if (this.$refs.formCode.validate()) {
        this.badCode = ''
        Api()
          .post(this.url, {
            login: this.flogin,
            code: this.fcode
          })
          .then((res) => {
            if (
              res.data.status === 'confirmed' ||
              res.data.status === 'success'
            ) {
              this.showPasswordInputs = true
              this.$nextTick(function () {
                this.$refs.passwords.resetValidation()
              })
            }
            if (res.data.status === 'waiting') {
              this.badCode = 'Код введен неверно'
            }
            if (res.data.status === 'fail') {
              this.badCode = 'Код недействителен. Нужно послать новый код'
            }
            this.codeTries = res.data.attempts
          })
          .catch((err) => {
            console.log(err)
            this.alert(makeAlert(err))
          })
      }
    },
    sendKeyCode (code) {
      if (!code) { return }

      Api()
        .post('rpc/check_email', {
          login: null,
          code
        })
        .then((res) => {
          if (res.data.status === 'confirmed') {
            this.showPasswordInputs = true
            this.flogin = res.data.login
            this.$nextTick(function () {
              this.$refs.passwords.resetValidation()
            })
          }
          if (res.data.status === 'fail') {
            this.badCode = 'Ссылка устарела'
          }
        })
        .catch((err) => {
          console.log(err)
          this.alert(makeAlert(err))
        })
    }
  }
}
</script>

<style lang="scss">
@import '~assets/styles/businesscard-form.scss';
@import '~assets/styles/dropdown-select.scss';
@import '~assets/styles/default-checkbox.scss';

.register-form {
  width: 280px;
  &__h1 {
    margin-bottom: 23px;
    font-family: Roboto Slab;
    font-style: normal;
    font-weight: normal;
    font-size: 24px;
    text-align: center;
    color: #07101c;
  }
  &__disclaimer {
    width: 220px;
    margin-top: 5px;
    font-size: 10px;
  }
  &__confirm-code {
    font-size: 16px;
  }
  .businesscard-form__field {
    margin-top: 22px;
  }
  .button {
    width: 240px !important;
    height: 56px !important;
    border-radius: 0 !important;
    margin-top: 20px;
    margin-bottom: 10px;
    font-family: $roboto;
    font-style: normal;
    font-weight: 900;
    font-size: 18px;
    text-align: center;
    letter-spacing: 0.05em;
    text-transform: uppercase;
  }
  .v-select__selections {
    max-width: 100%;
    overflow-x: hidden;
    .v-chip {
      text-overflow: ellipsis;
    }
  }
  .v-select__selections > div {
    text-align: right;
    justify-content: flex-end;
    flex-grow: 1;
  }
  .v-input--selection-controls {
    max-width: 27px;
    margin-top: 0;
  }
  .v-messages__message {
    text-align: center;
  }
  .error-message {
    margin-bottom: 20px;
    color: #ef4d37;
  }
  .offer-checkbox {
    margin-top: 20px;
  }

}
</style>
