import { mapGetters } from 'vuex'
import Api from '@/api/backend'
import GalleryLayout from '@/components/gallery/GalleryLayout.vue'
import Card from '@/components/gallery/Card.vue'
import { imagePath, isMobile } from '@/components/gallery/utils'

export default {
  components: { GalleryLayout, Card },
  data () {
    return {
      imagesData: []
    }
  },
  computed: {
    ...mapGetters({
      businessId: 'business/businessId',
      employees: 'employee/employees'
    }),
    personalId () {
      return this.$route.params && this.$route.params.personalId
    },
    currentEmployee () {
      if (!this.personalId || !this.employees) { return }
      const emp = this.employees.find(emp => emp.id === this.personalId)

      return emp && emp.j
    },
    isMobile () {
      return isMobile()
    }
  },
  watch: {
    businessId: 'load'
  },
  mounted () {
    this.load()
  },
  methods: {
    load () {
      if (!this.businessId) { return }

      Api()
        .get(`gallery?business_id=eq.${this.businessId}`)
        .then(res => res.data)
        .then((res) => {
          this.imagesData = res
        })
    },
    imagePath (src) {
      return imagePath(src, this.businessId)
    },
    /* возвращает список всех фотографий работ мастера */
    personalServicesImages (personalId = this.personalId) {
      if (!personalId || !this.imagesData.length) {
        return []
      }

      return (
        this.imagesData &&
        this.imagesData
          .filter(x => x.employees.some(e => e === personalId))
          .filter(x => x.services && x.services.some(e => !!e))
      )
    }
  }
}
