<template>
  <div class="branch-card" :class="{ _pinned: pinned }" @click="$emit('click')">
    <div class="branch-card__top">
      <div class="branch-card__left">
        <h2 class="branch-card__title">
          <!--<span v-if="!branch.parent" class="branch-card__main">
            <svg width="10" height="11" viewBox="0 0 10 11" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M10 3.4375L5 0L0 3.4375V11H10V3.4375ZM3.75 10.9999V7.33321H6.25V10.9999H3.75Z" :fill="pinned? '#FFFFFF' : '#5699FF'" />
            </svg>
          </span>-->
          <!--eslint-disable vue/no-parsing-error -->
          <span>{{ branch.j.name || '<Филиал компании>' }}</span>
        </h2>
        <div v-if="branch.j.address" class="branch-card__subtitle">
          {{ branch.j.address.name }}
        </div>
      </div>
      <div v-if="pinned" class="branch-card__right">
        <div class="branch-card__pin" />
      </div>
    </div>
    <div class="branch-card__bottom">
      <div>
        <div v-if="branch.j.employees" class="branch-card__info">
          {{ branch.j.employees | formatMaster }}
        </div>
      </div>
      <DeleteButton
        :is-dark="true"
        :visible="isEditable && canDelete"
        @delete="$emit('delete')"
      />
    </div>
  </div>
</template>

<script>
import DeleteButton from '~/components/common/DeleteButton'
import { conjugateEmployee } from '~/components/utils'

export default {
  components: {
    DeleteButton,
  },
  filters: {
    formatMaster (n) {
      return conjugateEmployee(n)
    },
  },
  props: {
    branch: {
      type: Object,
      default: () => {
        return {}
      },
    },
    pinned: {
      type: Boolean,
      default: false,
    },
    isEditable: {
      type: Boolean,
      default: false,
    },
    canDelete: {
      type: Boolean,
      default: true,
    },
  },
  data () {
    return {
      captionClass:
        'caption font-weight-bold text-no-wrap grey--text text--darken-1',
    }
  },
  methods: {
    onDelete () {
      this.edit = false
      this.$emit('delete', this.branch)
    },
  },
}
</script>

<style lang="scss">
.branch-card {
  width: 312px;
  height: 160px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-content: space-between;
  padding: 17px 4px 8px 24px;
  border-top: 2px solid transparent;
  box-shadow: 0px 0px 2px rgba(137, 149, 175, 0.35);
  transition: border-color 0.4s 0s;
  box-sizing: border-box;
  background-color: #fff;
  &:hover {
    border-color: #5699ff;
    cursor: pointer;
    box-shadow: 0 2px 12px rgba(137, 149, 175, 0.1);
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
    max-width: 85%;
  }

  &__title {
    font-weight: 900;
    font-size: 18px;
    color: #07101c;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &__main {
    display: inline-block;
    vertical-align: baseline;
    margin-right: 6px;
  }

  &__subtitle {
    font-weight: normal;
    font-size: 12px;
    color: #8995af;
  }

  &__pin {
    width: 24px;
    height: 24px;
    margin-right: 8px;
    background: url('~assets/images/svg/pin.svg') center no-repeat;
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

  &._pinned {
    background-color: #5699ff;

    .branch-card__title {
      color: #fff;
    }
    .branch-card__subtitle {
      color: rgba(255, 255, 255, 0.6);
    }
    .branch-card__info {
      color: #fff;
      background-color: rgba(255, 255, 255, 0.2);
    }
    .delete-button {
      path {
        fill: #fff;
        fill-opacity: 1;
      }
      &:hover {
        background-color: rgba(255, 255, 255, 0.1);
      }
    }
  }
}
</style>
