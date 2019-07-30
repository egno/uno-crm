<template>
  <v-card>
    <v-card-text>
      <v-layout
        column
        justify-start
      >
        <v-flex
          v-for="param in params"
          :key="param.code"
        >
          <v-text-field
            v-model="values[param.code]"
            :label="param.title"
            :type="param.code"
          />
        </v-flex>
      </v-layout>
    </v-card-text>

    <v-layout row class="pb-3">
      <v-spacer />
      <v-btn
        large
        ripple
        class="px-5 styled-button"
        height="50"
        color="primary"
        @click="$emit('save')"
      >
        Сохранить
      </v-btn>
      <v-spacer />
    </v-layout>
  </v-card>
</template>

<script>
export default {
  props: {
    provider: {
      type: Object,
      default () {
        return {}
      }
    },
    values: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      paramsInfo: {
        login: {
          title: 'Логин'
        },
        password: {
          title: 'Пароль'
        },
        key: {
          title: 'Ключ API'
        }
      }
    }
  },
  computed: {
    params () {
      return (
        this.provider &&
        this.provider.j &&
        this.provider.j.services &&
        this.provider.j.services.sms &&
        this.provider.j.services.sms.params.map(x => {
          return { ...{ code: x.name }, ...this.paramsInfo[x.name] }
        })
      )
    }
  }
}
</script>

<style scoped>
.styled-button {
  font-family: Roboto Slab, Times New Roman, Times, serif;
  font-weight: 900;
  letter-spacing: 0.05em;
}
</style>
