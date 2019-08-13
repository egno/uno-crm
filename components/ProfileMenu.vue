<template>
  <div class="profile-menu">
    <VMenu
      v-if="loggedIn"
      v-model="menu"
      left
      full-width
      offset-y
      disable-resize-watcher
      min-width="174"
      max-width="174"
      content-class="profile-dropdown"
      open-on-hover
      :close-on-content-click="false"
    >
      <template v-slot:activator="{ on }">
        <v-btn flat v-on="on">
          <Avatar
            :new-message="newMessage"
            :size="avatarSize"
            :name="displayName"
            :src="avatar"
          />
          <div class="profile-expand-more" />
        </v-btn>
      </template>
      <VList class="menu-list">
        <template v-for="(item, index) in menuList">
          <VListTile
            v-if="!item.hide"
            :key="index"
            :to="item.route"
            @click="menuHandler(item.action)"
          >
            <VListTileTitle
              :class="{ _bold: item.count && item.title === 'Сообщения' }"
            >
              {{ item.title }}
            </VListTileTitle>
            <span
              v-if="item.count"
              class="caption count"
              :class="{ attention: item.count === '!' }"
            >
              {{ item.count }}
            </span>
          </VListTile>
        </template>
      </VList>
    </VMenu>
  </div>
  <!--<VMenu
    v-else-if="$route.name !== 'login'"
    v-model="menu"
    left
    full-width
    offset-y
    disable-resize-watcher
    min-width="300"
    max-width="300"
    :close-on-content-click="false"
  >
    <v-btn
      slot="activator"
      flat
    >
      <VLayout
        align-center
        row
        spacer
      >
        <VFlex class="hidden-sm-and-down">
          {{ "Войти" }}
        </VFlex>
      </VLayout>
    </v-btn>
    <VList>
      <Login @loggedIn="menu = false" />
    </VList>
  </VMenu>-->
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import Avatar from '~/components/avatar/Avatar.vue'
// import Login from "../components/Login"

export default {
  components: { Avatar },
  props: {
    source: { type: String, default: () => '' }
  },
  data: () => ({
    avatarSize: '24px',
    dialog: false,
    newMessage: false,
    errorMessage: null,
    flogin: '',
    fpassword: '',
    menu: false,
    snack: false,
    snackText: '',
    snackColor: 'error'
  }),
  computed: {
    ...mapGetters({
      loggedIn: 'user/loggedIn',
      avatar: 'user/userAvatar',
      userID: 'user/userID',
      userInfo: 'user/userInfo'
    }),
    menuList () {
      return [
        {
          title: 'Мой профиль',
          action: 'drawer',
          count: '!'
        },
        {
          title: 'Сообщения',
          route: { name: 'messages' },
          count: 2,
          hide:
            this.userInfo.role !== 'admin' && this.userInfo.role !== 'manager'
        },
        {
          title: 'Личный кабинет',
          route: { name: 'myBusinessList' },
          hide:
            this.userInfo.role !== 'admin' && this.userInfo.role !== 'manager'
        },
        {
          title: 'Выйти',
          action: 'logout',
          url: ''
        }
      ]
    },
    displayName () {
      if (!this.userID) { return }

      return (
        (this.userInfo &&
          this.userInfo.data &&
          this.userInfo.data.j &&
          this.userInfo.data.j.name &&
          this.userInfo.data.j.name +
            ' ' +
            (this.userInfo.data.j.surname || '')) ||
        this.userID
      )
    }
  },
  watch: {
    userInfo (newVal, oldVal) {
      if (
        newVal &&
        newVal.role === 'manager' &&
        newVal.role !== (oldVal && oldVal.role) &&
        this.$route.name === 'index'
      ) {
        this.$router.push({ name: 'myBusinessList' })
        return
      }
      if (
        newVal &&
        newVal.role === 'business' &&
        newVal.role !== (oldVal && oldVal.role) &&
        this.$route.name === 'register'
      ) {
        this.$router.push({ name: 'index' })
      }
    }
  },
  methods: {
    ...mapActions({
      logout: 'user/logout',
      openProfileDrawer: 'common/openProfileDrawer'
    }),
    menuHandler (action) {
      this.menu = false
      switch (action) {
        case 'logout':
          this.logout()
          this.$router.push({ name: 'login' })
          break
        case 'drawer':
          this.openProfileDrawer()
          break
        default:
      }
    }
  }
}
</script>
<style lang="scss">
.profile-menu {
  display: flex;
  height: 55px;
  align-items: center;
  justify-content: center;
  border-left: 1px solid rgba(137, 149, 175, 0.1);
  box-sizing: border-box;
  @media only screen and (min-width: 1300px) {
    width: 100px;
  }

  button {
    position: relative;
    min-width: 64px;
    max-width: 64px;
    justify-content: center;
    padding: 0 11px;
    &:hover {
      background-color: rgba(137, 149, 175, 0.1);
    }
    .v-btn__content {
      @media only screen and (min-width: 1300px) {
        justify-content: space-between;
      }
    }
  }

  .v-menu__activator--active button {
    background-color: rgba(137, 149, 175, 0.1);
  }
}
.menu-list {
  padding: 13px 0;
  @media only screen and (min-width: 1300px) {
    padding: 17px 0;
  }
  .v-list__tile {
    --v-primary-base: #2d333b;
    color: var(--v-primary-base);
    height: 36px;
    padding-left: 20px;
    font-weight: 400;
    @media only screen and (min-width: 1300px) {
      height: 24px;
    }
    &__title {
      display: flex;
      align-items: center;
    }
  }
  .v-list__tile__title {
    font-size: 14px;
  }
  .count,
  .attention {
    width: 16px;
    min-width: 16px;
    height: 16px;
    display: block;
    background: #ef4d37;
    border-radius: 16px;
    text-align: center;
    color: #fff;
    font-size: 11px !important;
  }
  .attention {
    color: #ef4d37;
    background: #fff;
    border: 1px solid #ef4d37;
  }
  ._bold {
    font-weight: 900;
  }
}
.profile-expand-more {
  display: none;
  @media only screen and (min-width: 1300px) {
    display: block;
    width: 10px;
    height: 6px;
    background: url('~assets/images/svg/down-blue.svg') center no-repeat;
  }
}
</style>
