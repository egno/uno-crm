<template>
  <ServicesLayout @add="showCreate = true">
    <template slot="content">
      <template v-if="!businessServices.length">
        <div class="services__empty-notification">
          Cоздайте свою первую услугу
        </div>
      </template>
      <template v-else>
        <div class="filters">
          <div
            v-for="group in branchServiceCategories"
            :key="group"
            class="filters__item"
            :class="{ _active: selectedGroups.includes(group) }"
            @click="toggleFilter(group)"
          >
            {{ group }}
          </div>
          <div
            class="filters__item"
            :class="{
              _active:
                selectedGroups &&
                selectedGroups.length === branchServiceCategories.length
            }"
            @click="toggleAll"
          >
            Все категории
          </div>
        </div>
        <div class="filter-results">
          <div
            v-for="group in branchServiceCategories"
            :key="group"
            class="filter-results__group"
          >
            <template v-if="selectedGroups.includes(group)">
              <div class="filter-results__group-name">
                {{ group }}
              </div>
              <div class="filter-results__cards">
                <ServiceCard
                  v-for="(service, i) in groupedBranchServices[group]"
                  v-show="
                    !searchString ||
                      service.name.toLowerCase().includes(searchString)
                  "
                  :key="i"
                  :service="service"
                  :edit-mode="true"
                  @click="showEditPanel(service)"
                  @delete="showDeleteModal(service)"
                />
              </div>
            </template>
          </div>
        </div>
      </template>
      <EditService
        :visible="showCreate"
        :branch-id="id"
        :create="true"
        :error-message="errorMessage"
        @close="onClose"
        @save="createService"
      />
      <EditService
        :visible="showEdit"
        :branch-id="id"
        :create="false"
        :service="editingService"
        :error-message="errorMessage"
        @close="onClose"
        @save="editService"
      /><!--todo remove the second EditService, combine creating and editing in one -->
      <Modal
        v-if="deletingService"
        :visible="showDelete"
        :template="deleteModalTemplate"
        @rightButtonClick="deleteService(deletingService)"
        @leftButtonClick="
          showDelete = false
          deletingService = null
        "
        @close="
          showDelete = false
          deletingService = null
        "
      >
        <template slot="text">
          <div
            v-if="
              deletingService.name &&
                deletingService.j &&
                deletingService.j.employees &&
                deletingService.j.employees.length
            "
            class="uno-modal__text"
          >
            Это приведет к удалению услуги <b>{{ deletingService.name }}</b>.
            <b>{{ deletingService.j.employees.length | formatMaster }} </b>
            больше не будут оказывать данную услугу.
          </div>
          <div v-else class="uno-modal__text">
            Это приведет к удалению услуги <b>{{ deletingService.name }}</b>.
          </div>
        </template>
      </Modal>
      <Modal
        :visible="showSave"
        :template="saveModalTemplate"
        @rightButtonClick="closeWithoutSaving"
        @leftButtonClick="showSave = false"
        @close="showSave = false"
      >
        <template slot="text">
          <div class="uno-modal__text">
            {{ saveModalTemplate.text }}
          </div>
        </template>
      </Modal>
    </template>
  </ServicesLayout>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'
import ServicesLayout from '~/components/services/ServicesLayout.vue'
import EditService from '~/components/services/EditService.vue'
import ServiceCard from '~/components/services/ServiceCard.vue'
import Api from '~/api/backend'
import Modal from '~/components/common/Modal'
import { conjugateEmployee } from '~/components/utils'
import Employee from '~/classes/employee'
import { responseGetId } from '~/api/utils'

