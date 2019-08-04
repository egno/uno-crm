import { mapState } from 'vuex'

export const employeesCategorized = {
  data () {
    return {
      selectedCategories: []
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
    }
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
