<template>
  <v-dialog
    :value="visible"
    :content-class="`right-attached-panel ${create ? 'create' : 'edit'}`"
    persistent
    transition="slide"
    @input="onClose"
  >
    <VForm
      ref="form"
      :value="!saveDisabled"
      class="right-attached-panel__container"
      @input="onFormInput"
    >
      <button
        type="button"
        class="right-attached-panel__close"
        @click="onClose"
      />
      <div class="right-attached-panel__content">
        <div class="right-attached-panel__header">
          {{ create ? 'Создать услугу' : 'Редактировать услугу' }}
        </div>

        <div class="right-attached-panel__field-block _select">
          <SearchSelect
            :searching-value="name"
            :options="suggestedServiceNames"
            :error="nameHasError"
            :required="true"
            :max-length="150"
            label="НАЗВАНИЕ УСЛУГИ"
            attach=".right-attached-panel__field-block._select"
            @blur="onNameInputBlur"
            @input="onInputName"
            @select="name = $event"
            @error="error = $event"
          />
        </div>

        <div class="right-attached-panel__field-block _groups dropdown-select">
          <VSelect
            v-model="group"
            :items="serviceGroups"
            :item-text="(servGr) => servGr.name"
            placeholder="КАТЕГОРИЯ"
            :rules="[rules.required]"
            :attach="
              create
                ? '.create .right-attached-panel__field-block._groups'
                : '.edit .right-attached-panel__field-block._groups'
            "
            @blur="
              !group && (error = 'Необходимо заполнить все обязательные поля')
            "
          />
        </div>

        <div class="right-attached-panel__field-block">
          <div class="right-attached-panel__field-name">
            Пол
          </div>
          <input
            :id="create ? 'male' : 'male2'"
            v-model="sex"
            type="checkbox"
            value="male"
            class="filters__item right-attached-panel__sex"
          >
          <label
            :for="create ? 'male' : 'male2'"
            class="right-attached-panel__checkbox-label"
          >Муж</label>
          <input
            :id="create ? 'female' : 'female2'"
            v-model="sex"
            type="checkbox"
            value="female"
            class="filters__item right-attached-panel__sex"
          >
          <label
            :for="create ? 'female' : 'female2'"
            class="right-attached-panel__checkbox-label"
          >Жен</label>
          <input
            :id="create ? 'child' : 'child2'"
            v-model="sex"
            type="checkbox"
            value="child"
            class="filters__item right-attached-panel__sex"
          >
          <label
            :for="create ? 'child' : 'child2'"
            class="right-attached-panel__checkbox-label"
          >Дети</label>
        </div>

        <div class="right-attached-panel__field-block">
          <div class="right-attached-panel__field-name">
            Цена
          </div>
          <div class="right-attached-panel__row">
            <div class="right-attached-panel__from">
              от
            </div>
            <VTextField
              v-model="price"
              mask="#####"
              placeholder="0"
              :rules="[rules.required]"
              class="right-attached-panel__price"
            />
            рублей
          </div>
        </div>

        <div class="right-attached-panel__field-block">
          <div class="right-attached-panel__field-name">
            Длительность (мин)
          </div>
          <Counter
            :id="
              create
                ? 'create-service-duration'
                : 'right-attached-panel-duration'
            "
            :input-disabled="true"
            :round-counter="true"
            :value="duration"
            :min-value="15"
            :max-value="720"
            :interval="15"
            :class="{ _invalid: duration < 15 || duration > 720 }"
            @changeCount="duration = $event"
          />
        </div>

        <div
          class="right-attached-panel__field-block _employees dropdown-select"
        >
          <VSelect
            v-model="selectedEmployees"
            :items="employees"
            :item-text="employeeFullName"
            multiple
            placeholder="ВЫБЕРИТЕ МАСТЕРОВ"
            return-object
            chips
            deletable-chips
            :attach="
              create
                ? '.create .right-attached-panel__field-block._employees'
                : '.edit .right-attached-panel__field-block._employees'
            "
          />
        </div>

        <div class="right-attached-panel__field-block">
          <VTextarea
            v-model="description"
            label="ОПИСАНИЕ"
            counter="1000"
            rows="1"
            :auto-grow="true"
            @input.native="
              sliceByLength('description', 1000, $event.target.value)
            "
          />
        </div>

        <div v-if="error" class="right-attached-panel__error">
          {{ error }}
        </div>

        <div v-if="errorMessage" class="right-attached-panel__error">
          {{ errorMessage }}
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
          <template v-if="!create">
            <button
              type="button"
              class="right-attached-panel__cancel"
              @click="onClose"
            >
              Отмена
            </button>
          </template>
        </div>
      </div>
    </VForm>
  </v-dialog>
</template>

<script>
/* eslint-disable prefer-const */
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
import { isEqual, debounce } from 'lodash'
import Counter from '~/components/common/Counter'
import SearchSelect from '~/components/common/SearchSelect.vue'
import Api from '~/api/backend'
import { makeAlert } from '~/api/utils'

