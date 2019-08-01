<template>
  <div @click="edit = undefined">
    <VDataTable
      :headers="headers"
      :items="data"
      :loading="progressQuery"
      :options.sync="pagination"
      :rows-per-page-items="[5, 10, 25]"
      rows-per-page-text="Записей на страницу:"
      :server-items-length="totalItems"
      class="elevation-1"
    >
      <VProgressLinear slot="progress" color="blue" indeterminate />
      <template slot="items" slot-scope="props">
        <td>
          <VLayout row align-center fill-height justify-start>
            <v-btn
              fab
              flat
              right
              small
              :outlined="props.item.access"
              color="green"
              :to="{ name: 'id-businessCard', params: { id: props.item.id } }"
              target="_blank"
            >
              <Avatar
                class="ma-1"
                :name="
                  (props.item.j && props.item.j.name) || props.item.j.email
                "
                size="2.4em"
                :src="props.item.j.avatar"
              />
            </v-btn>
            <VFlex align-self-center justify-start>
              <span class="text-truncate column-truncated">
                {{ (props.item.j && props.item.j.name) || '-' }}
              </span>
            </VFlex>
          </VLayout>
          <a
            :to="{ name: 'id-businessCard', params: { id: props.item.id } }"
            target="_blank"
          />
        </td>
        <td>{{ props.item.j.category }}</td>
        <td>{{ props.item.j.inn }}</td>
        <td>
          {{
            props.item.j && props.item.j.address && props.item.j.address.name
          }}
          <div
            v-if="props.item.j.filials"
            class="caption text-no-wrap grey--text text--darken-1"
          >
            <RouterLink
              :to="{ name: 'id-filials', params: { id: props.item.id } }"
            >
              Филиалов: {{ props.item.j.filials }}
            </RouterLink>
          </div>
        </td>
        <td>
          <VLayout v-if="props.item.user" column>
            <VFlex>
              <span>{{ props.item.user.name }} {{ props.item.user.surname }}</span>
            </VFlex>
            <VFlex><PhoneView :phone="props.item.user.phone" /></VFlex>
          </VLayout>
        </td>
        <td @click.stop="edit = allowChangeManager ? props.item : undefined">
          <span v-if="allowChangeManager && edit === props.item">
            <v-select
              v-model="props.item.j.manager"
              :items="managers"
              item-text="email"
              return-object
              clearable
              @change="itemSave(props.item)"
            /></span>
          <span v-else>
            <span
              v-if="
                props.item.j &&
                  props.item.j.manager &&
                  props.item.j.manager.email
              "
            >{{
              props.item.j &&
                props.item.j.manager &&
                props.item.j.manager.email
            }}</span>
            <span v-else class="red--text">менеджер не назначен</span>
          </span>
        </td>
        <td v-if="$route.name == 'myBusinessList'">
          <span v-if="props.item.last_login">{{
            props.item.last_login | date
          }}</span>
        </td>
        <td v-if="$route.name == 'myBusinessList'">
          -
        </td>
      </template>
      <template slot="pageText" slot-scope="props">
        {{ props.pageStart }}-{{ props.pageStop }} из {{ props.itemsLength }}
      </template>
    </VDataTable>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import Api from '~/api/backend'
import Avatar from '~/components/avatar/Avatar.vue'
import PhoneView from '~/components/common/PhoneView.vue'
import { makeAlert } from '~/api/utils'
import { displayRESTDate } from '~/components/calendar/utils'

export default {
  components: { Avatar, PhoneView },
  filters: {
    date (val) {
      return val ? displayRESTDate(val) : ''
    }
  },
  data () {
    return {
      formActions: [
        {
          label: 'Добавить',
          href: '/new/businessCard',
          target: '_blank',
          default: true
        }
      ],
      data: [],
      pagination: { rowsPerPage: 10 },
      progressQuery: false,
      totalItems: 0,
      managers: [],
      edit: undefined
    }
  },
  computed: {
    ...mapGetters({
      loggedIn: 'user/loggedIn',
      searchString: 'common/searchString',
      userRole: 'user/userRole'
    }),
    allowChangeManager () {
      return this.managers && this.managers.length && this.userRole === 'admin'
    },
    headers () {
      const headers = [
        { text: 'Название', value: 'j->>name' },
        { text: 'Тип', value: 'j->>category' },
        { text: 'ИНН', value: 'j->>inn' },
        { text: 'Адрес', value: 'j->>address' },
        { text: 'Телефон', value: '', sortable: false },
        { text: 'Менеджер', value: 'j->manager->>email' }
      ]
      if (this.$route.name === 'myBusinessList') {
        headers.push({ text: 'Последний вход', value: 'last_login' })
        headers.push({ text: 'Статус', value: '' })
      }
      return headers
    },
    table () {
      return this.$route.name === 'businessList' ? 'business' : 'my_business'
    },
    querySearchString () {
      if (!this.searchString) {
        return null
      }
      return `or=(j->>email.ilike.*${this.searchString}*,j->>name.ilike.*${this.searchString}*,j->>inn.ilike.${this.searchString}*,j->>address.ilike.*${this.searchString}*)`
    }
  },
  watch: {
    pagination: {
      handler () {
        this.fetchData()
      },
      deep: true
    },
    table: 'changeTable',
    searchString: 'fetchData',
    userRole: 'loadManagers'
  },
  mounted () {
    this.loadManagers()
    this.fetchData()
    this.setActions(this.formActions)
  },
  destroyed () {
    this.setActions([])
  },
  methods: {
    ...mapActions({ alert: 'alerts/alert', setActions: 'common/setActions' }),
    changeTable () {
      this.pagination.sortBy = undefined
      this.fetchData()
    },
    editItem (item) {
      this.$router.push({ name: 'id-businessCard', params: { id: item.id } })
    },
    fetchData () {
      this.progressQuery = true
      this.data = []
      const { sortBy, descending, page, rowsPerPage } = this.pagination
      const params = [this.querySearchString]
      params.push('parent=is.null')
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
      if (this.$route.name === 'myBusinessList') {
        params.push(`manager_id=not.is.null`)
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
          this.data = res
            .filter(x => x.j)
            .map((x) => {
              x.user = this.user(x)
              return x
            })
          this.progressQuery = false
        })
        .catch(() => {
          this.progressQuery = false
        })
    },
    itemSave (item) {
      this.edit = undefined
      const data = {
        j: item.j
      }
      Api()
        .patch(`business?id=eq.${item.id}`, data)
        .then(() => {
          this.alert(makeAlert('Сохранено'))
        })
        .catch((err) => {
          this.alert(makeAlert(err))
        })
    },
    user (business) {
      const users = this.users(business)
      return users && users[0]
    },
    users (business) {
      return (
        business &&
        business.users &&
        business.users.length &&
        business.users.sort(x => (x.id === business.id ? -1 : 1))
      )
    },
    loadManagers () {
      if (this.userRole !== 'admin') { return }
      Api()
        .get('managers')
        .then((res) => {
          this.managers = res.data.map((x) => {
            return { id: x.id, email: x.email }
          })
        })
    }
  }
}
</script>

<style>
.column-truncated {
  max-width: 20em;
}
</style>
