<template>
  <div>
    <div>
      <span :class="captionClass">
        Адрес
      </span>
      &nbsp;
      <AddressLink v-if="address.point" :address="addressName" />
      <span v-else>
        {{ addressName }}
      </span>
    </div>
    <VSlideYTransition />
  </div>
</template>

<script>
import AddressLink from '~/components/yandex/AddressLink.vue'
export default {
  components: { AddressLink },
  props: {
    address: { type: [ String, Object ], default: null },
    captionClass: {
      type: String,
      default: '',
    },
  },
  data () {
    return {
      showDetails: false,
    }
  },
  computed: {
    addressName () {
      if (typeof this.address === 'object') {
        return this.address.name
      }
      return this.address
    },
  },
}
</script>
