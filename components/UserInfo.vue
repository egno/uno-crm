<template>
  <VCard flat>
    <VCardTitle>Учетная запись</VCardTitle>
    <VLayout align-center justify-center row fill-height>
      <VFlex align-self-center>
        <v-btn fab left large @click="avatarEdit = !avatarEdit">
          <Avatar
            v-if="email"
            size="4em"
            :name="data.data.name || data.data.email"
            :src="avatar"
          />
        </v-btn>
      </VFlex>
      <VFlex>
        <VLayout column>
          <VFlex>
            <VTextField
              v-model="data.data.email"
              label="E-mail"
              prepend-icon="email"
              type="text"
              autocomplete="username"
            />
          </VFlex>
        </VLayout>
      </VFlex>
    </VLayout>

    <VDialog v-model="avatarEdit">
      <VueAvatarEditor @finished="saveImage" />
    </VDialog>

    <VCardActions>
      <VSpacer />
      <v-btn color="primary" @click="sendData">
        Сохранить
      </v-btn>
    </VCardActions>
  </VCard>
</template>

<script>
import axios from 'axios'
import Avatar from '~/components/avatar/Avatar.vue'
import VueAvatarEditor from '~/components/avatar/VueAvatarEditor.vue'
import Api from '~/api/backend'

export default {
  components: {
    VueAvatarEditor,
    Avatar,
  },
  data () {
    return {
      avatarEdit: false,
      data: { data: {} },
    }
  },
  computed: {
    avatar () {
      return this.data.data.avatar
    },
    id () {
      return this.$route.params.id
    },
    email () {
      return this.data.data.email
    },
  },
  mounted () {
    this.fetchData()
  },
  methods: {
    fetchData () {
      Api()
        .get(`business?id=eq.${this.id}`)
        .then(res => res.data)
        .then(res => res[0])
        .then((res) => {
          this.data = res
        })
    },
    saveImage (img) {
      this.avatarEdit = false
      const blobBin = atob(img.toDataURL().split(',')[1])
      const array = []
      for (let i = 0; i < blobBin.length; i++) {
        array.push(blobBin.charCodeAt(i))
      }
      const file = new Blob([ new Uint8Array(array) ], { type: 'image/png' })
      const formData = new FormData()
      const newFileName = `${this.uuidv4()}.png`
      formData.append('file', file, newFileName)
      const vm = this
      axios
        .post(process.env.VUE_APP_UPLOAD, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        .then(function () {
          vm.data.data.avatar = newFileName
          console.log('SUCCESS!!')
        })
        .then(() => vm.sendData())
        .catch(function () {
          console.log('FAILURE!!')
        })
    },
    sendData () {
      // this.saveImage();
      Api().patch(`business?id=eq.${this.id}`, this.data)
    },
    uuidv4 () {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (
        c
      ) {
        const r = (Math.random() * 16) | 0
        const v = c === 'x' ? r : (r & 0x3) | 0x8
        return v.toString(16)
      })
    },
  },
}
</script>
