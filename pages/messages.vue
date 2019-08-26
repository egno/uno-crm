<template>
  <v-data-table
    :headers="headers"
    :items="data"
    item-key="id"
    :loading="progressQuery"
    :pagination.sync="pagination"
    :rows-per-page-items="[5, 10, 25]"
    rows-per-page-text="Записей на страницу:"
    class="elevation-1"
  >
    <VProgressLinear slot="progress" color="blue" indeterminate />
    <template slot="items" slot-scope="props">
      <tr @click="props.expanded = !props.expanded">
        <td>{{ formatDate(props.item.ts) }}</td>
        <td>
          <div>{{ props.item.j.from.contact }}</div>
        </td>
        <td>
          <v-card color="rgba(255, 255, 255, 0)" flat max-width="20em">
            <v-card-text class="text-truncate">
              {{ props.item.j.message }}
            </v-card-text>
          </v-card>
        </td>
      </tr>
    </template>
    <template slot="expand" slot-scope="props">
      <v-card>
        <v-card-text>
          <VLayout column>
            <VFlex>
              <span>Логин:</span>
              {{ props.item.j.from.user.login }}
              /
              {{ props.item.j.from.user.role }}
            </VFlex>
            <VFlex>{{ props.item.j.message }}</VFlex>
          </VLayout>
        </v-card-text>
      </v-card>
    </template>
  </v-data-table>
</template>

<script>
import { mapActions } from 'vuex'
import Api from '~/api/backend'
import { formatDate, formatTime, valueDate } from '~/components/calendar/utils'

export default {
  data () {
    return {
      headers: [
        { text: 'Время', value: 'ts' },
        { text: 'От', value: 'j->from->>contact' },
        { text: 'Текст', value: 'j->>message', sortable: false },
      ],
      data: [],
      pagination: { rowsPerPage: 10 },
      progressQuery: false,
    }
  },
  computed: {
    querySearchString () {
      if (!this.searchString) {
        return null
      }
      return `or=(j->>email.ilike.*${this.searchString}*,j->>name.ilike.*${this.searchString}*,j->>inn.ilike.${this.searchString}*,j->>address.ilike.*${this.searchString}*)`
    },
  },
  watch: {
    pagination: {
      handler () {
        this.fetchData()
      },
      deep: true,
    },
    table: 'fetchData',
    searchString: 'fetchData',
  },
  mounted () {
    this.fetchData()
    this.setActions()
  },
  methods: {
    ...mapActions({ setActions: 'common/setActions' }),
    fetchData () {
      this.progressQuery = true
      this.data = []
      const {
        sortBy, descending, page, rowsPerPage,
      } = this.pagination
      const params = [ this.querySearchString ]
      if (sortBy && sortBy.length) {
        params.push(
          `order=${sortBy}${descending ? '.desc.nullsfirst' : '.asc.nullslast'}`
        )
      }
      if (rowsPerPage > -1) {
        params.push(`limit=${rowsPerPage}`)
      }
      if (page > 1) {
        params.push(`offset=${(page - 1) * rowsPerPage}`)
      }
      Api()
        .get(`message?${params.filter(x => !!x).join('&')}`)
        .then((res) => {
          if (res.headers && res.headers['content-range']) {
            const r = res.headers['content-range'].match(/^\d*-\d*\/(\d*)$/)
            if (r) {
              this.totalItems = +r[1]
            }
          }
          return res.data
        })
        .then((res) => {
          this.data = res
          this.progressQuery = false
        })
        .catch(() => {
          this.progressQuery = false
        })
    },
    formatDate (dt) {
      if (!dt) { return }
      const d = new Date(valueDate(dt))
      return `${formatDate(d)} ${formatTime(d)}`
    },
  },
}
</script>
