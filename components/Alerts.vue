<template>
  <div>
    <v-snackbar v-if="alert" :value="alert" multi-line bottom right>
      {{ alert.message }}
    </v-snackbar>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
export default {
  data () {
    return {}
  },
  computed: {
    ...mapGetters({ alerts: 'alerts/alerts' }),
    alert () {
      return this.alerts && this.alerts.slice(-1)[0]
    }
  },
  methods: {
    ...mapActions({ delAlert: 'alerts/delAlert' }),
    onClose () {
      this.delAlert()
    }
  }
}
</script>
