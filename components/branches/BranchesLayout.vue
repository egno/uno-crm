<template>
  <div class="branches" :class="{ _view: !isCreating }">
    <v-layout
      class="branches__header"
      row
      fill-height
      align-center
      justify-space-between
    >
      <v-flex
        class="branches__heading"
        xs12
      >
        <h1 class="branches__h1">
          {{ isCreating? 'Создать новый филиал' : 'Филиалы' }}
        </h1>
        <div v-if="isCreating">
          <button class="branches__close" @click="$emit('close')">
            <svg width="22" height="22" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M13 4L12 3L8 7L4 3L3 4L7 8L3 12L4 13L8 9L12 13L13 12L9 8L13 4Z" fill="#8995AF" fill-opacity="0.35" />
            </svg>
          </button>
        </div>
      </v-flex>
      <v-flex>
        <main-button
          v-if="isButtonVisible && !isCreating"
          class="button_attractive add-branch"
          @click="$emit('add')"
        >
          <span>Создать филиал</span>
        </main-button>
      </v-flex>
    </v-layout>
    <v-layout class="branches__content" wrap>
      <slot name="content" />
    </v-layout>
  </div>
</template>

<script>
  import MainButton from '~/components/common/MainButton.vue'

  export default {
    components: { MainButton },
    props: {
      isCreating: {
        type: Boolean,
        default: false
      },
      isButtonVisible: {
        type: Boolean,
        default: false
      }
    }
  }
</script>

<style lang="scss">
  @import '~/assets/styles/common.scss';

  .branches {
    display: flex;
    flex-direction: column;
    min-height: 100%;
    padding-right: 0;

    &__header {
      flex-grow: 0;
      padding: 44px 0;
      background: #fff;
    }

    &__heading {
      align-items: center;
      padding-left: 48px;
      @media only screen and (min-width : $desktop) {
        padding-left: 127px;
      }
    }

    &__h1 {
      font: 24px Roboto Slab, Times New Roman, Times, serif;
    }

    &__close {
      @extend %inline-svg-close;
    }

    &__content {
      display: flex;
      flex-grow: 1;
      align-content: flex-start;
      background: #f4f5f7;
      overflow-x: scroll;
    }

    &__cities {
      width: 100%;
      margin-bottom: 32px;
    }

    &__city {
      height: 28px;
      padding: 0 24px;
      margin-right: 24px;
      margin-bottom: 28px;
      background: rgba(137, 149, 175, 0.1);
      border-radius: 14px;
      font-family: $roboto;
      font-style: normal;
      font-weight: normal;
      font-size: 14px;
      line-height: 28px;
      text-align: center;
      color: #8995AF;
      cursor: pointer;

      &._active {
        @extend %filter-active
      }
      &:hover {
        @extend %filter-active
      }
    }

    &__group {
      min-width: 100%;
      padding-left: 5px;
    }

    &__cards {
      margin-bottom: 40px;
    }

    &._view {
      .branches__content {
        padding: 40px 0 0 48px;
        @media only screen and (min-width : $desktop) {
          padding-left: 122px;
        }
      }
    }
  }
  .add-branch {
    position: fixed;
    right: 0;
    top: 96px;
    margin-right: 14px;
    background: url('~assets/images/svg/plus-white.svg') no-repeat center #EF4D37;
    span {
      display: none;
    }
    @media only screen and (min-width : $desktop) {
      background-image: none;

      span {
        display: inline;
      }
    }
  }
</style>
