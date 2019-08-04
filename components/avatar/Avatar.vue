<template>
  <VAvatar
    class="ma-1"
    :size="size"
    :tile="tile"
    :class="{ [avatarClass]: avatarClass }"
    @mouseover="tooltip = true"
    @mouseout="tooltip = false"
    @mousemove="move"
  >
    <v-tooltip
      v-if="isCompanyAvatar && !isEditing"
      v-model="tooltip"
      right
      :position-x="x"
      :position-y="y"
    >
      <span class="text-primary">
        Это главное фото вашей компании.
      </span>
      <br>
      <span class="text-secondary">
        Может быть логотип или любое <br>
        другое привлекательное фото <br>
        компании
      </span>
    </v-tooltip>

    <div v-if="newMessage" class="new-message" />

    <template v-if="required">
      <img v-if="!validationError" :src="imagePath" alt>
      <img v-else :src="userError" alt>
    </template>
    <template v-else>
      <img v-if="image_exists" :src="imagePath" alt>
      <template v-else-if="isEditing">
        <div class="add-photo-empty">
          <div class="add-photo-empty__img">
            <svg
              width="40"
              height="35"
              viewBox="0 0 40 35"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M2 5H10.9649L13.9553 0H25.9169L28.9073 5H37.8722H39.8722V7V33V35H37.8722H2H0V33V7V5H2ZM12.6813 6.02657L15.0895 2H24.7827L27.1909 6.02657L27.7731 7H28.9073H37.8722V33H2V7H10.9649H12.0991L12.6813 6.02657ZM25.9106 19C25.9106 22.3197 23.2297 25 19.9361 25C16.6426 25 13.9617 22.3197 13.9617 19C13.9617 15.6803 16.6426 13 19.9361 13C23.2297 13 25.9106 15.6803 25.9106 19ZM27.9106 19C27.9106 23.4183 24.3403 27 19.9361 27C15.532 27 11.9617 23.4183 11.9617 19C11.9617 14.5817 15.532 11 19.9361 11C24.3403 11 27.9106 14.5817 27.9106 19Z"
                fill="#8995AF"
                fill-opacity="0.35"
              />
            </svg>
          </div>
          <div class="add-photo-empty__text">
            Загрузить фото
          </div>
        </div>
      </template>
      <template v-else>
        <div class="avatar-letters">
          {{ initials }}
        </div>
      </template>
    </template>
  </VAvatar>
</template>

<script>
import { hash } from '~/components/utils'
import { imagePath } from '~/components/avatar/utils'

export default {
  props: {
    newMessage: { type: Boolean, default: false },
    size: { type: String, default: '3em' },
    isCompanyAvatar: { type: Boolean, default: false },
    isEditing: { type: Boolean, default: false },
    avatarClass: { type: String, default: '' },
    name: { type: String, default: '' },
    src: { type: String, default: '' },
    tile: { type: Boolean, default: false },
    required: { type: Boolean, default: false },
    validError: { type: Boolean, default: false }
  },
  data () {
    return {
      user: require('@/assets/user.svg'),
      userError: require('@/assets/user-error.svg'),
      grayScaleColors: { bg: 'grey', text: 'lighten' },
      tooltip: false,
      x: 0,
      y: 0,
      colors: [
        { bg: 'red', text: 'lighten' },
        { bg: 'pink', text: 'lighten' },
        { bg: 'purple', text: 'lighten' },
        { bg: 'deep-purple', text: 'lighten' },
        { bg: 'indigo', text: 'lighten' },
        { bg: 'blue', text: 'lighten' },
        { bg: 'light-blue', text: 'darken' },
        { bg: 'cyan', text: 'darken' },
        { bg: 'teal', text: 'lighten' },
        { bg: 'green', text: 'lighten' },
        { bg: 'light-green', text: 'darken' },
        { bg: 'lime', text: 'darken' },
        { bg: 'yellow', text: 'darken' },
        { bg: 'amber', text: 'darken' },
        { bg: 'orange', text: 'darken' },
        { bg: 'deep-orange', text: 'lighten' }
      ],
      image_exists: false
    }
  },
  computed: {
    color () {
      if (!this.name) {
        return this.grayScaleColors
      }

      const h =
        ((hash(this.name) % this.colors.length) + this.colors.length) %
        this.colors.length

      return this.colors[h]
    },
    initials () {
      return this.name.charAt(0).toUpperCase()
    },
    imagePath () {
      return imagePath(this.src) || this.user
    },
    validationError () {
      return !this.src
    }
  },
  watch: {
    src (value) {
      this.image_exists = false
      this.$nextTick(function () {
        if (value) { this.loadImage() }
      })
    }
  },
  mounted () {
    this.$nextTick(function () {
      if (this.src) { this.loadImage() }
    })
  },
  methods: {
    move (e) {
      if (!this.tooltip) { return }
      this.x = e.x + 20
      this.y = e.y + 80
    },
    loadImage () {
      setTimeout(() => {
        const img = new Image()
        img.onload = () => {
          this.loaded_src = this.src
          this.image_exists = true
        }
        img.src = this.imagePath
      }, this.delay)
    }
  }
}
</script>

<style lang="scss">
@import '~assets/styles/common.scss';

.v-avatar {
  flex-shrink: 0;
  margin: 0 !important;
  background: linear-gradient(180deg, #c9a15d 0%, #ba9462 100%);
  .new-message {
    position: absolute;
    width: 8px;
    height: 8px;
    border: 1px solid #fff;
    background: #ef4d37;
    border-radius: 16px;
    top: 0;
    left: 0;
  }
  .load-text {
    position: absolute;
    z-index: 1;
    top: 114px;
    font-family: Roboto-Slab;
    font-size: 13px;
    color: rgba(137, 149, 175, 0.5);
  }
  img {
    background: #fff;
    position: relative;
    z-index: 2;
  }
  &.square {
    margin-bottom: 20px;
    width: 312px !important;
    height: 184px !important;
    background: url('~assets/phot.svg') no-repeat top 57px center;
    background-size: 40px;
    background-color: rgba(137, 149, 175, 0.1) !important;
    border-radius: 0;
    img {
      border-radius: 0;
    }
  }
}

.avatar-letters {
  font-family: $roboto;
  font-style: normal;
  font-weight: normal;
  line-height: normal;
  text-align: center;
  color: #ffffff;
}

.business-avatar {
  width: 140px;
  height: 140px;
  @media only screen and (min-width: $desktop) {
    width: 170px;
    height: 170px;
  }
}

.add-photo-empty {
  width: 140px;
  height: 140px;
  padding-top: 36px;
  color: rgba(137, 149, 175, 0.5);
  font: 12px $lato;
  background: #f3f4f7;
  border-radius: 50%;
  text-align: center;
  cursor: pointer;
  @media only screen and (min-width: $desktop) {
    width: 170px;
    height: 170px;
    padding-top: 53px;
    font-size: 14px;
  }

  &__text {
    margin-top: 10px;
  }
}
</style>
