<template>
  <div class="list">
    <div class="column">
      <div>
        <nuxt-link
          :to="{ name: 'news' }"
          class="link page-link"
          @click.native="$emit('click')"
        >
          ПОСЛЕДНИЕ ОБНОВЛЕНИЯ
        </nuxt-link>
      </div>
      <div>
        <nuxt-link
          :to="{ name: 'index', hash: '#product' }"
          class="link page-link"
          @click.native="$emit('click')"
        >
          ПРОДУКТ
        </nuxt-link>
      </div>
      <div>
        <nuxt-link
          :to="{ name: 'index', hash: '#fits' }"
          class="link page-link"
          @click.native="$emit('click')"
        >
          КОМУ ПОДОЙДЕТ СИСТЕМА
        </nuxt-link>
      </div>
    </div>

    <div class="column">
      <div>
        <nuxt-link
          :to="{ name: 'features' }"
          class="link page-link"
          @click.native="$emit('click')"
        >
          СЕРВИСЫ
        </nuxt-link>
      </div>
      <div>
        <nuxt-link
          :to="{ name: 'features', hash: '#adaptive' }"
          class="link tablet"
          @click.native="$emit('click')"
        >
          Мобильная версия
        </nuxt-link>
      </div>
      <div>
        <nuxt-link
          :to="{ name: 'features', hash: '#social-networks-integrated' }"
          class="link tablet"
          @click.native="$emit('click')"
        >
          Интеграция с соцсетями
        </nuxt-link>
      </div>
      <div>
        <nuxt-link
          :to="{ name: 'features', hash: '#sms-notifications' }"
          class="link tablet"
          @click.native="$emit('click')"
        >
          Рассылка SMS
        </nuxt-link>
      </div>
      <div>
        <nuxt-link
          :to="{ name: 'features', hash: '#phone-integration' }"
          class="link tablet"
          @click.native="$emit('click')"
        >
          API телефония
        </nuxt-link>
      </div>
      <div>
        <nuxt-link
          :to="{ name: 'features', hash: '#express' }"
          class="link tablet"
          @click.native="$emit('click')"
        >
          Экспресс-запись
        </nuxt-link>
      </div>
      <div>
        <nuxt-link
          :to="{ name: 'features', hash: '#aggregation' }"
          class="link tablet"
          @click.native="$emit('click')"
        >
          Агрегатор
        </nuxt-link>
      </div>
    </div>

    <div class="column">
      <div class="block contacts">
        <div class="link page-link no-hover">
          КОНТАКТЫ
        </div>
        <div>
          <a
            href="tel:+73832131415"
            class="link"
            @click.native="$emit('click')"
          >+ 7 (383) 213-14-15</a>
        </div>
        <div>
          <a
            href="mailto:info@uno.salon"
            class="link"
            target="_blank"
            @click.native="$emit('click')"
          >info@uno.salon</a>
        </div>
      </div>
      <div class="block">
        <div class="page-link no-hover">
          МЫ В СОЦСЕТЯХ
        </div>
        <Socials @click="$emit('click')" />
      </div>
    </div>

    <div class="column additional">
      <div class="block">
        <div>
          <a
            href="https://drive.google.com/open?id=1Ioe9v58FGXfI7o1ExWPGR9aMkeYyU6LCJenMniPSsl4"
            target="_blank"
            rel="nofollow"
            @click.native="$emit('click')"
          >Договор оферты</a>
        </div>
        <div>
          <a
            href="https://drive.google.com/open?id=1JWxq7uHt7H9CKhqyJLIozc-JeAT9aNXUszZ1m2Dd4Os"
            target="_blank"
            rel="nofollow"
            @click.native="$emit('click')"
          >Политика конфиденциальности</a>
        </div>
        <div>
          <a
            href="https://drive.google.com/file/d/1nFp-fbvBCY-rX7TkJ1M0CKJsArkB9su1/view?usp=sharing"
            target="_blank"
            rel="nofollow"
            @click.native="$emit('click')"
          >Реквизиты компани</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Socials from '~/components/home/Socials.vue'

export default {
  name: 'LinksVue',
  components: {
    Socials
  }
}
</script>

<style lang="scss" scoped>
@import '~assets/styles/common.scss';

.list {
  list-style: none;
  padding: 0 0 30px;
  @media only screen and (min-width: $tablet) {
    display: flex;
    flex-wrap: wrap;
  }

  .column {
    padding: 0 40px;
    @media only screen and (min-width: $tablet) {
      width: 33%;
    }
  }

  .link {
    display: block;
    margin-top: 20px;
    color: #07101c;
    text-decoration: none;
    font-weight: 400;
    &:hover {
      text-decoration: underline;
    }
  }

  .page-link {
    margin-top: 28px;
    font-weight: 600;
    font-size: 18px;
    &:hover {
      color: #c9a15d;
      text-decoration: none;
    }
    &.no-hover:hover {
      color: #07101c;
    }
  }

  .tablet {
    display: none;
    @media only screen and (min-width: $tablet) {
      display: block;
    }
  }

  .block {
    margin-top: 42px;
    &.contacts {
      @media only screen and (min-width: $tablet) {
        margin-top: 0;
      }
    }
  }

  .additional a {
    font-size: 8px;
    color: #8995af;
    text-decoration: underline;
    white-space: nowrap;
    @media only screen and (min-width: $tablet) {
      font-size: 12px;
    }
  }

  .main-page__links {
    padding-bottom: 0;
  }
}
</style>
