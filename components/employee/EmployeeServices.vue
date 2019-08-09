<template>
  <div class="employee-services">
    <div class="employee-services__top">
      <h2 class="employee-services__title">
        Выберите предоставляемые услуги
      </h2>
      <h3 class="employee-services__subtitle _desktop">
        Укажите минимум 1 услугу для каждой выбранной категории
      </h3>
    </div>
    <div class="employee-services__center">
      <div class="employee-services__left">
        <Chip
          v-for="(services, category) in groupedBranchServices"
          :id="category"
          :key="category"
          :checked="!!selectedServiceGroups[category]"
          :label="category"
          name="service_category"
          :value="category"
          @change="onGroupsChange(category, $event)"
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
        <div
          v-for="(services, category) in groupedBranchServices"
          :key="category"
        >
          <Accordion
            v-if="!!selectedServiceGroups[category]"
          >
            <template slot="heading">
              <div>{{ category }}</div>
            </template>
            <template slot="content">
              <SmallCheckbox
                v-for="(service, servI) in groupedBranchServices[category]"
                :id="service.id"
                :key="servI"
                :checked="selectedServices.some(s => s.id === service.id)"
                name="selected_services"
                :value="service.name"
                @change="onServiceChange(service, category, $event)"
              >
                {{ service.name }}
              </SmallCheckbox>
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
// import { mapGetters } from 'vuex'
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
      search: '',
      selectedServiceGroups: {},
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
  },
  methods: {
    init () {
      this.employeeServiceGroups.forEach((category) => {
        this.selectedServiceGroups[category] = this.employeeServices.filter(s => s.j.group === category)
      })
      this.selectedServices = cloneDeep(this.employeeServices)
    },
    onGroupsChange (category, selected) {
      if (selected) {
        this.$set(this.selectedServiceGroups, category, this.businessServices.filter(s => s.j.group === category))
      } else if (this.selectedServiceGroups[category]) {
        this.$set(this.selectedServiceGroups, category, null)
      }
    },
    onServiceChange (service, category, selected) {
      if (selected) {
        this.selectedServices.push(service)
      } else {
        const i = this.selectedServices.findIndex(s => s.id === service.id)
        if (i > -1) {
          this.selectedServices.splice(i, 1)
        }
      }
    },
    onSave () {
      this.$emit('selected', this.selectedServices)
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
      min-width: 274px;
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
  .services-tree {
    &>.v-treeview-node {
      position: relative;
      margin: 10px 0;
      padding-left: 0;
      border-radius: 20px;
      background: rgba(137, 149, 175, 0.1);
      &>.v-treeview-node__root  {
        padding: 11px 45px 10px 36px;
        cursor: pointer;
        .v-treeview-node__label {
          font-family: Lato, sans-serif;
          font-weight: 600;
          font-size: 14px;
        }
      }
      &>.v-treeview-node__children {
        border-top: 1px solid #fff;
        padding: 12px 45px 16px 36px;
      }
      .v-treeview-node--leaf {
        margin: 5px 0 0;
        .v-treeview-node__root {
          display: block;
          min-height: 28px;
        }
        .v-treeview-node__content {
          display: inline-block;
        }
        .v-treeview-node__label {
          font-family: Lato, sans-serif;
          font-size: 14px;
          color: #8995AF;
        }
        &.v-treeview-node--selected .v-treeview-node__label {
          color: #07101C;
        }
      }
    }
    .v-icon.v-treeview-node__checkbox {
      position: absolute;
      right: 27px;
      width: 16px;
      height: 16px;
      border: 1px solid rgba(137, 149, 175, 0.2);
      border-radius: 2px;
      &.mdi-minus-box {
        border-color: rgba(137, 149, 175, 0.2);
        background: url('~assets/images/svg/selection.svg') center/10px auto no-repeat rgba(137, 149, 175, 0.5);
      }
      &.mdi-checkbox-marked {
        border-color: #5699FF;
        background: url('~assets/images/svg/selection.svg') center/10px auto no-repeat #5699FF;
      }
    }
  }
}
</style>
