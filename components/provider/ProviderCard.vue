<template>
  <v-layout justify-center>
    <v-card-actions class="justify-center">
      <v-btn flat ripple @click="$emit('click')">
        <v-img
          :src="logo(provider)"
          :alt="provider.name"
          :height="40"
          :width="170"
        />
      </v-btn>
    </v-card-actions>
  </v-layout>
</template>

<script>
import { logo } from '~/components/provider/utils'

export default {
  props: {
    provider: {
      type: Object,
      default () {
        return {}
      },
    },
  },
  methods: {
    logo (provider) {
      return logo(provider)
    },
  },
}
</script>
