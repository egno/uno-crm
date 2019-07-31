<template>
  <image-loader
    :has-slot="true"
    class="add-photo__button"
    @onFilesUpload="$emit('filesUploaded', $event)"
  >
    <template slot="add-photo-button">
      <div class="add-photo__text">
        {{ text }}
      </div>
    </template>
  </image-loader>
</template>

<script>
import ImageLoader from '@/components/common/ImageLoader.vue'

export default {
  components: { ImageLoader },
  props: {
    text: { type: String, default: 'Добавить обложку' }
  }
}
</script>

<style lang="scss">
.add-photo {
  justify-content: center;
  background: url('~assets/images/svg/add-photo.svg') no-repeat center 51px;
  box-shadow: inset 0px 0px 0px 8px #fff,
    inset 0 0 0 9px rgba(137, 149, 175, 0.2);
  color: rgba(137, 149, 175, 0.5);
  font: 14px Lato, sans-serif;

  &__button {
    display: flex;
    height: 100%;
    justify-content: stretch;
  }

  &__text {
    margin-top: 107px;
  }
}
</style>
