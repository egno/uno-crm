<template>
  <div class="home-menu">
    <button
      type="button"
      :class="{ 'hamburger-menu': true, active: menuActive }"
      @click="menuActive = !menuActive"
    />

    <v-dialog
      v-model="menuActive"
      content-class="content"
      fullscreen
      hide-overlay
      :internal-activator="true"
      attach=".home-menu .v-dialog__container"
      origin="top right"
      transition="slide-y-transition"
    >
      <Links @click="menuActive = false" />
    </v-dialog>
  </div>
</template>

<script>
import Links from '~/components/home/Links.vue'

export default {
  name: 'HomeMenu',
  components: {
    Links
  },
  data () {
    return {
      menuActive: false
    }
  }
}
</script>

<style lang="scss">
@import '~assets/styles/common.scss';

.home-menu {
  .hamburger-menu {
    width: 28px;
    height: 24px;
    margin-right: 20px;
    background: url('~assets/images/svg/menu.svg') center/contain no-repeat;
    outline: none;
    &.active {
      background: url('~assets/images/svg/cross.svg') center/14px no-repeat;
    }
  }

  .content {
    top: 80px;
    height: calc(100vh - 80px);
    background-color: rgba(255, 255, 255, 0.97);
    box-shadow: none;
    @media only screen and (min-height: 950px) {
      top: 146px;
      height: calc(100vh - 146px);
    }
  }

  .v-dialog--fullscreen {
    overflow-y: scroll;
  }
}
</style>
