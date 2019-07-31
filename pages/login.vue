<template>
  <VContainer fluid fill-height justify-center class="login-page">
    <div class="login-page__container">
      <h1 class="login-page__heading">
        Авторизация
      </h1>
      <Login />
    </div>
  </VContainer>
</template>

<script>
import Login from '~/components/Login'

export default {
  components: {
    Login
  }
}
</script>

<style lang="scss">
.login-page {
  background-color: #fff;
  &__container {
    margin-top: -60px;
  }
  &__heading {
    margin-bottom: 23px;
    font-family: Roboto Slab;
    font-style: normal;
    font-weight: normal;
    font-size: 24px;
    text-align: center;
    color: #07101c;
  }
  &__no-account {
    display: block;
    text-align: center;
    margin-top: 10px;
    text-decoration: none;
  }

  .login-form {
    margin-bottom: 20px;
  }
  input {
    width: 280px;
    padding: 8px 0 7px 18px;
  }
  .businesscard-form__field:first-child {
    margin-bottom: 38px;
  }
  .save-info {
    margin-top: 32px;
  }
}
</style>
