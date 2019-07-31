<template>
  <Layout>
    <section class="pocket type-3">
      <div class="content">
        <div class="text-wrapper">
          <div class="main-page__heading">
            КАРМАННЫЙ ОФИС<br>
            И МНОГОЕ ДРУГОЕ
          </div>
          <div class="subheader">
            Используйте возможности UNO.CRM для работы с&nbsp;клиентами своего
            бизнеса с&nbsp;помощью ряда специальных сервисов.
          </div>
          <router-link
            :to="{ name: 'index', hash: '#product' }"
            class="inner-link"
          >
            ПОДРОБНЕЕ О ПРОДУКТЕ
          </router-link>
        </div>
      </div>
    </section>

    <section id="adaptive" class="adaptive type-3">
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

    <section id="social-networks-integrated" class="online type-2">
      <div class="content">
        <div class="text-wrapper layer-1">
          <div class="main-page__heading">
            ЗАПИСЬ НА&nbsp;САЙТЕ И&nbsp;В&nbsp;СОЦСЕТЯХ
          </div>
          <div class="subheader">
            Чтобы клиенты могли записаться в&nbsp;любое время.
          </div>
          <p class="text">
            Чаще всего бизнес теряет клиентов еще на&nbsp;этапе первого
            контакта. Ссылка на онлайн-запись во&nbsp;всех точках контакта
            позволит увеличить записи клиентов на&nbsp;20%. Настройка
            и&nbsp;установка виджета займет у&nbsp;вас&nbsp;не&nbsp;более 20
            минут.
          </p>
        </div>
      </div>
    </section>

    <section id="sms-notifications" class="connection type-3">
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

    <section id="phone-integration" class="phone type-3 layer-0">
      <div class="content">
        <div class="text-wrapper">
          <div class="main-page__heading">
            ИНТЕГРАЦИЯ<br>С&nbsp;ТЕЛЕФОНИЕЙ
          </div>
          <div class="subheader">
            Когда просто сообщения<br>недостаточно.
          </div>
          <p class="text">
            Мы никогда не лишим вас привычного инструмента. У вас есть
            возможность связаться с&nbsp;клиентом прямо из&nbsp;базы в&nbsp;один
            клик. Просто нажмите кнопку вызова и&nbsp;выберите программу, через
            которую вы хотите провести звонок. Или же звоните напрямую
            через&nbsp;мобильный телефон.
          </p>
        </div>
      </div>
    </section>

    <section id="express" class="express type-2 layer-1">
      <div class="overlay layer-0" />
      <div class="content">
        <div class="text-wrapper layer-1">
          <div class="main-page__heading">
            ЭКСПРЕСС&#8209;ЗАПИСЬ<br>ЗА 30 СЕКУНД
          </div>
          <div class="subheader">
            Только для супер-шпионов!
          </div>
          <p class="text">
            Запись «Экспресс», без&nbsp;указания данных о&nbsp;клиенте, создана
            специально для&nbsp;тех, кто спешит на&nbsp;сверхсекретную миссию!
            Или забежал «просто подровнять кончики».
          </p>
          <router-link :to="{ name: 'register' }" class="inner-link layer-1">
            ПОЛУЧИТЕ ДОСТУП УЖЕ СЕЙЧАС
          </router-link>
        </div>
      </div>
    </section>

    <section id="aggregation" class="aggregation type-3">
      <div class="content">
        <div class="text-wrapper">
          <div class="main-page__heading">
            ПРОДВИЖЕНИЕ ЧЕРЕЗ&nbsp;АГРЕГАТОР
          </div>
          <div class="subheader">
            С нашей системой вы сможете не&nbsp;только удержать и&nbsp;повысить
            лояльность постоянных клиентов, но и&nbsp;найти новых.
          </div>
          <p class="text">
            Без ставок за&nbsp;привлеченного клиента, процентов с&nbsp;заказов,
            без&nbsp;штрафов и&nbsp;сложных систем оплат. Настройте участие
            в&nbsp;агрегаторе всего за&nbsp;несколько минут и&nbsp;наслаждайтесь
            потоком клиентов.<br>
            <br>
            Подключайте существующие акции вашей компании или&nbsp;участвуйте
            в&nbsp;системе лояльности агрегатора для повышения позиций компаний
            в&nbsp;топе. Получайте отзывы и&nbsp;рейтинги от&nbsp;клиентов,
            а&nbsp;также делитесь впечатлениями о&nbsp;клиенте. Вы сможете
            выбирать клиентов по&nbsp;рейтингам и&nbsp;пополнять портфолио.
          </p>

          <div class="g-play" />
        </div>
      </div>
    </section>
  </Layout>
</template>

<script>
import Layout from '~/components/home/Layout.vue'

export default {
  components: {
    Layout
  }
}
</script>

