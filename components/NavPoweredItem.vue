<template>
  <v-card
    v-if="item.show"
    class="menu-item-card"
    color="rgba(0,0,0,0)"
    flat
    pa-0
  >
    <div class="menu-item-container">
      <div class="menu-item-left" :class="{ _active: isActiveItem }">
        <VListTile :to="item.route">
          <VListTileContent>
            <VListTileTitle>
              {{ item.title }}
            </VListTileTitle>
          </VListTileContent>
          <VListTileAction>
            <span
              v-if="item.count && !isActiveItem"
              class="list-item--count"
            >
              {{ item.count }}
            </span>
          </VListTileAction>
        </VListTile>
      </div>
      <div
        v-show="item.action && isActiveItem"
        class="add-btn"
        @click="$emit('onAction',item.action)"
      >
        <v-icon color="white">
          add
        </v-icon>
      </div>
    </div>
  </v-card>
</template>

<script>
export default {
  props: {
    item: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  computed: {
    isActiveItem () {
      return this.item.route && (this.item.route.name === this.$route.name)
    }
  }
}
</script>

<style lang="scss" scoped>
.menu-item-container {
  display: flex;
}
.menu-item-left {
  flex-grow: 1;

  &._active {
    background: rgba(137, 149, 175, 0.2);
   }
}
</style>
