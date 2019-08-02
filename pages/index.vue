<template>
  <Layout>
    <section class="main-page__first">
      <div class="main-page__first-top">
        <div class="content">
          <div class="text-wrapper">
            <h2 class="main-page__subheading">
              Оптимизируйте процессы – <br>
              и занимайтесь любимым делом
            </h2>
            <h1 class="main-page__heading">
              НОВАЯ СИСТЕМА УЧЕТА ДЛЯ&nbsp;ИНДУСТРИИ КРАСОТЫ
            </h1>
            <router-link
              :to="{ name: 'register' }"
              class="main-page__register-link"
            >
              ПОЛЬЗУЙТЕСЬ БЕСПЛАТНО
            </router-link>
            <a v-smooth-scroll href="/#product" class="main-page__scroll">
              <span>УЗНАЙТЕ БОЛЬШЕ</span>
            </a>
          </div>
        </div>
      </div>
      <div class="main-page__first-bottom">
        <div class="content">
          <div class="text-wrapper">
            <Socials />
          </div>
        </div>
      </div>
    </section>

    <section id="fits" class="fits">
      <div class="content">
        <div class="target-audience">
          <h2 class="main-page__heading">
            КОМУ ПОДОЙДЕТ <br>
            СИСТЕМА UNO.CRM?
          </h2>
          <ul class="target-audience__list">
            <li class="target-audience__item beauty">
              <div>САЛОНЫ КРАСОТЫ</div>
            </li>
            <li class="target-audience__item spa _one-line">
              <div>SPA-ЦЕНТРЫ</div>
            </li>
            <li class="target-audience__item cosmetic">
              <div>КЛИНИКИ КОСМЕТОЛОГИИ</div>
            </li>
            <li class="target-audience__item hairdressers _one-line">
              <div>ПАРИКМАХЕРСКИЕ</div>
            </li>
            <li class="target-audience__item barbershop _one-line">
              <div>БАРБЕРШОПЫ</div>
            </li>
            <li class="target-audience__item massage">
              <div>КАБИНЕТЫ МАССАЖА</div>
            </li>
            <li class="target-audience__item tattoo _one-line">
              <div>ТАТУ-САЛОНЫ</div>
            </li>
            <li class="target-audience__item lash">
              <div>LASH- И BROW-КАБИНЕТЫ</div>
            </li>
            <li class="target-audience__item manicure">
              <div>МАНИКЮРНЫЕ САЛОНЫ</div>
            </li>
            <li class="target-audience__item epilation">
              <div>КАБИНЕТЫ ЭПИЛЯЦИИ</div>
            </li>
            <li class="target-audience__item individual">
              <div>ЧАСТНЫЕ МАСТЕРА</div>
            </li>
            <li class="target-audience__item solarium">
              <div>СТУДИИ ЗАГАРА</div>
            </li>
          </ul>
        </div>
      </div>
    </section>

    <section id="product" class="pricing type-1">
      <div class="content">
        <div class="text-wrapper layer-1">
          <div class="main-page__heading">
            ПОЛЬЗУЙТЕСЬ<br>БЕСПЛАТНО!
          </div>
          <div class="subheader">
            Мы любим своих клиентов.<br>
            Никакого навязанного сервиса.
          </div>
          <div class="text">
            Пройдите простую регистрацию и&nbsp;получите возможности развития
            и&nbsp;оптимизации ваших бизнес-процессов.<br>
            <ul>
              <li>Управляйте сотрудниками онлайн</li>
              <li>Ведите запись в&nbsp;онлайн-журнале</li>
              <li>Уведомляйте клиентов о&nbsp;новой записи</li>
              <li>Храните историю записей клиентов</li>
              <li>Контролируйте рабочие процессы из&nbsp;любой точки мира</li>
            </ul>
            <div class="desktop">
              Все это и другие полезные инструменты уже ждут вас в&nbsp;базовой
              версии UNO.CRM. А если вам не хватит стандартного функционала,
              просто добавьте действительно нужные вам платные модули
              и&nbsp;не&nbsp;платите за&nbsp;подписки и&nbsp;каждого мастера
              отдельно.
            </div>
          </div>
          <router-link :to="{ name: 'register' }" class="inner-link layer-1">
            ПОЛУЧИТЕ ДОСТУП УЖЕ СЕЙЧАС
          </router-link>
        </div>
      </div>
    </section>

    <section class="integration-time type-2">
      <div class="content">
        <div class="text-wrapper layer-1">
          <div class="main-page__heading">
            ВНЕДРЕНИЕ<br>ВСЕГО ЗА 2 ЧАСА
          </div>
          <div class="subheader">
            Экономия времени и&nbsp;сил.
          </div>
          <p class="text">
            Мы создали систему максимально простой и&nbsp;удобной, чтобы ваши
            сотрудники смогли легко освоить ее, даже если до этого они никогда
            не&nbsp;работали в&nbsp;CRM.
            <br><br>
            А если вам понадобится помощь, просто напишите в&nbsp;поддержку. Наш
            менеджер свяжется с&nbsp;вами и&nbsp;поможет разобраться
            со&nbsp;всеми вопросами.
          </p>
        </div>
      </div>
    </section>

    <section class="clients type-3">
      <div class="content">
        <div class="text-wrapper layer-1">
          <div class="main-page__heading">
            О КЛИЕНТАХ<br>В ПЕРВУЮ ОЧЕРЕДЬ
          </div>
          <div class="subheader">
            Они скажут вам&nbsp;«Спасибо!» за&nbsp;заботу.
          </div>
          <div class="text">
            В нашем мире невозможно все держать в&nbsp;голове. Поэтому мы
            разработали несколько инструментов, которые помогут вам держать свою
            базу клиентов в&nbsp;актуальном состоянии, расширять ее
            и&nbsp;удерживать.
          </div>
          <router-link
            :to="{ name: 'features', hash: '#sms-notifications' }"
            class="inner-link layer-1"
          >
            ПОДРОБНЕЕ О РАБОТЕ С&nbsp;КЛИЕНТАМИ БИЗНЕСА
          </router-link>
        </div>
      </div>
    </section>
  </Layout>
