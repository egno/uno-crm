import { mapGetters } from 'vuex'
import { User } from '@/classes/user'

export default {
  data () {
    return {
      user: {}
    }
  },
  computed: {
    ...mapGetters({
      userLoadingState: 'user/userLoadingState',
      loggedIn: 'user/loggedIn',
      userRole: 'user/userRole',
      userInfo: 'user/userInfo'
    }),
    isEditorUser () {
      return this.userRole !== 'anon' && this.userRole !== 'client'
    }
  },
  watch: {
    loggedIn (newVal) {
      if (newVal) {
        this.user = new User({ id: this.userInfo.id })
        this.user.load(this.userInfo.id)
      } else {
        this.user = {}
      }
    }
  },
  mounted () {
    if (this.userInfo && this.userInfo.id) {
      this.user = new User({ id: this.userInfo.id })
      this.user.load(this.userInfo.id)
    }
  }
}
