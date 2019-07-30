<template>
  <VContainer
    fluid
    grid-list-lg
  >
    <VFlex
      xs4
      offset-xs4
    >
      <UserProfile />
    </VFlex>
  </VContainer>
</template>

<script>
import UserProfile from '~/components/user/UserProfile.vue'
import { mapActions } from 'vuex'

export default {
  components: {
    UserProfile
  },
  data () {
    return {
      data: null
    }
  },
  computed: {},
  watch: {},
  mounted () {},
  methods: {
    ...mapActions({setActions: 'common/setActions'})
  }
}
</script>
