<template>
  <gallery-layout>
    <template slot="breadcrumbs">
      <v-breadcrumbs :items="breadcrumbs" divider=" " />
    </template>
    <template slot="content">
      <v-layout wrap>
        <div>
          <employee-badge :employee="currentEmployee" />
        </div>
        <div class="album__header">
          <v-flex>
            <h1 class="album__heading">
              {{ service }}
            </h1>
          </v-flex>
          <div v-if="!editMode && businessInfo && businessInfo.access">
            <v-btn
              icon
              fab
              flat
              ripple
              @click="editMode = true"
            >
              <v-icon>edit</v-icon>
            </v-btn>
          </div>
        </div>
        <gallery-images
          :images="albumImages"
          @showSlider="showSlider"
          @deleteImage="deleteImage"
          @filesUploaded="addImage"
        />
        <album-slider
          :display="isSliderVisible"
          :images="albumImages"
          :title="currentEmployee && `${currentEmployee.name} ${currentEmployee.surname}`"
          :subtitle="service"
          :current="selectedImage"
          :full-screen="fullScreen"
          @close="onSliderClose"
          @deleteImage="deleteImage"
          @fullscreenOn="fullScreen = true"
        />
      </v-layout>
    </template>
  </gallery-layout>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex'
  import AlbumSlider from '~/components/gallery/AlbumSlider.vue'
  import EmployeeBadge from '~/components/gallery/EmployeeBadge.vue'
  import GalleryImages from '~/components/gallery/GalleryImages.vue'
  import { deleteImage } from '~/components/gallery/utils'
  import Gallery from '~/components/gallery/gallery'
  import Api from '~/api/backend'
  import { makeAlert } from '~/api/utils'

  export default {
    components: { AlbumSlider, GalleryImages, EmployeeBadge },
    mixins: [ Gallery ],
    data () {
      return {
        defaultEmployeeImage: require('@/assets/user.svg'),
        editMode: false,
        selectedImage: null,
        fullScreen: false
      }
    },
    computed: {
      ...mapGetters({businessInfo: 'business/businessInfo'}),
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
            disabled: false,
            href: `/gallery/${businessId}/employees/${personalId}`
          },
          {
            text: this.service,
            disabled: true,
          },
        ]
      },
      service () {
        return this.$route && this.$route.query && this.$route.query.service
      },
      albumImages () {
        if (!this.personalId) {
          return
        }
        return this.personalServicesImages(this.personalId).filter(imgData => imgData.j && imgData.j.service && imgData.j.service.includes(this.service))
      },
      isSliderVisible () {
        return this.selectedImage !== null && this.selectedImage !== undefined
      }
    },
    methods: {
      ...mapActions({alert: 'alerts/alert'}),
      deleteImage (imageId) {
        if (!imageId) return
        const idx = this.imagesData.findIndex(x => x.id === imageId)

        if (idx === -1) return
        deleteImage(imageId)
          .then(() => {
            this.imagesData.splice(idx, 1)
          })
          .catch(err => {
            console.log(err)
          })
      },
      onSliderClose () {
        this.selectedImage = null
      },
      showSlider (payload) {
        this.selectedImage = payload.selected
      },
      addImage ({ fileNames }) {
        let url = 'gallery'
        let personalId = this.personalId
        let serviceName = this.service

        let payload = fileNames.map(fileName => {
          return {
            id: fileName.path,
            business_id: this.businessId,
            j: {
              file_name: fileName.file,
              service: [serviceName],
              employee: [personalId],
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
    }
  }
</script>

<style lang="scss" scoped>
  .album {
    &__header {
      display: flex;
      width: 100%;
      align-items: center;
      justify-content: space-between;
    }

    &__heading {
      font-family: Roboto Slab, Times New Roman, Times, serif;
      font-style: normal;
      font-weight: normal;
      line-height: normal;
      font-size: 18px;
      color: #000000;
    }
  }

</style>