</template>

<script>
import { mapGetters } from 'vuex'
import Layout from '~/components/home/Layout.vue'
import Socials from '~/components/home/Socials.vue'

export default {
  components: {
    Layout,
    Socials
  },
  head () {
    return {
      title: this.title
    }
  },
  data () {
    return {
      tokenTimerId: undefined
    }
  },
  computed: {
    ...mapGetters({
      appTitle: 'common/appTitle',
      businessName: 'business/businessName',
      userRole: 'user/userRole'
    }),
    title () {
      if (!this.appTitle) {
        return 'UNO'
      }
      if (this.businessName) {
        return `${this.appTitle}. ${this.businessName}`
      }
      if (this.userRole) {
        return `${this.appTitle} ${this.userRole}`
      }
      return this.appTitle
    }
  }
}
</script>

<style lang="scss">
@import '~assets/styles/common.scss';
@import 'lato-font/scss/_public-api.scss';

$header-height: 80px;
$header-desktop-height: 146px;
$padding-top: 53px;
$min-height: 667px;

$saloons: beauty spa cosmetic hairdressers barbershop massage tattoo lash
  manicure epilation individual solarium;

.main-page-sections {
  section {
    &.main-page__first {
      height: calc(100vh - #{$header-height});
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: center;
      background: $white-fill,
        url('~assets/images/bg_intro.png') center bottom/230%auto no-repeat #fff;
      @media only screen and (min-aspect-ratio: 768/1024) and (min-width: $tablet) {
        background: $white-fill,
          url('~assets/images/bg_home_first_tablet.png') right bottom/230% auto
            no-repeat #fff;
      }
      @media only screen and (min-aspect-ratio: 1024/768) and (min-width: $tablet) {
        background: $white-fill,
          url('~assets/images/bg_home_first_tablet.png') 60% bottom/160% auto
            no-repeat #fff;
      }
      @media only screen and (min-aspect-ratio: 1366/666) and (min-width: $desktop) {
        background: $white-fill,
          url('~assets/images/bg_home_first_desktop.png') 60% bottom/100% auto
            no-repeat #fff;
      }
      @media only screen and (min-height: $min-height) {
        height: calc(100vh - #{$header-desktop-height});
      }
      @media only screen and (min-width: $desktop) and (min-height: $min-height) {
        position: relative;
        background: url('~assets/images/bg_home_first_desktop.png') 70%
          bottom/auto 100% no-repeat #fff;
      }
      @media only screen and (min-width: $wide) and (min-height: $min-height) {
        background: url('~assets/images/bg_home_first_wide.png') center
          bottom/auto 100% no-repeat #fff;
      }
      @media screen and (min-height: 1023px) {
        padding-bottom: 2vh;
      }
      .content {
        justify-content: center;
        overflow: visible;
      }
      .text-wrapper {
        max-width: 100%;
        text-align: center;
        @media only screen and (min-width: $tablet) {
          padding: 0;
          text-align: left;
        }
      }

      .main-page__first-top {
        display: flex;
        flex-grow: 1;
        width: 100%;
        align-items: center;

        .content {
          width: 100%;
          @media only screen and (min-width: $tablet) {
            justify-content: flex-start;
          }
        }
      }
      .main-page__first-bottom {
        width: 100%;
        .content {
          @media only screen and (min-width: $tablet) {
            justify-content: flex-start;
          }
        }
      }
      .main-page__container {
        position: relative;
        padding-left: 48px;
        @media only screen and (min-width: $tablet) {
          padding-left: 0;
        }
      }
      .main-page__heading {
        margin-bottom: 5vh;
        @media only screen and (min-width: $tablet) and (min-height: $min-height) {
          max-width: 570px;
        }
        @media only screen and (min-width: $desktop) and (min-height: $min-height) {
          max-width: none;
          margin-bottom: 45px;
        }
      }
      .main-page__subheading {
        font-size: 16px;
        font-weight: 300;
        margin-bottom: 2vh;
        @media only screen and (min-width: $tablet) and (min-height: $min-height) {
          margin-bottom: 50px;
          font-size: 24px;
        }
      }
      .main-page__register-link {
        display: inline-flex;
        width: 100%;
        max-width: 280px;
        height: 68px;
        margin: 0;
        padding: 0 25px;
        align-items: center;
        justify-content: center;
        background: linear-gradient(90deg, #c9a15d 0%, #ba9462 100%) #b69768;
        color: #ffffff;
        text-decoration: none;
        text-align: center;
        font-size: 16px;
        font-weight: 600;
        transition: background-color 0.6s 0s;
        &:hover {
          background-color: #07101c;
          background-image: none;
          text-decoration: none !important;
        }
      }
      .main-page__scroll {
        display: none;
        align-items: baseline;
        justify-content: center;
        width: 100%;
        max-width: 280px;
        margin-top: 6vh;
        text-align: center;
        font-weight: 600;
        font-size: 16px;
        color: #07101c !important;
        text-decoration: none !important;
        &:after {
          display: block;
          content: '';
          height: 7px;
          width: 7px;
          margin-left: 5px;
          border: 2px solid #07101c;
          transform: rotate(45deg) translate(-2px, -1px);
          border-left: none;
          border-bottom: none;
        }
        @media screen and (min-height: 568px) {
          display: inline-flex;
        }
      }
      .main-page__links {
        display: none;
        margin: 4vh 0 !important;
        padding: 4vh 0;
        @media screen and (min-height: $min-height) {
          display: flex;
        }
      }
    }

    &.fits {
      .content {
        overflow: visible;
      }
    }

    &.pricing {
      height: 820px;
      background: url('~assets/images/home/bg_pricing_mobile.png') right
        bottom/auto 50% no-repeat #fff;
      @media only screen and (min-width: $tablet) {
        height: 728px;
        background: url('~assets/images/home/bg_pricing.png') 95% bottom/auto
          600px no-repeat #fff;
      }
      @media only screen and (min-width: $desktop) {
        height: 978px;
        background-size: auto 90%;
        background-position: 90% bottom;
      }
      @media only screen and (min-width: $wide) {
        height: 1000px;
        background-size: 750px auto;
        background-position: 80% bottom;
      }
    }

    &.integration-time {
      background: url('~assets/images/home/time.png') -20px top/contain no-repeat;
      @media screen and (min-width: $tablet) {
        height: 550px;
        background: url('~assets/images/home/bg_integration.png') left
          top/contain no-repeat;
      }
      @media screen and (min-width: $desktop) {
        background-position: 10% top;
      }
      @media screen and (min-width: $wide) {
        background-position: 20% top;
      }
    }

    &.clients {
      height: 500px;
      background: url('~assets/images/home/bg_clients_mobile.png') 180px
        bottom/78% no-repeat #fff;
      @media screen and (min-width: $tablet) {
        height: 550px;
        background-position: right bottom;
        background-size: 45%;
      }
      @media screen and (min-width: $desktop) {
        height: 755px;
        background: url('~assets/images/home/bg_clients.png') 180px bottom/43%
          no-repeat #fff;
      }
      @media screen and (min-width: $wide) {
        background: url('~assets/images/home/bg_clients_wide.png') 80%
          bottom/contain no-repeat #fff;
      }
      .subheader {
        max-width: 80%;
        @media screen and (min-width: $tablet) {
          max-width: none;
        }
      }
      .text-wrapper {
        @media screen and (min-width: $tablet) {
          max-width: 77%;
        }
      }
      .text {
        max-width: 60%;
        @media screen and (min-width: $tablet) {
          max-width: none;
        }
      }
    }
  }
}

.target-audience {
  $item-margin: 11px;
  $item-margin-desktop: 3%;
  $item-margin-wide: 19px;
  padding: 100px 6px 0;

  @media only screen and (min-width: $tablet) {
    margin-top: 55px;
    padding: 100px 0 0;
  }
  @media only screen and (min-width: $desktop) {
    margin-bottom: 30px;
    padding-top: 150px;
  }
  &__list {
    display: flex;
    max-width: 1286px;
    flex-wrap: wrap;
    margin: 0 auto 42px;
    padding: 0;
    justify-content: space-around;
    list-style: none;
    @media only screen and (min-width: $tablet) {
      margin: 0 (-$item-margin * 4);
      justify-content: center;
    }
    @media only screen and (min-width: $desktop) {
      margin: 0 (-$item-margin-desktop * 2);
    }
    @media only screen and (min-width: $wide) {
      margin: 0 (-$item-margin-wide);
    }
  }
  &__item {
    width: 158px;
    margin: 0 $item-margin 57px;
    font-weight: 600;
    font-size: 16px;
    text-align: center;
    @media only screen and (min-width: $desktop) {
      width: 10%;
      margin: 0 $item-margin-desktop 57px;
    }
    @media only screen and (min-width: $wide) {
      margin: 0 $item-margin-wide 57px;
    }
    &:before {
      display: inline-block;
      width: 90px;
      height: 90px;
      margin-bottom: 13px;
      content: '';
      border-radius: 50%;
      box-shadow: 0px 7px 20px rgba(0, 0, 0, 0.05);
    }
    @each $saloon in $saloons {
      &.#{$saloon}:before {
        background: url('~assets/images/svg/#{$saloon}.svg')
          center/contain
          no-repeat;
      }
    }

    div {
      height: 38px;
    }

    &._one-line {
      div {
        padding-top: 1px;
      }
    }
    &.beauty,
    &.individual,
    &.solarium {
      padding: 0 15px;
    }
  }
  .main-page__heading {
    margin-bottom: 30px;
    padding-left: 42px;
    text-align: left;
    @media only screen and (min-width: $tablet) {
      margin-bottom: 95px;
      padding-left: 0;
    }
  }
  .main-page__register-link {
    margin: 0 auto;
  }
}
</style>
