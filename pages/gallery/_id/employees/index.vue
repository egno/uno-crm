<template>
  <gallery-layout>
    <template slot="breadcrumbs">
      <v-breadcrumbs :items="breadcrumbs" divider=" " />
    </template>
    <template slot="content">
      <v-layout wrap>
        <div v-for="emp in empList" :key="emp.id" class="card-wrapper">
          <card
            v-if="emp.images && emp.images.length"
            :title="emp.title"
            :subtitle="emp.subtitle"
            :image="emp.images[0]"
            :hover-effect="true"
            aspect-ratio="1"
            @titleClick="
              $router.push({
                name: 'employeeGallery',
                params: { id: businessId, personalId: emp.id }
              })
            "
            @imgClick="
              $router.push({
                name: 'employeeGallery',
                params: { id: businessId, personalId: emp.id }
              })
            "
          />
          <card
            v-else
            class="empty-photo"
            :title="emp.title"
            :subtitle="emp.subtitle"
            aspect-ratio="1"
            @titleClick="
              $router.push({
                name: 'employeeGallery',
                params: { id: businessId, personalId: emp.id }
              })
            "
            @imgClick="loadEmployee(emp.id)"
          >
            <template slot="card-placeholder">
              <v-flex class="add-photo">
                <add-cover
                  text="Добавить фотографию мастера"
                  @filesUploaded="saveMasterPhoto($event, emp.id)"
                />
              </v-flex>
            </template>
          </card>
        </div>
      </v-layout>
    </template>
  </gallery-layout>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { fullName } from '~/components/business/utils'
import Gallery from '~/components/gallery/gallery'
import Api from '~/api/backend'
import { makeAlert } from '~/api/utils'
import AddCover from '~/components/gallery/AddCover.vue'

export default {
  components: { AddCover },
  mixins: [ Gallery ],
  data () {
    return {
      changingEmployee: {},
    }
  },
  computed: {
    ...mapGetters({ employees: 'employee/employees' }),
    empList () {
      return (
        this.employees &&
        this.employees
          .map(x => ({
            id: x.id,
            title: fullName(x),
            subtitle: x.j.category,
            /* images - фотографии самого мастера, а не его работ */
            images: x.j.image ? [ { id: x.j.image } ] : undefined,
          }))
          .sort((a, b) => (a.subtitle < b.subtitle ? -1 : 1))
      )
    },
    breadcrumbs () {
      const { businessId } = this

      return [
        {
          text: 'Галерея',
          disabled: false,
          href: `/gallery/${businessId}`,
        },
        {
          text: 'Сотрудники',
          disabled: true,
          href: `/gallery/${businessId}/employees`,
        },
      ]
    },
  },
  methods: {
    ...mapActions({ alert: 'alerts/alert' }),
    dataPrefill (data) {
      if (!data) {
        data = {}
      }
      if (!data.j) {
        data.j = {}
      }
      if (!data.j.phones) {
        data.j.phones = []
      }
      if (!data.j.links) {
        data.j.links = {}
      }
      if (!data.j.address) {
        data.j.address = {}
      }
      if (!data.j.services) {
        data.j.services = []
      }
      if (!data.j.schedule) {
        data.j.schedule = {}
      }
      if (Array.isArray(data.j.schedule)) {
        data.j.schedule = { data: data.j.schedule }
      }
      if (!data.j.schedule.data) {
        data.j.schedule.data = [
          [ '', '' ],
          [ '', '' ],
          [ '', '' ],
          [ '', '' ],
          [ '', '' ],
          [ '', '' ],
          [ '', '' ],
        ]
      }
      return data
    },
    loadEmployee (employeeId) {
      if (!employeeId) { return false }
      if (this.changingEmployee && this.changingEmployee.id === employeeId) {
        return Promise.resolve(true)
      }

      return Api()
        .get(`employee?id=eq.${employeeId}`)
        .then(res => res.data[0])
        .then((res) => {
          this.changingEmployee = this.dataPrefill(res)
        })
    },
    saveMasterPhoto ({ fileNames }, employeeId) {
      if (!employeeId) { return }
      this.changingEmployee.j = {
        ...this.changingEmployee.j,
        ...{ image: fileNames[0].path },
      }

      Api()
        .patch(`employee?id=eq.${employeeId}`, this.changingEmployee)
        .then(() => {
          this.alert(makeAlert('Успешно'))
        })
        .catch((err) => {
          this.alert(makeAlert(err))
        })
    },
  },
}
</script>

<style lang="scss">
.card-wrapper {
  margin: 0 24px 42px 0;
}
</style>
