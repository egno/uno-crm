<template>
  <v-dialog
    :value="visible"
    content-class="right-attached-panel businesscard-form _clients"
    transition="slide"
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
        {{ create ? 'Добавить пользователя' : 'Информация о пользователе' }}
      </div>
      <div class="businesscard-form__field">
        <div class="phone-input">
          <PhoneEdit
            :phone="phone"
            :removable="false"
            label="Телефон"
            placeholder=""
            :disabled="!!client.phone"
            :class="{ 'no-default': !client.phone && filledPhones.length > 1 }"
            @onEdit="checkPhone($event)"
          />
          <template v-if="seekComplete">
            <div v-if="foundedUser" class="success--text">
              Пользователь найден
            </div>
            <div v-else class="success--text">
              Будет создан новый пользователь с этим номером телефона.
            </div>
          </template>
        </div>
      </div>
      <div class="businesscard-form__field">
        <v-text-field
          v-model="fullName"
          label="ИМЯ И ФАМИЛИЯ"
          :disabled="foundedUser && !!fullName"
          maxlength="50"
          required
        />
      </div>
      <div v-if="roles.length > 1" class="businesscard-form__field">
        <v-select
          v-model="role"
          :items="roles"
          :item-disabled="
            function itemDisabledLogger (x) {
              console.log(x)
              return true
            }
          "
          label="Роль пользователя"
        />
      </div>
      <div
        v-if="roles.length > 1 && (role === roles[1] || role === roles[2])"
        class="businesscard-form__field"
      >
        <v-select
          v-model="filials"
          :items="companyFilials"
          label="Филиал"
          item-text="name"
          item-value="id"
          return-object
          multiple
          chips
          deletable-chips
        />
      </div>
      <div class="businesscard-form__field">
        <v-textarea
          v-model="notes"
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
            button_disabled:
              !(seekComplete || client.phone) || !fullName || !checkRole
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
import { mapGetters } from 'vuex'
import MainButton from '~/components/common/MainButton.vue'
import PhoneEdit from '~/components/common/PhoneEdit.vue'
import Api from '~/api/backend'
import User from '~/classes/user'
const { roles } = User

