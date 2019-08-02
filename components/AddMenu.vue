<template>
  <div class="add-menu">
    <div v-if="navigationMini">
      <v-menu offset-x open-on-hover>
        <template v-slot:activator="{ on }" class="pl-0">
          <div class="accent add-btn" v-on="on">
            <v-icon color="white">
              add
            </v-icon>
          </div>
        </template>

        <v-list dark>
          <template v-for="(item, i) in adds">
            <VListTile :key="i" ripple active-class="accent" @click="onAction">
              <v-list-tile-content>
                <VListTileTitle>
                  <span class="body-1">
                    {{ item }}
                  </span>
                </VListTileTitle>
              </v-list-tile-content>
            </VListTile>
          </template>
        </v-list>
      </v-menu>
    </div>

    <v-list v-else>
      <VListGroup v-model="expand" no-action :class="{ accent: !expand }">
        <VListTile slot="activator" class="add-menu-button">
          <v-list-tile-content>
            <VListTileTitle>
              <span class="title">
                Добавить
              </span>
            </VListTileTitle>
          </v-list-tile-content>
        </VListTile>
        <template v-for="(item, i) in adds">
          <VListTile :key="i" ripple active-class="accent" @click="onAction">
            <v-list-tile-content class="list-group-item-unshift">
              <VListTileTitle>
                <span class="body-1">
                  {{ item }}
                </span>
              </VListTileTitle>
            </v-list-tile-content>
          </VListTile>
        </template>
      </VListGroup>
    </v-list>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  data: () => ({
    adds: ['Менеджера', 'Компанию'],
    expand: false,
    showMenu: true
  }),
  computed: {
    ...mapGetters({ navigationMini: 'layout/navigationMini' })
  },
  methods: {
    onAction () {}
  }
}
</script>

<style lang="scss">
.add-btn {
  width: 40px;
  height: 40px;
  background: #ef4d37;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}

.add-menu a.v-list__tile.v-list__tile--link.theme--dark {
  background: rgba(137, 149, 175, 0.2) !important;
  &:hover {
    span {
      text-decoration: underline;
    }
  }
}
</style>
