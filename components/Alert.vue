<template>
  <div>
    <VAlert v-model="alert" dismissible type="error">
      {{ message }}
    </VAlert>
  </div>
</template>

<script>
export default {
  props: {
    message: { type: String, default: () => '' }
  },
  data () {
    return {
      alert: true
    }
  }
}
</script>
