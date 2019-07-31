<template>
  <v-card flat color="grey lighten-3" class="card-rounded">
    <v-card-text>
      <v-switch
        v-model="showDetails"
        label="Генерация кнопки Онлайн записи на сайт"
        color="blue"
        class="compact mt-0 pb-1 px-2"
        height="10px"
        hide-details
      />
    </v-card-text>
    <template v-if="showDetails">
      <v-divider class="card-divider" />
      <v-card-text>
        <v-layout row wrap>
          <v-flex pa-2 sm6>
            <v-layout column>
              <v-flex pa-2>
                <div>
                  Кнопка <span>«Запись»</span> будет всегда доступна в правом
                  нижнем углу экрана. Выберите подходящий цвет из
                  представленных, чтобы ваши клиенты всегда могли быстро найти
                  ее на сайте.
                </div>
              </v-flex>
              <v-flex pa-2>
                <ColorSelector
                  :colors="[
                    'C9A15D',
                    'DFC497',
                    'F3AA57',
                    '85CA86',
                    '49C9B7',
                    '5A96DF',
                    '142941',
                    'F36B6B',
                    'F37F6B',
                    'DF8CB2',
                    'B88AB2',
                    '8589DF'
                  ]"
                  @click="color = $event"
                />
              </v-flex>
              <v-flex pa-5>
                <div class="button-container">
                  <a class="unoBtn button-example">
                    <div
                      class="unoBtnBackground"
                      :style="{ background: `${color}` }"
                    />
                    <div class="unoBtnText">запись</div>
                    <div class="unoBtnIcon" />
                  </a>
                </div>
              </v-flex>
              <v-flex pa-2>
                <h3>В код сайта вставьте скрипт</h3>
              </v-flex>
              <v-flex pa-2>
                <textarea
                  ref="script-text"
                  class="script-text"
                  :value="unoBtnScript"
                  readonly
                />
              </v-flex>
              <v-flex pa-2>
                <v-btn
                  small
                  ripple
                  round
                  color="primary"
                  outline
                  @click="copyScript"
                >
                  Скопировать код
                </v-btn>
              </v-flex>
            </v-layout>
          </v-flex>
          <v-flex pa-2 sm6>
            <v-layout column>
              <v-flex pa-2>
                <div class="red--text">
                  <div>
                    <span class="rounded">?</span>
                    <span class="font-weight-bold">
                      Как вставить кнопку "Запись" на сайт?</span>
                  </div>
                </div>
              </v-flex>
              <v-flex pa-2>
                <a
                  href="https://docs.google.com/document/d/1Xhdy0qMvgOmD9AlBQALeG6nJF3i6NPH81K0DYcZQn7k"
                  target="_blank"
                >Скачать короткую инструкцию</a>
              </v-flex>
              <v-flex pa-2 pt-4>
                <span class="font-weight-bold">Возникла проблема?</span>
              </v-flex>
              <v-flex pa-2>
                <div @click="openMessageWindow">
                  <a>Связаться с техподдержкой</a>
                </div>
              </v-flex>
            </v-layout>
          </v-flex>
        </v-layout>
      </v-card-text>
    </template>
  </v-card>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import ColorSelector from '~/components/common/ColorSelector.vue'

export default {
  components: { ColorSelector },
  props: {
    //
  },
  data () {
    return {
      showDetails: false,
      color: ''
    }
  },
  computed: {
    ...mapGetters({ businessId: 'business/businessId' }),
    unoBtnScript () {
      return `<script>var UNO_ID = '${
        this.businessId
      }'; var UNO_BTN = {color:'${
        this.color
        // eslint-disable-next-line no-useless-escape
      }'}<\/script><script src='https://widget.uno.salon/js/widget.js' charset='UTF-8'> <\/script>`
    }
  },
  methods: {
    ...mapActions({ openMessageWindow: 'common/openMessageWindow' }),
    copyScript () {
      this.$refs['script-text'].select()
      document.execCommand('copy')
    }
  }
}
</script>

<style scoped>
@import 'https://widget.uno.salon/css/widget.css';
.button-container {
  height: 60px;
}
.button-example {
  position: relative !important;
}
.card-rounded {
  border-radius: 24px;
}
.card-divider {
  border-color: rgba(255, 255, 255, 1);
}
.script-text {
  width: 100%;
  background: white;
  min-height: 6em;
  padding: 0.5em;
}
.rounded {
  font-size: 10px;
  display: inline-block;
  border: solid;
  border-width: 1px;
  border-radius: 1em;
  text-align: center;
  position: relative;
  bottom: 1px;
  width: 14px;
  height: 14px;
  margin-right: 0.5em;
}
</style>
