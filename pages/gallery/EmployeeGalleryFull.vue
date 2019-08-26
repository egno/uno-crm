<template>
  <v-container fluid grid-list-sm>
    <v-card v-if="data" flat class="grey lighten-5">
      <v-card-title>
        <v-layout row>
          <v-flex>
            <Avatar
              class="ma-1"
              :name="data.j.name || data.j.email"
              :src="data.j.avatar"
            />
          </v-flex>
          <v-flex>
            <v-layout column>
              <v-flex class="caption grey--text text--darken-2">
                {{ data.j.category }}
              </v-flex>
              <v-flex>{{ data.j.name }}</v-flex>
            </v-layout>
          </v-flex>
        </v-layout>
      </v-card-title>

      <v-responsive>
        <v-layout row fill-height wrap>
          <v-flex v-for="(service, n) in services" :key="service + n">
            <!--<album
              :title="service"
              :employee="id"
              :service="service"
              :images="serviceImages(service)"
              @showSlider="showSlider($event)"
            />-->
          </v-flex>
          <v-flex key="others">
            <!--<album
              title="Прочее"
              :employee="id"
              :images="serviceImages()"
            />-->
          </v-flex>
        </v-layout>
      </v-responsive>
    </v-card>
    <album-slider
      :display="!!sliderImages"
      :title="sliderTitle"
      :subtitle="sliderSubTitle"
      :images="sliderImages"
      :select="selectedImage"
      @close="onSliderClose()"
    />
  </v-container>
</template>

<script>
/* import Album from '~/components/gallery/Album.vue' */
import { mapActions } from 'vuex'
import AlbumSlider from '~/components/gallery/AlbumSlider.vue'
import Avatar from '~/components/avatar/Avatar.vue'
import Api from '~/api/backend'

export default {
  components: { AlbumSlider, Avatar },
  data () {
    return {
      data: undefined,
      images: [],
      sliderImages: undefined,
      sliderTitle: '',
      selectedImage: 0,
    }
  },
  computed: {
    id () {
      return this.$route && this.$route.params && this.$route.params.employee
    },
    business () {
      return this.data && this.data.parent
    },
    services () {
      return this.data && this.data.j && this.data.j.services
    },
    sliderSubTitle () {
      return this.data && this.data.j && this.data.j.name
    },
  },
  watch: {
    id: 'load',
    business: 'loadBusiness',
  },
  mounted () {
    this.load()
  },
  methods: {
    ...mapActions({ setBusiness: 'business/setBusiness' }),
    load () {
      if (!this.id) { return }
      Api()
        .get(`employee?id=eq.${this.id}`)
        .then(res => res.data[0])
        .then((res) => {
          this.data = res
          this.loadBusiness(res.parent)
        })
    },
    loadBusiness () {
      if (!this.business) { return }
      this.setBusiness(this.businessId)
      Api()
        .get(`gallery?employees=cs.{${this.id}}`)
        .then(res => res.data)
        .then((res) => {
          this.images = res
        })
    },
    serviceImages (service) {
      if (service) {
        return (
          this.images &&
          this.images.filter(x => x.services.some(s => s === service))
        )
      }
      return (
        this.images &&
          this.images.filter(
            x => !x.services.some(s => this.services.some(ss => ss === s))
          )
      )
    },
    onSliderClose () {
      this.sliderImages = undefined
      this.selectedImage = undefined
      this.sliderTitle = undefined
    },
    showSlider (payload) {
      this.sliderImages = payload.images
      this.selectedImage = payload.selected
      this.sliderTitle = payload.title
    },
  },
}
</script>
