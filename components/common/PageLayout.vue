<template>
  <div class="page-layout">
    <v-layout class="page-layout__breadcrumbs">
      <slot name="breadcrumbs" />
    </v-layout>
    <v-layout
      :class="{ _bordered: !isEditMode }"
      class="page-layout__header"
      row
      fill-height
      align-center
      justify-space-between
    >
      <v-flex class="page-layout__heading" xs12>
        <h1 class="page-layout__h1">
          {{ template.headerText }}
        </h1>
        <div v-if="isEditVisible && !isEditMode" class="page-layout__edit">
          <v-btn icon fab textripple @click="$emit('changeMode', true)">
            <svg
              width="13"
              height="20"
              viewBox="0 0 13 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M9.40402 0L13 2.13162L11.3998 4.82815L7.80374 2.69653L9.40402 0ZM7.27032 3.59534L10.8663 5.72696L4.46522 16.5131L4.46514 16.5131L0 19.9415L0.869124 14.3814L0.869208 14.3815L7.27032 3.59534Z"
                fill="#8995AF"
                fill-opacity="0.35"
              />
            </svg>
          </v-btn>
        </div>
        <div v-if="isEditVisible && isEditMode">
          <button
            class="page-layout__close"
            @click="$emit('changeMode', false)"
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M13 4L12 3L8 7L4 3L3 4L7 8L3 12L4 13L8 9L12 13L13 12L9 8L13 4Z"
                fill="#8995AF"
                fill-opacity="0.35"
              />
            </svg>
          </button>
        </div>
      </v-flex>
      <v-flex v-if="isButtonVisible">
        <main-button
          class="button_attractive section-add-button"
          @click="$emit('add')"
        >
          <span>{{ template.buttonText }}</span>
        </main-button>
      </v-flex>
    </v-layout>
    <v-layout class="page-layout__content" column justify-start>
      <slot name="content" />
    </v-layout>
  </div>
</template>

<script>
import MainButton from '~/components/common/MainButton.vue'
export default {
  components: { MainButton },
  props: {
    isButtonVisible: {
      type: Boolean,
      default: false
    },
    isEditMode: {
      type: Boolean,
      default: false
    },
    isEditVisible: {
      type: Boolean,
      default: false
    },
    template: {
      type: Object,
      default () {
        return {
          headerText: '',
          buttonText: ''
        }
      }
    }
  }
}
</script>

<style lang="scss">
@import '~assets/styles/common.scss';
@import '~assets/styles/icon.scss';

.page-layout {
  display: flex;
  flex-direction: column;
  min-height: 100%;
  padding-right: 0;
  &__breadcrumbs {
    display: none;
    background-color: #fff;
    flex-grow: 0;
    padding-left: 127px;
    @media only screen and (min-width: $desktop) {
      display: flex;
    }
  }
  &__header {
    flex-grow: 0;
    padding: 44px 0;
    background: #fff;
    &._bordered {
      border-bottom: 1px solid rgba(137, 149, 175, 0.1);
    }
  }
  &__heading {
    padding-left: 48px;
    @media only screen and (min-width: $desktop) {
      padding-left: 127px;
    }
  }
  &__h1 {
    font: 24px/40px Roboto Slab, Times New Roman, Times, serif;
  }
  &__edit {
    padding-left: 40px;
    &:hover {
      path {
        fill: #000;
      }
    }
    button.v-btn {
      @include uno-icon();
      border: 1px solid rgba(137, 149, 175, 0.1);
      &:hover {
        border-color: transparent;
        color: rgba(0, 0, 0, 0.4);
      }
    }
  }

  &__close {
    @extend %inline-svg-close;
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
    align-content: flex-start;
    background: #f4f5f7;
    min-width: 375px;
  }
}
</style>
