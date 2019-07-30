<template>
  <v-layout class="client-visit-log" :class="{ [visit.status]: visit.status, done: status && status.done }">
    <div
      class="client-visit-log__left"
    >
      <div class="client-visit-log__date">
        {{ visit.date }}
      </div>
      <div class="client-visit-log__status">
        {{ status.display }}
      </div>
    </div>
    <div
      class="client-visit-log__right"
    >
      <div class="client-visit-log__time">
        {{ visit.time }}
      </div>
      <div v-if="services">
        <v-layout
          v-for="(service, si) in services"
          :key="'s'+si"
          align-center
          fill-height
          justify-space-between
          class="client-visit-log__service"
        >
          <div class="client-visit-log__service-name">
            {{ service.name }}
          </div>
          <div
            v-if="service.j && service.j.price"
            class="client-visit-log__price"
          >
            {{ service.j.price }} ₽
          </div>
        </v-layout>
      </div>
      <div v-if="master">
        <div class="client-visit-log__master">
          Мастер
        </div>
        <div>
          {{ master }}
        </div>
      </div>
    </div>
  </v-layout>
</template>

<script>
import Visit from '~/classes/visit'

export default {
  props: {
    visit: {
      type: Object,
      default () {
        return new Visit()
      }
    }
  },
  data () {
    return {}
  },
  computed: {
    master () {
      return this.visit && this.visit.j && this.visit.j.master && this.visit.j.master.name
    },
    services () {
      return this.visit && this.visit.j && this.visit.j.services
    },
    status () {
      return this.visit.status
        ? this.visit.statuses.find(s => s.code === this.visit.status)
        : this.visit.getCurrentStatus(new Date())
    }
  }
}
</script>

<style lang="scss" scoped>
  $log-top-gap: 24px;
  $log-bottom-gap: 24px;
  $date-line-gap: 10px;
  $future-color: #5699FF;
  $cancel-color: rgba(137, 149, 175, 0.35);
  $unvisited-color: #EF4D37;
  $done-color: #8995AF;

  // todo make hover effects when editing is possible
  .visit-service-price .row-hover {
    background-color: #eee;
  }

  .client-visit-log {

    &__left {
      width: 110px;
      flex-shrink: 0;
      padding: $log-top-gap 0 $log-bottom-gap;
      border-right: solid 2px rgba(137, 149, 175, 0.2);
      text-align: right;
    }
    &__right {
      flex-grow: 1;
      padding: $log-top-gap 40px $log-bottom-gap 47px;
      text-align: left;
      color: #07101C;
    }
    &__date {
      position: relative;
      padding-right: $date-line-gap;
      font-size: 12px;
      color: #8995AF;
      &:after {
        position: absolute;
        top: 6px;
        right: -5px;
        width: 8px;
        height: 8px;
        border-radius: 50%;
        content: '';
        background-color: $future-color;
      }
    }
    &__status {
      padding: 4px $date-line-gap 0 0;
      font-size: 14px;
      color: $future-color;
    }
    &__time {
      font-size: 12px;
      color: #8995AF;
    }
    &__service {
      padding: 5px 0 0;
    }
    &__service-name {
      padding-right: 10px;
    }
    &__price {
      height: 18px;
      padding: 0 10px;
      background: rgba(137, 149, 175, 0.35);
      border-radius: 12px;
      font-size: 14px;
      line-height: 18px;
      text-align: center;
      color: #fff;
      white-space: nowrap;
    }
    &__master {
      margin-top: 7px;
      font-weight: 900;
      text-transform: capitalize;
    }
    
    &.unvisited {
      .client-visit-log__date:after {
        background-color: $unvisited-color;
      }
      .client-visit-log__status {
        color: $unvisited-color;
      }
    }
    &.canceled {
      .client-visit-log__date:after {
        background-color: $done-color;
      }
      .client-visit-log__status {
        color: $cancel-color;
      }
    }
    &.done {
      .client-visit-log__date:after {
        background-color: $done-color;
      }
      .client-visit-log__status {
        color: $done-color;
      }
    }
  }

</style>

