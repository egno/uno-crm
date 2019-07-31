<template>
  <div>
    <v-toolbar flat color="white">
      <v-toolbar-title>Менеджеры CRM</v-toolbar-title>
      <v-spacer />
      <v-btn color="primary" ripple @click="add">
        Создать менеджера
      </v-btn>
    </v-toolbar>
    <v-data-table
      :headers="headers"
      :items="managers"
      :loading="progressQuery"
      :pagination.sync="pagination"
      :rows-per-page-items="[5, 10, 25]"
      rows-per-page-text="Записей на страницу:"
      :total-items="totalItems"
      class="elevation-1"
    >
      <VProgressLinear slot="progress" color="blue" indeterminate />
      <template slot="items" slot-scope="props">
        <td>
          <v-btn small fab @click="edit(props.item)">
            <v-icon>edit</v-icon>
          </v-btn>
          <span>{{ props.item.j && props.item.j.name }}</span>
        </td>
        <td>
          {{ props.item.j && props.item.j.surname }}
        </td>
        <td>
          {{ props.item.email }}
        </td>
        <td>
          {{ props.item.phone }}
        </td>
      </template>
    </v-data-table>
    <v-dialog v-model="dialog" width="500">
      <ManagerEdit
        :manager="manager"
        @cancel="dialog = false"
        @save="managerSave"
      />
    </v-dialog>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import Api from '~/api/backend'
import ManagerEdit from '~/components/ManagerEdit'
import { makeAlert } from '~/api/utils'

export default {
  components: { ManagerEdit },
  data () {
    return {
      headers: [
        { text: 'Имя', value: 'j->>name' },
        { text: 'Фамилия', value: 'j->>surname' },
        { text: 'E-mail', value: 'email' },
        { text: 'Телефон', value: 'phone' }
      ],
      manager: undefined,
      managers: [],
      progressQuery: false,
      pagination: { rowsPerPage: 10 },
      totalItems: 0,
      dialog: false,
      table: 'managers'
    }
  },
  computed: {
    ...mapGetters({
      loggedIn: 'user/loggedIn',
      searchString: 'common/searchString',
      userRole: 'user/userRole'
    }),
    querySearchString () {
      if (!this.searchString) {
        return null
      }
      return `or=(j->>email.ilike.*${this.searchString}*,j->>name.ilike.*${this.searchString}*,j->>name.ilike.${this.searchString}*,j->>surname.ilike.${this.searchString}*)`
    }
  },
  watch: {
    pagination: {
      handler () {
        this.fetchData()
      },
      deep: true
    },
    table: 'fetchData',
    searchString: 'fetchData',
    userRole: 'fetchData'
  },
  methods: {
    ...mapActions({ alert: 'alerts/alert' }),
    add () {
      this.manager = undefined
      this.dialog = true
    },
    edit (item) {
      this.manager = item
      this.dialog = true
    },
    fetchData () {
      if (!this.loggedIn) { return }
      if (this.userRole !== 'admin') { return }

      this.progressQuery = true
      this.managers = []
      const { sortBy, descending, page, rowsPerPage } = this.pagination
      const params = [this.querySearchString]
      if (sortBy) {
        params.push(
          `order=${sortBy}${descending ? '.desc.nullslast' : '.asc.nullsfirst'}`
        )
      }
      if (rowsPerPage > -1) {
        params.push(`limit=${rowsPerPage}`)
      }
      if (page > 1) {
        params.push(`offset=${(page - 1) * rowsPerPage}`)
      }
      Api()
        .get(`${this.table}?${params.filter(x => !!x).join('&')}`)
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
          this.managers = res
          this.progressQuery = false
        })
        .catch(() => {
          this.progressQuery = false
        })
    },
    managerSave (item) {
      this.progressQuery = true
      this.manager = item
      if (item.id) {
        Api()
          .patch(`${this.table}?id=eq.${item.id}`, item)
          .then(() => {
            this.progressQuery = false
            this.dialog = false
            this.fetchData()
          })
          .catch((err) => {
            this.progressQuery = false
            this.alert(makeAlert(err))
          })
      } else {
        Api()
          .post(`${this.table}`, item)
          .then(() => {
            this.progressQuery = false
            this.dialog = false
            this.fetchData()
          })
          .catch((err) => {
            this.progressQuery = false
            this.alert(makeAlert(err))
          })
      }
    }
  }
}
</script>
