<template>
  <div>
    <VTooltip bottom>
      <template v-slot:activator="{ on }">
        <button
          v-show="visible"
          type="button"
          class="delete-button"
          :class="{ _dark: isDark }"
          v-bind="$attrs"
          v-on="on"
          @mousedown="$emit('delete')"
        >
          <svg
            width="12"
            height="20"
            viewBox="0 0 12 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M8 0H4V2H0V4H12V2H8V0ZM0 6H12V20H0V6Z"
              :fill="isDark ? 'rgba(137, 149, 175, 0.2)' : '#ffffff'"
              :fill-opacity="isDark ? 1 : 0.7"
            />
          </svg>
        </button>
      </template>
      <span>{{ deleteText }}</span>
    </VTooltip>
  </div>
</template>
<script>
export default {
  props: {
    visible: {
      type: Boolean,
      default: true
    },
    isDark: {
      type: Boolean,
      default: false
    },
    deleteText: {
      type: String,
      default: 'Удалить'
    }
  }
}
</script>
<style lang="scss">
@import '~assets/styles/common.scss';
@import '~assets/styles/icon.scss';
.delete-button {
  @include uno-icon();
  @extend %vertical-align;
  background-color: transparent;
  justify-content: center;
  &:hover {
    path {
      fill-opacity: 1;
    }
  }

  &._dark:hover path {
    fill: #ced3de;
  }
}
</style>
