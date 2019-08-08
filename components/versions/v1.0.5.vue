<template>
  <slide>
    <h2 class="main-page__heading">
      <div>Обновления системы версии 1.0.5 от 24.06.2019</div>
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
                В связи с работами по улучшению и упрощению сервиса смс-рассылок
                блок “Настройки” пока недоступен. Все настроенные данные
                действуют в назначенном виде. Для изменения настроек обратитесь
                к вашему менеджеру.
              </p>
            </li>
            <li class="update-item">
              <p>
                Добавлен пункт “Реквизиты” на странице
                <nuxt-link :to="{ name: 'faq' }">
                  “Продукт”
                </nuxt-link>.
              </p>
            </li>
            <li class="update-item">
              <p>
                Добавлена Инструкция во вкладке “Насколько сложно ее внедрить в
                бизнес?” на странице
                <nuxt-link :to="{ name: 'faq' }">
                  “Продукт”
                </nuxt-link>и
                будет всегда доступна для просмотра из страницы информации о
                вашей компании.
              </p>
            </li>
            <li class="update-item">
              <p>
                Изменена механика возврата из филиала на уровень компании.
                Теперь переход на уровень компании будет осуществляться по
                нажатию на значок “Домой” в верхней правой части экрана, рядом с
                вашим аватаром.
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
              <h3>Изменен режим графика “День”</h3>
              <p>
                Теперь график на день отображает столбцы сотрудников, для
                улучшения контроля нагрузки салона.
              </p>
            </li>

            <li class="update-item">
              <h3>Режим графика по умолчанию изменен на “День”</h3>
              <p>
                Теперь при переходе в журнал записи, в первую очередь вы будете
                видеть информацию о записях в текущий день, в настоящее время.
              </p>
            </li>

            <li class="update-item">
              <h3>Закреплено верхнее информационное поле журнала записи</h3>
              <p>
                Теперь при прокручивании журнала записи вниз, в зависимости от
                устройства будет отображаться следующая информация:
              </p>
              <ul>
                <li class="li-text">
                  <h4>Версия для мобильных устройств:</h4>
                  <ul>
                    <li>Отображается информация о выбранном сотруднике.</li>
                  </ul>
                </li>
                <li class="li-text">
                  <h4>Десктоп версия:</h4>
                  <ul>
                    <li>
                      В режиме “День” будут отображаться данные о выбранной дате
                      и о сотрудниках работающих в этот день;
                    </li>
                    <li>
                      В режиме неделя будут отображаться даты текущей недели и
                      информация о выбранном сотруднике.
                    </li>
                  </ul>
                </li>
              </ul>
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
            <li class="update-item">
              <h3>Изменение полей заполнений</h3>
              <ul>
                <li class="li-text">
                  Изменена цветовая гамма полей под заполнение;
                </li>
                <li class="li-text">
                  Изменена форма полей под заполнение.
                </li>
              </ul>
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