export default {
  components: {
    ServicesLayout,
    ServiceCard,
    EditService,
    Modal
  },
  filters: {
    formatMaster (n) {
      return conjugateEmployee(n)
    }
  },
  data () {
    return {
      formActions: [
        { label: 'Добавить услугу', action: 'newService', default: false }
      ],
      branchInfo: { j: {} },
      edit: false,
      newService: {},
      selectedGroups: [],
      showCreate: false,
      showEdit: false,
      showDelete: false,
      showSave: false,
      editingService: undefined,
      deletingService: undefined,
      errorMessage: '',
      saveModalTemplate: {
        header: 'Данные были изменены.',
        text: `Выйти без сохранения?`,
        leftButton: 'ОТМЕНА',
        rightButton: 'ДА'
      }
    }
  },
  computed: {
    ...mapState({
      businessEmployees: state => state.business.businessEmployees,
      businessServices: state => state.business.businessServices
    }),
    ...mapGetters({
      serviceGroups: 'service/serviceGroups',
      businessServiceCategories: 'business/businessServiceCategories',
      searchString: 'common/searchString',
      businessId: 'business/businessId'
    }),
    id () {
      return this.$route.params.id
    },
    groupedBranchServices () {
      const obj = {}

      this.businessServices.forEach((s) => {
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
    },
    branchServiceCategories () {
      const res = []

      for (const key in this.groupedBranchServices) {
        res.push(key)
      }

      return res.sort()
    },
    deleteModalTemplate () {
      if (
        !this.deletingService ||
        !this.deletingService.j ||
        !this.deletingService.j.employees
      ) {
        return {
          header: 'Удалить услугу?',
          text: `Это приведет к удалению услуги. Мастера больше не будут оказывать данную услугу.`,
          leftButton: 'ОТМЕНА',
          rightButton: 'УДАЛИТЬ'
        }
      }
      return {
        header: 'Удалить услугу?',
        text: `Это приведет к удалению услуги <b>${this.deletingService.name}</b>. <b>${this.deletingService.j.employees.length}</b> мастеров больше не будут оказывать данную услугу.`,
        leftButton: 'ОТМЕНА',
        rightButton: 'УДАЛИТЬ'
      }
    }
  },
  watch: {
    businessServiceCategories: 'selectAll',
    searchString (val) {
      this.selectedGroups = this.businessServices
        .filter(s => s.name.toLowerCase().includes(val))
        .map(s => s.j.group)
    }
  },
  mounted () {
    this.setActions(this.formActions)
    this.$root.$on('onAction', this.onAction)
    this.selectAll()
  },
  beforeDestroy () {
    this.$root.$off('onAction', this.onAction)
  },
  methods: {
    ...mapActions({
      setActions: 'common/setActions',
      loadBusinessServices: 'business/loadBusinessServices'
    }),
    addServiceToEmployee (serviceId, employeeId) {
      const employee = new Employee(
        this.businessEmployees.find(e => e.id === employeeId)
      )

      if (!employee.services.includes(serviceId)) {
        employee.j.services.push(serviceId)
        employee.save()
      }
    },
    closeWithoutSaving () {
      this.showCreate = false
      this.showEdit = false
      this.editingService = null
      this.newService = null
    },
    createService (newService) {
      this.errorMessage = ''

      Api()
        .post(`business_service`, {
          business_id: this.id,
          name: newService.name,
          j: {
            ...newService
          }
        })
        .then(res => responseGetId(res))
        .then(() => {
          this.showCreate = false
          this.loadBusinessServices(this.businessId)
          // newService.employees.forEach(employeeId => {
          //   this.addServiceToEmployee(id, employeeId)
          // })
        })
        .catch((e) => {
          console.log('FAILURE!! ', e)
          if (
            e.response &&
            e.response.data &&
            e.response.data.message ===
              'duplicate key value violates unique constraint "business_service_un"'
          ) {
            this.errorMessage =
              'Услуга с таким названием уже существует. Пожалуйста, выберите другое название'
          }
        })
    },
    deleteService (service) {
      // const oldService = this.businessServices.find(s => s.id === service.id)

      // oldService.j.employees.forEach(employeeId => {
      //   this.removeEmployeeService(employeeId, service.id)
      // })

      Api()
        .delete(`business_service?id=eq.${service.id}`)
        .then(() => {
          this.showEdit = false
          this.deletingService = null
          // service.j.employees.forEach(e => {
          //   this.addServiceToEmployee(service.id, e.id)
          // })
          this.loadBusinessServices(this.businessId)
        })
        .catch((e) => {
          console.log('FAILURE!! ', e)
        })
    },
    editService (newService) {
      const serviceId = this.editingService.id
      // const oldService = this.businessServices.find(s => s.id === serviceId)

      // oldService.j.employees.forEach(employeeId => {
      //   if (!newService.employees.includes(employeeId)) {
      //     this.removeEmployeeService(employeeId, serviceId)
      //   }
      // })

      Api()
        .patch(`business_service?id=eq.${serviceId}`, {
          id: serviceId,
          business_id: this.id,
          name: newService.name,
          access: true,
          j: {
            ...newService
          }
        })
        .then(() => {
          this.showEdit = false
          this.editingService = null
          // newService.employees.forEach(employeeId => {
          //   this.addServiceToEmployee(serviceId, employeeId)
          // })
          this.loadBusinessServices(this.businessId)
        })
        .catch((e) => {
          console.log('FAILURE!! ', e)
          if (
            e.response &&
            e.response.data &&
            e.response.data.message ===
              'duplicate key value violates unique constraint "business_service_un"'
          ) {
            this.errorMessage =
              'Услуга с таким названием уже существует. Пожалуйста, выберите другое название'
          }
        })
    },
    onAction (payload) {
      if (payload === this.formActions[0].action) {
        this.showCreate = true
      }
    },
    onClose ({ hasDiff }) {
      if (hasDiff) {
        this.showSave = true
      } else {
        this.showCreate = false
        this.showEdit = false
        this.editingService = null
        this.newService = null
      }
    },
    // removeEmployeeService (employeeId, serviceId) {
    //   const employee = new Employee(this.businessEmployees.find(e => e.id === employeeId))
    //   let index = employee.services.indexOf(serviceId)

    //   employee.j.services.splice(index, 1)
    //   employee.save()
    // },
    showEditPanel (service) {
      if (this.showEdit) {
        return
      }
      this.showEdit = true
      this.editingService = service
    },
    selectAll () {
      if (
        !this.branchServiceCategories ||
        !this.branchServiceCategories.length
      ) {
        return
      }
      this.selectedGroups = this.branchServiceCategories.slice()
    },
    showDeleteModal (service) {
      if (this.showDelete) {
        return
      }
      this.showDelete = true
      this.deletingService = service
    },
    toggleAll () {
      if (this.selectedGroups.length === this.branchServiceCategories.length) {
        this.selectedGroups = []
      } else {
        this.selectAll()
      }
    },
    toggleFilter (group) {
      const index = this.selectedGroups.indexOf(group)

      if (index !== -1) {
        this.selectedGroups.splice(index, 1)
      } else {
        this.selectedGroups.push(group)
      }
    }
  }
}
</script>
