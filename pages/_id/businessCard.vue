<template>
  <div class="businesscard" :class="{ '_edit-mode': editMode }">
    <div class="businesscard__header">
      <div class="businesscard__header-content">
        <VFlex class="businesscard__heading">
          <h1 class="businesscard__h1">
            {{ businessInfo && businessInfo.category }}
          </h1>
        </VFlex>
        <div
          v-if="!editMode && businessInfo && businessInfo.access"
          class="businesscard__edit"
        >
          <v-btn icon fab flat ripple @click="editMode = true">
            <svg
              width="13"
              height="20"
              viewBox="0 0 13 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M9.40402 0L13 2.13162L11.3998 4.82815L7.80374 2.69653L9.40402 0ZM7.27032 3.59534L10.8663 5.72696L4.46522 16.5131L4.46514 16.5131L0 19.9415L0.869124 14.3814L0.869208 14.3815L7.27032 3.59534Z"
                fill="#8995AF"
                fill-opacity="0.35"
              />
            </svg>
          </v-btn>
        </div>
        <div v-if="editMode">
          <button class="businesscard__close" @click="editMode = false">
            <svg
              width="22"
              height="22"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M13 4L12 3L8 7L4 3L3 4L7 8L3 12L4 13L8 9L12 13L13 12L9 8L13 4Z"
                fill="#8995AF"
                fill-opacity="0.35"
              />
            </svg>
          </button>
        </div>
      </div>
      <div class="businesscard__instructions">
        <a
          href="https://drive.google.com/open?id=1m_AFYItiKC64SGfXfjQbqzNeJZZvMJGC"
          target="_blank"
        >
          Краткая инструкция для пользователей
        </a>
      </div>
    </div>

    <BusinessCardEdit
      v-if="editMode"
      :business-info="businessInfo"
      :current-tab="infoTab ? 'infoTab' : 'scheduleTab'"
      @tabChange="onTabChange"
      @saved="editMode = false"
    />
    <BusinessCard
      v-else
      :business-info="businessInfo"
      @onEditClick="editMode = true"
    />
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import BusinessCard from '~/components/business/BusinessCard.vue'
import BusinessCardEdit from '~/components/business/BusinessCardEdit.vue'
import { filials } from '~/components/business/mixins'

export default {
  components: {
    BusinessCard,
    BusinessCardEdit,
  },
  mixins: [ filials ],
  data () {
    return {
      editMode: false,
      infoTab: true,
      newBusinessInfo: {},
    }
  },
  computed: {
    ...mapGetters({
      businessInfo: 'business/businessInfo',
    }),
    id () {
      return this.$route.params.id
    },
  },
  watch: {
    id: 'checkId',
  },
  mounted () {
    this.checkId()
    this.setActions(null)
  },
  methods: {
    ...mapActions({ setActions: 'common/setActions' }),
    checkId () {
      if (this.id === 'new') {
        this.editMode = true
      }
    },
  },
}
</script>

<style lang="scss">
@import '~assets/styles/common.scss';
@import '~assets/styles/icon.scss';
@import '~assets/styles/businesscard-tabs.scss';
@import '~assets/styles/businesscard-form.scss';

.businesscard {
  height: 100%;
  display: flex;
  align-items: stretch;
  flex-direction: column;

  &__header {
    position: relative;
    min-height: 128px;
    flex-grow: 0;
    background: #fff;
    border-bottom: 1px solid rgba(137, 149, 175, 0.1);
  }
  &__header-content {
    display: flex;
    justify-content: space-between;
    padding: 44px 0 44px 47px;
    @media only screen and (min-width: $tablet) {
      width: 524px;
      margin: 0 auto;
      padding-left: 0;
      justify-content: flex-start;
    }
    @media only screen and (min-width: $desktop) {
      margin-left: 127px;
      justify-content: flex-start;
    }
  }

  &__heading {
    flex-grow: 0;
  }

  &__instructions {
    position: absolute;
    display: none;
    top: 0;
    bottom: 0;
    right: 40px;

    @media only screen and (min-width: $desktop) {
      display: flex;
      align-items: center;
    }

    a {
      font-weight: 900;
      font-size: 16px;
      text-decoration: none;
      &:hover {
        text-decoration: underline;
      }
    }
  }

  &__h1 {
    font-family: $roboto;
    font-style: normal;
    font-weight: normal;
    font-size: 24px;
    line-height: normal;
    color: #07101c;
  }

  &__edit {
    margin-right: 11px;
    @media only screen and (min-width: $tablet) {
      margin-left: 40px;
    }
    &:hover {
      path {
        fill: #000;
      }
    }
    button.v-btn {
      @include uno-icon();
      border: 1px solid rgba(137, 149, 175, 0.1);
      &:hover {
        border-color: transparent;
        color: rgba(0, 0, 0, 0.4);
      }
    }
  }

  &__close {
    @extend %inline-svg-close;
    padding-top: 0;
  }

  &__phone {
    padding-left: 24px;
    background: url('~assets/images/svg/ru.svg') left top no-repeat;
  }

  &._edit-mode {
    .businesscard__header {
      border-bottom-color: transparent;
    }
  }

  & .avatar-letters {
    font-size: 80px;
  }
}

.soc {
  &__input {
    position: relative;
    @extend %vertical-align;
    &:before {
      position: absolute;
      width: 18px;
      height: 18px;
      bottom: 8px;
      left: 16px;
      content: '';
      background: url('~assets/sllink.svg') no-repeat center center;
      background-size: 18px;
      z-index: 1;
    }
    &._ig {
      &:before {
        background: url('~assets/images/svg/igg.svg') no-repeat center;
      }
    }
    &._vk {
      &:before {
        background: url('~assets/images/svg/vkk.svg') no-repeat center;
      }
    }

    input {
      padding-left: 44px;
    }
  }
  &__value {
    position: relative;
    padding: 20px 0 0 30px;
    &:before {
      position: absolute;
      width: 18px;
      height: 18px;
      top: 19px;
      left: 0;
      content: '';
      background: url('~assets/sllink.svg') no-repeat center;
      background-size: 18px;
    }
    &._ig {
      &:before {
        background: url('~assets/images/svg/igg.svg') no-repeat center;
      }
    }
    &._vk {
      &:before {
        background: url('~assets/images/svg/vkk.svg') no-repeat center center;
      }
    }
  }
}
</style>
