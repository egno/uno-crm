<template>
  <v-card>
    <v-card-title>
      {{ item.name.fullName || '' }}
    </v-card-title>
    <v-card-text>{{ client.phone || '' }}</v-card-text>
  </v-card>
</template>

<script>
import Client from '~/classes/client'

export default {
  props: {
    client: {
      type: Object,
      default () {
        return new Client()
      },
    },
  },
  data () {
    return {
      item: new Client(this.client),
    }
  },
}
</script>
