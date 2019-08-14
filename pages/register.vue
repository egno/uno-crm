<template>
  <VContainer fluid fill-height justify-center class="register-page">
    <RegisterForm />
  </VContainer>
</template>

<script>
import { mapActions } from 'vuex'
import RegisterForm from '~/components/register/Register.vue'

export default {
  components: { RegisterForm },
  data () {
    return {}
  },
  computed: {},
  mounted () {
    this.setActions(null)
    this.logout()
  },
  methods: {
    ...mapActions({ setActions: 'common/setActions', logout: 'user/logout' }),
  },
}
</script>

<style lang="scss">
.register-page {
  background-color: #fff;
}
</style>
