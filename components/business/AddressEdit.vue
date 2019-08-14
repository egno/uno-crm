<template>
  <v-layout column>
    <v-flex>
      <v-text-field
        v-model="address"
        :label="label"
        :prepend-icon="prependIcon"
      />
    </v-flex>
    <v-flex v-if="address" width="20em">
      <AddressMap :address="address" />
    </v-flex>
  </v-layout>
</template>

<script>
import AddressMap from '~/components/yandex/AddressMap.vue'
export default {
  components: { AddressMap },
  props: {
    value: { type: String, default: undefined },
    label: { type: String, default: undefined },
    prependIcon: { type: String, default: undefined },
  },
  data () {
    return {
      address: '',
    }
  },
  watch: {
    value: 'fetchValue',
  },
  mounted () {
    this.fetchValue()
  },
  beforeDestroy () {},
  methods: {
    fetchValue () {
      this.address = this.value
    },
  },
}
</script>
