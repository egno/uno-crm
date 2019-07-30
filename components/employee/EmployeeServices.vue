<template>
  <div class="employee-services">
    <div v-show="!showServices" class="infocard _edit">
      <div class="infocard__content">
        <h2 class="employee-services__title">
          Выберите категории услуг, которые вы предоставляете
        </h2>
        <div class="employee-services__categories">
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
        <MainButton
          color="success"
          class="businesscard-form__next"
          :class="{ button_disabled: !selectedServiceGroups.length }"
          @click.native.prevent="showServices = true"
        >
          К услугам
        </MainButton>
      </div>
    </div>
    <div v-show="showServices" class="edit-services">
      <div class="employee-services__header">
        <div class="employee-services__left">
          <h2 class="employee-services__title">
            Выберите предоставляемые услуги из категории
            {{ selectedServiceGroups[currentStep] }}
          </h2>
          <h3 class="employee-services__subtitle">
            Укажите минимум 1 услугу для каждой выбранной категории
          </h3>
        </div>
        <Steps
          :current-step="currentStep"
          :length="selectedServiceGroups.length"
          header="Категория"
          @changeStep="currentStep = $event"
        />
      </div>
      <div v-for="category in selectedServiceGroups" :key="category">
        <div v-show="category === selectedServiceGroups[currentStep]" class="employee-services__services">
          <ServiceCard
            v-for="(service, servInd) in businessServices.filter(
              s => s.j.group === category
            )"
            :key="servInd"
            :service="service"
            :edit-mode="false"
            :is-selected="selectedServices.includes(service)"
            :responsive="true"
            @click="onSelect(service)"
          />
        </div>
      </div>
      <div class="employee-services__buttons">
        <MainButton
          color="success"
          class="employee-services__back"
          @click.native.prevent="showServices = false"
        >
          Назад к категориям
        </MainButton>
        <MainButton
          color="success"
          class="employee-services__next"
          :class="{
            button_disabled: !selectedServices.some(s => s.j.group === selectedServiceGroups[currentStep])
          }"
          @click.native.prevent="onNext"
        >
          Далее
        </MainButton>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import ServiceCard from '~/components/services/ServiceCard.vue'
import AppCheckbox from '~/components/common/AppCheckbox.vue'
import MainButton from '~/components/common/MainButton.vue'
import Steps from '~/components/common/Steps.vue'

export default {
  components: { AppCheckbox, MainButton, ServiceCard, Steps },
  props: {
    item: {
      type: Object,
      default () {
        return {}
      }
    },
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
      selectedServiceGroups: [],
      selectedServices: [],
      showServices: false,
      currentStep: 0
    }
  },
  computed: {
    ...mapState({
      businessServices: state => state.business.businessServices
    }),
    ...mapGetters({businessServiceCategories: 'business/businessServiceCategories'}),
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
      this.selectedServices = this.employeeServices.slice()
    },
    onGroupsChange (category, selected) {
      if (selected) {
        this.selectedServiceGroups.push(category)
      } else {
        const i = this.selectedServiceGroups.indexOf(category)

        if (i > -1) {
          this.selectedServiceGroups.splice(i, 1)
          this.selectedServices = this.selectedServices.filter(s => this.selectedServiceGroups.includes(s.j.group))
        }
      }
      this.$emit('selected', this.selectedServices)
    },
    onNext () {
      if (this.currentStep === this.selectedServiceGroups.length - 1) {
        this.$emit('selected', this.selectedServices)
        this.$emit('nextStep')
      } else {
        this.currentStep++
      }
    },
    onSelect (service) {
      const i = this.selectedServices.indexOf(service)

      if (i > -1) {
        this.selectedServices.splice(i, 1)
      } else {
        this.selectedServices.push(service)
      }
    }
  }
}
</script>

<style lang="scss">
  @import '~/assets/styles/common.scss';

  .employee-services {
    &__header {
      font-family: $lato;
      text-align: center;

      @media only screen and (min-width: $desktop) {
        display: flex;
        justify-content: space-between;
        text-align: left;
      }
    }
    &__title {
      margin: 0 auto;
      font-weight: 900;
      font-size: 16px;
      color: #07101C;
      @media only screen and (min-width : $tablet) {
        max-width: 85%;
      }
      @media only screen and (min-width : $desktop) {
        max-width: 100%;
      }
    }
    &__subtitle {
      font-weight: normal;
      font-size: 14px;
      color: #8995AF;
    }
    &__categories,
    &__services {
      margin-top: 40px;
    }
    &__services {
      padding: 25px 8px 0;
      border-top: 1px solid rgba(137, 149, 175, 0.1);
      @media only screen and (min-width : $desktop) {
        display: flex;
        flex-wrap: wrap;
        justify-content: flex-start;
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
      color: #8995AF;
      &:hover {
        color: #07101C;
      }
    }
    &__next {
      width: 240px;
      color: #fff;
      background-color: #5699FF;
    }
    .edit-services {
      padding: 30px 37px 60px;
      background: #fff;

      @media only screen and (min-width : $tablet) {
        max-width: 524px;
        margin: 0 auto;
        box-shadow: 0 2px 12px rgba(137, 149, 175, 0.1);
      }
      @media only screen and (min-width : $desktop) {
        max-width: 100%;
        margin: 0 40px 0 0;
        padding: 40px 60px 60px;
      }
    }
  }
</style>
