<template>
  <v-dialog v-model="show" :fullscreen="fullScreen" max-width="944px" content-class="gallery-slider">
    <v-layout justify-space-between>
      <v-flex class="gallery-slider__left">
        <v-layout class="gallery-slider__header" align-center justify-space-between>
          <v-flex>
            <div class="gallery-slider__title">
              {{ title }}
            </div>
            <div class="gallery-slider__subtitle">
              {{ subtitle }}
            </div>
          </v-flex>
          <v-flex shrink>
            <v-layout align-center justify-space-between>
              <div> {{ selected + 1 }} / {{ images.length }}</div>
              <v-btn
                flat
                icon
                @click="deleteImage"
              >
                <!--todo-->
                <v-icon>delete</v-icon>
              </v-btn>
            </v-layout>
          </v-flex>
        </v-layout>
        <v-container class="gallery-slider__img">
          <v-img
            :src="imagePath(images[selected])"
            aspect-ratio="16/9"
            max-width="800"
            min-height="450"
            :contain="true"
          />
        </v-container>
        <!--<v-layout>
          <v-btn
            flat
            icon
            @click="$emit('fullscreenOn')"
          >
            &lt;!&ndash;todo&ndash;&gt;
            <v-icon>expand</v-icon>
          </v-btn>
        </v-layout>-->
      </v-flex>
      <div class="gallery-slider__thumbs">
        <v-flex v-if="sliderCanScroll">
          <v-btn
            small
            flat
            block
            class="white--text"
            @click="onPrevClick"
          >
            <v-icon>keyboard_arrow_up</v-icon>
          </v-btn>
        </v-flex>
        <div v-show="!fullScreen" class="gallery-slider__previews">
          <div
            v-for="(image, i) in images"
            :key="i"
            :class="[selected===i? '_selected':'', 'gallery-slider__preview']"
            @click.stop="onPreviewSelect($event, i)"
          >
            <v-img
              :src="imagePath(image)"
              :aspect-ratio="120/80"
            />
          </div>
        </div>
        <v-flex v-if="sliderCanScroll">
          <v-btn
            small
            flat
            block
            class="white--text"
            @click="onNextClick"
          >
            <v-icon>keyboard_arrow_down</v-icon>
          </v-btn>
        </v-flex>
      </div>
    </v-layout>
  </v-dialog>
</template>

<script>
  import { mapGetters } from 'vuex'
  import { imagePath } from '@/components/gallery/utils'

  export default {
  model: {
    prop: 'display',
    event: 'input'
  },
  props: {
    display: { type: Boolean, default: false },
    fullScreen: { type: Boolean, default: false },
    images: { type: Array, default: undefined },
    current: { type: Number, default: 0 },
    title: { type: String, default: '' },
    subtitle: { type: String, default: '' }
  },
  data () {
    return {
      sliderCount: 4,
      selected: 0,
      previewsParentEl: null
    }
  },
  computed: {
    ...mapGetters({ businessId: 'business/businessId'}),
    sliderCanScroll () {
      return this.images && this.images.length > this.sliderCount
    },
    show: {
      get () {
        return this.display
      },
      set () {
        this.$emit('close')
      }
    }
  },
  watch: {
    'display' (visible) {
      if (visible) {
        this.selected = this.current
        this.scrollToSelected()
      }
    }
  },
  methods: {
    imagePath (image) {
      if (!image) {
        return
      }
      return imagePath(image.id, this.businessId)
    },
    deleteImage () {
      this.$emit('deleteImage', this.images[this.selected].id)
    },
    onPreviewSelect (event, index) {
      this.selected = index
      event.currentTarget.scrollIntoView({ behavior: 'smooth' })
    },
    onPrevClick () {
      this.selected = (this.selected + this.images.length - 1) % this.images.length
      this.scrollToSelected()
    },
    onNextClick () {
      this.selected = (this.selected + 1) % this.images.length
      this.scrollToSelected()
    },
    scrollToSelected () {
      if(!this.previewsParentEl) {
        this.previewsParentEl = document.querySelector('.gallery-slider__previews')
      }
      this.$nextTick(() => {
        this.previewsParentEl.querySelector('._selected').scrollIntoView({ behavior: 'smooth' })
      })
    }
  }
}
</script>

<style lang="scss">
  @import '~/assets/styles/common.scss';
  .gallery-slider {
    box-shadow: none;

    &>div {
      height: 100%;
    }
    &__left {
      max-width: 800px;
    }

    &__header {
      max-height: 56px;
      padding: 8px 0 8px 16px;
      background-color: #fff;
    }

    &__thumbs {
      //display: none;
      @media only screen and (min-width : $desktop) {
        display: block;
        width: 120px;
      }
    }

    &__previews {
      height: 432px;
      overflow-y: auto;
    }

    &__preview {
      margin: 4px 0;
      border: 1px solid transparent;
      &._selected {
        border: 1px solid rgba(255, 255, 255, 0.65);
      }
    }

    &__img {
      max-width: 800px;
      padding: 0;
      background: #757575;
    }

    &.fullscreen {
      .gallery-slider__previews {
        display: none;
      }
    }
  }
</style>

