<template>
  <v-card :hover="hoverEffect" class="card">
    <v-card-title class="card__title" @click="$emit('titleClick')">
      <v-flex xs12 class="card__subtitle-text">
        {{ subtitle }}
      </v-flex>
      <v-flex xs12 class="card__title-text">
        {{ title }}
      </v-flex>
    </v-card-title>
    <v-responsive class="card__bottom" @click="$emit('imgClick')">
      <v-img
        v-if="image"
        :src="imgSrc"
        :height="height"
        :aspect-ratio="aspectRatio"
        class="card__image-block"
      />
      <v-layout v-else fill-height align-space-around justify-space-between>
        <slot name="card-placeholder" />
      </v-layout>
    </v-responsive>
  </v-card>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  props: {
    aspectRatio: { type: String, default: '1' },
    title: { type: String, default: '' },
    subtitle: { type: String, default: '' },
    height: { type: String, default: undefined },
    image: { type: Object, default: undefined },
    hoverEffect: { type: Boolean, default: false }
  },
  data () {
    return {
      placeholder:
        'https://i1.wp.com/makeupandbeautyhome.com/wp-content/uploads/2013/10/Kiwi-and-Cream-Dry-Skin-Facial.jpg'
    }
  },
  computed: {
    ...mapGetters({ businessId: 'business/businessId' }),
    selected () {
      return (
        this.images &&
        this.images.length &&
        (Math.random() * this.images.length) | 0
      )
    },
    imgSrc () {
      return (
        this.image &&
        `${process.env.VUE_APP_IMAGES}${this.businessId}/${this.image.id}`
      )
    }
  },
  methods: {
    showSlider (images) {
      this.$emit('showSlider', {
        selected: this.selected,
        images,
        title: this.title,
        subtitle: this.subtitle
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~assets/styles/common.scss';

.card {
  width: 280px;
  box-shadow: none;
  @media only screen and (min-width: $desktop) {
    width: 312px;
  }
  &:last-child {
    margin-right: 0;
  }

  &__title {
    position: relative;
    box-sizing: border-box;
    min-height: 65px;
    padding: 12px 0 12px 20px;
    border-top: 1px solid rgba(137, 149, 175, 0.2);
    background: #f4f5f7;

    &:after {
      content: '';
      position: absolute;
      top: 0;
      bottom: 0;
      right: 4px;
      margin: auto;
      width: 6px;
      height: 10px;
      background: url('~assets/images/svg/arrow-right.svg') no-repeat center
        center;
    }
  }

  &__subtitle-text {
    padding: 1px 4px !important;
    color: #8995af;
    font: 14px $lato;
  }

  &__title-text {
    padding: 1px 4px !important;
    color: #07101c;
    font: 700 16px $lato, sans-serif;
  }

  &__bottom {
    height: 190px;
  }

  &__image-block {
    max-height: 190px;
  }

  &.empty-card-company {
    .card__bottom {
      background: url('~assets/images/gallery/company.png') center center
        no-repeat;
    }
  }

  &.empty-card-employees {
    .card__bottom {
      background: url('~assets/images/gallery/employees.png') center center
        no-repeat;
    }
  }

  &.empty-card-services {
    .card__bottom {
      background: url('~assets/images/gallery/services.png') center center
        no-repeat;
    }
  }
}
</style>
