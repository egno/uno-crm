<template>
  <div
    v-if="visit.j.type === 'break'"
    class="visit-wrapper"
    @click="selectCurrentBreak"
  >
    <div class="visit" :style="`height: ${actualContainerHight}px;`">
      <div :class="['break-time', { _long: visit.j.duration > 15 }]" />
    </div>
  </div>
  <div v-else class="visit-wrapper">
    <div
      :style="`height: ${actualContainerHight}px; background: ${bgColor};`"
      :class="[
        'visit',
        {
          'white-bg': whiteBg,
          canceled: visitStatus.display === 'Отмена',
          unvisited: visitStatus.display === 'Не пришел'
        }
      ]"
      @click="selectVisit(visit)"
    >
      <div
        v-if="visit.j.duration < 45"
        class="visit__container"
        @mouseenter="showTooltip = true"
        @mouseleave="showTooltip = false"
      >
        <div class="visit__top">
          <div class="visit__time">
            {{ timeStart }} – {{ timeEnd }}
          </div>
        </div>
        <div class="visit__status">
          {{ visitStatus.display }}
        </div>
      </div>
      <div v-else class="visit__container">
        <div class="visit__top">
          <div class="visit__time">
            {{ timeStart }} – {{ timeEnd }}
          </div>
          <div class="visit__name">
            {{ clientName() }}
          </div>
          <div class="visit__phone">
            {{ visit.clientPhone | phoneFormat }}
          </div>
          <div v-for="(service, n) in services" :key="n" class="visit__service">
            {{ serviceName(service) }}
          </div>
        </div>
        <div class="visit__status">
          {{ visitStatus.display }}
        </div>
      </div>
    </div>
    <transition :duration="400" name="slide-fade">
      <div v-show="visit.j.duration < 45 && showTooltip" class="visit _tooltip">
        <div class="visit__container">
          <div class="visit__top">
            <div class="visit__time">
              {{ timeStart }} – {{ timeEnd }}
            </div>
            <div class="visit__name">
              {{ clientName() }}
            </div>
            <div class="visit__phone">
              {{ visit.clientPhone | phoneFormat }}
            </div>
            <div
              v-for="(service, n) in services"
              :key="n"
              class="visit__service"
            >
              {{ serviceName(service) }}
            </div>
          </div>
          <div class="visit__status">
            {{ visitStatus.display }}
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { hashColor } from '~/components/utils'

export default {
  props: {
    id: { type: String, default: undefined },
    now: {
      type: Date,
      default () {
        return new Date()
      }
    },
    selected: { type: Boolean, default: false },
    services: {
      type: Array,
      default () {
        return []
      }
    },
    visit: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      slotDuration: 15 /* smallest slot duration in minutes  */,
      slotHeight: 55.5 /* smallest slot height in px */,
      showTooltip: false
    }
  },
  computed: {
    ...mapGetters({ selectedVisit: 'common/selectedVisit' }),
    visitStatus () {
      return this.visit.getCurrentStatus(this.now)
    },
    whiteBg () {
      const status = this.visitStatus

      return (
        status.display === 'Завершен' ||
        status.display === 'Отмена' ||
        status.display === 'Не пришел'
      )
    },
    bgColor () {
      if (this.whiteBg) {
        return '#FFF'
      }

      return (
        this.visit.color ||
        (this.visit.clientName || this.visit.clientPhone
          ? hashColor(
            `${this.visit.clientName}${this.visit.j.client.phone}${this.email}`,
            30,
            40
          )
          : 'grey')
      )
    },
    actualContainerHight () {
      return (this.visit.j.duration / this.slotDuration) * this.slotHeight - 1
    },
    timeEnd () {
      return this.visit.timeEnd
    },
    timeStart () {
      return this.visit.time
    }
  },
  methods: {
    ...mapActions({
      selectBreak: 'common/selectBreak',
      selectVisit: 'common/selectVisit'
    }),
    onSelect () {
      this.$emit('unselectOthers')
    },
    selectCurrentBreak () {
      this.selectBreak(this.visit)
    },
    serviceName (service) {
      if (this.services.length > 2) {
        return service.name.substring(0, 13) + '...'
      }
      return this.services.length > 1 && service.name.length > 30
        ? service.name.substring(0, 27) + '...'
        : service.name
    },
    clientName () {
      const arr = this.visit.clientName
        ? this.visit.clientName.split(' ')
        : ['Аноним', '']

      return `${arr[0]} ${arr[1] ? arr[1].substring(0, 1) + '.' : ''}`
    }
  }
}
</script>

<style lang="scss" scoped>
.slide-fade-enter-active {
  transition: all 0.3s ease;
}
.slide-fade-leave-active {
  transition: all 0.8s cubic-bezier(1, 0.5, 0.8, 1);
}
.slide-fade-enter,
.slide-fade-leave-to {
  transform: translateX(10px);
  opacity: 0;
}
.v-btn {
  float: right;
  margin: 0;
  border-radius: 0;
}

.visit-wrapper {
  position: relative;
  cursor: pointer;
}
.visit {
  font-size: 12px;
  transition: all 0.5s ease 0s;
  border-radius: 4px;
  text-align: left;
  &__container {
    height: 100%;
    display: flex;
    flex-wrap: wrap;
    align-content: space-between;
    padding: 9px 12px;
    color: #fff;
  }
  &__top {
    flex-basis: 100%;
  }
  &__time {
    color: rgba(255, 255, 255, 0.8);
  }
  &__duration {
    opacity: 0.7;
  }
  &__name {
    margin-top: 7px;
    font-weight: 900;
    font-size: 14px;
    text-transform: capitalize;
  }
  &__phone {
    margin-top: 2px;
  }
  &__service {
    margin-top: 10px;
    color: rgba(255, 255, 255, 0.8);
    &::first-letter {
      text-transform: capitalize;
    }
  }
  &__status {
    color: rgba(255, 255, 255, 0.35);
  }
  &._tooltip {
    position: absolute;
    z-index: 10;
    top: 100%;
    padding: 5px;
    background-color: #1c2f44 !important;
    box-shadow: 1px 2px 7px rgba(0, 0, 0, 0.04);
  }
  .active {
    z-index: 2;
  }
  &.white-bg {
    border-radius: 0;
    border-top: 2px solid #5699ff;

    .visit__container {
      color: #07101c;
    }
    .visit__time,
    .visit__service,
    .visit__status {
      color: #8995af;
    }
  }

  &.canceled,
  &.unvisited {
    border-top: none;
  }

  &.unvisited {
    border-left: 2px solid #ef4d37;
    .visit__status {
      color: #ef4d37;
    }
  }

  &.canceled {
    border-left: 2px solid #8995af;
    .visit__status {
      color: rgba(137, 149, 175, 0.35);
    }
  }
  .break-time {
    height: 100%;
    background: url('~assets/images/svg/cup-big.svg') center/48px no-repeat
      #d6dae3;
    border-radius: 4px;
    &._long {
      background: url('~assets/images/svg/cup-title.svg') center/65px 81px
        no-repeat #d6dae3;
    }
  }
}
.v-tooltip__content .visit {
  min-height: 115px;
  padding: 0;
}
</style>
