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
      <div class="logo-wrap">
        <nuxt-link :to="{ name: 'index' }">
          <div class="logo" />
        </nuxt-link>
      </div>
      <div v-if="isManagerMenu" class="title-action">
        <v-btn icon :class="{ 'menu-button': mini }" @click.stop="mini = !mini">
          <v-icon v-if="!mini" class="blind">
            close
          </v-icon>
        </v-btn>
      </div>
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
      businessId: 'business/businessId',
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
        this.isSalonLevel && this.isBusinessCard && this.isEditorUser
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
    isCompanyLevel: {
      cache: false,
      get () {
        const loggedIn = this.loggedIn
        const businessInfo = this.businessInfo
        const res = (
          loggedIn &&
          businessInfo &&
          (businessInfo.type === 'C' ||
            (businessInfo.type === null &&
              businessInfo.parent === null))
        )
        return res
      }
    },
    isSalonLevel () {
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
      // first, define user role
      // then define is company or filial level
      const isEmployee = this.loggedIn && this.user.role === 'Сотрудник Салона'
      const isFilialManager = this.loggedIn && this.user.role === 'Менеджер филиала'
      const isCompanyAdmin = this.loggedIn && this.user.role === 'Администратор компании'
      const employeeMenu = [
        {
          title: 'Журнал записи',
          route: {
            name: 'id-visits',
            params: { id: this.businessId, date: this.date }
          },
          show: isEmployee && this.isSalonLevel,
          action: {
            label: 'Создать запись',
            action: 'newVisit',
            default: true
          }
        },
        {
          title: 'Филиалы',
          count: this.businessFilialCount,
          route: {
            name: 'id-filials',
            params: { id: this.businessId }
          },
          show: isEmployee && this.isCompanyLevel
        }
      ]
      const filialManagerMenu = [
        {
          title: 'Филиалы',
          count: this.businessFilialCount,
          route: {
            name: 'id-filials',
            params: { id: this.businessId }
          },
          show: isFilialManager && this.isCompanyLevel
        },
        {
          title: 'Информация',
          count: undefined,
          route: {
            name: 'id-businessCard',
            params: { id: this.businessId }
          },
          show: isFilialManager && this.businessIsFilial
        },
        {
          title: 'Услуги',
          count: this.businessServiceCount,
          route: {
            name: 'id-services',
            params: { id: this.businessId }
          },
          show: isFilialManager && this.businessIsFilial,
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
            name: 'id-businessEmployees',
            params: { id: this.businessId }
          },
          show: isFilialManager && this.businessIsFilial,
          action: {
            label: 'Добавить сотрудника',
            action: 'newEmployee',
            to: {
              name: 'id-businessEmployees-employee',
              params: { id: this.businessId, employee: 'new' }
            },
            default: true
          }
        },
        {
          title: 'Клиенты',
          count: this.clientsCount,
          route: {
            name: 'id-businessClients',
            params: { id: this.businessId }
          },
          show: isFilialManager && this.businessIsFilial,
          action: {
            label: 'Добавить клиента',
            action: 'newClient',
            to: {
              name: 'id-businessClient',
              params: { id: this.businessId, client: 'new' }
            },
            default: true
          }
        },
        {
          title: 'Журнал записи',
          route: {
            name: 'id-visits',
            params: { id: this.businessId, date: this.date }
          },
          show: isFilialManager && this.businessIsFilial,
          action: {
            label: 'Создать запись',
            action: 'newVisit',
            default: true
          }
        }
      ]
      const companyLevelAdminMenu = [
        {
          title: 'Информация',
          count: undefined,
          route: {
            name: 'id-businessCard',
            params: { id: this.businessId }
          },
          show: true
        },
        {
          title: 'Филиалы',
          count: this.businessFilialCount,
          route: {
            name: 'id-filials',
            params: { id: this.businessId }
          },
          show: true,
          action: {
            label: 'Добавить филиал',
            action: 'newFilial',
            default: true
          }
        },
        {
          title: 'Настройки',
          count: undefined,
          route: {
            name: 'id-businessSettings',
            params: { id: this.businessId }
          },
          show: true
        },
        {
          title: 'Пользователи',
          route: {
            name: 'id-businessUsers',
            params: { id: this.businessId }
          },
          show: true
        },
        {
          title: 'Онлайн запись',
          count: undefined,
          route: {
            name: 'id-widgetSettings',
            params: { id: this.businessId }
          },
          show: true
        }
      ]
      const salonLevelAdminMenu = [
        {
          title: 'Информация',
          count: undefined,
          route: {
            name: 'id-businessCard',
            params: { id: this.businessId }
          },
          show: true
        },
        {
          title: 'Услуги',
          count: this.businessServiceCount,
          route: {
            name: 'id-services',
            params: { id: this.businessId }
          },
          show: true,
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
            name: 'id-businessEmployees',
            params: { id: this.businessId }
          },
          show: true,
          action: {
            label: 'Добавить сотрудника',
            action: 'newEmployee',
            to: {
              name: 'id-businessEmployees-employee',
              params: { id: this.businessId, employee: 'new' }
            },
            default: true
          }
        },
        {
          title: 'Клиенты',
          count: this.clientsCount,
          route: {
            name: 'id-businessClients',
            params: { id: this.businessId }
          },
          show: true,
          action: {
            label: 'Добавить клиента',
            action: 'newClient',
            to: {
              name: 'id-businessClient',
              params: { id: this.businessId, client: 'new' }
            },
            default: true
          }
        },
        {
          title: 'Журнал записи',
          route: {
            name: 'id-visits',
            params: { id: this.businessId, date: this.date }
          },
          show: true,
          action: {
            label: 'Создать запись',
            action: 'newVisit',
            default: true
          }
        }
      ]
      const companyAdminMenu = this.isCompanyLevel ? companyLevelAdminMenu : salonLevelAdminMenu
      const unoManagerMenu = [
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
        }
      ]
      let menu = []

      switch (this.userRole) {
        case 'admin':
        case 'manager':
          menu = this.isManagerMenu ? unoManagerMenu : companyAdminMenu
          break
        case 'business':
          menu = isFilialManager
            ? filialManagerMenu
            : isCompanyAdmin
              ? companyAdminMenu
              : employeeMenu
          break
      }
      return menu
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
