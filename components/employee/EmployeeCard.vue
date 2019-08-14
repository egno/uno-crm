<template>
  <div class="employee-card" @click="$emit('click')">
    <div v-if="employee.j" class="employee-card__top">
      <Avatar
        class="employee-card__avatar"
        :name="employee.j.name || employee.j.email"
        :src="avatar"
        size="80px"
      />
      <div class="employee-card__badge">
        <h2 class="employee-card__title">
          <span>{{
            employee.j.name && employee.j.name.length > 70
              ? employee.j.name.substring(0, 70) + '...'
              : employee.j.name
          }}</span>
        </h2>
        <div v-if="employee.j.category" class="employee-card__subtitle">
          {{ employee.j.category }}
        </div>
      </div>
    </div>
    <div class="employee-card__bottom">
      <div class="employee-card__info">
        {{ servicesCount | formatServices }}
      </div>
      <div class="employee-card__buttons">
        <VTooltip v-if="servicesCount" bottom>
          <template v-slot:activator="{ on }">
            <button
              type="button"
              class="employee-registry"
              v-on="on"
              @mousedown.stop="$emit('calendarClick')"
            />
          </template>
          <span>Журнал записей мастера</span>
        </VTooltip>
        <DeleteButton
          :is-dark="true"
          delete-text="Удалить сотрудника"
          @click.native.stop="$emit('delete')"
        />
      </div>
    </div>
  </div>
</template>

<script>
import Avatar from '~/components/avatar/Avatar.vue'
import { fullName } from '~/components/business/utils'
import DeleteButton from '~/components/common/DeleteButton'
import { conjugateServices } from '~/components/utils'

export default {
  components: { Avatar, DeleteButton },
  filters: {
    formatServices (n) {
      return conjugateServices(n)
    },
  },
  props: {
    employee: {
      type: Object,
      default: () => {
        return {}
      },
    },
    servicesCount: {
      type: Number,
      default: 0,
    },
  },
  data () {
    return {
      captionClass:
        'caption font-weight-bold text-no-wrap grey--text text--darken-1',
    }
  },
  computed: {
    avatar () {
      return (
        this.employee &&
        this.employee.j &&
        (this.employee.j.avatar || this.employee.j.image)
      )
    },
  },
  methods: {
    fullName (emp) {
      return fullName(emp)
    },
    onSave (payload) {
      this.$emit('onSave', payload)
    },
  },
}
</script>

<style lang="scss">
@import '~assets/styles/employee-card.scss';
@import '~assets/styles/icon.scss';
.employee-registry {
  @include uno-icon();
  justify-content: center;
  margin-right: 25px;
  background: url('~assets/images/svg/calendar-grey.svg') center no-repeat
    transparent;
  &:hover {
    background-image: url('~assets/images/svg/calendar-dark.svg');
  }
}
</style>
