<template>
  <VLayout align-center>
    <div>
      <Avatar
        :name="initiales || null"
        size="80px"
        :src="employee && employee.avatar"
        :required="true"
      />
    </div>
    <VFlex class="badge-text">
      <VFlex class="badge-text__specialty">
        {{ employee && employee.category }}
      </VFlex>
      <VFlex>{{ employee && employee.name }} {{ employee && employee.surname }}</VFlex>
    </VFlex>
  </VLayout>
</template>

<script>
  import Avatar from '@/components/avatar/Avatar.vue'
  import { imagePath } from '@/components/avatar/utils'

  export default {
    components: {
      Avatar,
    },
    props: {
      employee: { type: Object, default: undefined },
    },
    computed: {
      avatarPath () {
        if (!this.employee || !this.employee.avatar) {
          return
        }
        return imagePath(this.employee.avatar)
      },
      initiales () {
        if (!this.employee) {
          return
        }
        return this.employee.name + ' ' + this.employee.surname
      },
    },
    methods: {
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
    height: 80px;
    width: 80px;
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
  .badge-text {
    padding-left: 16px;
    font: 400 18px Roboto Slab, Times New Roman, Times, serif;
    font-weight: normal;
    line-height: normal;
    font-size: 18px;
    &__specialty {
      font-family: Lato, sans-serif;
      font-weight: normal;
      line-height: normal;
      font-size: 14px;
      color: #8995AF;
    }
  }
</style>