<style lang="scss">
@import '~/assets/styles/common.scss';

$header-height: 80px;
$header-desktop-height: 146px;
$padding-top: 53px;
$min-height: 667px;

.main-page-sections {
  section {
    &.pocket {
      height: calc(100vh - #{$header-height});
      background: url('~assets/images/faq/pocket_mobile.png') right center/auto
        100% no-repeat;
      @media only screen and (min-width: $tablet) {
        background: url('~assets/images/faq/pocket_tablet.png') right
          center/auto 100% no-repeat;
      }
      @media only screen and (min-width: 1200px) {
        height: 800px;
        background: url('~assets/images/faq/bg_pocket.png') right top/auto 137%
          no-repeat;
      }
      @media only screen and (min-width: $wide) {
        background-position: right 40%;
        background-size: auto 180%;
      }
      .text-wrapper {
        max-width: 100%;
        text-align: center;
        @media only screen and (min-width: $tablet) {
          max-width: 90%;
          text-align: left;
          padding-right: 0;
        }
        @media only screen and (min-width: $desktop) {
          padding: 0;
        }
      }
      .subheader {
        margin-bottom: 32px;
      }
    }

    &.online {
      .content {
        background: url('~assets/images/faq/bg_online.png') left bottom/61%
          no-repeat;
        @media screen and (min-width: $desktop) {
          background-size: 55%;
        }
        .text-wrapper {
          max-width: 87%;
          @media screen and (min-width: $tablet) {
            display: inline-flex;
            flex-wrap: wrap;
            justify-content: flex-end;
          }
          @media screen and (min-width: $desktop) {
            max-width: 67%;
            padding-right: 0;
          }
        }
        .subheader,
        .text {
          @media screen and (min-width: $tablet) {
            max-width: 71%;
          }
        }
      }
    }

    &.phone {
      position: static;
      height: 400px;
      background: $white-fill,
        url('~assets/images/faq/bg_phone_mobile.png') 70% top/cover no-repeat;
      @media screen and (min-width: $tablet) {
        height: 500px;
        background: $white-fill,
          url('~assets/images/faq/bg_phone_mobile.png') right top/89% 100%
            no-repeat;
      }
      @media screen and (min-width: $desktop) {
        background: url('~assets/images/faq/bg_phone.png') right top/87% 100%
          no-repeat;
        height: 826px;
      }
      @media screen and (min-width: $wide) {
        background: url('~assets/images/faq/bg_phone_wide.png') right top/auto
          100% no-repeat;
      }
      .text-wrapper {
        @media screen and (min-width: $tablet) {
          max-width: 70%;
        }
        @media screen and (min-width: $desktop) {
          width: 470px;
        }
      }
    }

    &.express {
      background: #fff;
      .overlay {
        background: url('~assets/images/faq/bg_express_mobile.png') -80px bottom/290px
          auto no-repeat;
        @media screen and (min-width: $tablet) {
          top: -70px;
          left: -40px;
          bottom: 0;
          background-position: left top;
          background-size: 540px auto;
        }
        @media screen and (min-width: $desktop) {
          left: 0;
          width: 1600px;
          background: url('~assets/images/faq/bg_express.png') left bottom/auto
            100% no-repeat;
        }
        @media screen and (min-width: $wide) {
          left: 11%;
        }
      }
      .content {
        overflow: visible;
      }
      .text-wrapper {
        width: 89%;
        max-width: 485px;
        @media screen and (min-width: $tablet) {
          max-width: 430px;
        }
        @media screen and (min-width: $desktop) {
          width: 630px;
          max-width: none;
        }
      }
    }

    &.aggregation {
      height: 825px;
      background: url('~assets/images/faq/bg_aggregation.png') 180px 420px/70%
        no-repeat;
      @media screen and (min-width: $tablet) {
        height: 855px;
        background: url('~assets/images/faq/bg_aggregation.png') right 280px/380px
          auto no-repeat;
      }
      @media screen and (min-width: $desktop) {
        height: 950px;
        background: url('~assets/images/faq/bg_aggregation.png') 80% bottom/auto
          70% no-repeat;
      }
      .content {
        align-items: flex-start;
        padding-top: 64px;
        @media screen and (min-width: $tablet) {
          align-items: center;
        }
      }
      .subheader,
      .text {
        @media screen and (min-width: $tablet) {
          max-width: 65%;
        }
        @media screen and (min-width: $desktop) {
          max-width: 100%;
        }
      }
      .g-play {
        width: 130px;
        height: 44px;
        margin-top: 55px;
        background: url('~assets/images/google_play.png') center/contain
          no-repeat;
        @media screen and (min-width: $tablet) {
          width: 223px;
          height: 80px;
        }
      }
    }
  }
}
</style>
