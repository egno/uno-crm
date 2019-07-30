<template>
  <v-layout column>
    <v-layout
      v-if="employee.j"
      justify-center
      class="businesscard-form__avatar"
    >
      <div @click="avatarEdit = true">
        <Avatar
          size=""
          :src="employee.j.avatar || employee.j.image"
          :is-editing="true"
          :is-company-avatar="false"
          :avatar-class="'business-avatar'"
          :new-message="false"
          :required="false"
          :name="employee.j.name"
        />
      </div>
      <VDialog
        v-model="avatarEdit"
        max-width="375px"
        height="600px"
      >
        <VueAvatarEditor
          :width="280"
          :height="280"
          :border="0"
          :border-radius="140"
          @finished="onSaveAvatarClick"
        />
      </VDialog>
    </v-layout>
    <v-text-field
      v-model="employee.j.name"
      browser-autocomplete="name"
      label="Имя и Фамилия*"
      required
      :disabled="!employee.access"
      :rules="[ rules.required, rules.maxLength(50) ]"
      maxlength="50"
      class="businesscard-form__field"
    />
    <div class="dropdown-select">
      <v-select
        v-model="employee.j.category"
        placeholder="Должность*"
        :items="employeeCategories"
        :disabled="!employee.access"
        :rules="[ rules.required ]"
        attach=".infocard._edit .dropdown-select"
        class="businesscard-form__field"
      />
    </div>
    <PhoneEdit
      :phone="employee.j.phones[0]"
      :disabled="!employee.access"
      :removable="false"
      class="phone-input"
      @onEdit="employee.j.phones[0] = $event"
    />
    <v-textarea
      v-model="employee.j.notes"
      counter="500"
      height="auto"
      auto-grow
      rows="1"
      class="businesscard-form__field"
      maxlength="500"
      placeholder="Дополнительные сведения"
      :disabled="!employee.access"
      :rules="[value => value && (value.length <= 500 || 'Слишком длинный текст') || true]"
    />
  </v-layout>
</template>
<script>
import { mapGetters } from 'vuex'
import PhoneEdit from '~/components/common/PhoneEdit.vue'
import Avatar from '~/components/avatar/Avatar.vue'
import VueAvatarEditor from '~/components/avatar/VueAvatarEditor.vue'

export default {
  components: { Avatar, VueAvatarEditor, PhoneEdit },
  props: {
    employee: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      defaultImage: require('@/assets/user.svg'),
      rules: {
        required: value => !!value || 'Это поле обязательно для заполнения',
        maxLength: length => value =>
          (value && (value.length <= length || 'Слишком длинный текст')) || true
      },
      avatarEdit: false
    }
  },
  computed: {
    ...mapGetters({
      employeePositions: 'employee/employeePositions',
      employeeCategories: 'employee/employeeCategories',
    })
  },
  methods: {
    onSaveAvatarClick (canvasImg) {
      this.avatarEdit = false
      this.$emit('avatarChange', canvasImg)
    }
  }
}
</script>

<style lang="scss">
@import '~/assets/styles/phone-input.scss';
@import '~/assets/styles/dropdown-select.scss';

</style>
