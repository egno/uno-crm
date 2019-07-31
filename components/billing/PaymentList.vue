<template>
  <div>
    <v-data-table
      :headers="paymentHeaders"
      :items="paymentItems"
      :loading="paymentIsLoading"
      :pagination.sync="paymentPagination"
      :total-items="paymentTotalItems"
      class="elevation-0"
      sort-icon="mdi-menu-down"
      hide-actions
      must-sort
    >
      <template slot="items" slot-scope="props">
        <td class="payment__date">
          <div>{{ displayRESTDate(props.item.ts) }}</div>
          <div class="grey--text">
            {{ displayRESTTime(props.item.ts) }}
          </div>
        </td>
        <td class="payment__event">
          Платёж <span class="grey--text">№ {{ props.item.id }}</span>
        </td>
        <td class="payment__total">
          + {{ props.item.amount }} руб.
        </td>
        <td :class="['settings__status', { [`_${props.item.status}`]: true }]">
          <span>{{ statusText(props.item.status) }}</span>
          <button
            v-if="props.item.status === 'error'"
            type="button"
            class="blue-link help-link"
            @click="openMessageWindow"
          >
            Сообщить о проблеме
          </button>
        </td>
      </template>
    </v-data-table>
    <div class="text-xs-right">
      <v-pagination
        v-model="paymentPagination.page"
        :length="paymentPages"
        :total-visible="paymentPagination.rowsPerPage"
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
      paymentHeaders: [
        { text: 'Дата', value: 'ts', sortable: false },
        { text: 'Платежи', value: 'id', sortable: false },
        { text: 'Сумма', value: 'amount', sortable: false },
        { text: 'Статус', value: 'status', sortable: false }
      ],
      paymentItems: [],
      paymentIsLoading: false,
      paymentPagination: { rowsPerPage: 10 },
      paymentTotalItems: 0,
      statuses: {
        success: 'Платёж проведён'
      }
    }
  },
  computed: {
    page () {
      return this.paymentPagination.page || 1
    },
    paymentPages () {
      if (!this.paymentPagination.rowsPerPage || !this.paymentTotalItems) { return 0 }

      return Math.ceil(
        this.paymentTotalItems / this.paymentPagination.rowsPerPage
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
  },
  methods: {
    displayRESTDate (ts) {
      return displayRESTDate(ts)
    },
    displayRESTTime (ts) {
      return displayRESTTime(ts)
    },
    getData () {
      this.paymentItems = []
      if (!this.businessId) {
        return
      }
      BillingApi()
        .get(
          `business_payments/${this.businessId}?order=ts.desc&limit=${
            this.paymentPagination.rowsPerPage
          }&offset=${(this.page - 1) * this.paymentPagination.rowsPerPage}`
        )
        .then((res) => {
          if (res && res.data) {
            this.paymentItems = res.data
            if (res.headers && res.headers['content-range']) {
              const r = res.headers['content-range'].match(/^\d*-\d*\/(\d*)$/)
              if (r) {
                this.paymentTotalItems = +r[1]
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
