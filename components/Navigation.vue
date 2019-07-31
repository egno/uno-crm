<template>
  <VNavigationDrawer
    v-model="visible"
    app
    :dark="!mini"
    mobile-break-point="1000"
    width="240"
    :mini-variant.sync="mini"
    :mini-variant-width="40"
    touchless
    class="navigation"
    @input="onInput($event)"
  >
    <VToolbar flat :dark="!mini" height="55" class="pa-0">
      <VList class="logo-wrap">
        <!--<v-list-tile-content>
          <v-list-tile-title overflow-hidden>
            <router-link :to="{ name: 'index' }">
              <div class="logo" />
            </router-link>
          </v-list-tile-title>
        </v-list-tile-content>-->
      </VList>
      <v-list-tile-action v-if="isManagerMenu" class="title-action">
        <v-btn icon :class="{ 'menu-button': mini }" @click.stop="mini = !mini">
          <v-icon v-if="!mini" class="blind">
            close
          </v-icon>
        </v-btn>
      </v-list-tile-action>
    </VToolbar>

    <VCalendar v-if="isCalendarVisible" />
    <AddMenu v-if="loggedIn && isManagerMenu" />
    <VList v-if="!mini" class="nav-menu">
      <nav-powered-item
        v-for="item in menu"
        :key="item.title"
        :item="item"
        @onAction="onAction"
      />
    </VList>
    <v-spacer />
    <div
      v-if="!mini"
      class="blue-link help-link navigation__report"
      @click="openMessageWindow"
    >
      Сообщить о проблеме
    </div>
  </VNavigationDrawer>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { filials } from './business/mixins'
import AddMenu from '~/components/AddMenu.vue'
import NavPoweredItem from '~/components/NavPoweredItem.vue'
import VCalendar from '~/components/calendar/VCalendar.vue'
import { isBusinessRoute } from '~/utils'
import { formatDate } from '~/components/calendar/utils'
import Users from '~/mixins/users'
import { roles } from '~/classes/user'

