<template>
  <PageLayout
    :is-edit-mode="isEditMode || isCreating"
    :is-edit-visible="!isCreating"
    :template="layoutText"
    :class="{ 'businesscard-form': isEditMode || isCreating }"
    @add="
      $router.push({
        name: 'id-businessEmployees-employee',
        params: { id: id, employee: 'new' }
      })
    "
    @changeMode="isEditMode = $event"
  >
    <template slot="breadcrumbs">
      <v-breadcrumbs :items="breadcrumbs" divider=" " />
    </template>
    <template v-if="!isEditMode && !isCreating" slot="content">
      <div class="tab-content employee-profile">
        <div class="infocard _view">
          <div v-if="employee && employee.j" class="infocard__content">
            <VLayout align-center column>
              <Avatar
                size=""
                :src="employee.j.image"
                :is-company-avatar="false"
                :is-editing="false"
                :name="employee.j.name"
                :avatar-class="'business-avatar'"
              />
              <div class="infocard__field-value employee-profile__title _name">
                {{ employee.j.name }}
              </div>
              <div class="infocard__field-value employee-profile__position">
                {{ employee.j.category }}
              </div>
            </VLayout>
            <VLayout column>
              <div v-if="phone" class="top-bordered">
                <div class="infocard__field-value">
                  <PhoneView :phone="phone" />
                </div>
              </div>
              <div v-if="employee.j.notes">
                <div class="infocard__field-title top-bordered">
                  Дополнительные сведения
                </div>
                <div class="infocard__field-value _description">
                  {{ employee.j.notes }}
                </div>
              </div>
              <div
                v-if="
                  employee.schedule &&
                    employee.schedule.data &&
                    employee.schedule.data.length
                "
              >
                <BusinessSchedule
                  :week-schedule="employee.schedule"
                  :expanded="scheduleExpanded"
                  @toggleSchedule="scheduleExpanded = !scheduleExpanded"
                />
              </div>
            </VLayout>
          </div>
        </div>
        <div v-if="empServices.length" class="infocard _view _services">
          <div class="infocard__content">
            <div class="employee-profile__title">
              Услуги
            </div>
            <div v-for="(category, catInd) in empServiceGroups" :key="catInd">
              <div>
                <Accordion>
                  <template slot="heading">
                    <div>{{ category }}</div>
                  </template>
                  <template slot="content">
                    <div
                      v-for="(service, servInd) in empServices"
                      :key="servInd"
                    >
                      <template
                        v-if="service.j && service.j.group === category"
                      >
                        <ServiceCard
                          :service="service"
                          :edit-mode="false"
                          :hoverable="false"
                          :responsive="true"
                        />
                      </template>
                    </div>
                  </template>
                </Accordion>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
    <template v-else slot="content">
      <AppTabs v-model="activeTab">
        <v-tab :key="0" ripple>
          Профиль
        </v-tab>
        <v-tab :key="1" ripple>
          Услуги
        </v-tab>
        <v-tab :key="2" ripple>
          График работы
        </v-tab>
      </AppTabs>
      <div class="tab-content">
        <v-form v-if="employee" ref="form" v-model="valid">
          <div v-show="activeTab === 0" class="infocard _edit">
            <div class="infocard__content">
              <EmployeeEdit
                v-if="employee"
                :employee="employee"
                @avatarChange="onAvatarChange"
              />
              <MainButton
                color="success"
                class="businesscard-form__next"
                :class="{ button_disabled: hasErrors }"
                @click.native.prevent="activeTab = 1"
              >
                Далее
              </MainButton>
            </div>
          </div>
          <div v-show="activeTab === 1" class="employee-profile-edit">
            <EmployeeServices
              :item="employee"
              :employee-services="empServices"
              :employee-service-groups="empServiceGroups"
              @selected="onServicesSelected"
              @nextStep="activeTab = 2"
            />
          </div>
          <div v-show="activeTab === 2" class="infocard _edit">
            <div class="infocard__content">
              <BusinessScheduleEdit
                :week-schedule="employee.schedule"
                @editWeek="onScheduleEdit"
              />
              <MainButton
                color="success"
                class="button save-info"
                :class="{ button_disabled: hasErrors }"
                @click.native.prevent="save"
              >
                Сохранить
              </MainButton>
            </div>
          </div>
        </v-form>
      </div>
    </template>
  </PageLayout>
