<template>
  <div class="employee-services">
    <div class="employee-services__top">
      <h2 class="employee-services__title">
        Выберите предоставляемые услуги
      </h2>
    </div>
    <div class="employee-services__center">
      <div class="employee-services__left">
        <Chip
          v-for="(services, category) in groupedBranchServices"
          :id="category"
          :key="category"
          :checked="selectedGroups.includes(category)"
          :label="filterText(category)"
          name="service_category"
          :value="category"
          @change="onFilterClick(category, $event)"
        />
      </div>
      <div class="employee-services__right">
        <h3 class="employee-services__subtitle">
          Выберите услуги из списка
          или начните вводить название услуги
          в строку поиска
        </h3>
        <div class="employee-services__search">
          <v-text-field
            v-model="search"
            placeholder="ВВЕДИТЕ УСЛУГУ"
            flat
          />
        </div>
        <div v-if="search.length && !businessServices.some(isServiceVisible)" class="employee-services__right-text">
          Не найдено подходящих услуг
        </div>
        <div
          v-for="(services, category) in groupedBranchServices"
          :key="category"
        >
          <Accordion
            v-show="isCategoryVisible(category)"
            :expanded="search.length ? isCategoryVisible(category) : expanded[category]"
            @click="expanded[category] = $event"
          >
            <template slot="heading">
              <SmallCheckbox
                :id="category"
                :checked="groupedSelectedServices[category] && groupedSelectedServices[category].length === groupedBranchServices[category].length"
                name="category"
                :value="category"
                @change="toggleCategory(category, $event)"
              >
                {{ category }}
              </SmallCheckbox>
            </template>
            <template slot="content">
              <div
                v-for="(service, servI) in groupedBranchServices[category]"
                :key="servI"
              >
                <SmallCheckbox
                  v-show="isServiceVisible"
                  :id="service.id"
                  :checked="selectedServices.some(s => s.id === service.id)"
                  name="selected_services"
                  :value="service.name"
                  @change="onServiceChange(service, $event)"
                >
                  {{ service.name }}
                </SmallCheckbox>
              </div>
            </template>
          </Accordion>
        </div>
      </div>
    </div>
    <div class="employee-services__buttons">
      <MainButton
        color="success"
        class="employee-services__back"
        @click.native.prevent="$emit('goBack')"
      >
        Назад
      </MainButton>
      <MainButton
        color="success"
        class="button employee-services__next"
        @click.native.prevent="onSave"
      >
        Сохранить
      </MainButton>
    </div>
  </div>
</template>

<script>
import { cloneDeep } from 'lodash'
import Chip from '~/components/common/Chip.vue'
import MainButton from '~/components/common/MainButton.vue'
import Accordion from '~/components/common/Accordion.vue'
import { servicesMixin } from '~/mixins/services'
import SmallCheckbox from '~/components/common/SmallCheckbox'

