<template>
  <div class="accordion" :class="{ _expanded: isOpen }">
    <div class="accordion__header" @click="onClick">
      <slot name="heading" />
    </div>
    <div v-show="isOpen" class="accordion__container">
      <slot name="content" />
    </div>
    <div v-show="$slots.footer && isOpen" class="accordion__footer">
      <slot name="footer" />
    </div>
  </div>
</template>

<script>
export default {
  model: {
    prop: 'expanded',
    event: 'click'
  },
  props: {
    expanded: {
      type: Boolean,
      default: null
    }
  },
  data () {
    return {
      expandedData: false
    }
  },
  computed: {
    isOpen () {
      return this.expanded !== null ? this.expanded : this.expandedData
    }
  },
  created () {
    if (this.expanded !== null) {
      this.expandedData = this.expanded
    }
  },
  methods: {
    onClick () {
      this.expandedData = !this.expandedData
      this.$emit('click', !this.expanded)
    }
  }
}
</script>

<style lang="scss">
.accordion {
  padding: 20px 0 0;

  &__header {
    position: relative;
    padding: 11px 36px 10px 36px;
    border-radius: 20px;
    cursor: pointer;
    background: rgba(137, 149, 175, 0.1);
    font-family: Lato, sans-serif;
    font-weight: 600;
    font-size: 14px;
    border-bottom: 1px solid transparent;

    &:after {
      position: absolute;
      top: 50%;
      right: 20px;
      content: '';
      width: 10px;
      height: 6px;
      margin-top: -3px;
      background: url('~assets/images/svg/down.svg') center no-repeat;
    }
  }

  &__container {
    padding: 17px 23px 26px 36px;
    background: rgba(137, 149, 175, 0.1);
  }

  &__footer {
    padding: 11px 17px 10px 36px;
    background: rgba(137, 149, 175, 0.1);
    border-top: 1px solid #fff;
  }

  &._expanded {
    border-bottom-left-radius: 20px;
    border-bottom-right-radius: 20px;
    overflow: hidden;

    .accordion__header {
      border-bottom-left-radius: 0;
      border-bottom-right-radius: 0;
      border-bottom-color: #fff;

      &:after {
        transform: rotate(180deg);
      }
    }
  }
}
</style>
