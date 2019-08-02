<template>
  <v-layout wrap>
    <image-loader
      class="add-photo image-card"
      :place-text="''"
      @onFilesUpload="$emit('filesUploaded', $event)"
    />
    <image-card
      v-for="(image, index) in images"
      :key="image.id"
      :src="imagePath(image.id)"
      :title="image.service"
      :edit-mode="editMode"
      @deleteImage="deleteImage(image)"
      @click="!editMode && showSlider(index)"
    />
  </v-layout>
</template>

<script>
import { mapGetters } from 'vuex'
import ImageCard from '@/components/gallery/ImageCard.vue'
import { imagePath } from '@/components/gallery/utils'
import { fullName } from '@/components/business/utils'
import ImageLoader from '@/components/common/ImageLoader.vue'

export default {
  components: { ImageCard, ImageLoader },
  props: {
    images: { type: Array, default: undefined },
    editMode: { type: Boolean, default: false }
  },
  computed: {
    ...mapGetters({ businessId: 'business/businessId' })
  },
  methods: {
    imagePath (imageId) {
      return imagePath(imageId, this.businessId)
    },
    deleteImage (image) {
      if (!(image && image.id)) { return }
      this.$emit('deleteImage', image.id)
    },
    fullName (emp) {
      return fullName(emp)
    },
    showSlider (index) {
      this.$emit('showSlider', {
        selected: index
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~assets/styles/common.scss';

.add-photo {
  background: url('~assets/images/svg/plus.svg') no-repeat center;
  border: 1px solid rgba(137, 149, 175, 0.2);

  &__button {
    display: flex;
    height: 100%;
    justify-content: stretch;
  }
}

.image-card {
  width: 130px;
  height: 130px;
  margin: 0 20px 20px 0;
  @media only screen and (min-width: $desktop) {
    width: 150px;
    height: 150px;
    margin: 0 12px 18px 0;
  }
}
</style>
