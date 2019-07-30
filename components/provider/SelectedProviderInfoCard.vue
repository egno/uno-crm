<template>
  <v-card flat>
    <v-layout
      column
      align-center
      class="text-xs-center"
    >
      <v-flex class="pa-3">
        <v-avatar size="10em">
          <v-img
            :src="providerAvatar"
            aspect-ratio="1"
            class="grey lighten-2"
          />
        </v-avatar>
      </v-flex>
      <v-flex v-if="name">
        <h3>{{ name }}</h3>
      </v-flex>
      <v-flex v-else>
        <span class="caption text--grey">Оператор рассылки не выбран</span>
      </v-flex>
      <v-flex>
        <div class="caption ">
          <a :href="site">{{ site }}</a>
        </div>
      </v-flex>
    </v-layout>
  </v-card>
</template>

<script>
import { avatar } from '~/components/provider/utils'

export default {
  props: {
    provider: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  computed: {
    providerAvatar () {
      return avatar(this.provider)
    },
    name () {
      return this.provider && this.provider.name
    },
    site () {
      return this.provider && this.provider.j && this.provider.j.site
    }
  }
}
</script>
