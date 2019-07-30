<template>
  <VLayout>
    <VFlex>
      <VContainer pa-2>
        <VLayout column>
          <VFlex
            v-for="(week,i) in dates"
            :key="i"
            ma-0
          >
            <VLayout
              justify-space-between
              row
            >
              <VFlex
                v-for="(day, di) in week"
                :key="di"
              >
                <VBadge overlap>
                  <span
                    v-if="visitCount(day.dateKey)"
                    slot="badge"
                  >
                    {{ visitCount(day.dateKey) }}
                  </span>
                  <VBtn
                    fab
                    small
                    block
                    depressed
                    flat
                    :color="day.outOfRange ? 'grey': ''"
                    :outline="day.today"
                  >
                    {{ day.display }}
                  </VBtn>
                </VBadge>
              </VFlex>
            </VLayout>
          </VFlex>
        </VLayout>
      </VContainer>
    </VFlex>
  </VLayout>
</template>

<script>
import { periodDates } from '~/components/calendar/utils'
import Api from '~/api/backend'

export default {
  props: {
    date: { type: String, default: '' },
    format: { type: String, default: 'YYYY-MM-DD' }
  },
  data () {
    return {
      visits: []
    }
  },
  computed: {
    dates () {
      return periodDates(2019, 0)
    }
  },
  mounted () {
    this.fetchData()
  },
  methods: {
    fetchData () {
      Api()
        .get('visit')
        .then(res => res.data)
        .then(res => {
          this.visits = res
        })
    },
    visitCount (dt) {
      return this.visits.filter(v => v.ts_begin.slice(0, 10) === dt).length
    }
  }
}
</script>