export default {
  components: { AddMenu, NavPoweredItem, VCalendar },
  mixins: [Users, filials],
  data () {
    return {
      parentFilialsCount: null
    }
  },
  computed: {
    ...mapGetters({
      actualDate: 'common/actualDate',
      businessFilialCount: 'business/businessFilialCount',
      businessInfo: 'business/businessInfo',
      businessIsSalon: 'business/businessIsSalon',
      businessClientCount: 'business/businessClientCount',
      businessServiceCount: 'business/businessServiceCount',
      employeeCount: 'employee/employeeCount',
      navigationMini: 'layout/navigationMini',
      token: 'common/token',
      navigationVisible: 'layout/navigationVisible',
      businessIsFilial: 'business/businessIsFilial'
    }),
    date () {
      const dt = new Date()
      return formatDate(dt)
    },
    businessId () {
      return this.$route && this.$route.params && this.$route.params.id
    },
    clientsCount () {
      return this.businessClientCount
    },
    currentToken () {
      return this.token
    },
    employeesCount () {
      return this.employeeCount
    },
    isBusinessCard () {
      return isBusinessRoute(this.$route.name)
    },
    isCalendarVisible () {
      return (
        this.hasSalonLevelAccess && this.isBusinessCard && this.isEditorUser
      )
    },
    isManagerMenu () {
      return (
        this.loggedIn &&
        (this.userRole === 'manager' || this.userRole === 'admin') &&
        (this.$route.name === 'businessList' ||
          this.$route.name === 'myBusinessList' ||
          this.$route.name === 'adminUserList')
      )
    },
    hasCompanyLevelAccess () {
      return (
        this.loggedIn &&
        this.businessInfo &&
        (this.businessInfo.type === 'C' ||
          (this.businessInfo.type === null &&
            this.businessInfo.parent === null))
      )
    },
    hasSalonLevelAccess () {
      return (
        this.loggedIn && this.businessInfo && this.businessInfo.type === null
      )
    },
    hasName () {
      return (
        this.businessInfo && this.businessInfo.j && this.businessInfo.j.name
      )
    },
    menu () {
      return [
        {
          title: 'Информация',
          count: undefined,
          route: {
            name: 'businessCard',
            params: { id: this.businessId }
          },
          show:
            this.loggedIn &&
            (this.userRole === 'manager' ||
              this.userRole === 'admin' ||
              this.user.role === roles[0] ||
              (this.user.role === roles[1] && this.businessIsFilial)) &&
            !this.isManagerMenu
        },
        {
          title: 'Мои компании',
          icon: 'business',
          route: { name: 'myBusinessList' },
          show: this.isManagerMenu
        },
        {
          title: 'Все компании',
          icon: 'business',
          route: { name: 'businessList' },
          show: this.isManagerMenu
        },
        {
          title: 'Менеджеры',
          icon: 'business',
          route: { name: 'adminUserList' },
          show: this.isManagerMenu && this.userRole === 'admin'
        },
        {
          title: 'Филиалы',
          count: this.businessFilialCount,
          route: {
            name: 'filialList',
            params: { id: this.businessId }
          },
          show:
            this.hasCompanyLevelAccess &&
            this.hasName &&
            !this.businessIsFilial,
          action: {
            label: 'Добавить филиал',
            action: 'newFilial',
            default: true
          }
        },
        {
          title: 'Пользователи',
          route: {
            name: 'businessUsers',
            params: { id: this.businessId }
          },
          show:
            this.hasCompanyLevelAccess &&
            this.hasName &&
            !this.businessIsFilial &&
            this.loggedIn &&
            !this.isManagerMenu &&
            (this.userRole === 'manager' ||
              this.userRole === 'admin' ||
              this.user.role === roles[0])
        },
        {
          title: 'Услуги',
          count: this.businessServiceCount,
          route: {
            name: 'services',
            params: { id: this.businessId }
          },
          show:
            this.hasSalonLevelAccess &&
            this.hasName &&
            this.user.role !== roles[2] &&
            !this.isManagerMenu,
          action: {
            label: 'Добавить услугу',
            action: 'newService',
            default: true
          }
        },
        {
          title: 'Сотрудники',
          count: this.employeesCount,
          route: {
            name: 'employeeList',
            params: { id: this.businessId }
          },
          show:
            this.hasSalonLevelAccess &&
            this.hasName &&
            this.user.role !== roles[2] &&
            !this.isManagerMenu,
          action: {
            label: 'Добавить сотрудника',
            action: 'newEmployee',
            to: {
              name: 'employeeProfile',
              params: { id: this.businessId, employee: 'new' }
            },
            default: true
          }
        },
        {
          title: 'Галерея',
          count: null,
          route: {
            name: 'companyGallery',
            params: { id: this.businessId }
          },
          show: false
        },
        {
          title: 'Клиенты',
          count: this.clientsCount,
          route: {
            name: 'businessClientsTable',
            params: { id: this.businessId }
          },
          show:
            this.hasSalonLevelAccess &&
            this.hasName &&
            this.user.role !== roles[2] &&
            this.isEditorUser,
          action: {
            label: 'Добавить клиента',
            action: 'newClient',
            to: {
              name: 'businessCardClient',
              params: { id: this.businessId, client: 'new' }
            },
            default: true
          }
        },
        {
          title: 'Журнал записи',
          route: {
            name: 'visitCalendar',
            params: { id: this.businessId, date: this.date }
          },
          show: this.hasSalonLevelAccess && this.hasName && !this.isManagerMenu,
          action: {
            label: 'Создать запись',
            action: 'newVisit',
            default: true
          }
        },
        {
          title: 'Онлайн запись',
          count: undefined,
          route: {
            name: 'widgetSettings',
            params: { id: this.businessId }
          },
          show:
            !this.businessIsFilial &&
            this.hasName &&
            !this.isManagerMenu &&
            this.loggedIn &&
            (this.userRole === 'manager' ||
              this.userRole === 'admin' ||
              this.user.role === 'Администратор компании')
        },
        {
          title: 'Настройки',
          count: undefined,
          route: {
            name: 'businessSettings',
            params: { id: this.businessId }
          },
          show:
            this.hasCompanyLevelAccess &&
            this.hasName &&
            !this.isManagerMenu &&
            (this.userRole === 'manager' ||
              this.userRole === 'admin' ||
              this.user.role === 'Администратор компании')
        }
      ]
    },
    mini: {
      get () {
        return this.navigationMini
      },
      set (val) {
        this.setNavigationMini(val)
      }
    },
    services () {
      return (
        this.businessId &&
        this.businessInfo &&
        this.businessInfo.j &&
        this.businessInfo.j.services
      )
    },
    visible: {
      get () {
        return this.navigationVisible
      },
      set (val) {
        this.setNavigationVisible(val)
      }
    }
  },
  watch: {
    currentToken: 'onNewToken',
    isBusinessCard: 'checkUserInfo',
    userLoadingState: 'checkUserInfo',
    businessInfo: {
      handler: 'getFilialsCount',
      deep: true
    }
  },
  mounted () {
    this.checkUserInfo()
  },
  methods: {
    ...mapActions({
      navBar: 'common/navBar',
      setNavigationVisible: 'layout/setNavigationVisible',
      loadDayVisits: 'business/loadDayVisits',
      loadUserInfo: 'user/loadUserInfo',
      openMessageWindow: 'common/openMessageWindow',
      setAppTitle: 'common/setAppTitle',
      setBusiness: 'business/setBusiness',
      setNavigationMini: 'layout/setNavigationMini',
      logout: 'user/logout'
    }),
    onNewToken () {
      this.loadUserInfo()
    },
    checkUserInfo () {
      this.$nextTick(() => {
        if (
          this.userLoadingState === 'finished' &&
          this.loggedIn === false &&
          this.isBusinessCard === true
        ) {
          this.$router.push({ name: 'login' })
        }
      })
    },
    getFilialsCount () {
      if (this.businessIsFilial) {
        this.getFilialsOf(this.businessInfo.parent).then((filials) => {
          this.parentFilialsCount = filials.length
        })
      }
    },
    goHome () {
      this.$router.push({ name: 'index' })
    },
    onAction (action) {
      if (action && action.to) {
        this.$router.push(action.to)
        return
      }
      this.$emit('onAction', action.action)
    },
    onInput (event) {
      this.navBar(event)
    }
  }
}
</script>

