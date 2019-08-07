<template>
  <!--for animation of header on mobiles
    :class="{ 'mobile-transparent' : $route.name === 'features' || $route.name === 'news' }"-->
  <v-toolbar app class="home-header" flat fixed :height="isDesktop ? 146 : 80">
    <router-link :to="{ name: 'index' }" class="home-header__logo" />
    <VToolbarItems>
      <div class="home-header__desktop-menu">
        <a
          v-if="$route.name === 'index'"
          v-smooth-scroll
          href="/#product"
          :class="{ current: $route.hash && $route.hash === '#product' }"
        >ПРОДУКТ</a>
        <router-link
          v-else
          :to="{ name: 'index', hash: '#product' }"
          :class="{ current: $route.hash && $route.hash === '#product' }"
        >
          ПРОДУКТ
        </router-link>
        <router-link
          :to="{ name: 'features' }"
          :class="{ current: $route.name === 'features' }"
        >
          СЕРВИСЫ
        </router-link>
        <router-link
          :to="{ name: 'news' }"
          :class="{ current: $route.name === 'news' }"
        >
          НОВОСТИ
        </router-link>
      </div>
      <HomeMenu />
      <div class="home-header__right">
        <VLayout
          v-if="loggedIn && userRole !== 'manager' && userRole !== 'admin'"
          align-center
          justify-center
          class="company-badge"
          @click="goToBusiness"
        >
          <VFlex class="text-truncate company-badge__name">
            {{ badge.j.name }}
          </VFlex>
          <VFlex v-if="badge.j.category" class="company-badge__category">
            {{ badge.j.category }}
          </VFlex>
        </VLayout>
        <v-btn
          v-if="loggedIn && userRole !== 'manager' && userRole !== 'admin'"
          flat
          class="main-header__button"
          @click="goToBusiness"
        >
          <div class="home-header__icon " />
        </v-btn>
        <v-btn
          v-else-if="!loggedIn"
          id="reglink_header"
          flat
          :class="[
            'home-header__button _register',
            {
              active:
                !isFirstSectionInView ||
                $route.name === 'features' ||
                $route.name === 'news'
            }
          ]"
          @click="$router.push({ name: 'register' })"
        >
          <div class="home-header__icon _register" />
          <div class="home-header__tablet-text">
            ПОЛЬЗУЙТЕСЬ БЕСПЛАТНО
          </div>
        </v-btn>
        <ProfileMenu v-if="loggedIn" />
        <v-btn
          v-else
          flat
          class="home-header__button _login"
          @click="$router.push({ name: 'login' })"
        >
          <div class="home-header__desktop">
            ВХОД
          </div>
          <div class="home-header__icon _login" />
        </v-btn>
      </div>
    </VToolbarItems>
  </v-toolbar>
</template>

<script>
import { mapGetters } from 'vuex'
import HomeMenu from '~/components/home/HomeMenu.vue'
import ProfileMenu from '~/components/ProfileMenu.vue'

export default {
  name: 'HomeHeader',
  components: {
    HomeMenu,
    ProfileMenu
  },
  data () {
    return {
      firstSection: null,
      isFirstSectionInView: true
    }
  },
  computed: {
    ...mapGetters({
      loggedIn: 'user/loggedIn',
      myBusinessList: 'user/myBusinessList',
      userRole: 'user/userRole'
    }),
    isDesktop () {
      if (process.client) {
        return window && window.innerHeight > 950
      } else {
        return false
      }
    },
    badge () {
      if (!this.myBusinessList.length) {
        return {
          j: {
            name: '',
            category: ''
          }
        }
      }
      const company = this.myBusinessList.find(b => b.type === 'C')
      return company || this.myBusinessList[0]
    }
  },
  watch: {
    $route: {
      handler: 'checkElement',
      deep: true
    }
  },
  mounted () {
    this.checkElement()
  },
  beforeDestroy () {
    if (this.onScroll) {
      document.removeEventListener('scroll', this.onScroll)
    }
  },
  methods: {
    checkElement () {
      this.$nextTick(() => {
        this.firstSection = document.querySelector('.main-page__first')

        if (this.firstSection) {
          this.onScroll = () => this.isOutOfViewport(this.firstSection)
          this.onScroll()
          document.addEventListener('scroll', this.onScroll)
        }
      })
    },
    goToBusiness () {
      if (this.badge.id) {
        this.$router.push({
          name: 'id-businessCard',
          params: { id: this.badge.id }
        })
      }
    },
    isOutOfViewport (elem) {
      if (!elem) {
        return
      }
      const bounding = elem.getBoundingClientRect()

      this.isFirstSectionInView =
        bounding.bottom > 100 &&
        bounding.bottom <=
          (window.innerHeight || document.documentElement.clientHeight)
    }
  }
}
</script>

