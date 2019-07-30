<template>
  <PageLayout
    :is-edit-mode="true"
    :is-edit-visible="false"
    :template="{ headerText: 'Настройки', buttonText: '' }"
    class="businesscard-form settings"
  >
    <template slot="content">
      <AppTabs v-model="activeTab">
        <v-tab
          :key="0"
          ripple
        >
          Уведомления
        </v-tab>
        <v-tab
          :key="1"
          ripple
        >
          Журнал сообщений
        </v-tab>
        <v-tab
          :key="2"
          ripple
        >
          Баланс
        </v-tab>
      </AppTabs>
      <div :class="['tab-content', { log: activeTab === 1 }]">
        <v-form ref="form">
          <div
            v-show="activeTab === 0"
            class="infocard _edit"
          >
            <div class="infocard__content">
              <v-layout
                align-left
                column
              >
                <h3 class="settings__content-heading">
                  Настройте необходимые вам события рассылки уведомлений
                </h3>
                <div
                  v-for="(event, propName) in businessSettings.notifications.events"
                  :key="propName"
                  class="settings__checkbox-block"
                >
                  <v-switch
                    v-model="event.enabled"
                    :label="event.title"
                  />

                  <div v-if="event.enabled" flat>
                    <div v-if="typeof event.phone !== 'undefined' || event.description">
                      <div v-if="propName === 'new_visit_client'" class="settings__description">
                        Шаблон рассылки: <br> Вы записаны на визит к&nbsp;&lt;Должность&nbsp;мастера&gt; &lt;Имя&nbsp;и&nbsp;Фамилия Мастера&gt; на&nbsp;&lt;время&nbsp;записи&gt; в&nbsp;&lt;Название&nbsp;филиала&gt;
                      </div>
                      <div v-else-if="propName === 'new_visit_manager'" class="settings__description">
                        Шаблон рассылки: <br> Новая онлайн запись к&nbsp;&lt;Мастер&gt; на&nbsp;&lt;Время&nbsp;записи&gt; в&nbsp;&lt;Название&nbsp;филиала&gt;
                      </div>
                      <v-flex v-if="typeof event.phone !== 'undefined'" sm6 class="phone-input">
                        <PhoneEdit
                          :phone="event.phone"
                          :removable="false"
                          label="Телефон для уведомлений"
                          @onEdit="event.phone = $event"
                        />
                      </v-flex>
                    </div>
                    <div v-if="typeof event.amount !== 'undefined'">
                      <v-flex v-if="typeof event.amount !== 'undefined'" sm6 class="amount-input">
                        <v-text-field
                          v-model="event.amount"
                          label="Сумма остатка"
                          single-line mask="######" suffix="руб. "
                        />
                      </v-flex>
                    </div>
                  </div>
                </div>
              </v-layout>
              <MainButton
                class="button save-info"
                :class="{ button_disabled: saveDisabled }"
                type="button"
                @click.native.prevent="save"
              >
                Сохранить
              </MainButton>
            </div>
          </div>
          <div v-show="activeTab === 1">
            <MessageList :business-id="businessId" />
          </div>
          <div
            v-show="activeTab === 2"
            class="infocard _edit balance"
          >
            <div class="infocard__content">
              <AccountBalance :business-id="businessId" />
              <v-layout align-center>
                <v-flex class="balance__level">
                  На какую сумму пополнить счёт?
                </v-flex>
                <v-flex class="balance__level">
                  <v-text-field v-model="amount" single-line mask="######" suffix="руб." />
                </v-flex>
              </v-layout>
              <v-layout align-center>
                <v-checkbox
                  v-model="oferta_agree"
                  color="blue"
                >
                  <template v-slot:label>
                    <span>Я ознакомился со <a href="https://drive.google.com/open?id=164gkgHbMyDM-esjuOBzdJCQPZtgktIHM" target="_blank">стоимостью</a> услуг 
                      и согласен с <a href="https://docs.google.com/document/d/1Wr31zRe4-mdDyTh8ndn3O1cps0jkQe7aZkYbXTLRw10/" target="_blank">условиями</a> их предоставления</span>
                  </template>
                  <v-checkbox />
                </v-checkbox>
              </v-layout>
              <MainButton
                class="button businesscard-form__next balance__add"
                :disabled="!(oferta_agree && (+amount > 0))"
                :class="{ button_disabled: !(oferta_agree && (+amount > 0)) }"
                type="button"
                @click.native.prevent="add"
              >
                ПОПОЛНИТЬ
              </MainButton>
            </div>
            <div class="payment">
              <h2 class="payment__heading">
                История платежей
              </h2>
              <PaymentList :business-id="businessId" />
            </div>
          </div>
        </v-form>
      </div>
    </template>
  </PageLayout>
</template>

