<template>
  <slide>
    <h2 class="main-page__heading">
      <div>Обновления системы версии 1.0.7 от 08.07.2019</div>
      <div>
        <span
          v-for="(indicator, i) in newsIndicators"
          :key="i"
          :class="indicator.class"
          class="news__indicator"
        />
      </div>
    </h2>
    <div class="home-section__text">
      <Accordion class="critical">
        <template slot="heading">
          Критическое обновление
        </template>
        <template slot="content">
          <ul>
            <li class="update-item">
              <p>
                Исправлено отображение основного номера клиента в списке.
              </p>
            </li>
          </ul>
        </template>
      </Accordion>

      <Accordion class="visual">
        <template slot="heading">
          Визуал
        </template>
        <template slot="content">
          <ul>
            <li>
              <p>Изменено основное изображение на главной странице uno.salon</p>
            </li>
            <li>
              <p>Изменены шрифты на более четкие и читаемые</p>
            </li>
          </ul>
        </template>
      </Accordion>

      <Accordion class="widget">
        <template slot="heading">
          Виджет Онлайн-записи
        </template>
        <template slot="content">
          <ul>
            <li>
              <p>
                Для простоты восприятия убраны предложения ближайшего времени
              </p>
            </li>
            <li>
              <p>Виджет для сайта теперь располагается в центре</p>
            </li>
            <li>
              <p>Изменены шрифты отображения имени филиала</p>
            </li>
            <li>
              <p>Изменена форма кнопки перехода</p>
            </li>
          </ul>
        </template>
      </Accordion>
    </div>
  </slide>
</template>

<script>
import { Slide } from 'vue-carousel'
import Accordion from '~/components/common/Accordion.vue'

export default {
  components: {
    Accordion,
    Slide
  },
  data () {
    return {
      newsIndicators: [
        { class: 'critical', color: '#EF4D37', active: true },
        { class: 'visual', color: '#5BCD5E', active: true },
        { class: 'widget', color: '#b35dc9', active: true }
      ]
    }
  }
}
</script>
