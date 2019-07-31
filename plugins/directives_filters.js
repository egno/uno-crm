import Vue from 'vue'

/* if (process.client) {
  const vueSmoothScroll = require('vue2-smooth-scroll')
  Vue.use(vueSmoothScroll)
} */

Vue.filter('phoneFormat', function (value) {
  if (!value) {
    return ''
  }
  if (value.length === 10) {
    return value.replace(
      /(\d{1,3})(\d{1,3})(\d{1,2})(\d{1,2})$/g,
      '+7 ($1) $2-$3-$4'
    )
  } else {
    return value.replace(
      /(\d?)(\d{1,3})(\d{1,3})(\d{1,2})(\d{1,2})$/g,
      '+$1 ($2) $3-$4-$5'
    )
  }
})
