<template>
  <div class="businesscard-tabs">
    <div class="businesscard-tabs__tab-wrapper">
      <div class="businesscard-tabs__tab">
        <div
          class="businesscard-tabs__tab-header"
          :class="{ _active: currentTab === 'infoTab' }"
          @click="emitTabChange"
        >
          Информация
        </div>
        <div
          class="businesscard-tabs__tab-header"
          :class="{ _active: currentTab !== 'infoTab' }"
          @click="emitTabChange"
        >
          Режим работы
        </div>
      </div>
    </div>
    <v-layout class="businesscard-tabs__content">
      <div v-if="data" class="infocard _edit businesscard-form" flat>
        <div class="infocard__content">
          <VForm
            v-show="currentTab === 'infoTab'"
            ref="form"
            v-model="valid"
            @click="hasFocused = true"
          >
            <v-layout
              justify-center
              class="businesscard-form__avatar"
              @click="
                avatarEdit = !avatarEdit
                $emit('formChange')
              "
            >
              <Avatar
                size=""
                :src="avatar"
                :is-editing="true"
                :is-company-avatar="true"
                :avatar-class="'business-avatar'"
                :new-message="false"
                :required="false"
                :name="name"
              />
            </v-layout>

            <VTextField
              v-model="data.j.name"
              label="Название*"
              :rules="[
                () => !!data.j.name || 'Это поле обязательно для заполнения',
                () =>
                  (!!data.j.name && data.j.name.length <= 50) ||
                  'Слишком длинное наименование'
              ]"
              required
              maxlength="50"
              class="businesscard-form__field"
              @change="$emit('formChange')"
            />
            <VSelect
              v-if="!!data.parent"
              v-model="data.j.category"
              :items="categories"
              placeholder="Тип бизнеса*"
              :rules="[rules.required]"
              :error="hasFocused && !!data.parent && !data.j.category"
              attach=".dropdown-select.category"
              class="dropdown-select category businesscard-form__field"
            />
            <VTextField
              v-if="!businessIsIndividual"
              v-model="data.j.inn"
              label="ИНН"
              mask="############"
              :disabled="!businessIsIndividual && !!data.parent"
              :rules="[rules.INN_counter]"
              class="businesscard-form__field"
              required
              @change="$emit('formChange')"
            />
            <v-layout row justify-space-between>
              <v-flex>
                <AddressAutocomplete
                  :value="data.j.address"
                  label="Адрес*"
                  @inputAddress="onAddressInput"
                  @blur="onAddressInput"
                />
              </v-flex>
              <div class="businesscard-form__field _office">
                <VTextField
                  v-model="data.j.office"
                  label="Офис"
                  maxlength="20"
                  class="businesscard-form__field"
                  @change="$emit('formChange')"
                />
              </div>
            </v-layout>
            <v-img
              v-if="hasAddress"
              :src="
                `https://static-maps.yandex.ru/1.x/?lang=ru_RU&l=map&z=16&ll=${point}&pt=${point},org&scale=1.4`
              "
              max-height="200px"
              width="100%"
              class="grey lighten-2 businesscard-form__map"
            >
              <v-layout
                slot="placeholder"
                fill-height
                align-center
                justify-center
                ma-0
              >
                <v-progress-circular indeterminate color="grey lighten-5" />
              </v-layout>
            </v-img>
            <BusinessPhonesEdit :phones="phones" @onEdit="phonesEdit" />
            <div v-if="data.j.links" class="soc">
              <div class="soc__input _ig">
                <VTextField
                  v-model="data.j.links.instagram"
                  class="businesscard-form__field"
                  placeholder="Инстаграм"
                  :rules="[rules.uriLength]"
                  maxlength="150"
                  @change="$emit('formChange')"
                />
              </div>
              <div class="soc__input _vk">
                <VTextField
                  v-model="data.j.links.vk"
                  class="businesscard-form__field"
                  placeholder="Вконтакте"
                  :rules="[rules.uriLength]"
                  maxlength="150"
                  @change="$emit('formChange')"
                />
              </div>
              <div
                v-for="(site, i) in data.j.links.others"
                :key="i"
                class="soc__input"
              >
                <VTextField
                  v-model="site.uri"
                  class="businesscard-form__field"
                  :rules="[rules.uriLength]"
                  maxlength="150"
                  placeholder="Веб-сайт"
                  @input="
                    site.uri = $event.slice(0, 150)
                    debouncedCheckAddLink()
                  "
                  @focus="focusedOtherLink = i"
                  @change="$emit('formChange')"
                />
                <button
                  v-show="i > 0"
                  type="button"
                  class="businesscard-form__delete"
                  @mousedown="deleteLink(i)"
                >
                  <svg
                    width="12"
                    height="20"
                    viewBox="0 0 12 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M8 0H4V2H0V4H12V2H8V0ZM0 6H12V20H0V6Z"
                      fill="#8995AF"
                      fill-opacity="0.2"
                    />
                  </svg>
                </button>
              </div>
            </div>
            <button
              type="button"
              class="businesscard-form__add-field"
              :disabled="
                addLinkDisabled ||
                  (data.j.links &&
                  data.j.links.others &&
                  data.j.links.others.length >= 4)
              "
              @click="addLink"
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
              <span>Добавить ссылку</span>
            </button>
            <v-textarea
              v-if="data && data.j"
              v-model="data.j.description"
              counter="400"
              height="auto"
              auto-grow
              rows="1"
              placeholder="Описание"
              maxlength="400"
              class="businesscard-form__field"
              :rules="[
                (value) =>
                  (value && (value.length <= 400 || 'Слишком длинный текст')) ||
                  true
              ]"
              @change="$emit('formChange')"
            />
            <div
              v-show="hasFocused && hasErrors"
              class="businesscard-form__errors"
            >
              Необходимо заполнить все обязательные поля
            </div>
            <MainButton
              color="success"
              class="button businesscard-form__next"
              :class="{ button_disabled: hasErrors }"
              @click.native.prevent="emitTabChange"
            >
              Далее
            </MainButton>
          </VForm>
          <div v-show="currentTab !== 'infoTab'">
            <BusinessScheduleEdit
              :week-schedule="schedule"
              @editWeek="scheduleEdit"
              @delete="scheduleEdit()"
            />
            <MainButton
              :disabled="hasErrors || !hasSchedule"
              class="button save-info"
              :class="{ button_disabled: hasErrors || !hasSchedule }"
              @click="debouncedSave"
            >
              Сохранить
            </MainButton>
          </div>
        </div>
        <VDialog v-model="avatarEdit" max-width="375px" height="600px">
          <VueAvatarEditor
            :avatar="avatar"
            :width="280"
            :height="280"
            :border="0"
            :border-radius="140"
            @finished="onAvatarSave"
          />
        </VDialog>
      </div>
    </v-layout>
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters, mapMutations } from 'vuex'
import { debounce } from 'lodash'
import Avatar from '~/components/avatar/Avatar.vue'
import VueAvatarEditor from '~/components/avatar/VueAvatarEditor.vue'
import BusinessPhonesEdit from '~/components/business/BusinessPhonesEdit.vue'
import BusinessScheduleEdit from '~/components/business/BusinessScheduleEdit.vue'
import AddressAutocomplete from '~/components/yandex/AddressAutocomplete.vue'
import { backendMixins } from '~/api/mixins'
import { businessMixins, scheduleMixin } from '~/components/business/mixins'
import { makeAlert } from '~/api/utils'
import MainButton from '~/components/common/MainButton.vue'
import Business from '~/classes/business'
import BusinessSchedule from '~/classes/businessSchedule'
import { uuidv4 } from '~/components/utils'

