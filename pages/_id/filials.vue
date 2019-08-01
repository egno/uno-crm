<template>
  <BranchesLayout
    :is-creating="!businessIsFilial && isCreating"
    :is-button-visible="!businessIsFilial"
    @add="createBranch('newFilial')"
    @close="onClose"
  >
    <template v-if="!businessIsFilial && isCreating" slot="content">
      <BusinessCardEdit
        :business-info="newBranch"
        :current-tab="infoTab ? 'infoTab' : 'scheduleTab'"
        @tabChange="onTabChange"
        @saved="onSaved"
        @formChange="isFormChanged = true"
      />
      <Modal
        :visible="showSave"
        :template="saveModalTemplate"
        @rightButtonClick="closeWithoutSaving"
        @leftButtonClick="showSave = false"
        @close="showSave = false"
      >
        <template slot="text">
          <div class="uno-modal__text">
            {{ saveModalTemplate.text }}
          </div>
        </template>
      </Modal>
    </template>
    <template v-else slot="content">
      <VLayout wrap class="branches__cities">
        <div
          v-for="(branches, city) in branchesByCities"
          :key="city"
          @click="selectedCity = city"
        >
          <div
            v-if="city !== 'Другие'"
            class="branches__city"
            :class="{ _active: selectedCity === city }"
          >
            {{ city }}
          </div>
        </div>
        <div
          v-if="branchesByCities['Другие'].length"
          class="branches__city"
          :class="{ _active: selectedCity === 'Другие' }"
          @click="selectedCity = 'Другие'"
        >
          Другие
        </div>
        <div
          class="branches__city"
          :class="{ _active: !selectedCity }"
          @click="selectedCity = null"
        >
          Все города
        </div>
      </VLayout>

      <div
        v-for="(city, cityInd) in sortedUniqueCities"
        :key="cityInd"
        class="branches__group"
      >
        <template
          v-if="
            city &&
              city !== 'Другие' &&
              (selectedCity === city || !selectedCity)
          "
        >
          <div class="city-branch">
            <div class="city-branch__city">
              {{ city }}
            </div>
            <div class="city-branch__count">
              {{
                branchesByCities[city] &&
                  branchesByCities[city].length | formatFilial
              }}
            </div>
          </div>
          <VLayout justify-start align-start wrap class="branches__cards">
            <div
              v-for="(item, i) in branchesByCities[city]"
              :key="i"
              class="card-wrapper"
            >
              <FilialCard
                :branch="item"
                :pinned="item.id === businessId"
                :is-editable="!businessIsFilial"
                :can-delete="filialCount > 1"
                @click="showCheckoutDialog(item)"
                @delete="showDeleteDialog(item)"
              >
                {{ i }} {{ item.id }}
              </FilialCard>
            </div>
          </VLayout>
        </template>
      </div>
      <div
        v-show="
          branchesByCities['Другие'].length &&
            (selectedCity === 'Другие' || !selectedCity)
        "
        class="branches__group"
      >
        <div class="city-branch">
          <div class="city-branch__city">
            Другие
          </div>
          <div class="city-branch__count">
            {{ branchesByCities['Другие'].length | formatFilial }}
          </div>
        </div>
        <VLayout justify-start align-start wrap class="branches__cards">
          <div
            v-for="(item, i) in branchesByCities['Другие']"
            :key="i"
            class="card-wrapper"
          >
            <FilialCard
              :branch="item"
              :pinned="item.id === businessId"
              :is-editable="!businessIsFilial"
              :can-delete="filialCount > 1"
              @click="showCheckoutDialog(item)"
              @delete="showDeleteDialog(item)"
            >
              {{ i }} {{ item.id }}
            </FilialCard>
          </div>
        </VLayout>
      </div>

      <Modal
        :visible="checkoutModalVisible"
        :template="checkoutTemplate"
        @close="checkoutModalVisible = false"
        @leftButtonClick="
          checkoutModalVisible = false
          branchToCheckout = null
        "
        @rightButtonClick="checkout"
      >
        <template slot="text">
          <div
            v-if="
              branchToCheckout && branchToCheckout.j && branchToCheckout.j.name
            "
            class="uno-modal__text"
          >
            Вы будете перемещены в филиал <b>{{ branchToCheckout.j.name }}.</b>
          </div>
          <div v-else class="uno-modal__text">
            Вы будете перемещены в филиал.
          </div>
        </template>
      </Modal>
      <Modal
        :visible="deleteModalVisible"
        :template="deleteTemplate"
        @close="deleteModalVisible = false"
        @leftButtonClick="
          deleteModalVisible = false
          branchToDelete = null
        "
        @rightButtonClick="deleteBranch"
      >
        <template slot="text">
          <div
            v-if="branchToDelete && branchToDelete.j && branchToDelete.j.name"
            class="uno-modal__text"
          >
            Это приведет к удалению филиала
            <b>{{ branchToDelete.j.name }}.</b> Вся информация филиала будет
            удалена.
          </div>
          <div v-else class="uno-modal__text">
            Это приведет к удалению филиала. Вся информация филиала будет
            удалена.
          </div>
        </template>
      </Modal>
    </template>
  </BranchesLayout>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import { filials } from '../../components/business/mixins'
