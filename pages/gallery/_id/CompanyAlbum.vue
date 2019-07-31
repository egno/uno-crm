<template>
  <gallery-layout>
    <template slot="content">
      <v-layout wrap>
        <image-card
          v-for="image in companyImages"
          :key="image.id"
          :src="imagePath(image.id)"
          :title="image.service"
          :edit-mode="false"
        />
      </v-layout>
    </template>
  </gallery-layout>
</template>

<script>
import Gallery from '~/components/gallery/gallery'
import ImageCard from '~/components/gallery/ImageCard.vue'

export default {
  components: { ImageCard },
  mixins: [Gallery],
  computed: {
    companyImages () {
      return (
        this.imagesData && this.imagesData.filter(x => x.j && x.j.business)
      )
    }
  }
}
</script>

<style scoped></style>
