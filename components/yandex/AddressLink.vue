<template>
  <span class="ymaps-geolink" data-type="biz">
    {{ address }}
  </span>
</template>

<script>
import * as utils from '~/components/yandex/utils'

export default {
  props: {
    address: { type: String, default: null }
  },
  data () {
    return {
      ymapEventBus: utils.emitter
    }
  },
  mounted () {
    if (this.ymapEventBus.scriptIsNotAttached) {
      const yandexMapScript = document.createElement('SCRIPT')
      const mapLink =
        this.mapLink ||
        'https://api-maps.yandex.ru/2.1/?lang=ru_RU&load=Geolink'
      yandexMapScript.setAttribute('src', mapLink)
      yandexMapScript.setAttribute('async', '')
      yandexMapScript.setAttribute('defer', '')
      document.body.appendChild(yandexMapScript)
      this.ymapEventBus.scriptIsNotAttached = false
      yandexMapScript.onload = () => {
        this.ymapEventBus.ymapReady = true
        this.ymapEventBus.$emit('scriptIsLoaded')
      }
    }
    if (!this.ymapEventBus.ymapReady) {
      this.ymapEventBus.$on('scriptIsLoaded', () => {})
    }
  },
  beforeDestroy () {}
}
</script>
