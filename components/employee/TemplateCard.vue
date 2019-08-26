<template>
  <div class="template-card">
    <div class="template-card__title">
      <template v-if="selectable">
        <input
          :checked="checked"
          :value="template.title"
          type="radio"
          class="template-card__input"
        >
        <label class="template-card__label" @click.stop="$emit('change', !checked)">
          <span>График {{ template.title }}</span>
          <span class="template-card__circle" />
        </label>
      </template>
      <span v-else>График {{ template.title }}</span>
    </div>
    <div class="template-card__slot">
      <slot name="default" />
    </div>
    <div v-if="editable" class="template-card__buttons">
      <button type="button" :class="['template-card__show-trigger', { up: visible }]" @click="visible = !visible" />
      <v-expand-transition>
        <div v-show="visible" class="template-card__buttons-visible">
          <button type="button" class="template-card__edit" @click="$emit('edit')" />
          <DeleteButton
            :is-dark="false"
            class="template-card__delete"
            delete-text="Удалить шаблон"
            @click.native.stop="$emit('delete')"
          />
        </div>
      </v-expand-transition>
    </div>
  </div>
</template>

<script>
import DeleteButton from '~/components/common/DeleteButton.vue'
import SmallCheckbox from '~/components/common/SmallCheckbox'

export default {
  name: 'TemplateCard',
  // eslint-disable-next-line vue/no-unused-components
  components: { DeleteButton, SmallCheckbox },
  props: {
    checked: {
      type: Boolean,
      default: false,
    },
    editable: {
      type: Boolean,
      default: false,
    },
    selectable: {
      type: Boolean,
      default: false,
    },
    template: {
      type: Object,
      default () {
        return {
          title: '',
        }
      },
    },
  },
  data () {
    return {
      visible: false,
    }
  },
}
</script>

<style lang="scss">
  .template-card {
    margin: 16px 0;
    min-height: 54px;
    flex-wrap: wrap;
    border-top: 2px solid #5699FF;
    background: #fff;
    &__title {
      display: flex;
      align-items: center;
      height: 50px;
      padding: 0 16px;
      font-weight: 600;
    }
    &__buttons {
      border-top: 1px solid rgba(137, 149, 175, 0.1);
    }
    &__show-trigger {
      width: 100%;
      height: 23px;
      background: url('~assets/images/down.png') center no-repeat;
      transform: rotate(0);
      transition: transform 0.5s;
      &.up {
        transform: rotate(180deg);
      }
    }
    &__buttons-visible {
      display: flex;
      width: 100%;
      justify-content: space-between;
    }
    &__edit {
      width: calc(50% - 2px);
      height: 55px;
      margin: 0 1px;
      background: url('~assets/images/svg/pencil.svg') center no-repeat  rgba(137, 149, 175, 0.5);
      border-radius: 2px;
    }
    &__delete {
      display: flex;
      align-items: center;
      width: calc(50% - 2px);
      height: 55px;
      margin: 0 1px;
      background: #EF4D37;
      border-radius: 2px;
      .delete-button {
        margin: 0 auto;
        path {
          fill-opacity: 1;
        }
      }
    }
    &__input {
      position: absolute;
      z-index: -1;
      opacity: 0;
    }
    &__label {
      display: flex;
      width: 100%;
      justify-content: space-between;
      color: #8995AF;
    }
    &__circle {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 16px;
      height: 16px;
      flex-shrink: 0;
      border: 1px solid rgba(137, 149, 175, 0.8);
      background: #fff;
      border-radius: 50%;
    }
    &__input:checked + &__label {
      color: #07101c;
      &>.template-card__circle:before {
        width: 10px;
        height: 10px;
        content: '';
        border-radius: 50%;
        background: #5699FF;
      }
    }
  }
</style>