export default {
  components: {
    AddressAutocomplete,
    BusinessPhonesEdit,
    BusinessScheduleEdit,
    Avatar,
    VueAvatarEditor,
    MainButton
  },
  mixins: [backendMixins, businessMixins, scheduleMixin],
  props: {
    businessInfo: {
      type: Object,
      default () {
        return {}
      }
    },
    currentTab: {
      type: String,
      default: 'infoTab'
    }
  },
  data () {
    return {
      avatarEdit: false,
      captionClass: '',
      data: new Business(this.businessInfo),
      rules: {
        INN_counter: value =>
          (value &&
            (value.length === 10 ||
              value.length === 12 ||
              'В ИНН должно быть 10 или 12 цифр')) ||
          true,
        required: v => !!v || 'Обязательное поле',
        uriLength: value =>
          (value && (value.length <= 150 || 'Слишком длинная ссылка')) || true
      },
      valid: false,
      schedule: undefined,
      scheduleErrors: [],
      addLinkDisabled: false,
      focusedOtherLink: undefined,
      hasAddress: false,
      hasSchedule: false,
      hasFocused: false
    }
  },
  computed: {
    ...mapState({
      categories: state => state.business.businessCategories
    }),
    ...mapGetters({
      userInfo: 'user/userInfo',
      businessCategories: 'business/businessCategories',
      businessIsIndividual: 'business/businessIsIndividual'
    }),
    avatar () {
      if (this.data.j) {
        return this.data.j.avatar
      }
      return null
    },
    hasName () {
      return !!(this.data && this.data.j && this.data.j.name)
    },
    hasPhone () {
      return !!(
        this.data &&
        this.data.j &&
        !!this.data.j.phones &&
        this.data.j.phones.length &&
        this.data.j.phones.some(phone => phone.length >= 10)
      )
    },
    hasErrors () {
      return (
        !(
          this.hasName &&
          this.hasPhone &&
          this.data &&
          this.data.j &&
          this.data.j.address &&
          this.data.j.address.name
        ) ||
        (!!this.data.parent && !this.data.j.category)
      )
    },
    id () {
      return this.$route.params.id
    },
    name () {
      return this.data.j.name
    },
    point () {
      if (
        !this.data ||
        !this.data.j ||
        !this.data.j.address ||
        !this.data.j.address.point
      ) {
        return
      }
      return this.data.j.address.point.replace(' ', ',')
    }
  },
  watch: {
    'data.j.links': 'checkAddLink'
  },
  created () {
    this.fetchData()
    this.debouncedCheckAddLink = debounce(this.checkAddLink, 350)
    this.debouncedSave = debounce(this.saveData)
  },
  methods: {
    ...mapActions({ alert: 'alerts/alert' }),
    ...mapMutations({
      setBusinessInfo: 'SET_BUSINESS_INFO'
    }),
    addLink () {
      if (!this.data.j.links) {
        this.data.j.links = {
          vk: '',
          instagram: '',
          others: [{ uri: '' }]
        }
      }
      if (!this.data.j.links.others || !this.data.j.links.others.length) {
        this.data.j.links.others = [{ uri: '' }]
      }

      this.checkAddLink()
      if (!this.addLinkDisabled) {
        this.data.j.links.others.push({ uri: '' })
        this.$forceUpdate()
      }
    },
    checkAddLink () {
      const sites = this.data.j.links && this.data.j.links.others

      if (!sites) {
        this.addLinkDisabled = false
        return
      }

      if (sites.some(site => !site.uri)) {
        this.addLinkDisabled = true
        return
      }

      this.addLinkDisabled = sites.length > 3
    },
    checkAddress () {
      return !!(
        this.data &&
        this.data.j &&
        this.data.j.address &&
        this.data.j.address.name &&
        this.data.j.address.point
      )
    },
    deleteLink (i) {
      if (!this.data.j.links || !this.data.j.links.others) {
        return
      }
      this.data.j.links.others.splice(i, 1)
      this.$emit('formChange')
    },
    emitTabChange () {
      this.hasFocused = true
      this.$emit('tabChange', this.data)
    },
    fetchData () {
      if (!this.businessInfo.id || this.businessInfo.id === 'new') {
        this.data.id = undefined
        this.addLink()
        if (this.businessInfo.j && this.businessInfo.j.schedule) {
          this.data.schedule = new BusinessSchedule(
            this.businessInfo.j.schedule
          )
          this.schedule = this.data.j.schedule
          this.hasSchedule = this.checkSchedule()
        }
        return
      }
      this.data
        .load(this.businessInfo.id)
        .then(() => {
          if (
            !(this.data.j && this.data.j.category) &&
            this.userInfo &&
            this.userInfo.data &&
            this.userInfo.data.j &&
            this.userInfo.data.j.category
          ) {
            this.data.j.category = this.userInfo.data.j.category
          }
          if (
            !this.data.j.links ||
            !this.data.j.links.others ||
            !this.data.j.links.others.length
          ) {
            this.addLink()
          }
          if (this.data.j.schedule) {
            this.schedule = this.data.j.schedule
          }

          this.hasAddress = this.checkAddress()
          this.hasSchedule = this.checkSchedule()
        })
        .catch((err) => {
          this.alert(makeAlert(err))
        })
    },
    checkSchedule () {
      if (
        this.data &&
        this.data.j &&
        this.data.j.schedule &&
        this.data.j.schedule.data &&
        this.data.j.schedule.data.length
      ) {
        const errorDays = this.data.j.schedule.data.filter(
          day => this.getDayScheduleErrors(day).length
        )

        if (errorDays.length) {
          return false
        }

        const notFilled = this.data.j.schedule.data.filter(
          day => (!day.start && !day[0]) || (!day.end && !day[1])
        )
        return notFilled && notFilled.length <= 6
      }

      return false
    },
    onAddressInput (val) {
      if (!this.data.j) {
        this.data.j = {}
      }
      this.data.j.address = val
      this.hasAddress = this.checkAddress()
      this.$emit('formChange')
    },
    onAvatarSave (img) {
      this.$set(this.data, 'j', { ...this.data.j, ...{ avatar: '' } })
      const id = uuidv4()
      this.saveImage(img, id).then(() => {
        this.data.save().then(() => {
          this.setBusinessInfo(this.data)
        })
      })
    },
    phonesEdit (payload) {
      this.$set(this.data, 'j', { ...this.data.j, ...{ phones: payload } })
      this.$emit('formChange')
    },
    saveData () {
      const schedule = this.data.j.schedule.data
      for (let i = 0; i < 7; i++) {
        !schedule[i] && (schedule[i] = { start: '', end: '' })
      }

      this.data
        .save()
        .then(() => {
          this.setBusinessInfo(this.data)
          this.$emit('saved')
        })
        .catch((err) => {
          this.alert(makeAlert(err))
        })
    },
    scheduleEdit (newWeek) {
      this.data.j.schedule = newWeek
      this.schedule = newWeek
      this.hasSchedule = this.checkSchedule()
      this.$emit('formChange')
    }
  }
}
</script>

<style lang="scss">
@import '~assets/styles/common.scss';
@import '~assets/styles/businesscard-form.scss';
@import '~assets/styles/dropdown-select.scss';
</style>
