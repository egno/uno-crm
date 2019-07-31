<template>
  <div
    :class="[
      'service-card',
      {
        '_not-hoverable': !hoverable,
        _responsive: responsive,
        _selected: isSelected
      }
    ]"
    :style="{ 'background-image': `url(${imagePath}service_group/${image}` }"
    @click="$emit('click')"
  >
    <div class="service-card__top">
      <div class="service-card__left">
        <h2 class="service-card__title">
          {{
            service.name.length > 70
              ? service.name.substring(0, 70) + '...'
              : service.name
          }}
        </h2>
        <div v-if="service.j.duration" class="service-card__subtitle _duration">
          {{ service.j.duration }} мин.
        </div>
        <div v-if="service.j.price" class="service-card__subtitle _price">
          {{ service.j.price }} р.
        </div>
      </div>
    </div>
    <div class="service-card__bottom">
      <div>
        <div
          v-if="service.j.employees && service.j.employees.length"
          class="service-card__info"
        >
          {{ service.j.employees.length | formatMaster }}
        </div>
      </div>
      <template v-show="editMode">
        <DeleteButton @click.native.stop="$emit('delete')" />
      </template>
    </div>
    <div class="service-card__selection" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import DeleteButton from '~/components/common/DeleteButton'
import { conjugateEmployee } from '~/components/utils'

export default {
  components: { DeleteButton },
  filters: {
    formatMaster (n) {
      return conjugateEmployee(n)
    }
  },
  props: {
    editMode: { type: Boolean, default: false },
    service: {
      type: Object,
      default: () => {
        return {}
      }
    },
    isSelected: { type: Boolean, default: false },
    hoverable: { type: Boolean, default: true },
    responsive: { type: Boolean, default: false }
  },
  computed: {
    ...mapGetters({ serviceGroups: 'service/serviceGroups' }),
    imagePath () {
      return process.env.VUE_APP_IMAGES || '/images/'
    },
    image () {
      const group = this.serviceGroups.find(
        gr => gr.name === this.service.j.group
      )

      return group && group.j && group.j.image
    }
  }
}
</script>

<style lang="scss" scoped>
.text-value {
  padding-left: 0.5em;
  padding-right: 0.2em;
}

.service-card {
  position: relative;
  width: 312px;
  height: 160px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-content: space-between;
  padding: 17px 4px 8px 17px;
  margin: 0 10px 20px 0;
  border-top: 2px solid transparent;
  box-shadow: 0 0 2px rgba(137, 149, 175, 0.35);
  transition: border-color 0.4s 0s;
  box-sizing: border-box;
  background-size: cover;
  background-position: right top;
  background-repeat: no-repeat;
  background-color: #fff;
  @media only screen and (min-width: 1360px) {
    padding-left: 24px;
  }
  &:hover {
    border-color: #5699ff;
    cursor: pointer;
    box-shadow: 2px 12px 12px rgba(137, 149, 175, 0.2);
  }
  &__top,
  &__bottom {
    display: flex;
    justify-content: space-between;
  }
  &__top {
    font-family: Lato, sans-serif;
    font-style: normal;
    line-height: normal;
  }
  &__bottom {
    align-items: center;
  }
  &__left {
    overflow: hidden;
  }
  &__title {
    margin-bottom: 10px;
    font-weight: 900;
    font-size: 18px;
    color: #07101c;
    text-transform: capitalize;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  &__main {
    display: inline-block;
    vertical-align: baseline;
    margin-right: 6px;
  }
  &__subtitle {
    margin-bottom: 9px;
    padding-left: 20px;
    font-weight: normal;
    font-size: 12px;
    color: #8995af;

    &._duration {
      background: url('~assets/images/svg/clock_opacity_1.svg') left center
        no-repeat;
    }
    &._price {
      background: url('~assets/images/svg/rub.svg') 3px center no-repeat;
    }
  }
  &__info {
    width: 125px;
    height: 24px;
    padding: 4px 0 0;
    background: rgba(137, 149, 175, 0.1);
    border-radius: 12px;
    color: #8995af;
    text-align: center;
  }
  &__selection {
    position: absolute;
    bottom: 13px;
    right: 9px;
    display: none;
    width: 24px;
    height: 24px;
    border-radius: 50%;
  }
  &._responsive {
    width: 100%;
    max-width: 420px;
    height: 110px;
    margin: 0 auto 20px;

    .service-card__title,
    .service-card__subtitle {
      margin-bottom: 7px;
    }

    .service-card__bottom {
      display: none;
    }
  }
  &._not-hoverable:hover {
    border-color: transparent;
    cursor: default;
    box-shadow: 0 0 2px rgba(137, 149, 175, 0.35);
  }
  &._selected {
    padding-right: 33px;
    border-color: #5699ff;

    .service-card__selection {
      display: block;
      background: url('~assets/images/svg/selection.svg') center no-repeat
        #5699ff;
    }
  }
}
</style>
