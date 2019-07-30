<template>
  <div>
    <v-card>
      <v-card-title>Менеджер</v-card-title>
      <v-card-text v-if="data">
        <v-layout column>
          <v-flex>
            <v-text-field v-model="data.j.name" label="Имя" />
          </v-flex>
          <v-flex>
            <v-text-field v-model="data.j.surname" label="Фамилия" />
          </v-flex>
          <v-flex>
            <v-text-field v-model="data.email" label="E-mail" />
          </v-flex>
          <v-flex>
            <v-text-field v-model="data.phone" label="телефон" />
          </v-flex>
        </v-layout>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn @click="$emit('cancel')">
          Отменить
        </v-btn>
        <v-btn color="primary" @click="$emit('save', data)">
          Сохранить
        </v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
export default {
  props: {
    manager: {
      type: Object,
      default () {
        return { j: {} }
      }
    }
  },
  data () {
    return {
      data: undefined
    }
  },
  watch: {
    manager (newVal) {
      if (newVal) {
        this.data = newVal
      }
    }
  },
  mounted () {
    this.data = this.manager
  },

}
</script>