export default {
  components: {
    SearchSelect,
    Counter
  },
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
    branchId: {
      type: String,
      default: '',
      required: true
    },
    create: {
      type: Boolean,
      default: false,
      required: true
    },
    service: {
      type: Object,
      default () {
        return {}
      }
    },
    errorMessage: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      companyServices: [],
      name: '',
      nameHasError: false,
      group: '',
      sex: [],
      price: '',
      duration: 15,
      description: '',
      selectedEmployees: [],
      rules: {
        required: value => !!value || 'Это поле обязательно для заполнения',
        maxLength: length => value =>
          (value && (value.length <= length || 'Слишком длинный текст')) || true
      },
      employeeFullName (e) {
        return `${e.j.name}${e.j.surname ? ' ' + e.j.surname : ''}`
      },
      error: ''
    }
  },
  computed: {
    ...mapState({
      businessServices: state => state.business.businessServices,
      serviceList: state => state.service.serviceList
    }),
    ...mapGetters({
      serviceGroups: 'service/serviceGroups',
      employees: 'employee/employees',
      businessInfo: 'business/businessInfo'
    }),
    saveDisabled () {
      return !this.name || !this.group || !this.duration || !this.price
    },
    suggestedServiceNames () {
      const base = this.serviceList.map(s => s.name)
      const company = this.companyServices.map(s => s.name)
      const branch = this.businessServices.map(s => s.name)

      return [...new Set(base.concat(company))].filter(
        name => !branch.includes(name)
      )
    }
  },
  watch: {
    service: 'init',
    visible: 'init',
    businessInfo: 'getCompanyServices'
  },
  created () {
    this.debouncedGetServices = debounce(this.getServices, 350)
  },
  methods: {
    ...mapMutations({ LOAD_SERVICE_LIST: 'service/LOAD_SERVICE_LIST' }),
    ...mapActions({ alert: 'alerts/alert' }),
    sliceByLength (property, length, val) {
      if (!val) {
        return
      }
      if (val.length > length) {
        this[property] = val.substring(0, length)
      } else {
        this[property] = val
      }
    },
    hasDiff () {
      if (!this.service || !this.service.j) {
        return (
          this.name ||
          this.group ||
          this.sex.length ||
          Number(this.price) ||
          this.duration !== 15 ||
          this.selectedEmployees.length ||
          this.description
        )
      }

      const {
        group,
        sex,
        price,
        duration,
        description,
        employees
      } = this.service.j

      if (!isEqual(this.sex.sort(), sex.slice().sort())) { return true }
      if (
        !isEqual(
          this.selectedEmployees.map(e => e && e.id).sort(),
          employees.slice().sort()
        )
      ) { return true }

      return (
        this.name !== this.service.name ||
        this.group !== group ||
        Number(this.price) !== Number(price) ||
        this.duration !== duration ||
        this.description !== description
      )
    },
    init () {
      if (this.$refs.form) {
        this.$refs.form.reset()
      }

      if (!this.service || !this.service.j) {
        this.name = ''
        this.group = ''
        this.sex = []
        this.price = ''
        this.duration = 15
        this.selectedEmployees = []
        this.description = ''
        return
      }
      const {
        group,
        sex,
        price,
        duration,
        description,
        employees
      } = this.service.j

      this.name = this.service.name
      this.group = group
      this.sex = sex || []
      this.price = price || ''
      this.duration = duration || 15
      this.description = description || ''
      this.selectedEmployees =
        (employees && this.employees.filter(e => employees.includes(e.id))) ||
        []
    },
    getCompanyServices () {
      if (!this.businessInfo.parent) {
        return
      }
      const path = `business_service?parent=eq.${this.businessInfo.parent}`

      Api()
        .get(path)
        .then(res => res.data)
        .then((res) => {
          this.companyServices = res
        })
        .catch((err) => {
          this.alert(makeAlert(err))
        })
    },
    getServices () {
      Api()
        .get(`service?name=ilike.*${this.name}*`)
        .then(res => res.data)
        .then((res) => {
          res &&
            res.length &&
            this.LOAD_SERVICE_LIST(this.serviceList.concat(res))
        })
    },
    onClose () {
      this.$emit('close', {
        hasDiff: this.hasDiff(),
        service: this.prepareNewService()
      })
    },
    onInputName (val) {
      this.error = ''
      this.nameHasError = false
      this.sliceByLength('name', 150, val)
      if (this.name.length < 2) {
        return
      }

      this.debouncedGetServices()
    },
    onNameInputBlur (event) {
      const newName = event.target.value.toLowerCase()
      const branchServices = this.businessServices.map(s =>
        s.j.name.toLowerCase()
      )

      if (branchServices.includes(newName)) {
        this.error = 'Услуга с таким названием уже существует'
        this.nameHasError = true
      }
    },
    onFormInput (valid) {
      if (valid) {
        this.error = ''
        this.nameHasError = false
      }
    },
    onSave () {
      this.$emit('save', this.prepareNewService())
    },
    prepareNewService () {
      let {
        name,
        group,
        sex,
        price,
        duration,
        description,
        selectedEmployees
      } = this.$data
      const employees = selectedEmployees && selectedEmployees.map(e => e.id)

      if (!sex.length) {
        sex = ['male', 'female', 'child']
      }

      return {
        name,
        group,
        sex,
        price,
        duration,
        description,
        employees
      }
    }
  }
}
</script>

<style lang="scss">
@import '~/assets/styles/common.scss';
@import '~/assets/styles/right-attached-panel.scss';

.slide-enter,
.slide-leave-to {
  right: -440px !important;
}
</style>
