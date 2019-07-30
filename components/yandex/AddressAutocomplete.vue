<template>
  <v-layout>
    <v-flex class="address">
      <v-combobox
        :value="address.name"
        allow-overflow
        auto-select-first
        browser-autocomplete
        :error="!success"
        hide-no-data
        :items="items"
        item-text="name"
        :label="label"
        :loading="loading"
        no-filter
        persistent-hint
        :prepend-icon="prependIcon"
        :rules="[rules.found]"
        :search-input.sync="search"
        :maxlength="200"
        attach=".address .dropdown-select"
        class="businesscard-form__field dropdown-select"
        @blur="edited = true; $emit('blur', search)"
        @input="$emit('inputAddress', (items && items[0]) || search)"
      />
    </v-flex>
  </v-layout>
</template>

<script>
  import axios from 'axios'
  import { mapActions } from 'vuex'
  import { debounce } from 'lodash'

  export default {
    props: {
      value: { type: [String, Object], default: undefined },
      label: { type: String, default: undefined },
      prependIcon: { type: String, default: undefined }
    },
    data () {
      const vm = this

      return {
        address: { name: '' },
        edited: false,
        items: [],
        loading: false,
        search: '',
        rules: {
          found: (val) => {
            if (!vm.edited && (!val || !val.name)) {
              return true
            }
            return (vm.success || `Адрес не найден. Проверьте правильность введенных данных`)
          }
        }
      }
    },
    computed: {
      success () {
        return !this.edited ||
          (this.items &&
            this.items.map(x => x.name).some(x => x === this.search))
      }
    },
    watch: {
      address (val) {
        this.$emit('inputAddress', val)
        this.search = (val && val.name) || ''
      },
      value: 'fetchValue',
      search (val) {
        if (!this.address || !val || val.length < 2) {
          return
        }
        (val !== this.address.name) && this.debouncedGeocode(val)
      }
    },
    created () {
      this.debouncedGeocode = debounce(this.geocode, 300)
    },
    methods: {
      ...mapActions({openMessageWindow: 'common/openMessageWindow'}),
      fetchValue () {
        if (typeof this.value === 'string') {
          this.address = { name: this.value }
        } else if (this.value && typeof this.value === 'object') {
          if (!this.address || (this.address.name !== this.value.name)) {
            this.address = Object.assign({}, this.value)
          }
        } else {
          this.address = { name: null }
        }
      },
      geocode (val) {
        this.loading = true
        this.edited = true
        if (!(val && val.length > 6)) {
          this.items = undefined
          this.loading = false
          return
        }
        const dt = new Date()
        axios
          .get(
            `https://geocode-maps.yandex.ru/1.x/?format=json&kind=house&geocode=Россия,${val}`
          )
          .then(res => {
            this.items = res.data.response.GeoObjectCollection.featureMember
              .filter(
                x =>
                  x.GeoObject.metaDataProperty.GeocoderMetaData.kind === 'house'
              )
              .map(x => {
                const addressComponents = x.GeoObject.metaDataProperty.GeocoderMetaData.Address && x.GeoObject.metaDataProperty.GeocoderMetaData.Address.Components
                let city

                if (addressComponents) {
                  city = addressComponents.find(component => component.kind === "locality")["name"]
                }

                return {
                  name:
                  x.GeoObject.metaDataProperty.GeocoderMetaData.Address.formatted,
                  city,
                  cityAddress:
                    x.GeoObject && x.GeoObject.name,
                  addressComponents,
                  point: x.GeoObject && x.GeoObject.Point && x.GeoObject.Point.pos,
                  updated: dt.toISOString()
                }
              })
            this.loading = false
          })
          .catch(() => {
            this.loading = false
          })
      },
    }
  }
</script>

<style lang="scss">
  .href {
    text-decoration: underline;
    color: rgb(158, 0, 0);
  }
  .address.flex .v-input__append-inner {
    display: none !important;
  }
</style>

