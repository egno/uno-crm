<template>
  <v-dialog
    :value="value"
    content-class="right-attached-panel _client-visits"
    transition="slide"
    @input="$emit('close')"
  >
    <button
      type="button"
      class="right-attached-panel__close"
      @click="$emit('close')"
    />
    <div class="right-attached-panel__header">
      История записей
    </div>
    <div class="right-attached-panel__subheader">
      {{ client.fullName }}
    </div>
    <div class="scrollable">
      <div v-for="visit in visits" :key="visit.id">
        <!--todo сортировка по ts_begin -->
        <VisitTimeLineRow :visit="visit" />
      </div>
    </div>
  </v-dialog>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import Visit from '~/classes/visit'
import { newClient } from '~/components/client/utils'
import VisitTimeLineRow from '~/components/client/VisitTimeLineRow.vue'
import Api from '~/api/backend'
import { makeAlert } from '~/api/utils'

export default {
  components: { VisitTimeLineRow },
  model: {
    prop: 'value',
    event: 'close'
  },
  props: {
    client: {
      type: Object,
      default () {
        return newClient()
      }
    },
    value: {
      type: Boolean,
      default: false,
      required: true
    }
  },
  data () {
    return {
      visits: [],
      active: 0
    }
  },
  computed: {
    ...mapGetters({ businessId: 'business/businessId' }),
    clientId () {
      return this.client && this.client.id
    }
  },
  watch: {
    clientId: 'load',
    businessId: 'load'
  },
  mounted () {
    this.load()
  },
  methods: {
    ...mapActions({ alert: 'alerts/alert' }),
    load () {
      if (!this.clientId || this.clientId === 'new') { return }
      if (!this.businessId) { return }

      Api()
        .get(
          `visit?and=(client_id.eq.${this.clientId},salon_id.eq.${this.businessId})&order=ts_begin.desc`
        )
        .then(res => res.data)
        .then((res) => {
          const compare = (a, b) => {
            if (a.date > b.date) {
              return -1
            } else if (a.date === b.date) {
              return a.time < b.time ? -1 : 1
            } else {
              return 1
            }
          }
          this.visits = res.map(x => new Visit(x))
          this.visits.sort(compare)
        })
        .catch((res) => {
          this.alert(makeAlert(res))
        })
    },
    onDelete () {
      this.$emit('onDelete', this.client)
    },
    onSave () {
      this.$emit('onSave', this.client)
    }
  }
}
</script>

<style lang="scss">
@import '~/assets/styles/right-attached-panel.scss';

.right-attached-panel._client-visits {
  .right-attached-panel__header {
    margin: 53px 0 0;
  }
  .scrollable {
    height: calc(100% - 128px);
    overflow: auto;
  }
}
</style>