export default {
  components: { MainButton, PhoneEdit },
  model: {
    prop: 'visible',
    event: 'close'
  },
  props: {
    visible: {
      type: Boolean,
      default: false,
      required: true
    },
    client: {
      type: Object,
      default () {
        return new User()
      }
    },
    create: {
      type: Boolean,
      default: false,
      required: true
    },
    filial: {
      type: String,
      default: ''
    },
    companyId: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      active: 0,
      clientWithSamePhone: undefined,
      clientDisplay (c) {
        return `${c.j.name.fullname}${c.j.phone ? c.j.phone : c.j.phones[0]}`
      },
      companyFilials: [],
      duplicatedPhone: '',
      hasPhone: undefined,
      hasEmptyPhone: undefined,
      filials: [],
      filledPhones: [],
      foundedUser: undefined,
      fullName: '',
      notes: '',
      phone: '',
      role: '',
      seekComplete: false,
      suggestedClients: [],
      rules: {
        required: value => !!value || 'Это поле обязательно для заполнения',
        maxLength: length => value =>
          (value && (value.length <= length || 'Слишком длинный текст')) ||
          true,
        discount: val =>
          !val || ((val > 0 && val <= 100) || 'Неверное количество процентов')
      },
      samePhone: '',
      user: undefined
    }
  },
  computed: {
    ...mapGetters({
      businessId: 'business/businessId',
      businessFilialCount: 'business/businessFilialCount'
    }),
    checkRole () {
      return (
        (this.roles.length > 1 &&
          (this.role === this.roles[1] || this.role === this.roles[2]) &&
          this.filials.length > 0) ||
        (this.roles.length <= 1 && !this.role) ||
        this.role === this.roles[0]
      )
    },
    roles () {
      return roles && roles.filter(x => x === roles[0] || this.businessFilialCount)
    }
  },
  watch: {
    foundedUser: 'fillUser',
    businessId: 'getFilials'
  },
  mounted () {
    this.getFilials()
    this.initUser()
  },
  beforeMount () {
    this.checkPhone()
  },
  created () {},
  methods: {
    checkPhone (newPhone) {
      this.seekComplete = false
      this.foundedUser = undefined
      if (
        newPhone &&
        typeof newPhone === 'string' &&
        newPhone.length >= 10 &&
        newPhone.length < 12
      ) {
        this.getUsersByPhone(newPhone)
      }
    },
    initUser () {
      this.user = new User(this.client)
      this.foundedUser = this.user
      this.fullName = this.user.fullName
      this.phone = this.user.phone && this.user.phone.slice(-10)
      this.role = this.user.role
      this.filials = this.client.business
      this.notes = this.client.j && this.client.j.notes
    },
    fillUser () {
      if (!this.foundedUser) {
        this.fullName = ''
      } else {
        this.fullName = [
          this.foundedUser.name,
          this.foundedUser.surname ? this.foundedUser.surname + '.' : undefined
        ]
          .filter(x => !!x)
          .join(' ')
      }
    },
    getFilials () {
      if (!this.businessId || !this.businessFilialCount) {
        this.companyFilials = []
      } else {
        Api()
          .get(`/business?select=id,j->>name&parent=eq.${this.businessId}`)
          .then((res) => {
            this.companyFilials = res.data.map((x) => {
              x.name = x.name || `<без названия ${x.id.slice(-4)}>`
              return x
            })
          })
      }
    },
    getUsersByPhone (newPhone) {
      this.seekComplete = false
      this.foundedUser = undefined
      if (newPhone && newPhone.length >= 10) {
        this.phone = newPhone
        Api()
          .post(`/rpc/find_user`, { phone: `7${newPhone}` })
          .then((res) => {
            this.seekComplete = true
            if (res.data && res.data.id) {
              this.foundedUser = res.data
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
    onInputName (val) {
      if (!val) {
        this.suggestedClients = []
        return
      }

      const match = val.match(/[а-яА-ЯёЁ ]+/g)

      val = match ? match[0] : ''
      this.$refs.fullName.lazySearch = val
      if (!val || val.length < 3) {
        this.suggestedClients = []
        return
      }
      this.debouncedGetClients(val)
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
        const parts = this.fullName.split(' ')
        const name = parts[0]
        parts.splice(0, 1)
        const surname = parts.join(' ')
        const userInfo = {
          user_id: this.foundedUser && this.foundedUser.id,
          company_id: this.businessId,
          business:
            this.role === roles[0]
              ? []
              : this.filials.filter(b => b.id !== this.companyId),
          j: {
            name,
            surname,
            notes: this.notes,
            role: this.role === roles[2] ? 'busman' : ''
          },
          phone: this.phone
        }
        this.$emit('onSave', userInfo)
      }, 100)
    },
    reset () {
      this.foundedUser = null
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
    }
  }
}
</script>

<style lang="scss">
@import '~assets/styles/businesscard-form.scss';
@import '~assets/styles/phone-input.scss';
@import '~assets/styles/right-attached-panel.scss';
@import '~assets/styles/dropdown-select.scss';

.right-attached-panel._clients {
  .businesscard-form__field {
    margin-top: 28px;
    padding-top: 20px;
  }
  .v-btn-toggle {
    button {
      @extend %filter;
      padding: 0 12px;
      margin: 0 12px 15px;
      border-radius: 14px !important;
      text-transform: capitalize;
      &:hover {
        @extend %filter-active;
      }
    }
  }
  .v-btn-toggle--selected {
    box-shadow: none;
  }
  .error--text,
  .success--text {
    font-size: 12px;
  }
  .phone-input .v-input--is-disabled .v-input__slot:before {
    display: none;
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
