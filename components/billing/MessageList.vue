<template>
  <div>
    <v-layout row px-2>
      <v-spacer />
      <button class="balance__update settings__update" type="button" @click="getData()">
        <span>Обновить</span>
      </button>
    </v-layout>
    <v-data-table
      :headers="smsHeaders"
      :items="smsItems"
      :loading="smsIsLoading"
      :pagination.sync="smsPagination"
      :total-items="smsTotalItems"
      class="elevation-0 sms"
      sort-icon="mdi-menu-down"
      hide-actions
      must-sort
    >
      <template slot="items" slot-scope="props">
        <td class="sms__event-name">
          {{ displayRESTDate(props.item.ts) }} {{ displayRESTTime(props.item.ts) }}
        </td>
        <td class="sms__receiver">
          <div class="sms__receiver-phone">
            {{ props.item.phone | phoneFormat }}
          </div>
          <div class="sms__receiver-operator">
            {{ props.item.operator }}
          </div>
        </td>
        <td class="sms__total">
          <div class="sms__total-price">
            {{ props.item.amount }} руб.
          </div>
          <div v-if="props.item.parts" class="sms__length">
            {{ props.item.parts }} SMS
          </div>
        </td>
        <td>
          <div>ID {{ props.item.sms_id }}</div>
        </td>
        <td>
          <v-tooltip v-if="props.item.lastStatus.code === 'not_delivered'" top>
            <template v-slot:activator="{ on }">
              <div class="settings__status _error" v-on="on">
                Не доставлено
              </div>
              <div class="sms__time">
                {{ displayRESTTime(props.item.lastStatus.ts) }}
              </div>
            </template>
            <span>{{ statusText(props.item.status) }}</span>
          </v-tooltip>
          <template v-else>
            <div
              :class="['settings__status', { _waiting: props.item.lastStatus.code === 'SMSReserveSum', _success: props.item.lastStatus.code === 'SMSDelivered' }]"
            >
              {{ statusText(props.item.lastStatus.code) }}
            </div>
            <div class="sms__time">
              {{ displayRESTDate(props.item.lastStatus.ts) }} {{ displayRESTTime(props.item.lastStatus.ts) }}
            </div>
          </template>
        </td>
        <td>
          <div>  {{ props.item.message }}</div>
        </td>
      </template>
    </v-data-table>
    <div class="text-xs-right">
      <v-pagination
        v-model="smsPagination.page"
        :length="smsPages"
        :total-visible="smsPagination.rowsPerPage"
        circle
        color="rgba(137, 149, 175, 0.35)"
      />
    </div>
  </div>
</template>


<script>
import BillingApi from '~/api/billing'
import { displayRESTTime, displayRESTDate } from '~/components/calendar/utils'

export default {
  props: {
    businessId: { type: String, default: '' }
  },
  data () {
    return {
      smsHeaders: [
        { text: 'Время отправки', value: 'ts' , sortable: false},
        { text: 'Телефон получателя', value: 'phone' , sortable: false},
        { text: 'Стоимость', value: 'amount' , sortable: false},
        { text: 'Идентификатор', value: 'sms_id', sortable: false},
        { text: 'Статус сообщения', value: 'statuses->0->>code', sortable: false },
        { text: 'Событие', value: 'message', sortable: false}
      ],
      smsItems: [
      ],
      smsIsLoading: false,
      smsPagination: { rowsPerPage: 10 },
      smsTotalItems: 0,
      statuses: {
          'SMSDelivered': 'Доставлено',
          'SMSReserveSum': 'Отправляется'
      }
    }
  },
  computed: {
    page () {
        return this.smsPagination.page || 1
    },
    smsPages () {
      if (!this.smsPagination.rowsPerPage || !this.smsTotalItems)
        return 0

      return Math.ceil(
        this.smsTotalItems / this.smsPagination.rowsPerPage
      )
    }
  },
  watch: {
    businessId: 'getData',
    page: 'getData'
  },
  mounted () {
    this.$nextTick(function () {
      this.getData()
    })
    const updateElement = this.$el.querySelector('.sms th.settings__update')

    if (updateElement) {
      updateElement.addEventListener('click', this.getData)
    }
  },
  beforeDestroy () {
    const updateElement = this.$el.querySelector('.sms th.settings__update')

    if (updateElement) {
      updateElement.removeEventListener('click', this.updateAll)
    }
  },
  methods: {
        displayRESTDate (ts) {
          return displayRESTDate(ts)
      },
      displayRESTTime (ts) {
          return displayRESTTime(ts)
      },    
      getData () {
       this.smsItems=[]
      if (!this.businessId) {
        return
      }
      BillingApi().get(`sms_list/${this.businessId}?order=ts.desc&limit=${this.smsPagination.rowsPerPage}&offset=${(this.page - 1) * this.smsPagination.rowsPerPage}`)
      .then(res => {
          if (res && res.data) {
              this.smsItems = res.data.map(i => {
                i.lastStatus = i.statuses.find(s => s.seq===1)
                return i
              })
              if (res.headers && res.headers['content-range']) {
                const r = res.headers['content-range'].match(/^\d*-\d*\/(\d*)$/)
                if (r) {
                this.smsTotalItems = +r[1]
                }
            }
          }
      })
    },
    statusText (status) {
        return this.statuses[status] || status
    }
  }
}
</script>

