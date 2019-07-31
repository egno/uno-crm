<template>
  <v-layout align-left column>
    <v-flex pb-4>
      <v-layout row wrap fill-height>
        <v-flex xs12 sm6>
          <SelectedProviderInfoCard :provider="currentProvider" />
        </v-flex>
        <v-flex xs12 sm6>
          <ProviderParams
            v-show="currentProvider"
            :values="provider"
            :provider="currentProvider"
            @save="setProvider(provider)"
          />
        </v-flex>
      </v-layout>
    </v-flex>
    <v-flex>
      <ProviderList :providers="providers" @change="setProvider($event)" />
    </v-flex>
  </v-layout>
</template>

<script>
import Api from '~/api/backend'
import SelectedProviderInfoCard from '~/components/provider/SelectedProviderInfoCard.vue'
import ProviderParams from '~/components/provider/ProviderParams.vue'
import ProviderList from '~/components/provider/ProviderList.vue'

export default {
  components: { ProviderList, ProviderParams, SelectedProviderInfoCard },
  props: {
    provider: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      providers: []
    }
  },
  computed: {
    currentProvider () {
      return (
        this.provider &&
        this.provider.name &&
        this.providers &&
        this.providers.find(x => x.name === this.provider.name)
      )
    }
  },
  mounted () {
    this.loadProviders()
  },
  methods: {
    loadProviders () {
      Api()
        .get('sms_providers?order=name')
        .then((res) => {
          this.providers = res.data
        })
    },
    setProvider (payload) {
      this.provider.name = payload.name
      this.$emit('change', this.provider)
    }
  }
}
</script>
