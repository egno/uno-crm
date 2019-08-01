<template>
  <div class="login-form">
    <Spinner v-if="isLoading" />
    <VCard v-if="loaded && loggedIn === true">
      <VCardTitle primary-title>
        <div>
          <div>
            Вы авторизованы как
            <span class="font-weight-medium">
              {{ userID }}
            </span>
          </div>
          <div>
            Подождите, идет загрузка
          </div>
        </div>
      </VCardTitle>
    </VCard>
    <div v-if="!isLoading && loaded && loggedIn === false">
      <VForm class="businesscard-form _login" autocomplete="on">
        <VTextField
          v-model="flogin"
          name="username"
          label="Логин"
          type="text"
          autocomplete="username"
          class="businesscard-form__field"
          :rules="[rules.required]"
        />
        <VTextField
          id="password"
          v-model="fpassword"
          name="password"
          label="Пароль"
          type="password"
          autocomplete="current-password"
          class="businesscard-form__field"
          :rules="[rules.required]"
        />
        <div>
          <a class="login-form__restore-link" @click="goRestorePassword">
            Забыли пароль?
          </a>
        </div>
        <MainButton
          type="button"
          :class="[
            'button',
            'save-info',
            { button_disabled: !flogin || !fpassword }
          ]"
          @click.native.stop="sendLogin"
        >
          Вход
        </MainButton>
      </VForm>
      <router-link :to="{ name: 'register' }" class="login-page__no-account">
        Ещё нет аккаунта? Зарегистрировать
      </router-link>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import MainButton from '~/components/common/MainButton.vue'
import Spinner from '~/components/common/Spinner.vue'
import Users from '~/mixins/users'
import { formatDate } from '~/components/calendar/utils'

export default {
  components: { MainButton, Spinner },
  mixins: [Users],
  props: {
    source: { type: String, default: () => '' }
  },
  data: () => ({
    drawer: null,
    errorMessage: null,
    flogin: '',
    fpassword: '',
    snack: false,
    snackText: '',
    snackColor: 'error',
    rules: {
      required: value => !!value || 'Это поле обязательно для заполнения'
    },
    isLoading: false
  }),
  computed: {
    ...mapGetters({ userID: 'user/userID' }),
    loaded () {
      return this.userInfo !== undefined
    }
  },
  watch: {
    loggedIn (newVal) {
      if (newVal) {
        this.loadBusiness()
      }
    }
  },
  mounted () {
    this.loadBusiness()
  },
  methods: {
    ...mapActions({
      login: 'user/login',
      logout: 'user/logout',
      loadMyBusinessList: 'user/loadMyBusinessList'
    }),
    goRestorePassword () {
      this.$router.push({ name: 'restorePassword' })
    },
    loadBusiness () {
      if (!this.loggedIn) { return }

      this.isLoading = true

      this.loadMyBusinessList()
        .then((res) => {
          // todo replace into App.vue
          this.businessCount = res.length
          if (this.userRole === 'manager' || this.userRole === 'admin') {
            this.$router.push({
              name: 'myBusinessList'
            })
            return
          }
          const company = res.find(business => business.type === 'C')
          const filial = res.find(business => !!business.parent)
          // if user has access to a company with no branches
          if (this.businessCount === 1 && res[0].id && !company && !filial) {
            this.$router.push({
              name: 'id-businessCard',
              params: { id: res[0].id }
            })
            return
          }
          // if user has no access to a company
          if (!company) {
            if (this.user.business.length === 1) {
              this.$router.push({
                name: 'id-visits',
                params: {
                  id: filial.id,
                  date: formatDate(new Date())
                }
              })
            } else if (filial) {
              this.$router.push({
                name: 'id-filials',
                params: { id: filial.parent }
              })
            }
            return
          }
          // if user has access to a company
          if (company) {
            this.$router.push({
              name: 'id-businessCard',
              params: { id: company.id }
            })
          }
        })
        .finally(() => {
          this.isLoading = false
        })
    },
    sendLogin () {
      this.login({ login: this.flogin, pass: this.fpassword })
    },
    sendLogout () {
      this.logout()
      this.$router.push({ name: 'login' })
    }
  }
}
</script>

<style lang="scss">
@import '~/assets/styles/businesscard-form.scss';
._login {
  .businesscard-form__field {
    margin-top: 0;
  }
  .login-form__restore-link {
    display: block;
    text-align: center;
    margin-top: 10px;
  }
}
</style>
