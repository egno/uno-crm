<template>
  <PageLayout
    :is-button-visible="isEditorUser"
    :template="{
      headerText: 'Клиенты',
      buttonText: 'Добавить клиента'
    }"
    @add="
      $router.push({
        name: 'businessCardClient',
        params: { id: businessId, client: 'new' }
      })
    "
  >
    <template slot="content">
      <div class="clients">
        <v-data-table
          :headers="headers"
          :items="items"
          :loading="progressQuery"
          :options.sync="pagination"
          :server-items-length="totalItems"
          class="elevation-0"
          header-props.sort-icon="mdi-menu-down"
          hide-default-footer
        >
          <template slot="items" slot-scope="props">
            <td>
              <v-layout
                align-center
                justify-space-between
                row
                fill-height
                class="clients__first-cell"
              >
                <v-layout
                  align-center
                  row
                  fill-height
                  class="clients__badge"
                  @click="clientEdit(props.item)"
                >
                  <div class="clients__avatar">
                    <Avatar
                      class="ma-1"
                      :name="props.item.name.fullName || props.item.email"
                      size="24px"
                      :src="props.item.j.avatar"
                    />
                  </div>
                  <div class="clients__name-phone">
                    <div class="clients__name">
                      {{ props.item.name.fullName }}
                    </div>
                    <div
                      v-if="props.item.phone"
                      class="clients__add-info _phone"
                    >
                      {{ props.item.phone | phoneFormat }}
                    </div>
                    <div v-else class="clients__add-info _phone">
                      {{ props.item.phones[0] | phoneFormat }}
                    </div>
                  </div>
                </v-layout>
                <div>
                  <a
                    :href="`tel:+${props.item.phone}`"
                    class="clients__phone-button"
                  />
                </div>
              </v-layout>
            </td>
            <td>
              <div v-if="props.item.visit.visits.total">
                <span class="clients__visit-total">{{
                  props.item.visit.visits.total
                }}</span>
                <span
                  v-if="props.item.visit.visits.unvisited"
                  class="clients__visit-unvisited"
                >
                  {{ props.item.visit.visits.unvisited }}
                </span>
              </div>
            </td>
            <td>
              <v-layout
                v-if="props.item.lastVisit.ts_begin"
                column
                class="hidden-button"
                @click="clientVisits(props.item)"
              >
                <v-flex>
                  <span>{{ props.item.lastVisit.date }}</span>
                  <span> — </span>
                  <span>{{ props.item.lastVisit.displayStatus }}</span>
                </v-flex>
                <v-flex>
                  <span class="second-row">{{
                    props.item.lastVisit.timeInterval
                  }}</span>
                </v-flex>
              </v-layout>
            </td>
            <td>
              <span
                v-if="props.item.visit.visits.check"
              >{{ props.item.visit.visits.check | numberFormat }} рублей</span>
            </td>
            <td>
              <v-layout row align-center fill-height justify-start>
                <DeleteButton
                  :is-dark="true"
                  @click.native.stop="onDelete(props.item)"
                />
              </v-layout>
            </td>
          </template>
        </v-data-table>
        <div class="text-xs-right">
          <v-pagination
            v-model="pagination.page"
            :length="pages"
            :total-visible="6"
            circle
            color="rgba(137, 149, 175, 0.35)"
          />
        </div>
        <ClientCardEdit
          v-if="edit"
          :visible="edit"
          :client="item"
          :filial="businessId"
          :company-id="businessInfo.parent ? businessInfo.parent : businessId"
          :create="!item.id"
          @onDelete="onDelete(item)"
          @onSave="onSave"
          @close="
            edit = false
            item = {}
          "
        />
        <ClientVisits
          :value="visitsPanel"
          :client="item"
          @close="visitsPanel = false"
        />
        <Modal
          :visible="deleteConfirm"
          :template="{
            leftButton: 'ОТМЕНА',
            rightButton: 'УДАЛИТЬ'
          }"
          @rightButtonClick="deleteItem"
          @leftButtonClick="
            deleteConfirm = false
            item = {}
          "
          @close="
            deleteConfirm = false
            item = {}
          "
        >
          <template slot="text">
            <div v-if="item.fullName" class="uno-modal__text">
              Удалить клиента
              <span class="font-weight-bold">{{ item.fullName }}</span>? Все данные клиента будут удалены.
            </div>
            <div v-else class="uno-modal__text">
              Удалить клиента? Все данные клиента будут удалены.
            </div>
          </template>
        </Modal>
      </div>
      <v-tooltip
        bottom
        :value="tooltip"
        attach=".clients__question"
        content-class="clients__tooltip"
      >
        Для просмотра всей истории посещений кликните по статусу клиента
      </v-tooltip>
    </template>
  </PageLayout>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { debounce } from 'lodash'
