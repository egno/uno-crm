<template>
  <Layout>
    <section class="update">
      <div class="content">
        <div class="text-wrapper">
          <div class="main-page__heading">
            ПОСЛЕДНИЕ<br>ОБНОВЛЕНИЯ
          </div>
          <div class="subheader">
            Мы всегда идем в&nbsp;ногу с&nbsp;бизнесом, и&nbsp;благодаря вашей
            обратной связи регулярно создаем актуальные и&nbsp;полезные
            обновления.
          </div>
          <router-link
            :to="{ name: 'news', hash: '#news-adaptive' }"
            class="inner-link"
          >
            ПОДРОБНОЕ ОПИСАНИЕ ОБНОВЛЕНИЙ
          </router-link>
        </div>
      </div>
    </section>

    <section id="news-adaptive" class="adaptive type-3">
      <div class="overlay layer-1" />
      <div class="content layer-0">
        <div class="text-wrapper">
          <div class="main-page__heading">
            АДАПТИРОВАНА ПОД&nbsp;ВСЕ&nbsp;УСТРОЙСТВА
          </div>
          <div class="subheader">
            В курсе дел из любой точки мира.
          </div>
          <p class="text">
            Вести дела стало проще. Просто откройте ваш личный кабинет
            в&nbsp;браузере мобильного телефона или планшета и&nbsp;управляйте
            бизнесом из&nbsp;любой точки мира.<br><br>
            Предоставьте доступ вашим менеджерам и&nbsp;мастерам к&nbsp;системе,
            чтобы в&nbsp;ваше отсутствие рабочие процессы
            не&nbsp;останавливались.
          </p>
          <router-link :to="{ name: 'register' }" class="inner-link">
            ПОЛУЧИТЕ ДОСТУП УЖЕ СЕЙЧАС
          </router-link>
        </div>
      </div>
    </section>

    <section class="connection type-3">
      <div class="content">
        <div class="text-wrapper layer-1">
          <div class="main-page__heading">
            БУДЬТЕ НА СВЯЗИ<br>С КЛИЕНТАМИ!
          </div>
          <div class="subheader">
            Простой сервис отправки sms-уведомлений клиентам и&nbsp;сотрудникам.
          </div>
          <p class="text">
            Напоминайте о&nbsp;записи, поздравляйте с&nbsp;праздниками,
            подтверждайте записи клиентов без&nbsp;затрат времени.<br><br>
            Вам не потребуется заключение дополнительных договоров
            с&nbsp;операторами связи и&nbsp;проблем с&nbsp;подключением API. Все
            эти вопросы мы уже решили за&nbsp;вас. Вам нужно лишь ознакомиться
            с&nbsp;<a
              href="https://drive.google.com/open?id=1Ioe9v58FGXfI7o1ExWPGR9aMkeYyU6LCJenMniPSsl4"
              target="_blank"
              rel="nofollow"
              @click.native="$emit('click')"
            >договором оферты</a>
            и&nbsp;настроить события отправки сообщений.
          </p>
          <router-link :to="{ name: 'register' }" class="inner-link layer-1">
            ПОЛУЧИТЕ ДОСТУП УЖЕ СЕЙЧАС
          </router-link>
        </div>
      </div>
    </section>
  </Layout>
</template>

<script>
import Layout from '~/components/home/Layout.vue'

export default {
  name: 'News',
  components: {
    Layout
  }
}
</script>

<style lang="scss">
@import '~assets/styles/common.scss';

$header-height: 80px;
$header-desktop-height: 146px;
$padding-top: 53px;
$min-height: 667px;

.main-page-sections {
  section {
    &.update {
      height: calc(100vh - #{$header-height});
      /* for animation of header on mobiles
      height: 100vh;
      margin-top: -80px;
      */
      background: url('~assets/images/news/bg_update.png') right 8%/100%
        no-repeat #f3f4f7;
      /* for animation of header on mobiles
      @media only screen and (min-width : $tablet) {
        height: calc(100vh - 80px);
        margin-top: 0;
      }*/
      @media screen and (min-width: $tablet) {
        background-position: right 10%;
        background-size: auto 40%;
      }
      @media only screen and (min-height: $min-height) {
        height: calc(100vh - #{$header-desktop-height});
      }
      @media screen and (min-width: $desktop) {
        background: url('~assets/images/news/bg_update.png') right center/54%
          no-repeat #f3f4f7;
      }
      @media screen and (min-width: $wide) {
        background: url('~assets/images/news/bg_update.png') 90% center/950px
          auto no-repeat #f3f4f7;
      }
      .content {
        align-items: flex-end;
        padding-bottom: 17%;
        @media screen and (min-height: 667px) {
          padding-bottom: 20%;
        }
        @media screen and (min-width: $desktop) {
          align-items: center;
          padding-bottom: 0;
        }
      }
      .text-wrapper {
        @media screen and (min-width: $wide) {
          max-width: 50%;
        }
      }
      .main-page__heading {
        margin-bottom: 24px;
      }
    }
  }
}
</style>
