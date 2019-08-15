import Vue from 'vue'
import VueYandexMetrika from 'vue-yandex-metrika'

export default ({ app }) => {
  Vue.use(VueYandexMetrika, {
    id: 54209695,
    router: app.router,
    env: process.env.NODE_ENV
    // other options
  })
}
