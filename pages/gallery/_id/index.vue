<template>
  <!--<gallery-layout>
    <template slot="content">
      <v-layout wrap>
        <div class="card-wrapper">
          <card
            title="Компания"
            :image="companyImages[0]"
            :class="{ 'empty-card-company': !companyImages.length }"
            @titleClick="$router.push({name:'companyAlbum', params:{ id: businessId }})"
            @imgClick="$router.push({name:'companyAlbum', params:{ id: businessId }})"
          />
        </div>
        <div class="card-wrapper">
          <card
            title="Сотрудники"
            :image="empProfilePhotos[0]"
            :hover-effect="true"
            :class="{ 'empty-card-employees': !empProfilePhotos.length }"
            @titleClick="$router.push({name:'companyEmployeesGallery', params:{ id: businessId }})"
            @imgClick="$router.push({name:'companyEmployeesGallery', params:{ id: businessId }})"
          />
        </div>
        <div class="card-wrapper">
          <card
            title="Услуги"
            :image="servicesImages[0]"
            :hover-effect="true"
            :class="{ 'empty-card-services': !servicesImages.length }"
            @titleClick="$router.push({name:'companyServicesGallery', params:{ id: businessId }})"
            @imgClick="$router.push({name:'companyServicesGallery', params:{ id: businessId }})"
          />
        </div>
      </v-layout>
    </template>
  </gallery-layout>-->
</template>

<script>
  import { mapGetters } from 'vuex'
  import { fullName } from '~/components/business/utils'
  import Gallery from '~/components/gallery/gallery'

  export default {
    /*mixins: [ Gallery ],
    computed: {
      ...mapGetters({employees: 'employee/employees', allEmployeesServices: 'employee/allEmployeesServices'}),
      empList () {
        return (
          this.employees &&
          this.employees
            .filter(x => x.j && x.j.image)
            .map(x => ({
              id: x.id,
              title: fullName(x),
              subtitle: x.j.category,
              images: x.j.image ? [{ id: x.j.image }] : undefined
            }))
            .sort((a, b) => (a.subtitle < b.subtitle ? -1 : 1))
        )
      },
      empProfilePhotos () {
        return [
          ...new Set(this.empList.length && this.empList.map(x => x.images).flat())
        ]
      },
      companyImages () {
        return this.imagesData && this.imagesData.filter(x => x.j && x.j.business)
      },
      servicesImages () {
        return (
          this.imagesData &&
          this.imagesData.filter(x => x.employees && x.employees.some(e => !!e))
        )
      },
    },*/
  }
</script>

<style lang="scss">
  .card-wrapper {
    margin: 0 24px 42px 0;
  }
</style>