export default {
  components: { SmallCheckbox, Accordion, Chip, MainButton },
  mixins: [ servicesMixin ],
  props: {
    employeeServices: {
      type: Array,
      default () {
        return []
      }
    },
    employeeServiceGroups: {
      type: Array,
      default () {
        return []
      }
    }
  },
  data () {
    return {
      expanded: {},
      search: '',
      selectedGroups: [],
      selectedServices: []
    }
  },
  computed: {
    isDesktop () {
      if (process.client) {
        return window && window.innerWidth > 1300
      } else {
        return false
      }
    },
    groupedSelectedServices () {
      const obj = {}

      this.selectedServices.forEach((s) => {
        if (!s.j || !s.j.group) {
          return
        }
        const category = s.j.group

        if (!obj[category]) {
          obj[category] = []
        }

        if (!obj[category].includes(s)) {
          obj[category].push(s)
        }
      })

      return obj
    }
  },
  watch: {
    employeeServiceGroups: {
      handler: 'init',
      deep: true
    },
    employeeServices: {
      handler: 'init',
      deep: true
    }
  },
  created () {
    this.init()
    Object.keys(this.groupedBranchServices).forEach((key) => { this.$set(this.expanded, key, false) })
  },
  methods: {
    addService (service) {
      const category = service.j.group
      if (this.selectedServices.some(s => s.id === service.id)) {
        return
      }
      this.selectedServices.push(service)
      if (!this.selectedGroups.includes(category)) {
        this.selectedGroups.push(category)
      }
    },
    filterText (category) {
      const selectedServices = this.groupedSelectedServices[category] || []
      return `${category} ${selectedServices.length}/${this.groupedBranchServices[category].length}`
    },
    init () {
      this.employeeServices.forEach((s) => {
        if (s.j.group && !this.selectedGroups.includes(s.j.group)) {
          this.selectedGroups.push(s.j.group)
        }
      })
      this.selectedServices = cloneDeep(this.employeeServices)
    },
    isCategoryVisible (category) {
      const search = this.search
      return search.length
        ? search.length > 2 && this.groupedBranchServices[category].some(this.isServiceVisible)
        : this.selectedGroups.includes(category)
    },
    isServiceVisible (service) {
      return service.name.toLowerCase().includes(this.search.toLowerCase())
    },
    onFilterClick (category, selected) {
      if (selected && !this.selectedGroups.includes(category)) {
        this.selectedGroups.push(category)
      } else {
        if (this.groupedSelectedServices[category]) {
          return
        }
        const i = this.selectedGroups.indexOf(category)
        if (i > -1) {
          this.selectedGroups.splice(i, 1)
        }
      }
    },
    onServiceChange (service, selected) {
      if (selected) {
        this.addService(service)
      } else {
        this.removeService(service)
      }
    },
    onSave () {
      if (this.selectedGroups.length) {
        this.$emit('selected', this.selectedServices)
      } else {
        this.$emit('selected', [])
      }
    },
    removeService (service) {
      const i = this.selectedServices.findIndex(s => s.id === service.id)
      if (i > -1) { this.selectedServices.splice(i, 1) }
    },
    toggleCategory (category, selected) {
      if (selected) {
        this.groupedBranchServices[category].forEach((filialService) => {
          this.addService(filialService)
        })
      } else {
        this.groupedSelectedServices[category].forEach((selectedService) => {
          this.removeService(selectedService)
        })
      }
    }
  }
}
</script>

<style lang="scss">
@import '~assets/styles/common.scss';

.employee-services {
  max-width: 800px;
  padding-bottom: 50px;
  background-color: #fff;
  &__top {
    padding: 40px;
    text-align: center;
    @media only screen and (min-width: $desktop) {
      padding: 52px 0 32px;
      margin: 0 50px;
      text-align: left;
      border-bottom: 1px solid rgba(137, 149, 175, 0.2);
    }
  }
  &__title {
    margin: 0 auto;
    font-weight: 900;
    font-size: 16px;
    color: #07101c;
    @media only screen and (min-width: $tablet) {
      max-width: 85%;
    }
    @media only screen and (min-width: $desktop) {
      max-width: 100%;
    }
  }
  &__subtitle {
    font-weight: normal;
    font-size: 14px;
    color: #8995af;
    text-align: center;
  }
  &__center {
    margin: 0 30px;
    @media only screen and (min-width: $desktop) {
      display: flex;
      margin: 0 50px;
      border-bottom: 1px solid rgba(137, 149, 175, 0.2);
    }
  }
  &__left {
    display: none;
    @media only screen and (min-width: $desktop) {
      display: block;
      width: 274px;
      flex-shrink: 0;
      padding: 28px 8px;
    }
    .checkbox {
      display: inline-flex;
    }
  }
  &__right {
    padding-top: 26px;
    @media only screen and (min-width: $desktop) {
      min-height: 40vh;
      padding: 28px 40px;
      border-left: 1px solid rgba(137, 149, 175, 0.2);
    }
  }
  &__search {
    width: 290px;
    margin: 0 auto;
    input {
      text-align: center;
      &::placeholder {
        font-size: 12px;
        letter-spacing: 0.25em;
      }
    }
  }
  &__right-text {
    text-align: center;
    color: #EF4D37;
  }
  &__item {
    display: flex;
    height: 40px;
    margin: 5px 0;
    padding: 0 27px 0 40px;
    align-items: center;
    font-weight: normal;
    font-size: 14px;
    color: #8995af;
    border-radius: 20px;
    &.selected {
      background: rgba(137, 149, 175, 0.2);
      color: #07101C;
    }
  }
  &__buttons {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    margin-top: 50px;
    button {
      @extend %button;
      margin: 0 30px;
    }
  }
  &__back {
    color: #8995af;
    &:hover {
      color: #07101c;
    }
  }
  ._desktop {
    display: none;
    @media only screen and (min-width: $desktop) {
      display: flex;
    }
  }
  .accordion__header {
    padding-right: 23px;
    &:after {
      left: 20px;
    }
    .default-checkbox {
      margin: 0;
    }
    .default-checkbox__label {
      color: #07101c;
    }
  }
}
</style>
