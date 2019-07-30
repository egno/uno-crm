<template>
  <VFlex class="text-xs-center">
    <h2 class="display-3">
      Мой профиль
    </h2>
    <VForm ref="FormManagerProfile">
      <VBtn
        class="avatar"
        fab
        left
        @click="avatarEdit = !avatarEdit"
      >
        <Avatar
          :name="name"
          size="100px"
          :src="avatar"
          :required="true"
        />
      </VBtn>
      <VTextField
        v-model="fname"
        class="centered-input"
        name="fname"
        label="Имя"
        type="text"
        :rules="[required]"
      />
      <VTextField
        v-if="!isPersonalMaster"
        v-model="flastname"
        class="centered-input"
        name="flastname"
        label="Фамилия"
        :rules="[lastNameRequired]"
        type="text"
      />
      <v-combobox
        v-if="!(isPersonalMaster || isManager)"
        v-model="fspecialisation"
        class="centered-input"
        name="flastname"
        label="Должность"
        :items="specialisations"
        :rules="[specRequired]"
        type="text"
      />
      <v-layout row>
        <VFlex>
          <VTextField
            v-model="userEmail"
            class="centered-input"
            name="femail"
            label="e-mail"
            type="email"
            disabled
            :rules="[email]"
            browser-autocomplete="username"
          />
        </VFlex>
        <VFlex>
          <VBtn
            icon
            :to="{name:'AccountChangeEmail'}"
          >
            <v-icon>edit</v-icon>
          </VBtn>
        </VFlex>
      </v-layout>
      <v-layout row>
        <VFlex>
          <VTextField
            v-model="userPhone"
            class="centered-input"
            name="fphone"
            label="Телефон"
            type="phone"
            disabled
            :rules="[required]"
            browser-autocomplete="tel"
          />
        </VFlex>
        <VFlex>
          <VBtn
            icon
            :to="{name:'AccountChangePhone'}"
          >
            <v-icon>edit</v-icon>
          </VBtn>
        </VFlex>
      </v-layout>
      <div>
        <router-link :to="{ name: 'AccountSetPassword'}">
          Изменить пароль
        </router-link>
      </div>
      <VBtn
        color="success"
        @click="saveProfile"
      >
        Сохранить
      </VBtn>
    </VForm>
    <VDialog
      v-model="avatarEdit"
      max-width="350px"
    >
      <VueAvatarEditor
        :width="250"
        :height="250"
        :background="avatarPath"
        @finished="saveImage($event)"
      />
    </VDialog>
  </VFlex>
</template>

<script>
import Avatar from '~/components/avatar/Avatar.vue'
import VueAvatarEditor from '~/components/avatar/VueAvatarEditor.vue'
import { mapGetters, mapActions } from 'vuex'
import ImageApi from '~/api/images'
import { canvasToFormData, imagePath } from '~/components/avatar/utils'

export default {
  components: {
    Avatar,
    VueAvatarEditor
  },
  data () {
    return {
      data: undefined,
      avatarEdit: false,
      fname: '',
      flastname: '',
      femail: '',
      fphone: '',
      fspecialisation: '',
      specialisations: [
        'Администратор',
        ' Парикмахер',
        ' Барбер',
        ' Колорист',
        ' Стилист',
        ' Визажист',
        ' Косметолог',
        ' Персональный Тренер',
        ' Диетолог',
        ' Массажист'
      ],
      required: v => !!v || 'Обязательное поле',
      lastNameRequired: v =>
        this.isPersonalMaster || !!v || 'Обязательное поле',
      specRequired: v =>
        this.isPersonalMaster || this.isManager || !!v || 'Обязательное поле',
      email: value => {
        const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        return !value || pattern.test(value) || 'Введите действительный e-mail.'
      }
    }
  },
  computed: {
    ...mapGetters({
      businessInfo: 'business/businessInfo',
      isPersonalMaster: 'user/isPersonalMaster',
      userAvatar: 'user/userAvatar',
      userEmail: 'user/userEmail',
      userPhone: 'user/userPhone',
      userInfo: 'user/userInfo',
      userID: 'user/userID'
    }),
    avatarPath () {
      return imagePath(this.userAvatar)
    },
    initiales () {
      return this.fname + ' ' + this.flastname
    },
    isManager () {
      return this.userInfo && this.userInfo.role === 'manager'
    },
    avatar () {
      return this.userAvatar
    },
    name () {
      return this.initiales || null
    }
  },
  watch: {
    userID: 'load'
  },
  mounted () {
    this.load()
  },
  methods: {
    ...mapActions({
      alert: 'alerts/alert',
      setUserAvatar: 'user/setUserAvatar',
      uploadUserInfo: 'user/uploadUserInfo'
    }),
    load () {
      if (!this.userID) return
      this.fname =
        (this.userInfo &&
          this.userInfo.data &&
          this.userInfo.data.j &&
          this.userInfo.data.j.name) ||
        ''
      this.flastname =
        (this.userInfo &&
          this.userInfo.data &&
          this.userInfo.data.j &&
          this.userInfo.data.j.surname) ||
        ''
      this.femail =
        (this.userInfo && this.userInfo.data && this.userInfo.data.email) || ''
      this.fphone =
        (this.userInfo && this.userInfo.data && this.userInfo.data.phone) || ''
      this.fspecialisation =
        (this.userInfo &&
          this.userInfo.data &&
          this.userInfo.data.j &&
          this.userInfo.data.j.category) ||
        ''
    },
    saveProfile () {
      if (this.$refs.FormManagerProfile.validate()) {
        const data = {
          name: this.fname,
          surname: this.flastname,
          category: this.fspecialisation || null
        }
        this.uploadUserInfo(data)
        this.$emit('close')
      }
    },
    saveImage (payload) {
      if (!payload) return
      let formData = canvasToFormData(payload)
      let vm = this
      let newFileName = formData.get('file').name

      ImageApi()
        .post('/', formData)
        .then(() => {
          vm.setUserAvatar(newFileName)
          this.avatarEdit = false
        })
        .catch(err => {
          this.alert({ message: err })
        })
    }
  }
}
</script>

<style lang="scss" scoped>
a {
  text-decoration: none;
}
.drawer {
  .title {
    font-size: 18px !important;
  }
}
.avatar {
  margin-bottom: 35px;
  height: 100px;
  width: 100px;
  left: 0;
}
.display-3 {
  margin-bottom: 75px;
}
.v-input {
  margin-bottom: 15px;
}
.v-text-field {
  input,
  label {
    &.v-label--active {
      transform: scale(1) translateY(-18px);
    }
  }
}
</style>