import { filials } from '~/components/business/mixins'
import Api from '~/api/backend'
import Avatar from '~/components/avatar/Avatar.vue'
import ClientCardEdit from '~/components/client/ClientCardEdit.vue'
import ClientVisits from '~/components/client/ClientVisits.vue'
import Client from '~/classes/client'
import DeleteButton from '~/components/common/DeleteButton'
import Users from '~/mixins/users'
import PageLayout from '~/components/common/PageLayout.vue'
import Modal from '~/components/common/Modal'

export default {
  components: {
    ClientCardEdit,
    ClientVisits,
    Avatar,
    DeleteButton,
    PageLayout,
    Modal
  },
  filters: {
    numberFormat (value) {
      if (!value) {
        return ''
      }
      return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
    }
  },
  mixins: [filials, Users],
  data () {
    return {
      deleteConfirm: false,
      branchesList: [],
      edit: false,
      headers: [
        { text: 'Имя и фамилия', value: 'j->name->>fullname' },
        { text: 'Визиты', value: 'visit->visits->>total', width: '100px' },
        {
          text: 'Статус последнего визита',
          value: 'visit->last->>ts_begin',
          width: '200px',
          class: 'clients__question'
        },
        { text: 'Средний чек', value: 'visit->visits->>check', width: '170px' },
        /* { text: 'Филиал', value: '', width: '200px' }, */
        { text: '', value: '', sortable: false, width: '1' }
      ],
      item: {},
      items: [],
      pagination: { rowsPerPage: 20 },
      progressQuery: false,
      totalItems: 0,
      visitsPanel: false,
      tooltip: false,
      lastQuery: ''
    }
  },
  computed: {
    ...mapGetters({
      businessId: 'business/businessId',
      businessInfo: 'business/businessInfo',
      businessIsFilial: 'business/businessIsFilial',
      searchString: 'common/searchString'
    }),
    clientId () {
      return this.$route && this.$route.params && this.$route.params.client
    },
    querySearchString () {
      if (!this.searchString || this.searchString.trim().length < 3) {
        return ''
      }
      return `j->name->>fullname.ilike.*${this.searchString.trim()}*`
    },
    pages () {
      if (!this.pagination.rowsPerPage || !this.totalItems) { return 0 }

      return Math.ceil(this.totalItems / this.pagination.rowsPerPage)
    }
  },
  watch: {
    pagination: {
      handler () {
        this.fetchData()
      },
      deep: true
    },
    searchString: {
      handler () {
        this.debouncedFetch()
      }
    },
    businessId: 'fetchData',
    '$route.params': {
      handler: 'onClientChange',
      deep: true
    },
    edit: 'closeClientEditor',
    businessIsFilial: 'getFilials'
  },
  created () {
    this.getFilials()
    this.fetchData()
    this.debouncedFetch = debounce(this.fetchData, 350)
  },
  mounted () {
    if (this.clientId) {
      this.onClientChange()
    }
    this.$el
      .querySelector('.clients__question')
      .addEventListener('mouseenter', this.onHover)
    this.$el
      .querySelector('.clients__question')
      .addEventListener('mouseleave', this.onLeave)
  },
  beforeDestroy () {
    this.$el
      .querySelector('.clients__question')
      .removeEventListener('mouseenter', this.onHover)
    this.$el
      .querySelector('.clients__question')
      .removeEventListener('mouseleave', this.onLeave)
  },
  methods: {
    ...mapActions({ addClientsCounter: 'business/addClientsCounter' }),
    clientEdit (item) {
      this.$router.push({
        name: 'businessCardClient',
        params: { id: this.businessId, client: item.id }
      })
    },
    clientVisits (item) {
      this.item = new Client(item)
      this.visitsPanel = true
    },
    closeClientEditor () {
      if (!this.edit) {
        this.$router.push({
          name: 'id-businessClientsTable',
          params: { id: this.businessId }
        })
      }
    },
    fetchData (force = false) {
      if (!this.businessId) { return }

      const { sortBy, descending, page, rowsPerPage } = this.pagination
      const filter = [
        `business_id.eq.${this.businessId}`,
        this.querySearchString
      ]
        .filter(x => !!x)
        .join(',')
      const filterString = `and=(${filter})`
      const params = [filterString]

      if (sortBy && sortBy.length) {
        params.push(
          `order=${sortBy[0]}${descending ? '.desc.nullslast' : '.asc.nullsfirst'}`
        )
      }
      if (rowsPerPage > -1) {
        params.push(`limit=${rowsPerPage}`)
      }
      if (page > 1) {
        params.push(`offset=${(page - 1) * rowsPerPage}`)
      }
      if (force || this.lastQuery !== params.filter(x => !!x).join('&')) {
        this.lastQuery = params.filter(x => !!x).join('&')

        this.progressQuery = true
        this.items = []

        Api()
          .get(`client?${this.lastQuery}`)
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
            this.items = res.filter(x => !!x.j).map(x => new Client(x))
          })
          .catch((e) => {
            console.error(e)
          })
          .finally(() => {
            this.progressQuery = false
          })
      }
    },
    getFilials () {
      const id = this.businessIsFilial
        ? this.businessInfo && this.businessInfo.parent
        : this.businessId

      if (!id) { return }
      this.getFilialsOf(id).then((res) => {
        this.branchesList = res
      })
    },
    onClientChange () {
      if (!this.clientId) { return }
      this.item = new Client({ id: this.clientId })
      this.item.load(this.clientId).then(() => {
        this.edit = true
      })
    },
    onDelete (item) {
      if (item) {
        this.item = item
      }
      this.deleteConfirm = true
    },
    onHover () {
      this.tooltip = true
    },
    onLeave () {
      this.tooltip = false
    },
    deleteItem () {
      this.deleteConfirm = false
      if (!this.item.id) {
        this.edit = false
        return
      }
      Api()
        .delete(`client?id=eq.${this.item.id}`)
        .then(() => {
          this.addClientsCounter(-1)
          this.fetchData({ force: true })
          this.edit = false
          this.item = {}
        })
    },
    onSave (item) {
      const newItem = item instanceof Client ? item : new Client(item)
      newItem.save().then((res) => {
        if (!res) { return }
        this.edit = false
        const idx = this.items.findIndex(x => x.id === item.id)
        if (idx > -1) {
          this.items.splice(idx, 1, item)
        }
        this.item = {}
        this.fetchData({ force: true })
      })
    }
  }
}
</script>