</template>

<script>
import { mapState, mapGetters, mapActions, mapMutations } from 'vuex'
import axios from 'axios'
import Accordion from '~/components/common/Accordion.vue'
import AppTabs from '~/components/common/AppTabs.vue'
import PageLayout from '~/components/common/PageLayout.vue'
import EmployeeEdit from '~/components/employee/EmployeeEdit.vue'
import EmployeeServices from '~/components/employee/EmployeeServices.vue'
import PhoneView from '~/components/common/PhoneView.vue'
import BusinessSchedule from '~/components/business/BusinessSchedule.vue'
import BusinessScheduleEdit from '~/components/business/BusinessScheduleEdit.vue'
import Avatar from '~/components/avatar/Avatar.vue'
import MainButton from '~/components/common/MainButton.vue'
import ServiceCard from '~/components/services/ServiceCard.vue'

import { businessMixins } from '~/components/business/mixins'
import { fullName } from '~/components/business/utils'
import Employee from '~/classes/employee'
import { makeAlert } from '~/api/utils'

export default {
  components: {
    Accordion,
    Avatar,
    AppTabs,
    EmployeeEdit,
    EmployeeServices,
    PhoneView,
    BusinessSchedule,
    BusinessScheduleEdit,
    MainButton,
    PageLayout,
    ServiceCard
  },
  mixins: [businessMixins],
  data () {
    return {
      activeTab: 0,
      employee: undefined,
      dialog: false,
      isEditMode: false,
      scheduleExpanded: false,
      valid: false
    }
  },
  computed: {
    ...mapState({
      businessServices: state => state.business.businessServices
    }),
    ...mapGetters({
      businessId: 'business/businessId',
      businessInfo: 'business/businessInfo'
    }),
    breadcrumbs () {
      const businessId = this.id
      const employeeId = this.employeeId
      const employee = this.employee

      if (!businessId || !employeeId || !employee) {
        return []
      }

      return [
        {
          text: 'Сотрудники',
          disabled: false,
          href: `/${businessId}/employeeList`
        },
        {
          text: `${employee.id ? employee.name : 'Новый сотрудник'}`,
          disabled: true,
          href: `/${businessId}/employeeList/${employeeId}`
        }
      ]
    },
    empServices () {
      if (!this.businessServices || !this.businessServices.length) {
        return []
      }
      return this.businessServices.filter(
        s => s.j.employees && s.j.employees.includes(this.employeeId)
      )
    },
    empServiceGroups () {
      return [
        ...new Set(
          this.empServices.map(s => s.j && s.j.group).filter(g => !!g)
        )
      ]
    },
    fullName () {
      return fullName(this.employee)
    },
    isCreating () {
      return (
        this.$route &&
        this.$route.params &&
        this.$route.params.employee &&
        this.$route.params.employee === 'new'
      )
    },
    hasCategory () {
      return !!(this.employee && this.employee.j && this.employee.j.category)
    },
    hasErrors () {
      return !(this.hasName && this.hasCategory)
    },
    hasName () {
      return !!(this.employee && this.employee.j && this.employee.j.name)
    },
    layoutText () {
      return this.isCreating
        ? { headerText: 'Новый сотрудник', buttonText: '' }
        : { headerText: 'Профиль сотрудника', buttonText: '' }
    },
    phone () {
      return (
        this.employee.j && this.employee.j.phones && this.employee.j.phones[0]
      )
    },
    workDaysCount () {
      const schedule = this.employee.j.schedule
      if (!schedule || !schedule.data || !schedule.data.length) {
        return 0
      }

      return schedule.data.filter(day => day && day.start && day.end).length
    }
  },
  watch: {
    employeeId: 'loadEmployee'
  },
  mounted () {
    this.loadEmployee()
  },
  methods: {
    ...mapActions({
      alert: 'alerts/alert',
      deleteEmployee: 'employee/deleteEmployee',
      setEmployeeItem: 'employee/setEmployeeItem',
      loadBusinessServices: 'business/loadBusinessServices'
    }),
    ...mapMutations({
      LOAD_EMPLOYEES: 'employee/LOAD_EMPLOYEES'
    }),
    deleteItem () {
      if (this.employeeId && this.employeeId !== 'new') {
        this.deleteEmployee(this.employeeId)
      }
      this.exit()
    },
    exit () {
      this.$router.back()
    },
    loadEmployee () {
      if (!this.employeeId) { return }
      this.employee = new Employee(
        this.employeeId === 'new' ? { parent: this.id } : {}
      )
      this.employee.load(this.employeeId).then((res) => {
        this.setEmployeeItem(res)
      })
    },
    onAvatarChange (img) {
      if (!img) {
        return false
      }
      const blobBin = atob(img.toDataURL().split(',')[1])
      const array = []

      for (let i = 0; i < blobBin.length; i++) {
        array.push(blobBin.charCodeAt(i))
      }
      const file = new Blob([new Uint8Array(array)], { type: 'image/png' })
      const formData = new FormData()
      const newFileName = `${this.uuidv4()}.png`

      formData.append('file', file, newFileName)

      axios
        .post(process.env.VUE_APP_UPLOAD, formData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`
          }
        })
        .then(() => {
          this.employee.image = newFileName
        })
        .catch(function (e) {
          console.log('FAILURE!! ', e)
        })
    },
    onScheduleEdit (newWeek) {
      this.employee.schedule = newWeek
    },
    onServicesSelected (payload) {
      this.employee.services = payload
      // this.activeTab = 2
    },
    save () {
      if (!this.employeeId) { return }

      this.employee.services =
        this.employee.services && this.employee.services.length
          ? this.employee.services
            .map(s => (s && typeof s === 'object' ? s.id : s))
            .filter(s => !!s)
          : []

      if (!this.workDaysCount) {
        this.employee.j.schedule = this.employee.j.schedule || {
          data: [],
          type: 'week'
        }
        this.employee.j.schedule.data = this.businessInfo.j.schedule.data
      }

      this.employee.save().then((res) => {
        // Because Employee services'info like titles is rendered from businessServices,
        // we need to update it to get visual change of employee services
        this.loadBusinessServices(this.businessId)
        if (this.employeeId === 'new') {
          this.$router.replace({
            name: 'id-businessEmployees-employee',
            params: { id: this.id, employee: res }
          })
        } else {
          this.isEditMode = false
          this.loadEmployee()
        }
      })
        .catch((err) => {
          this.alert(makeAlert(err))
        })
    }
  }
}
</script>

<style lang="scss">
@import '~assets/styles/infocard.scss';
@import '~assets/styles/businesscard-form.scss';

.tab-content {
  @media only screen and (min-width: $desktop) {
    padding-left: 127px;
  }
  .infocard._emp-serv {
    max-width: 100%;
    width: auto;
    // padding-right: 40px;
    .infocard__content {
      max-width: 100%;
    }
  }
}
.employee-profile {
  color: #07101c;
  @media only screen and (min-width: $tablet) {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
  }

  &__title {
    font-size: 24px;
    &._name {
      text-align: center;
    }
  }
  &__position {
    font-size: 14px;
    color: #8995af;
  }
  .v-avatar {
    margin-bottom: 24px !important;
  }
  .infocard._view {
    @media only screen and (min-width: $tablet) {
      width: 400px;
      margin: 0 auto 10px;
    }
    @media only screen and (min-width: $desktop) {
      margin: 0 10px 10px 0;
    }
  }
  ._view .infocard__content {
    @media only screen and (min-width: $desktop) {
      padding: 40px 60px 60px;
    }
  }
  ._view._services {
    @media only screen and (min-width: 1350px) {
      width: 540px;
    }
  }
}
.employee-profile-edit {
  .infocard__content {
    @media only screen and (min-width: $tablet) {
    }
  }
}
</style>
