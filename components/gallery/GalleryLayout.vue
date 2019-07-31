<template>
  <div class="gallery">
    <v-layout class="gallery__breadcrumbs">
      <slot name="breadcrumbs" />
    </v-layout>
    <v-layout
      class="gallery__header"
      row
      fill-height
      align-center
      justify-space-between
    >
      <v-flex class="gallery__heading" xs12>
        <h1 class="gallery__h1">
          Галерея
        </h1>
      </v-flex>
      <v-flex>
        <main-button
          class="button_attractive add-master"
          @click="
            $router.push({
              name: 'employeeProfile',
              params: { id: $route.params.id, employee: 'new' }
            })
          "
        >
          <span v-if="isMobile" />
          <span v-else>Создать мастера</span>
        </main-button>
      </v-flex>
    </v-layout>
    <v-layout justify-start align-start class="gallery__content">
      <slot name="content" />
    </v-layout>
  </div>
</template>

<script>
import MainButton from '@/components/common/MainButton.vue'
import { isMobile } from '@/components/gallery/utils'

export default {
  components: { MainButton },
  computed: {
    isMobile () {
      return isMobile()
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~/assets/styles/common.scss';

.gallery {
  display: flex;
  flex-direction: column;
  min-height: 100%;
  padding-right: 0;

  &__breadcrumbs {
    flex-grow: 0;
    padding-left: 48px;
    @media only screen and (min-width: $desktop) {
      padding-left: 127px;
    }
  }

  &__header {
    flex-grow: 0;
    padding: 44px 0;
    background: #fff;
  }

  &__heading {
    padding-left: 48px;
    @media only screen and (min-width: $desktop) {
      padding-left: 127px;
    }
  }

  &__h1 {
    font: 24px Roboto Slab, Times New Roman, Times, serif;
  }

  &__content {
    display: flex;
    flex-grow: 1;
    padding: 56px 0 0 48px;
    background: #f4f5f7;
    @media only screen and (min-width: $desktop) {
      padding-left: 103px;
    }
  }
}
.add-master {
  margin-right: 16px;
  background: url('~assets/images/svg/plus-white.svg') no-repeat center/16px
    #ef4d37;
  @media only screen and (min-width: $desktop) {
    background-image: none;
  }
}
</style>
