<template>
  <div>
    <div>
      <EmployeesSelection
        :visible-employees="visibleEmployees"
        :show-category-checkbox="true"
        @addVisibleEmployee="visibleEmployees.push($event)"
        @removeVisibleEmployee="removeVisibleEmployee"
      />
    </div>
    <div v-for="(employee, i) in visibleEmployees" :key="i">
      <ScheduleRow
        :employee="employee"
        @assignTemplate="assignTemplate"
      />
    </div>
  </div>
</template>

<script>
// import { mapState, mapActions, mapGetters } from 'vuex'
import { employeesCategorized } from '~/mixins/employee'
import ScheduleRow from '~/components/employee/ScheduleRow.vue'
// import Modal from '~/components/common/Modal'
import EmployeesSelection from '~/components/employee/EmployeesSelection.vue'

export default {
  // eslint-disable-next-line standard/object-curly-even-spacing
  components: { ScheduleRow, EmployeesSelection },
  mixins: [ employeesCategorized ],
  data () {
    return {
      assignTemplateModal: false,
      visibleEmployees: [],
    }
  },
  beforeMount () {
    this.businessEmployees.forEach((employee) => {
      if (!this.visibleEmployees.some(emp => emp.id === employee.id)) {
        this.visibleEmployees.push(employee)
        if (!this.selectedCategories.includes(employee.j.category)) {
          this.selectedCategories.push(employee.j.category)
        }
      }
    })
  },
  methods: {
    assignTemplate (employee) {
      this.assignTemplateModal = true
    },
  },
}
</script>

<style scoped>

</style>
