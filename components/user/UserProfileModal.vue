<template>
  <div class="text-xs-center">
    <v-navigation-drawer
      v-if="drawer"
      v-model="drawer"
      class="drawer"
      touchless
      disable-resize-watcher
      disable-route-watcher
      absolute
      temporary
      right
      width="440"
      @input="(v) => v || closeProfileDrawer()"
    >
      <v-btn class="close" fab depressed @click="closeProfileDrawer" />
      <UserProfile @close="closeProfileDrawer" />
    </v-navigation-drawer>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import UserProfile from '~/components/user/UserProfile.vue'

export default {
  components: { UserProfile },
  props: {
    show: { type: Boolean, default: false }
  },
  data () {
    return {
      drawer: false
    }
  },
  watch: {
    show: 'setDrawer'
  },
  methods: {
    ...mapActions({ closeProfileDrawer: 'common/closeProfileDrawer' }),
    setDrawer (val) {
      this.drawer = !!val
    }
  }
}
</script>

<style lang="scss" scoped>
.drawer {
  padding: 53px 80px;
}
.close {
  position: absolute;
  left: 19px;
  top: 19px;
  margin: 0;
}
</style>
