<template>
  <PageLayout
    :is-button-visible="true"
    :template="{ headerText: 'Сотрудники', buttonText: 'Новый сотрудник' }"
    @add="
      $router.push({
        name: 'employeeProfile',
        params: { id: id, employee: 'new' }
      })
    "
  >
    <template slot="content">
      <div
        v-if="businessEmployees && businessEmployees.length"
        class="employees-list"
      >
        <div class="filters">
          <div
            v-for="category in employeesCategories"
            :key="category"
            @click="toggleCategory(category)"
          >
            <div
              v-if="category"
              class="filters__item"
              :class="{ _active: selectedCategories.includes(category) }"
            >
              {{ category }}
            </div>
          </div>
          <div
            class="filters__item"
            :class="{
              _active: searchString
                ? businessEmployees.filter((e) => isMatchingSearch(e))
                  .length === businessEmployees.length
                : selectedCategories &&
                  selectedCategories.length >= employeesCategories.length
            }"
            @click="toggleAll"
          >
            Все мастера
          </div>
        </div>
        <div class="filter-results">
          <div
            v-for="category in selectedCategories"
            :key="category"
            class="filter-results__group"
          >
            <template
              v-if="
                businessEmployees.some((e) => e.j && e.j.category === category)
              "
            >
              <div class="filter-results__group-name">
                {{ category ? category : '' }}
              </div>
              <div class="filter-results__cards">
                <div v-for="(employee, i) in businessEmployees" :key="i">
                  <EmployeeCard
                    v-if="
                      employee.j.category === category &&
                        isMatchingSearch(employee)
                    "
                    :employee="employee"
                    :services-count="empServices(employee.id)"
                    @delete="showDeleteDialog(employee)"
                    @calendarClick="openRegistry"
                    @click="
                      $router.push({
                        name: 'employeeProfile',
                        params: { id: id, employee: employee.id }
                      })
                    "
                  />
                </div>
              </div>
            </template>
          </div>
        </div>
      </div>
      <div v-else>
        <VLayout align-center justify-center column fill-height>
          <VFlex pa-5>
            <div class="font-weight-bold">
              Создайте своего первого сотрудника
            </div>
          </VFlex>
        </VLayout>
      </div>
      <Modal
        :visible="deleteModalVisible"
        :template="deleteTemplate"
        @close="deleteModalVisible = false"
        @leftButtonClick="
          deleteModalVisible = false
          empToDelete = null
        "
        @rightButtonClick="deleteEmployee"
      >
        <template slot="text">
          <div
            v-if="empToDelete && empToDelete.j && empToDelete.j.name"
            class="uno-modal__text"
          >
            Вы точно хотите удалить сотрудника <b>{{ empToDelete.j.name }}?</b>
            <span v-if="hasVisits">
              К cотруднику
              {{ hasVisits === 1 ? 'запланирован ' : 'запланировано ' }}
              {{ hasVisits | formatVisit }}.
            </span>
          </div>
          <div v-else class="uno-modal__text">
            Вы точно хотите удалить сотрудника?
          </div>
        </template>
      </Modal>
    </template>
  </PageLayout>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import EmployeeCard from '~/components/employee/EmployeeCard.vue'
import Modal from '~/components/common/Modal'
import PageLayout from '~/components/common/PageLayout.vue'
import Api from '~/api/backend'
import { employeeMixin, employeesCategorized } from '~/mixins/employee'
import { formatDate } from '~/components/calendar/utils'
import { conjugateVisits } from '~/components/utils'

export default {
  params: {
    items: { type: Array, default: [] },
    search: { type: String, default: '' }
  },
  components: { PageLayout, EmployeeCard, Modal },
  filters: {
    formatVisit (n) {
      return conjugateVisits(n)
    }
  },
  mixins: [employeesCategorized, employeeMixin],
  data () {
    return {
      edit: false,
      empToDelete: undefined,
      deleteModalVisible: false,
      deleteTemplate: {
        leftButton: 'ОТМЕНА',
        rightButton: 'УДАЛИТЬ'
      },
      hasVisits: false,
      newEmp: undefined,
      selectedOnStart: false
    }
  },
  computed: {
    ...mapState({
      businessServices: state => state.business.businessServices
    }),
    ...mapGetters({ searchString: 'common/searchString' }),
    id () {
      return this.$route.params.id
    }
  },
  watch: {
    employeesCategories: {
      handler (newVal) {
        if (this.selectedOnStart) {
          return
        }
        if (newVal && newVal.length) {
          this.selectAll()
          this.selectedOnStart = true
        }
      }
    },
    searchString () {
      this.selectedCategories = [
        ...new Set(
          this.businessEmployees
            .filter(e => this.isMatchingSearch(e))
            .map(s => s.j.category)
        )
      ]
    }
  },
  mounted () {
    this.setActions()
  },
  methods: {
    ...mapActions({
      setActions: 'common/setActions',
      loadBusinessEmployees: 'business/loadBusinessEmployees'
    }),
    deleteEmployee () {
      const empServices = this.businessServices.filter(
        s => s.j.employees && s.j.employees.includes(this.empToDelete.id)
      )

      this.removeEmpServices(empServices, this.empToDelete.id).then(() => {
        Api()
          .delete(`employee?id=eq.${this.empToDelete.id}`)
          .then(() => {
            this.deleteModalVisible = false
            this.loadBusinessEmployees(this.id)
          })
          .catch((e) => {
            console.log('FAILURE!! ', e)
          })
      })
    },
    empServices (empId) {
      if (!this.businessServices || !this.businessServices.length) {
        return 0
      }
      return this.businessServices.filter(
        s => s.j.employees && s.j.employees.includes(empId)
      ).length
    },
    openRegistry () {
      this.$router.push({
        name: 'id-visits',
        params: {
          id: this.id,
          date: formatDate(new Date())
        }
      })
    },
    onSave (payload) {
      this.sendData(payload)
    },
    isMatchingSearch (employee) {
      if (this.searchString) {
        return employee.j.name
          .toLowerCase()
          .includes(this.searchString.trim().toLowerCase())
      }
      return true
    },
    sendData (data) {
      data.j.phones = data.j.phones.filter(x => x > '')
      data.parent = this.id
      data.type = 'E'
      if (!data.id) {
        Api().post(`employee`, data)
      } else {
        Api().patch(`employee?id=eq.${data.id}`, data)
      }
    },
    showDeleteDialog (emp) {
      Api()
        .get(
          `/visit?salon_id=eq.${this.$route.params.id}&business_id=eq.${
            emp.id
          }&ts_begin=gte.${formatDate(new Date())}`
        )
        .then(({ data }) => {
          this.hasVisits = data.filter(v => !v.j.type).length
          this.deleteModalVisible = true
          this.empToDelete = emp
        })
    },
    showEditPanel () {}
  }
}
</script>

<style lang="scss">
@import '~/assets/styles/common.scss';

.employees-list {
  padding: 28px 28px 0;
  @media only screen and (min-width: $desktop) {
    padding: 38px 40px 0 122px;
  }
}
</style>
