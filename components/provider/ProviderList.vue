<template>
  <v-card
    flat
    color="grey lighten-3"
    class="card-rounded"
  >
    <v-card-text>
      <v-switch
        v-model="showProviders"
        label="Показать список операторов рассылки"
        color="blue"
        class="compact mt-0 pb-1 px-2"
        height="10px"
        hide-details
      />
    </v-card-text>
    <template v-if="showProviders">
      <v-divider class="card-divider" />
      <v-card-text>
        <v-layout
          row
          wrap
          fill-height
        >
          <v-flex
            v-for="provider in providers"
            :key="provider.name"
            pa-2
          >
            <ProviderCard
              :provider="provider"
              @click="$emit('change', provider)"
            />
          </v-flex>
        </v-layout>
      </v-card-text>
    </template>
  </v-card>
</template>

<script>
import ProviderCard from '~/components/provider/ProviderCard.vue'

export default {
  components: { ProviderCard },
  props: {
    providers: {
      type: Array,
      default () {
        return [{}]
      }
    }
  },
  data () {
    return {
      showProviders: false
    }
  }
}
</script>

<style scoped>
.card-rounded {
  border-radius: 24px;
}
.card-divider {
  border-color: rgba(255, 255, 255, 1);
}
</style>

