<template>
  <ul class="main-page__links">
    <li class="main-page__link">
      <a
        target="_blank"
        href="https://vk.com/unocrm"
        class="vk"
        @click="$emit('click')"
      />
    </li>
    <li class="main-page__link">
      <a
        target="_blank"
        href="https://www.facebook.com/unocrm"
        class="fb"
        @click="$emit('click')"
      />
    </li>
    <li class="main-page__link">
      <a
        target="_blank"
        href="https://www.instagram.com/crm_uno/"
        class="ig"
        @click="$emit('click')"
      />
    </li>
  </ul>
</template>

<script>
export default {
  name: 'SocialsVue'
}
</script>

<style lang="scss" scoped>
@import '~assets/styles/common.scss';

.main-page__links {
  display: flex;
  width: 207px;
  padding: 16px 0;
  align-items: center;
  justify-content: space-between;
  list-style: none;
  @media only screen and (min-width: $tablet) {
    width: 214px;
  }
}
.main-page__link {
  a {
    display: inline-flex;
    &.vk {
      width: 28px;
      height: 16px;
      background: url('~assets/images/svg/vk.svg') center/contain no-repeat;
    }
    &.fb {
      width: 16px;
      height: 29px;
      background: url('~assets/images/svg/fb.svg') center/contain no-repeat;
    }
    &.ig {
      width: 27px;
      height: 27px;
      background: url('~assets/images/ig.png') center/contain no-repeat;
    }
  }
}
</style>
