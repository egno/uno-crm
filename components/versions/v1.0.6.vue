<template>
  <slide>
    <h2 class="main-page__heading">
      <div>Обновления системы версии 1.0.6 от 01.07.2019</div>
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
                Добавлено автоматическое создание пользователя “Администратор
                компании” по регистрационным данным. Теперь, зарегистрировав
                свой бизнес, Вы автоматически становитесь администратором всей
                компании и Вам не нужно заполнять дополнительную информацию.
              </p>
            </li>
            <li class="update-item">
              <p>
                Добавлено автоматическое заполнение первого филиала компании.
                Теперь, после заполнения информации о компании, данные
                автоматически переносятся в первый филиал, и Вам не нужно
                заполнять информацию повторно.
              </p>
            </li>
            <li class="update-item">
              <p>
                Удалена дополнительная проверка согласия с договором оферты при
                смене пароля.
              </p>
            </li>
          </ul>
        </template>
      </Accordion>

      <Accordion class="visit-calendar">
        <template slot="heading">
          Журнал записи
        </template>
        <template slot="content">
          <ul>
            <li class="update-item">
              <p>
                Добавлено автоматическое пролистывание журнала записи до
                текущего времени. Теперь, заходя в журнал записи, Вы будете
                видеть ближайшие записи, и Вам не придется пролистывать ленту в
                поисках нужного времени.
              </p>
            </li>

            <li class="update-item">
              <p>
                Добавлено изменение мастера, отображаемого в журнале в режиме
                “Неделя”, через стрелки навигации. Для более быстрого просмотра
                журнала на неделю, вы можете выбирать сотрудников
                пролистыванием.
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
              <p>Изменено выделение сегодняшнего дня в журнале записи.</p>
            </li>
            <li>
              <p>Изменено выделение выбранной даты в журнале записи.</p>
            </li>
            <li>
              <p>
                Изменен цвет шрифта для дат будущего и прошлого месяца для
                мобильных устройств в журнале записи.
              </p>
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
        { class: 'visit-calendar', color: '#5699FF', active: true },
        { class: 'visual', color: '#5BCD5E', active: true }
      ]
    }
  }
}
</script>
