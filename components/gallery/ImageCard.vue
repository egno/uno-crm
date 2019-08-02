<template>
  <v-card hover class="image-card" @click="$emit('click')">
    <v-card-actions v-if="editMode">
      <v-spacer />
      <v-btn text icon @click="deleteImage" />
    </v-card-actions>
    <v-img :src="src" aspect-ratio="1" />
  </v-card>
</template>

<script>
export default {
  props: {
    editMode: { type: Boolean, default: false },
    title: { type: String, default: '' },
    subtitle: { type: String, default: '' },
    src: { type: String, default: undefined }
  },
  methods: {
    deleteImage () {
      this.$emit('deleteImage')
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~assets/styles/common.scss';

.pic-title {
  font-size: 0.7em;
  color: #fff;
  text-shadow: 0 0 0.3em #000;
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
