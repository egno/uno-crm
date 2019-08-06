<template>
  <HomeHeader
    v-if="
      !$route.name ||
        $route.name === 'index' ||
        $route.name === 'features' ||
        $route.name === 'news'
    "
  /><!--todo make a slot inside HomeHeader for authenticated user -->
  <v-toolbar v-else class="topbar" app height="55px">
    <v-toolbar-side-icon
      v-if="loggedIn && !navigationVisible"
      class="menu-button"
      @click="setNavigationVisible(true)"
    />
    <VLayout
      v-if="!$route.path.includes('gallery')"
      row
      align-center
      justify-start
    >
      <VFlex v-show="showSearchInput">
        <VTextField
          key="mainSearch"
          v-model="searchString"
          class="topsearch"
          autofocus
          label="Поиск"
          single-line
          type="text"
        />
      </VFlex>
    </VLayout>

    <VSpacer />
    <VToolbarItems>
      <!--<Notifications />-->
      <VLayout
        v-if="businessInfo"
        align-center
        justify-center
        class="company-badge"
      >
        <VFlex class="text-truncate company-badge__name">
          {{ businessInfo.name }}
        </VFlex>
        <VFlex v-if="businessInfo.category" class="company-badge__category">
          {{ businessInfo.category }}
        </VFlex>
      </VLayout>
      <div class="go-home-menu">
        <v-menu left offset-y @input="goHomeMenuActive = !goHomeMenuActive">
          <template v-slot:activator="{ on }">
            <button
              type="button"
              :class="{ active: goHomeMenuActive }"
              v-on="on"
            />
          </template>
          <VList class="menu-list">
            <VListTile @click="$router.push({ name: 'index' })">
              <VListTileTitle>
                На главную UNO
              </VListTileTitle>
            </VListTile>
            <VListTile
              v-if="isEditorUser && businessIsFilial"
              @click="goToCompany"
            >
              <VListTileTitle>
                Перейти к выбору филиала
              </VListTileTitle>
            </VListTile>
          </VList>
        </v-menu>
      </div>
      <ProfileMenu />
    </VToolbarItems>
  </v-toolbar>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import ProfileMenu from '~/components/ProfileMenu.vue'
import { isBusinessRoute } from '~/utils'
import HomeHeader from '~/components/home/HomeHeader.vue'
import Users from '~/mixins/users'

export default {
  components: {
    HomeHeader,
    ProfileMenu
  },
  mixins: [Users],
  data () {
    return {
      searchString: '',
      goHomeMenuActive: false
    }
  },
  computed: {
    ...mapGetters({
      actions: 'common/actions',
      businessInfo: 'business/businessInfo',
      loggedIn: 'user/loggedIn',
      navigationVisible: 'layout/navigationVisible',
      userID: 'user/userID',
      myBusinessList: 'user/myBusinessList',
      businessIsFilial: 'business/businessIsFilial'
    }),
    defaultAction () {
      if (!(this.actions && Array.isArray(this.actions))) {
        return
      }
      return this.actions.filter(x => x.default)[0]
    },
    href () {
      if (this.defaultAction) {
        return this.defaultAction.href
      }
      return null
    },
    isBusinessCard () {
      return isBusinessRoute(this.$route.name)
    },
    showSearchInput () {
      const routes = ['businessList', 'myBusinessList']
      return routes.includes(this.$route.name)
    },
    target () {
      if (this.defaultAction) {
        return this.defaultAction.target
      }
      return null
    }
  },
  watch: {
    searchString: 'setStoreSearchString'
  },
  mounted () {
    this.setStoreSearchString()
  },
  methods: {
    ...mapActions({
      setActions: 'common/setActions',
      setBusiness: 'business/setBusiness',
      setNavigationVisible: 'layout/setNavigationVisible',
      setSearchString: 'common/setSearchString'
    }),
    goHome () {
      this.$router.push({ name: 'index' })
    },
    goToCompany () {
      const parentId = this.businessInfo.parent
      this.setBusiness(parentId)
      this.$router.push({ name: 'id-filials', params: { id: parentId } })
    },
    setStoreSearchString (newVal) {
      this.setSearchString(newVal && newVal.toLowerCase())
    }
  }
}
</script>
<style lang="scss" scoped>
@import '~assets/styles/company-badge.scss';

.go-home-menu {
  button {
    width: 64px;
    height: 100%;
    outline: none;
    background: url('~assets/images/svg/menu.svg') center/24px no-repeat;
    border-left: 1px solid rgba(137, 149, 175, 0.1);
    &.active {
      background-color: rgba(137, 149, 175, 0.2);
    }
  }
}
.topsearch {
  display: block !important;
}
</style>
