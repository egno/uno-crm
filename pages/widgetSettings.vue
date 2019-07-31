<template>
  <PageLayout
    :is-edit-mode="true"
    :is-edit-visible="false"
    :template="{ headerText: 'Онлайн запись', buttonText: '' }"
    class="businesscard-form widget-settings"
  >
    <template slot="content">
      <AppTabs v-model="activeTab">
        <v-tab :key="0" ripple>
          Виджет на сайт
        </v-tab>
        <v-tab :key="1" ripple>
          Запись по ссылке
        </v-tab>
      </AppTabs>
      <div class="tab-content">
        <v-form ref="form">
          <div v-show="activeTab === 0" class="infocard _edit">
            <div class="infocard__content">
              <v-layout align-left column>
                <v-flex>
                  <v-layout row wrap>
                    <v-flex pa-3 sm6>
                      <div>
                        <span class="font-weight-bold ">Виджет</span>
                        <span>
                          — эффективный способ получать записи прямо с сайта
                          компании или личного портфолио. Подходит как для
                          компьютера, так и для смартфона. Универсальный
                          стильный дизайн, удобная навигация, SMS-напоминания
                          накануне записи.
                        </span>
                      </div>
                    </v-flex>
                    <v-flex pa-3 sm6>
                      <div>
                        <v-img src="/img/widget01.png" />
                      </div>
                    </v-flex>
                  </v-layout>
                </v-flex>
                <v-flex>
                  <WidgetButtonSettings />
                </v-flex>
              </v-layout>
            </div>
          </div>
          <div v-show="activeTab === 1" class="infocard _edit">
            <div class="infocard__content">
              <v-layout align-left column>
                <v-flex>
                  <v-layout row wrap>
                    <v-flex pa-3 sm6>
                      <v-layout column>
                        <v-flex pa-2>
                          Разместите вашу ссылку на запись там, где бывают ваши
                          клиенты. Ссылку можно прикреплять к постам в
                          социальной сети, установить в качестве статуса,
                          веб-сайта и отправлять в диалог с клиентом в
                          мессенджере.
                        </v-flex>
                        <v-flex pa-2>
                          Добавьте для ваших клиентов возможность записываться
                          онлайн
                          <span
                            class="font-weight-bold"
                          >прямо на вашей странице в Instagram</span>.
                        </v-flex>
                        <v-flex pa-2>
                          Для этого скопируйте ссылку, которая находится ниже, и
                          вставьте ее в поле Веб-сайт вашего профиля.
                        </v-flex>
                        <v-flex pa-2>
                          <h3>Ваша ссылка</h3>
                        </v-flex>
                        <v-flex pa-2>
                          <v-layout row wrap>
                            <v-flex xs-6>
                              <a :href="link" target="_blank">{{ link }}</a>
                            </v-flex>
                            <v-flex xs-6>
                              <v-btn
                                small
                                ripple
                                round
                                color="primary"
                                outline
                                @click="copyLink"
                              >
                                Скопировать
                              </v-btn>
                            </v-flex>
                          </v-layout>
                        </v-flex>
                      </v-layout>
                    </v-flex>
                    <v-flex pa-3 sm6>
                      <div>
                        <v-img src="/img/widget02.png" />
                      </div>
                    </v-flex>
                  </v-layout>
                </v-flex>
                <v-flex>
                  <FilialWidgetSettings />
                </v-flex>
              </v-layout>
            </div>
          </div>
          <div v-show="activeTab === 1" class="infocard _edit" />
        </v-form>
      </div>
    </template>
  </PageLayout>
</template>

<script>
import { mapGetters } from 'vuex'
import BusinessSettings from '~/classes/business_settings'
import AppTabs from '~/components/common/AppTabs.vue'
import PageLayout from '~/components/common/PageLayout.vue'
import WidgetButtonSettings from '~/components/WidgetButtonSettings.vue'
import FilialWidgetSettings from '~/components/FilialWidgetSettings.vue'
import { widgetHost } from '~/components/utils'

export default {
  components: {
    AppTabs,
    PageLayout,
    WidgetButtonSettings,
    FilialWidgetSettings
  },
  data () {
    return {
      activeTab: 0,
      businessSettings: new BusinessSettings()
    }
  },
  computed: {
    ...mapGetters({ businessId: 'business/businessId' }),
    link () {
      const host = widgetHost()
      return `${host}/?b=${this.businessId}`
    }
  },
  methods: {
    copyLink () {
      const el = document.createElement('textarea')
      el.value = this.link
      document.body.appendChild(el)
      el.select()
      document.execCommand('copy')
      document.body.removeChild(el)
    }
  }
}
</script>

<style lang="scss">
@import '~/assets/styles/settings.scss';
@import '~/assets/styles/businesscard-form.scss';

.tab-content {
  @media only screen and (min-width: $desktop) {
    padding-left: 127px;
  }
  .infocard._emp-serv {
    max-width: 100%;
    width: auto;
    // padding-right: 40px;
    .infocard__content {
      max-width: 100%;
    }
  }
}
</style>
