<template>
  <div class="phone-view">
    <a :href="phoneLink(phone)">
      {{ phone | phoneFormat }}
    </a>
  </div>
</template>

<script>
export default {
  props: {
    phone: {
      type: String,
      default: ''
    }
  },
  methods: {
    phoneLink (value) {
      if (!value) { return '' }
      return `tel:+${value}`
    }
  }
}
</script>

<style scoped>
.phone-view {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: 24px;
  background: url('~assets/images/svg/ru.svg') left 4px no-repeat;
  min-width: 13em;
}

a {
  display: block;
  width: 100%;
  line-height: 24px;
  text-decoration: none;
  color: #07101c;
  background: url('~assets/images/svg/phone.svg') right top no-repeat;
}
a:hover {
  text-decoration: underline;
}
</style>
