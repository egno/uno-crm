<template>
  <div class="employee-simple-card" @click="$emit('click')">
    <Avatar
      class="employee-simple-card__avatar"
      :name="employee.j.name || employee.j.email"
      :src="avatar"
      size="40px"
    />
    <div class="employee-simple-card__badge">
      <div v-if="employee.j.category" class="employee-simple-card__subtitle">
        {{ employee.j.category }}
      </div>
      <div class="employee-simple-card__title">
        <span>{{ employee.j.name }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import Avatar from '~/components/avatar/Avatar.vue'
import { fullName } from '~/components/business/utils'
import { conjugateServices } from '~/components/utils'

export default {
  components: { Avatar },
  filters: {
    formatServices (n) {
      return conjugateServices(n)
    },
  },
  props: {
    employee: {
      type: Object,
      default: () => ({}),
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

<style lang="scss" scoped>
  .employee-simple-card {
    width: 190px;
    height: 80px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    &__subtitle {
      font-size: 12px;
      line-height: 14px;
      color: #8995AF;
    }
    &__title {
      font-size: 14px;
      line-height: 17px;
      color: #07101C;
    }
    &__badge {
      padding-left: 10px;
    }
  }
</style>