<style lang="scss">
.navigation.theme--dark,
.v-toolbar.theme--dark {
  background-color: var(--v-secondary-base);
}
.navigation.theme--dark {
  background: linear-gradient(180deg, #333c54 0.06%, #4a5d6d 85.63%);
}
.navigation {
  @media only screen and (min-height: 667px) {
    padding-bottom: 40px;
  }
  &.v-navigation-drawer .v-list {
    background: transparent;
  }
  .v-list__tile {
    height: 40px;
    padding: 0 16px 0 38px;
  }
  .v-list__tile__title {
    font-weight: normal;
  }
  .primary--text.v-list__tile {
    color: #fff !important;
  }
  &__report {
    text-align: center;
    width: 100%;
    cursor: pointer;
    margin: 60px auto 15px;
    @media only screen and (min-height: 667px) {
      position: absolute;
      bottom: 24px;
      margin: 0;
    }
  }
  .calendar-container {
    overflow: hidden;
    opacity: 0;
    max-height: 0;
    transition: opacity 0.6s 0s, max-height 0.4s 0s;
    pointer-events: none;
    &._expanded {
      opacity: 1;
      pointer-events: all;
      max-height: 250px;
    }
  }
  .menu-button {
    border-right: none;
  }
  .v-list__tile__action {
    min-width: 40px;
  }
  &.v-navigation-drawer--mini-variant {
    .logo-wrap {
      display: none;
    }
    .v-toolbar__content {
      padding: 0;
    }
  }
}
.title-action {
  position: absolute;
  right: 0;
  height: 100%;
  width: 40px;
}
.blind {
  opacity: 0.2;
}
.logo-wrap {
  padding: 0 40px;
}
.logo {
  width: 73px;
  height: 24px;
  background: url('~assets/images/svg/uno_full.svg') center/contain no-repeat;
}
</style>
