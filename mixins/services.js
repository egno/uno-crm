import { mapState } from 'vuex'

export const servicesMixin = {
  computed: {
    ...mapState({
      businessServices: state => state.business.businessServices,
    }),
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
  },
}