<style lang="scss">
@import '~assets/styles/common.scss';
@import '~assets/styles/company-badge.scss';

.home-header {
  background-color: #fff !important;

  @media only screen and (min-width: $tablet) {
    padding-top: 5px;
  }
  @media only screen and (min-width: $desktop) {
    padding-top: 0;
  }
  &__logo {
    width: 63px;
    height: 36px;
    background: url('~assets/images/svg/logo_dark.svg') center/contain no-repeat;
    @media only screen and (min-width: $tablet) {
      width: 94px;
    }
    svg {
      max-width: 100%;
    }
  }
  &__desktop-menu {
    display: none;
    @media only screen and (min-width: $desktop) {
      display: flex;
      width: 55%;
      justify-content: flex-start;
    }
    a {
      line-height: 37px;
      margin-right: 15%;
      padding: 0 8px;
      border-bottom: 1px solid transparent;
      &:last-child {
        margin-right: 0;
      }
      &.current {
        color: #ba9462;
        border-bottom-color: #ba9462;
      }
    }
  }
  &__right {
    height: 100%;
    display: flex;
  }
  &__tablet-text {
    display: none;
    @media only screen and (min-width: $tablet) {
      display: inline;
      margin-left: 10px;
      font-weight: 900;
    }
  }
  &__icon {
    width: 24px;
    height: 24px;
    background-position: center top;
    background-repeat: no-repeat;
    &._register {
      background-image: url('~assets/images/svg/user.svg');
    }
    &._login {
      background-image: url('~assets/images/svg/lock.svg');
    }
  }
  &__button {
    padding: 0 30px;
    &._register {
      display: none;
      border-radius: 0;
      border-right: 2px solid #07101c;
      @media only screen and (min-width: $tablet) {
        display: inline-flex;
        width: 283px;
      }
      &.active {
        @media only screen and (min-width: $tablet) {
          border-right-color: transparent;
          background: linear-gradient(90deg, #c9a15d 0%, #ba9462 100%) #b69768;
          color: #fff;
          .home-header__icon {
            background-image: url('~assets/images/svg/user_white.svg');
          }
          &:hover {
            background-color: #07101c;
            background-image: none;
          }
        }
      }
    }
    &._login {
      @media only screen and (min-width: $desktop) {
        width: 134px;
      }
    }
  }
  &__desktop {
    display: none;
    @media only screen and (min-width: $desktop) {
      display: block;
      margin-right: 10px;
      font-weight: 700;
    }
  }
  .v-toolbar__content {
    max-width: 1496px;
    margin: 0 auto;
    padding-right: 0;
  }
  .v-toolbar__items {
    flex-grow: 1;
    height: 55px;
    justify-content: flex-end;
    align-items: center;
    padding-top: 2px;
    box-sizing: border-box;
    @media only screen and (min-width: $desktop) {
      justify-content: space-between;
      margin-left: 102px;
    }
  }
  a {
    text-decoration: none;
    font-weight: 900;
    font-size: 16px;
    color: #07101c;
  }
  .company-badge {
    display: flex;
    flex-wrap: wrap;
    max-width: 200px;
    cursor: pointer;
    @media only screen and (min-width: $desktop) {
      max-width: 320px;
    }
  }
  .profile-menu {
    border-left: 2px solid #07101c;
    @media only screen and (min-width: $desktop) {
      width: 136px;
    }
  }
  &.mobile-transparent {
    background-color: transparent !important;
    @media only screen and (min-width: $tablet) {
      background-color: #fff !important;
    }
  }
}

.main-header__button {
  width: 66px;
  height: 100%;
  outline: none;
  background: url('~assets/images/svg/home_blue.svg') center/24px no-repeat;
  border-left: 1px solid rgba(137, 149, 175, 0.1);
  &.active {
    background-color: rgba(137, 149, 175, 0.2);
  }
}
</style>