<script>
import BusinessSettings from '~/classes/business_settings'
import { mapActions, mapGetters } from 'vuex'
import PhoneEdit from '~/components/common/PhoneEdit.vue'
import MainButton from '~/components/common/MainButton.vue'
import AppTabs from '~/components/common/AppTabs.vue'
import PageLayout from '~/components/common/PageLayout.vue'
import { displayRESTDate, displayRESTTime } from '~/components/calendar/utils'
import AccountBalance from '~/components/billing/AccountBalance.vue'
import MessageList from '~/components/billing/MessageList.vue'
import PaymentList from '~/components/billing/PaymentList.vue'
import { uuidv4 } from '~/components/utils'

export default {
  components: { AccountBalance, AppTabs, PhoneEdit, MainButton, MessageList, PageLayout , PaymentList},
  data () {
    return {
      amount: '',
      activeTab: 0,
      businessSettings: new BusinessSettings(),
      oferta_agree: false
    }
  },
  computed: {
    ...mapGetters({ businessId: 'business/businessId'}),
    saveDisabled () {
      return this.settings.cancel_visit.enabled && (!this.settings.cancel_visit.phone || this.settings.cancel_visit.phone.length < 10)
        || this.settings.new_visit_manager.enabled && (!this.settings.new_visit_manager.phone || this.settings.new_visit_manager.phone.length < 10)
    },
    settings () {
      return this.businessSettings.settings.notifications.events
    }
  },
  watch: {
    businessId: 'load'
  },
  mounted () {
    this.load()
  },

  methods: {
    ...mapActions([
      'openMessageWindow'
    ]),
    add () {
      if (!this.businessId || !this.amount) {
        return
      }
      const paymentNo = uuidv4()
      const amount = this.amount
      const paymasterId = (window.location.hostname === process.env.VUE_APP_PROD_HOST_NAME) ? process.env.VUE_APP_PAYMASTER_ID : process.env.VUE_APP_DEV_PAYMASTER_ID
      const returnUrl = window.location.href
      const url = `https://paymaster.ru/payment/init?LMI_MERCHANT_ID=${paymasterId}&LMI_PAYMENT_AMOUNT=${amount}&LMI_CURRENCY=643&LMI_PAYMENT_NO=${paymentNo}&LMI_PAYMENT_DESC=UNO_SALON&BUSINESS_ID=${this.businessId}&LMI_SUCCESS_URL=${encodeURIComponent(returnUrl)}&LMI_FAIL_URL=${encodeURIComponent(returnUrl)}&LMI_FAIL_METHOD=GET`
      // console.log(url)
      window.location = url
    },
    load () {
      if (!this.businessId) return
      this.businessSettings.load(this.businessId)
    },
    getTime (ts) {
      return `${displayRESTDate(ts)} ${displayRESTTime(ts)}`
    },
    save () {
      this.businessSettings.save()
    },
    update (id) {
      console.log(id)
    },
    updateAll () {
      console.log('sdlfjsjdf')
    }
  }
}
</script>

<style lang="scss">
@import '~/assets/styles/common.scss';
@import '~/assets/styles/infocard.scss';
@import '~/assets/styles/businesscard-form.scss';

