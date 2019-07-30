<template>
  <!--<gallery-layout>
    <template slot="breadcrumbs">
      <v-breadcrumbs :items="breadcrumbs" divider=" " />
    </template>
    <template slot="content">
      <v-layout wrap>
        <div
          v-for="service in employeeServices"
          :key="service.id"
          class="card-wrapper"
        >
          <card
            v-if="service.image && service.service"
            :title="service.service.name"
            subtitle=""
            :image="service.image"
            aspect-ratio="1"
            :placeholder="defaultEmployeeImage"
            @titleClick="$router.push({name:'serviceAlbum', params:{ id: businessId, personalId }, query:{ service: service.service.name }})"
            @imgClick="$router.push({name:'serviceAlbum', params:{ id: businessId, personalId }, query:{ service: service.service.name }})"
          />
          <card
            v-else-if="service.service"
            class="empty-photo"
            :title="service.service.name"
            subtitle=""
            aspect-ratio="1"
            @titleClick="$router.push({name:'serviceAlbum', params:{ id: businessId, personalId }, query:{ service: service.service.name }})"
          >
            <template slot="card-placeholder">
              <v-flex class="add-photo">
                <add-cover text="Добавить обложку альбома" @filesUploaded="saveAlbumCover($event, service.service.name)" />
              </v-flex>
            </template>
          </card>
        </div>
      </v-layout>
    </template>
  </gallery-layout>-->
</template>

<script>
  import { mapGetters, mapActions } from 'vuex'
  import Gallery from '~/components/gallery/gallery'
  import AddCover from '~/components/gallery/AddCover.vue'
  import { makeAlert } from '~/api/utils'
  import Api from '~/api/backend'

  export default {
    /*components: { AddCover },
    mixins: [ Gallery ],
    data () {
      return {
        defaultEmployeeImage: require('@/assets/user.svg'), //todo replace
        addingCover: {}
      }
    },
    computed: {
      ...mapGetters({allEmployeesServices: 'employee/allEmployeesServices'}),
      breadcrumbs () {
        const businessId = this.businessId
        const personalId = this.personalId
        const currentEmployee = this.currentEmployee

        if (!businessId || !personalId || !currentEmployee) {
          return
        }

        return [
          {
            text: 'Галерея',
            disabled: false,
            href: `/gallery/${businessId}`
          },
          {
            text: 'Сотрудники',
            disabled: false,
            href: `/gallery/${businessId}/employees`
          },
          {
            text: `${currentEmployee.name} ${currentEmployee.surname}`,
            disabled: true,
            href: `/gallery/${businessId}/employees/${personalId}`
          },
        ]
      },
      employeeServices () {
        // todo сделать для частного мастера
        // todo названия услуг могут дублироваться
        const personalServices = this.allEmployeesServices.filter(service => service.employee === this.personalId)

        personalServices.forEach(service => {
          if (!service.service) {
            return
          }
          service.image = this.images.find(imgData => imgData.services.includes(service.service.name))
        })

        return personalServices
      },
      images () {
        return this.personalServicesImages(this.personalId)
      }
    },
    methods: {
      ...mapActions({alert: 'alerts/alert'}),
      saveAlbumCover ({ fileNames }, serviceName) {
        let url = 'gallery'
        let personalId = this.personalId

        let payload = fileNames.map(fileName => {
          return {
            id: fileName.path,
            business_id: this.businessId,
            j: {
              file_name: fileName.file,
              service: [serviceName],
              employee: [personalId],
              cover: {
                service: serviceName,
                employee: personalId
              }
            }
          }
        })

        Api()
          .post(url, payload)
          .then(() => {
            this.alert(makeAlert('Успешно'))
          })
          .catch(err => {
            this.alert(makeAlert(err))
          })
      }
    }*/
  }
</script>

<style lang="scss">
  .card-wrapper {
    margin: 0 24px 42px 0;
  }
</style>
