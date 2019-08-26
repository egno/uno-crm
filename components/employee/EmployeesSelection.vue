<template>
  <div class="employees-selection">
    <v-menu
      v-model="showMenu"
      :close-on-content-click="false"
      min-width="182"
      max-width="200"
      offset-x
      attach=".employees-selection"
    >
      <template v-slot:activator="{ on }">
        <div class="employees-selection__trigger" v-on="on" />
      </template>
      <div class="employees-selection__menu">
        <!--<div v-if="showCategoryCheckbox" :class="['employees-selection__item', 'v-expansion-panel__header']" @click="toggleAll">
          Все мастера
        </div>-->
        <v-expansion-panel expand>
          <v-expansion-panel-content
            v-for="category in employeesCategories"
            :key="category"
            :hide-actions="true"
          >
            <template v-slot:header>
              <VLayout align-center justify-space-between>
                <div>
                  {{ category }}
                  {{ groupedEmployees[category].length }}
                </div>
                <SmallCheckbox
                  v-if="showCategoryCheckbox"
                  :id="category"
                  :checked="
                    groupedEmployees[category].length ===
                      visibleEmployees.filter(
                        (e) => e.j.category === category
                      ).length
                  "
                  label=""
                  :value="category"
                  @click.native.stop
                  @change="onGroupsChange(category, $event)"
                />
              </VLayout>
            </template>

            <VLayout
              v-for="(emp, i) in groupedEmployees[category]"
              :key="emp.id"
              justify-space-between
              align-center
              class="employees-selection__item"
            >
              <VLayout row align-center>
                <Avatar
                  class="employee__avatar"
                  :name="emp.j.name"
                  :src="emp.j.image"
                  size="44px"
                />
                <div class="employees-selection__emp-name">
                  {{ emp.j.name }}
                </div>
              </VLayout>

              <SmallCheckbox
                :id="emp.j.name + i"
                :checked="
                  visibleEmployees.some((e) => e.id === emp.id)
                "
                label=""
                :value="emp.id"
                @change="changeVisibleEmployees(emp, $event)"
              />
            </VLayout>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </div>
    </v-menu>
  </div>
</template>

<script>
import SmallCheckbox from '~/components/common/SmallCheckbox'
import { employeesCategorized } from '~/mixins/employee'
import Avatar from '~/components/avatar/Avatar.vue'

export default {
  components: { Avatar, SmallCheckbox },
  mixins: [ employeesCategorized ],
  props: {
    showCategoryCheckbox: {
      type: Boolean,
      default: false,
    },
    visibleEmployees: {
      type: Array,
      default () {
        return []
      },
    },
  },
  data () {
    return {
      showMenu: false,
    }
  },
  computed: {
    groupedEmployees () {
      const obj = {}

      this.businessEmployees.forEach((emp) => {
        if (!emp.j || !emp.j.category) {
          return
        }
        const category = emp.j.category

        if (!obj[category]) {
          obj[category] = []
        }

        if (!obj[category].includes(emp)) {
          obj[category].push(emp)
        }
      })

      return obj
    },
  },
  methods: {
    changeVisibleEmployees (employee, selected) {
      if (!this.showCategoryCheckbox) {
        if (selected) {
          this.$emit('changeSelectedEmployee', employee)
        }
        return
      }
      if (selected) {
        if (!this.visibleEmployees.some(e => e.id === employee.id)) {
          this.$emit('addVisibleEmployee', employee)
        }
      } else {
        this.$emit('removeVisibleEmployee', employee)
      }
    },
    onGroupsChange (category, selected) {
      if (selected) {
        if (!this.selectedCategories.includes(category)) {
          this.selectedCategories.push(category)
        }
      } else {
        const i = this.selectedCategories.indexOf(category)

        if (i > -1) {
          this.selectedCategories.splice(i, 1)
        }
      }
      this.groupedEmployees[category].forEach(e =>
        this.changeVisibleEmployees(e, selected)
      )
    },
  },
}
</script>

<style lang="scss">
  .employees-selection {
    width: 24px;
    height: 24px;
    &__trigger {
      width: 24px;
      height: 24px;
      background: url('~assets/images/svg/dots.svg') center no-repeat;
      outline: none;
      margin-right: 36px;
    }
    &__menu {
      width: 182px;
      background-color: #fff;
    }
    &__item {
      padding: 7px 8px 8px 16px;
      border-bottom: 1px solid rgba(137, 149, 175, 0.1);
    }
    &__emp-name {
      margin-left: 8px;
    }
    .v-menu__content {
      overflow: hidden;
    }
    .v-expansion-panel__header {
      min-height: 32px;
      padding: 7px 8px 8px 16px;
      border-bottom: 1px solid rgba(137, 149, 175, 0.1);
      background-color: rgba(137, 149, 175, 0.1);
    }
    .v-expansion-panel .v-expansion-panel__container {
      border-top: none;
    }
    .v-expansion-panel__container--active .v-expansion-panel__header {
      background-color: #fff;
    }
  }
</style>
