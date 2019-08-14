<template>
  <Accordion class="business-schedule-view">
    <template slot="heading">
      <div>Режим работы</div>
    </template>
    <template slot="content">
      <VFlex v-for="(day, j) in days" :key="j" xs12 class="day-schedule">
        <div
          v-if="day.value && day.value.start && day.value.end"
          class="day-schedule__wrapper"
        >
          <div class="day-schedule__dayname">
            {{ day.dayName }}
          </div>
          <div
            v-if="day.value.start || day.value.end"
            class="day-schedule__times"
          >
            <span>
              {{ day.value.start }}
            </span>
            <span> - </span>
            <span>
              {{ day.value.end }}
            </span>
          </div>
        </div>
      </VFlex>
    </template>
  </Accordion>
</template>

<script>
import { scheduleMixin } from './mixins'
import Accordion from '~/components/common/Accordion.vue'

export default {
  components: { Accordion },
  mixins: [ scheduleMixin ],
  props: {
    expanded: { type: Boolean, default: false },
  },
}
</script>

<style lang="scss">
@import '~assets/styles/day-schedule.scss';

.business-schedule-view {
  .accordion {
    padding: 20px 0 0;

    &__header {
      position: relative;
      padding: 11px 17px 10px 36px;
      min-width: 246px;
      border-radius: 20px;
      cursor: pointer;
      background: rgba(137, 149, 175, 0.1);
      font-family: Lato, sans-serif;
      font-weight: 900;
      font-size: 14px;
      border-bottom: 1px solid transparent;

      &:before {
        position: absolute;
        top: 13px;
        left: 12px;
        content: '';
        width: 14px;
        height: 14px;
        background: url('~assets/images/svg/clock.svg') center no-repeat;
      }

      &:after {
        position: absolute;
        top: 18px;
        right: 20px;
        content: '';
        width: 10px;
        height: 6px;
        background: url('~assets/images/svg/down.svg') center no-repeat;
      }
    }

    &__container {
      padding: 17px 23px 26px 36px;
      border-bottom-left-radius: 20px;
      border-bottom-right-radius: 20px;
      background: rgba(137, 149, 175, 0.1);
    }

    &._expanded {
      .schedule__header {
        border-bottom-left-radius: 0;
        border-bottom-right-radius: 0;
        border-bottom-color: #fff;

        &:after {
          transform: rotate(180deg);
        }
      }
    }
  }
}

</style>
