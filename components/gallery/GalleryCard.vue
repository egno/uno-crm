<template>
  <v-card width="30em">
    <v-card-title>
      <v-layout column>
        <v-flex
          class="caption font-weight-medium grey--text"
          pa-0
        >
          {{ subtitle }}
        </v-flex>
        <v-flex pa-0>
          {{ title }}
        </v-flex>
      </v-layout>
    </v-card-title>
    <v-responsive>
      <gallery-tiles
        :employee="employee"
        :service="service"
        :images="images"
        :to="to"
        edit
        @showSlider="showSlider($event)"
      />
    </v-responsive>
  </v-card>
</template>

<script>
import GalleryTiles from '@/components/gallery/GalleryTiles.vue'
export default {
  components: { GalleryTiles },
  props: {
    title: { type: String, default: '' },
    subtitle: { type: String, default: '' },
    employee: { type: String, default: undefined },
    service: { type: String, default: undefined },
    images: { type: Array, default: undefined },
    to: { type: Object, default: undefined }
  },
  data () {
    return {}
  },
  methods: {
    showSlider (payload) {
      this.$emit('showSlider', {
        selected: payload,
        images: this.images,
        title: this.title,
        subtitle: this.subtitle
      })
    }
  }
}
</script>
