<template>
  <VCard class="avatar-editor">
    <VLayout
      align-center
      justify-space-around
      row
    >
      <VLayout
        align-center
        justify-space-around
        column
      >
        <VFlex
          justify-center
          pb-3
        >
          <VueAvatar
            ref="vueavatar"
            :width="width"
            :height="height"
            :border-radius="borderRadius"
            :border="border"
            :color="color"
            :scale="+scale"
            :background="background"
            @vue-avatar-editor:image-ready="onImageReady"
            @select-file="onSelectFile($event)"
          />
        </VFlex>
        <VFlex>
          <VLayout
            v-if="scale"
            column
            fill-height
          >
            <VFlex class="avatar-editor__text">
              Подберите миниатюру под нужный размер и положение в круге
            </VFlex>
            <VFlex>
              <v-slider
                v-model="scale"
                min="1"
                max="3"
                step="0.02"
                class="avatar-editor__scale"
              />
              <br>
            </VFlex>
          </VLayout>
        </VFlex>
      </VLayout>
    </VLayout>
    <VCardActions>
      <VBtn
        xs12
        color="primary"
        class="button"
        @click="finished"
      >
        Сохранить
      </VBtn>
    </VCardActions>
  </VCard>
</template>

<script>
import VueAvatar from './VueAvatar.vue'

export default {
  components: {
    VueAvatar
  },
  props: {
    avatar: {
      type: String,
      default: ''
    },
    background: {
      type: String,
      default: ''
    },
    finishText: {
      type: String,
      default: 'Save'
    },
    hasRotation: {
      type: Boolean,
      default: false
    },
    hasScale: {
      type: Boolean,
      default: true
    },
    image: {
      type: String,
      default: ''
    },
    border: {
      type: Number,
      default: 25
    },
    borderRadius: {
      type: Number,
      default: 0
    },
    width: {
      type: Number,
      default: 200
    },
    height: {
      type: Number,
      default: 200
    },
    color: {
      type: Array,
      default: () => [0, 0, 0, 0.5]
    }
  },
  data () {
    return {
      scale: 0
    }
  },
  methods: {
    onSelectFile (files) {
      this.$emit('select-file', files)
    },
    onImageReady () {
      this.scale = 1
    },
    finished () {
      return this.$emit('finished', this.$refs.vueavatar.getImageScaled())
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '~/assets/styles/button.scss';

  .avatar-editor {
    padding: 56px 47px 56px 48px;

    &__text {
      padding: 10px 0;
      font-family: Lato, sans-serif;
      font-size: 14px;
      line-height: normal;
      text-align: center;
      color: #8995AF;
    }

    &__scale {
      .v-slider__thumb {
        background: #FFFFFF !important;
        box-shadow: 0px 0px 3px rgba(137, 149, 175, 0.35);
      }
    }

    .v-card__actions {
      padding: 0;
      justify-content: center;
    }

    & button {
      width: 280px !important;
      height: 56px !important;
      border-radius: 4px !important;
    }

    #avatarEditorCanvas {
      display: block;
    }
  }
</style>
