<template>
  <div class="">
    <div class="colors-list">
      <div
        v-for="c in colors"
        :key="c"
        class=""
      >
        <input
          :id="c"
          v-model="active"
          class="color-input"
          type="radio"
          :value="`#${c}`"
          @click="$emit('click', `#${c}`)"
        >
        <label
          :for="c"
          class="color-label"
        >
          <div :style="{ background: `#${c}` }" />
        </label>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    color: { type: String, default: '' },
    colors: {
      type: Array,
      default () {
        return [
          'DFC497',
          'F3AA57',
          '85CA86',
          '49C9B7',
          '5A96DF',
          'F36B6B',
          'F37F6B',
          'DF8CB2',
          'B88AB2',
          '8589DF'
        ]
      }
    }
  },
  data () {
    return {
      active: ''
    }
  },
  mounted () {
    this.active = this.color
  }
}
</script>


<style scoped>
.colors-list {
    max-width: 250px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  padding: 0 10px;
  margin-top: 20px;
}

.color-label {
  display: inline-block;
  width: 32px;
  height: 32px;
  margin: 0 6px;
  border-radius: 50%;
  padding: 4px;
  cursor: pointer;
}

.color-label div {
  height: 24px;
  border-radius: 50%;
}

.color-input {
  display: none;
}
.color-input:checked + label {
  background-color: rgba(137, 149, 175, 0.2);
}
</style>
