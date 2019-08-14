<template>
  <VContainer fluid grid-list-lg>
    <VFlex xs4 offset-xs4>
      <UserProfile />
    </VFlex>
  </VContainer>
</template>

<script>
import { mapActions } from 'vuex'
import UserProfile from '~/components/user/UserProfile.vue'

export default {
  components: {
    UserProfile,
  },
  data () {
    return {
      data: null,
    }
  },
  computed: {},
  watch: {},
  mounted () {},
  methods: {
    ...mapActions({ setActions: 'common/setActions' }),
  },
}
</script>
