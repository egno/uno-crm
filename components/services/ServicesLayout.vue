<template>
  <div class="services">
    <v-layout class="services__breadcrumbs">
      <slot name="breadcrumbs" />
    </v-layout>
    <v-layout
      class="services__header"
      row
      fill-height
      align-center
      justify-space-between
    >
      <v-flex class="services__heading" xs12>
        <h1 class="services__h1">
          Услуги
        </h1>
      </v-flex>
      <v-flex>
        <main-button
          class="button_attractive section-add-button"
          @click="$emit('add')"
        >
          <span>Создать услугу</span>
        </main-button>
      </v-flex>
    </v-layout>
    <v-layout class="services__content" column>
      <slot name="content" />
    </v-layout>
  </div>
</template>

<script>
import MainButton from '~/components/common/MainButton.vue'
export default {
  components: { MainButton }
}
</script>

<style lang="scss">
@import '~assets/styles/common.scss';

.services {
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
  &__empty-notification {
    padding: 0 5px;
    font-family: $lato;
    font-style: normal;
    font-weight: 900;
    font-size: 16px;
    line-height: normal;
    color: #07101c;
  }
  &__content {
    display: flex;
    flex-grow: 1;
    padding: 40px 0 0 48px;
    align-content: flex-start;
    background: #f4f5f7;
    @media only screen and (min-width: $desktop) {
      padding-left: 122px;
    }
  }
}
</style>