<style lang="scss">
@import '~assets/styles/common.scss';

$first-column: 270px;
$first-column-desktop: 330px;
$max-width: 926px;
$left-panel: 240px;

.slide-enter,
.slide-leave-to {
  right: -440px !important;
}

.badge-inline {
  display: inline-block;
  line-height: 0px;

  border-radius: 50%;
  border: 0px solid;
}
.badge-inline span {
  color: white;
  display: inline-block;

  padding-top: 50%;
  padding-bottom: 50%;

  margin-left: 4px;
  margin-right: 4px;
}
.second-row {
  color: grey;
  font-size: 0.8em;
}
.clients {
  position: relative;
  color: #07101c;
  padding-left: $first-column;
  background: #fff;
  overflow-x: auto;

  @media only screen and (min-width: $desktop) {
    padding-left: $first-column-desktop;
  }

  @media only screen and (min-width: ($left-panel+$max-width)) {
    padding-left: 0;
  }

  table.v-table {
    min-width: 529px;
    padding-left: 0;
    @media only screen and (min-width: ($left-panel+$max-width)) {
      width: 100%;
    }
  }

  thead {
    background-color: #f3f4f7;
  }
  /* styles for table header */
  thead tr:first-child {
    height: 40px;
    background: #f3f4f7;
    border-bottom: none !important;
    th {
      height: 40px;
      padding: 10px !important;
      background: #f3f4f7;
      color: #8995af;
      &:first-child {
        padding-right: 20px !important;
        padding-left: 35px !important;
        @media only screen and (min-width: ($left-panel+$max-width)) {
          padding-left: 56px !important;
        }
      }
      i {
        vertical-align: top;
      }
    }
  } /* end of styles for table header */

  tbody tr {
    height: 88px;
    border-bottom-color: #f3f4f7 !important;
    &:hover {
      background-color: transparent !important;
    }
    &:last-child {
      border-bottom: 1px solid #f3f4f7;
    }
  }
  td {
    padding: 0 10px !important;
  }

  div {
    font-size: 14px;
    color: #07101c;
  }

  .clients__add-info {
    font-size: 12px;
    color: #8995af;
    &._phone {
      font-size: 14px;
    }
  }

  /* styles for first column */
  tr th:first-child,
  tr td:first-child {
    position: absolute;
    width: $first-column;
    height: 88px;
    left: 0;
    top: auto;
    background: #fff;
    margin-top: 1px;
    @media only screen and (min-width: $desktop) {
      width: $first-column-desktop;
    }
    @media only screen and (min-width: ($left-panel+$max-width)) {
      position: static;
    }
  }
  tr th:first-child {
    margin-top: 0;
  }
  @-moz-document url-prefix() {
    tr th:first-child,
    tr td:first-child {
      margin-top: 0;
    }
  }
  tbody td:first-child {
    border-bottom: 1px solid #f3f4f7;
  }
  /* end of styles for first column */

  &__first-cell {
    padding: 9px 0 9px 25px;
    @media only screen and (min-width: $desktop) {
      padding-left: 46px;
    }
  }
  &__badge {
    cursor: pointer;
  }
  &__avatar {
    margin: 0;
  }
  &__name-phone {
    padding-left: 12px;
    flex-grow: 1;
    overflow: hidden;
    line-height: 1.6;
  }
  &__name {
    text-transform: capitalize;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  &__phone-button {
    display: block;
    width: 40px;
    height: 40px;
    margin: 0 5px;
    background: url('~assets/images/svg/phone.svg') center no-repeat;
    border: 1px solid rgba(137, 149, 175, 0.1);
    border-radius: 50%;
  }
  &__visit-unvisited {
    display: inline-block;
    vertical-align: baseline;
    margin-left: 11px;
    width: 16px;
    height: 16px;
    text-align: center;
    font-size: 12px;
    color: #ffffff;
    background: #ef4d37;
    border-radius: 50%;
  }
  &__question {
    position: relative;
    &:after {
      display: inline-block;
      vertical-align: middle;
      content: '';
      width: 14px;
      height: 14px;
      background: url('~assets/images/svg/question.svg') center no-repeat;
    }
  }
  .clients__tooltip {
    max-width: 175px;
    top: 100% !important;
    white-space: normal;
    color: #fff;
    font-size: 13px;
  }
  &__filial {
    font-weight: 900;
  }
  .v-datatable__actions__select {
    display: none;
  }
  .avatar-letters {
    color: #fff;
    font-size: 11px;
  }
}
</style>
