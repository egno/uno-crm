<template>
  <v-layout align-center class="schedule-row">
    <EmployeeSimpleCard :employee="employee" />
    <div class="schedule-row__template">
      <template v-if="employee.j.template" />
      <template v-else>
        <span>У сотрудника нет активного шаблона.</span>
        <button type="button" @click="$emit('assignTemplate', employee)">
          Назначить
        </button>
      </template>
    </div>
    <div class="schedule-row__days">
      <div v-for="(day , i) in days" :key="i" />
    </div>
    <div class="schedule-row__summary">
      <div />
      <div />
    </div>
  </v-layout>
</template>

<script>
// import { mapState, mapActions, mapGetters } from 'vuex'
import EmployeeSimpleCard from '~/components/employee/EmployeeSimpleCard.vue'

export default {
  components: { EmployeeSimpleCard },
  props: {
    employee: {
      type: Object,
      default: () => ({}),
    },
    days: {
      type: Array,
      default: () => [],
    },
  },
}
</script>

<style scoped>

</style>
