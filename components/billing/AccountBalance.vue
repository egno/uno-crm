<template>
  <v-layout align-center>
    <v-flex class="balance__level">
      Остаток на счете:
      <span v-if="businessId">{{ balance }}&nbsp;руб.</span>
    </v-flex>
    <button
      class="balance__update settings__update"
      type="button"
      @click="getBalance()"
    >
      <span>Обновить</span>
    </button>
  </v-layout>
</template>

<script>
import BillingApi from '~/api/billing'

export default {
  props: {
    businessId: { type: String, default: '' }
  },
  data () {
    return {
      balance: 0.0
    }
  },
  watch: {
    businessId: 'getBalance'
  },
  mounted () {
    this.$nextTick(function () {
      this.getBalance()
    })
  },
  methods: {
    getBalance () {
      this.request = true
      this.balance = '-'
      if (!this.businessId) {
        return
      }
      BillingApi()
        .get(`business_balance/${this.businessId}?account=eq.business`)
        .then((res) => {
          if (res.data && res.data[0] && res.data[0].balance) {
            this.balance = res.data[0].balance
            this.request = false
          } else {
            this.balance = 0
          }
        })
        .catch((err) => {
          console.log(err)
          this.request = false
        })
    }
  }
}
</script>
