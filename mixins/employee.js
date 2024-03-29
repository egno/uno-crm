import { mapGetters, mapState } from 'vuex'

export const employeesCategorized = {
  data () {
    return {
      selectedCategories: [],
      selectedOnStart: false,
    }
  },
  computed: {
    ...mapGetters({
      businessEmployees: 'employee/employees',
    }),
    ...mapState({
      businessInfo: state => state.business.businessInfo,
    }),
    employeesCategories () {
      return [
        ...new Set(
          this.businessEmployees &&
            this.businessEmployees.map(x => x.j && x.j.category)
        ),
      ].sort((a, b) => (a < b ? -1 : 1))
    },
  },
  methods: {
    compareByName (a, b) {
      return a.j.name.toLowerCase() < b.j.name.toLowerCase() ? -1 : 1
    },
    getEmployeeTemplate (employee) {
      if (!employee.j.workTemplate || !employee.j.workTemplate.title) {
        return
      }

      return this.businessInfo.j.scheduleTemplates.find(t => t.title === employee.j.workTemplate.title)
    },
    removeVisibleEmployee (employee) {
      const i = this.visibleEmployees.findIndex(e => e.id === employee.id)

      if (i > -1) {
        this.visibleEmployees.splice(i, 1)
        this.visibleEmployees.sort(this.compareByName)
      }
    },
    selectAll () {
      if (!this.employeesCategories || !this.employeesCategories.length) {
        return
      }
      this.selectedCategories = this.employeesCategories.slice()
      if (!this.selectedOnStart) {
        this.selectedOnStart = true
      }
    },
    toggleAll () {
      if (this.selectedCategories.length === this.employeesCategories.length) {
        this.selectedCategories = []
      } else {
        this.selectAll()
      }
    },
    toggleCategory (category) {
      const index = this.selectedCategories.indexOf(category)

      if (index !== -1) {
        this.selectedCategories.splice(index, 1)
      } else {
        this.selectedCategories.push(category)
      }
    },
  },
}
