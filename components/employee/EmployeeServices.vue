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
        <AppCheckbox
          v-for="(category, i) in businessServiceCategories"
          :id="category"
          :key="i"
          :checked="selectedServiceGroups.includes(category)"
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
            label="ВВЕДИТЕ УСЛУГУ"
            flat
          />
        </div>
        <v-treeview
          ref="tree"
          v-model="selectedItems"
          :search="search"
          :items="treeItems"
          item-key="name"
          open-on-click
          open-all
          return-object
          selectable
          class="services-tree"
        />
      </div>
    </div>
    <div class="employee-services__buttons">
      <MainButton
        color="success"
        class="employee-services__back"
        @click.native.prevent=""
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
import { mapState, mapGetters } from 'vuex'
import AppCheckbox from '~/components/common/AppCheckbox.vue'
import MainButton from '~/components/common/MainButton.vue'

export default {
  components: { AppCheckbox, MainButton },
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
      selectedServiceGroups: [],
      selectedItems: []
    }
  },
  computed: {
    ...mapState({
      businessServices: state => state.business.businessServices
    }),
    ...mapGetters({
      businessServiceCategories: 'business/businessServiceCategories'
    }),
    isDesktop () {
      if (process.client) {
        return window && window.innerWidth > 1300
      } else {
        return false
      }
    },
    selectedServices () {
      return this.selectedItems.filter(item => !!item.id)
    },
    treeItems () {
      const categories = this.selectedServiceGroups.map((category) => {
        const services = this.businessServices.filter(s => s.j.group === category)

        return {
          name: category,
          children: services
        }
      })
      return categories
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
      this.selectedServiceGroups = this.employeeServiceGroups.slice()
      this.selectedItems = this.employeeServices.map(item => ({ name: item.name, id: item.id }))
    },
    onGroupsChange (category, selected) {
      if (selected) {
        this.selectedServiceGroups.push(category)
      } else {
        const i = this.selectedServiceGroups.indexOf(category)

        if (i > -1) {
          this.selectedServiceGroups.splice(i, 1)
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
      display: inline-flex;
      min-width: 274px;
      padding: 28px 8px;
    }
  }
  &__right {
    padding-top: 26px;
    @media only screen and (min-width: $desktop) {
      min-height: 300px;
      padding: 28px 40px;
      border-left: 1px solid rgba(137, 149, 175, 0.2);
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
        margin-left: 0;
        .v-treeview-node__root {
          min-height: 28px;
        }
        .v-treeview-node__label {
          font-family: Lato, sans-serif;
          font-size: 14px;
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
