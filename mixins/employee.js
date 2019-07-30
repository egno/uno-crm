import Api from '@/api/backend'
import { mapState } from 'vuex'

export const employeeMixin = {
  methods: {
    removeEmpServices (empServices, empId) {
      let p = []

      if (empId === 'new' || !empServices.length) {
        return Promise.resolve()
      }

      empServices.forEach(service => {
        let employees = service.j && service.j.employees

        employees.splice(employees.indexOf(empId), 1)
        p.push(Api()
          .patch(`business_service?id=eq.${service.id}`, {
            id: service.id,
            business_id: this.id,
            name: service.name,
            access: true,
            j: {
              ...service.j
            }
          })
          .catch(err => {
            console.error(err)
          })
        )
      })

      return Promise.all(p)
    }
  }
}

export const employeesCategorized = {
  data () {
    return {
      selectedCategories: [],
    }
  },
  computed: {
    ...mapState({
      businessEmployees: state => state.business.businessEmployees
    }),
    employeesCategories () {
      return [
        ...new Set(
          this.businessEmployees &&
          this.businessEmployees.map(x => x.j && x.j.category)
        )
      ].sort((a, b) => (a < b ? -1 : 1))
    },
  },
  methods: {
    selectAll () {
      if (!this.employeesCategories || !this.employeesCategories.length) {
        return
      }
      this.selectedCategories = this.employeesCategories.slice()
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
    }
  }
}