.settings {
  color: #07101C;
  &__content-heading {
    margin-top: 23px;
    margin-bottom: 12px;
    font-size: 16px;
    color: #07101C;
  }
  &__description {
    max-width: 445px;
    margin-top: 16px;
    margin-left: 28px;
    padding: 6px 0 6px 24px;
    border-left: 1px solid rgba(137, 149, 175, 0.1);
    color: #8995AF;
    font-size: 12px;
  }
  &__checkbox-block {
    margin: 9px 0;
  }
  &__update {
    text-align: center;
    cursor: pointer;

    &:after {
      display: inline-block;
      width: 16px;
      height: 16px;
      background: url('~assets/images/update.png') center/contain no-repeat;
      content: '';
      opacity: 0.5;
    }
  }
  &__status {
    white-space: nowrap;

    &:before {
      display: inline-block;
      vertical-align: sub;
      width: 16px;
      height: 16px;
      margin-right: 5px;
      content: '';
      background-size: contain;
      background-position: center;
      background-repeat: no-repeat;
    }

    &._waiting {
      color: #8995AF;
      &:before {
        background-image: url('~assets/images/svg/clock_opacity_1.svg');
      }
    }
    &._success {
      color: #5BCD5E;
      &:before {
        width: 19px;
        background-image: url('~assets/images/delivered.png');
      }
    }
    &._error {
      color: #EF4D37;
      &:before {
        background-image: url('~assets/images/error.png');
      }
      &:after {
        display: inline-block;
        vertical-align: middle;
        width: 14px;
        height: 14px;
        margin-left: 5px;
        content: '';
        background: url('~assets/images/svg/question.svg') center no-repeat;
      }
    }
  }
  .v-tabs__item {
    padding: 0 10px;
  }
  .tab-content {
    @media only screen and (min-width: $desktop) {
      padding-left: 127px;
    }
    &.log {
      position: relative;
      padding-left: 210px;
      padding-top: 36px;
      overflow-x: auto;
      background-color: rgba(137, 149, 175, 0.1);
    }
    .infocard {
      @media only screen and (min-width : $tablet) {
        width: 724px;
      }
      @media only screen and (min-width : $desktop) {
        width: 960px;
      }
      .infocard__content {
        @media only screen and (min-width: $desktop) {
          padding-left: 132px;
        }
      }
    }
  }
  .phone-input {
    .v-text-field__slot {
      position: relative;
      padding-left: 56px;
      background: url('~assets/images/svg/ru.svg') 20px 8px no-repeat;
      &:after {
        position: absolute;
        left: 41px;
        top: 12px;
        width: 0;
        height: 0;
        border-style: solid;
        border-width: 5px 5px 0 5px;
        border-color: #8995af transparent transparent transparent;
        content: '';
      }
    }
  }
  .amount-input  {
      position: relative;
      padding-left: 30px;
    }
  
  .phone-edit {
    margin-top: 25px;
    margin-left: 30px;
  }
  .businesscard-form__field._phone {
    margin-top: 0;
  }

  .sms {
    * {
      color: #07101C;
      font-size: 14px;
    }
    &__event-name {
      position: absolute;
      left: 0;
      width: 210px;
      height: 88px;
      font-weight: 900;
    }
    &__receiver-phone {
      font-weight: 900;
    }
    &__receiver-operator {
      margin-top: 5px;
      color: #8995AF;
    }
    &__length {
      margin-top: 5px;
      font-size: 12px;
      color: #8995AF;
    }
    &__time {
      margin-top: 5px;
      font-size: 12px;
      color: #8995AF;
    }
    thead tr:first-child th:first-child {
      position: absolute;
      left: 0;
      width: 210px;
      height: 40px;
      display: flex;
      align-items: center;

      background-color: #d6dae3;


    }
  }

  thead {
    background-color: #d6dae3;
    tr:first-child {
      height: 40px;
      border-bottom: none !important;
      th {
        color: #8995AF !important;
        font-size: 12px !important;
        &:first-child {
          padding-left: 35px;
          @media only screen and (min-width: $desktop) {
            padding-left: 56px !important;
          }
        }
        &.sortable i {
          color: #8995AF !important;
          vertical-align: top;
        }
        &.settings__update:after {
          margin-left: 5px;
          opacity: 1;
        }
      }
    }
  }
  tbody {
    tr {
      height: 88px;
      border-bottom: 1px solid #f3f4f7 !important;
      &:hover {
        background-color: #fff !important;
      }
      &:first-child {
        .sms__event-name {
          height: 89px;
        }
        @-moz-document url-prefix() {
          .sms__event-name {
            height: 88px;
          }
        }
      }
    }
    td {
      /*padding: 18px 24px !important;*/
      &:first-child {
        padding: 18px 10px 18px 35px !important;
        background-color: #fff;
        border-bottom: 1px solid #f3f4f7;
        @media only screen and (min-width: $desktop) {
          padding-left: 56px !important;
        }
      }
    }

  }

  .balance {
    &__level {
      font-weight: 500;
      font-size: 18px;
      @media only screen and (min-width: $tablet) {
        max-width: 50%;
      }
      span {
        font: normal 24px $roboto;
        @media only screen and (min-width: $tablet) {
          margin-left: 24px;
        }
      }
    }
    &__update {
      @extend %button-bordered;
      width: auto;
      padding: 0 24px;
      @media only screen and (min-width: $tablet) {
        width: 160px;
      }
      &:hover:after {
        background: url('~assets/images/update_black.png') center/contain no-repeat;
        opacity: 1;
      }
      &:after {
        float: left;
        @media only screen and (min-width: $tablet) {
          margin: 0 8px;
        }
      }
      span {
        display: none;
        @media only screen and (min-width: $tablet) {
          display: inline;
        }
      }
    }
    &__add {
      margin-left: 0;
    }
  }
  .payment {
    margin-top: 86px;
    &__heading {
      margin-bottom: 35px;
      font-size: 24px;
      color: #07101C;
    }
    .settings__status:after {
      display: none;
    }
  }

  .help-link {
    display: block;
  }
  .v-input--switch {
    .v-messages {
      display: none;
    }
    &__track {
      width: 32px;
      height: 16px;
      top: calc(50% - 8px);
      left: 0;
      background-color:  rgba(137, 149, 175, 0.5) !important;
      border-radius: 12px;
    }
    &__thumb {
      width: 14px;
      height: 14px;
      top: calc(50% - 8px);
      margin: 1px;
      box-shadow: none;
    }
  }
  .v-input--is-label-active {
    .v-input--switch__track {
      background-color: #5699FF !important;
    }
    .v-input--switch__thumb {
      color: #fff !important;
    }
  }
  .v-label {
    font-size: 14px;
    color: #07101C;
  }
}
</style>