import Api from '~/api/backend'
import FilialCard from '~/components/branches/FilialCard.vue'
import Business from '~/classes/business'
import BranchesLayout from '~/components/branches/BranchesLayout'
import Modal from '~/components/common/Modal'
import BusinessCardEdit from '~/components/business/BusinessCardEdit.vue'
import { formatDate } from '~/components/calendar/utils'
import { conjugateFilial } from '~/components/utils'
import Users from '~/mixins/users'
import { roles } from '~/classes/user'

export default {
  params: {
    items: { type: Array, default: [] },
    search: { type: String, default: '' }
  },
  components: { BranchesLayout, FilialCard, Modal, BusinessCardEdit },
  filters: {
    formatFilial (n) {
      return conjugateFilial(n)
    }
  },
  mixins: [filials, Users],
  data () {
    return {
      isCreating: false,
      isFormChanged: false,
      branchToCheckout: undefined,
      branchToDelete: undefined,
      branchesList: [],
      branchesByCities: {
        Другие: []
      },
      checkoutModalVisible: false,
      selectedCity: undefined,
      checkoutTemplate: {
        header: 'Перейти в филиал?',
        text:
          '<div>Вы будете перемещены</div><div>в филиал Estel Professional.</div>',
        leftButton: 'ОТМЕНА',
        rightButton: 'ПЕРЕЙТИ'
      },
      deleteModalVisible: false,
      newBranch: null,
      infoTab: true,
      saveModalTemplate: {
        header: 'Данные были изменены.',
        text: `Выйти без сохранения?`,
        leftButton: 'ОТМЕНА',
        rightButton: 'ДА'
      },
      sortedUniqueCities: [],
      showSave: false
    }
  },
  computed: {
    ...mapState({
      categories: state => state.business.businessCategories
    }),
    ...mapGetters({
      businessId: 'business/businessId',
      businessParent: 'business/businessParent',
      businessInfo: 'business/businessInfo',
      businessIsFilial: 'business/businessIsFilial'
    }),
    filialCount () {
      return this.branchesList && this.branchesList.length
    },
    deleteTemplate () {
      if (
        !this.branchToDelete ||
        !this.branchToDelete.j ||
        !this.branchToDelete.j.name
      ) {
        return {
          header: 'Удалить филиал?',
          text: `Это приведет к удалению филиала. Вся информация филиала будет удалена.`,
          leftButton: 'ОТМЕНА',
          rightButton: 'УДАЛИТЬ'
        }
      }
      return {
        header: 'Удалить филиал?',
        text: `Это приведет к удалению филиала ${this.branchToDelete.j.name}. Вся информация филиала будет удалена.`,
        leftButton: 'ОТМЕНА',
        rightButton: 'УДАЛИТЬ'
      }
    }
  },
  watch: {
    businessId: 'getFilials',
    businessParent: 'goToParent',
    'user.business': 'getFilials'
  },
  created () {
    this.getFilials()
  },
  mounted () {
    this.setActions(this.formActions)
    this.$root.$on('onAction', this.createBranch)
  },
  beforeDestroy () {
    this.$root.$off('onAction', this.createBranch)
  },
  methods: {
    ...mapActions({
      setActions: 'common/setActions',
      setBusiness: 'business/setBusiness',
      setBusinessToParent: 'business/setBusinessToParent'
    }),
    checkout () {
      if (!this.branchToCheckout) {
        return
      }
      const id = this.branchToCheckout.id

      this.setBusiness(id)
      this.checkoutTo(id)
    },
    checkoutTo (id) {
      this.$router.push({
        name: 'id-visits',
        params: {
          id,
          date: formatDate(new Date())
        }
      })
    },
    closeWithoutSaving () {
      this.showSave = false
      this.isCreating = false
      this.newBranch = null
      this.infoTab = true
    },
    deleteBranch () {
      Api()
        .delete(`business?id=eq.${this.branchToDelete.id}`)
        .then(() => {
          this.getFilials()
          this.branchToDelete = null
          this.deleteModalVisible = false
        })
        .catch((err) => {
          console.log(err)
          return false
        })
    },
    filterUserFilials (res) {
      const userBusinessList = this.user.business.map(b => b.id)
      if (this.user.role === roles[1] || this.user.role === roles[2]) {
        this.branchesList = res.filter(resultFilial =>
          userBusinessList.includes(resultFilial.id)
        )
      } else if (
        this.userRole === 'manager' ||
        this.userRole === 'admin' ||
        this.user.role === roles[0]
      ) {
        this.branchesList = res
      }

      this.sortedUniqueCities = [
        ...new Set(
          this.branchesList.map(
            branch => branch.j && branch.j.address && branch.j.address.city
          )
        )
      ].sort()
      this.groupBranches()
    },
    getFilials () {
      const id = this.businessIsFilial
        ? this.businessInfo && this.businessInfo.parent
        : this.businessId

      if (!id) { return }
      this.getFilialsOf(id).then((res) => {
        if (this.user && this.user.business) {
          this.filterUserFilials(res)
          this.setBusiness(id)
        }
      })
    },
    groupBranches () {
      this.branchesByCities = {
        Другие: []
      }
      this.branchesList.forEach((branch) => {
        if (branch.j && branch.j.address && branch.j.address.city) {
          const city = branch.j.address.city

          if (!this.branchesByCities[city]) {
            this.$set(this.branchesByCities, city, [])
          }
          if (!this.branchesByCities[city].includes(branch)) {
            this.branchesByCities[city].push(branch)
          }
        } else {
          this.branchesByCities['Другие'].push(branch)
        }
      })
    },
    createBranch (payload) {
      if (payload === 'newFilial') {
        this.newBranch = new Business({
          id: 'new',
          parent: this.businessId,
          name: this.businessInfo.name
        })
        if (this.businessInfo && this.businessInfo.j) {
          this.newBranch.inn = this.businessInfo.j.inn
          this.newBranch.schedule = Object.assign(
            {},
            this.businessInfo.j.schedule
          )
          if (
            this.categories &&
            this.categories.includes(this.businessInfo.j.category)
          ) {
            this.newBranch.category = this.businessInfo.j.category
          }
        }
        this.isCreating = true
      }
    },
    goToParent () {
      console.log('go to parent', this.businessParent)
      if (this.businessParent) {
        console.log('replace', this.businessParent)
        this.$router.replace({
          name: 'id-filials',
          params: { id: this.businessParent }
        })
      }
    },
    onClose () {
      this.isFormChanged ? (this.showSave = true) : (this.isCreating = false)
    },
    onSaved () {
      this.getFilials()
      this.isCreating = false
      this.isFormChanged = false
      this.newBranch = null
      this.infoTab = true
      this.selectedCity = null
    },
    showCheckoutDialog (branch) {
      if (branch.id === this.businessId) {
        this.checkoutTo(this.businessId)
      } else {
        this.checkoutModalVisible = true
        this.branchToCheckout = branch
      }
    },
    showDeleteDialog (branch) {
      this.deleteModalVisible = true
      this.branchToDelete = branch
    }
  }
}
</script>

<style lang="scss">
@import '~/assets/styles/common.scss';
@import '~/assets/styles/infocard.scss';
@import '~/assets/styles/businesscard-tabs.scss';

.card-wrapper {
  margin: 0 10px 20px 0;
}

.city-branch {
  display: flex;
  align-items: baseline;
  margin-bottom: 32px;
  line-height: 24px;

  &__city {
    padding-right: 11px;
    font-family: $roboto;
    font-style: normal;
    font-weight: normal;
    font-size: 18px;
    color: #07101c;
  }

  &__count {
    padding-left: 11px;
    font-family: $lato;
    font-style: normal;
    font-weight: normal;
    font-size: 14px;
    color: #8995af;
    border-left: 1px solid rgba(137, 149, 175, 0.1);
  }
}
</style>
