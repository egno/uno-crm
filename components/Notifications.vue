<template>
  <div
    class="notif"
    :class="{active: count > 0}"
  >
    <div
      v-if="count > 0"
      class="count"
    >
      {{ count }}
    </div>
  </div>
</template>

<script>

export default {
  props: {
    source: { type: String, default: () => '' }
  },
  data: () => ({
    count: 0,
  }),
}
</script>
<style lang="scss">
  .notif {
    width: 60px;
    border-left: 1px solid #f4f5f7; // rgba(137, 149, 175, 0.1);
    background: url('/assets/bellh.svg') no-repeat center center;
    background-size: 14px;
    cursor: pointer;
    position: relative;
    &.active {
      background: url('/assets/bell.svg') no-repeat center center;
      background-size: 14px;
    }
    .count {
      position: absolute;
      width: 16px;
      height: 16px;
      background: #07101C;
      color: #fff;
      border-radius: 20px;
      display: flex;
      justify-content: center;
      align-content: center;
      top: 24px;
      right: 14px;
      font-size: 11px;
      line-height: 17px;
    }
  }
</style>
