<template>
  <div class="template-card">
    <!-- todo replace with radiobuttons -->
    <div class="template-card__title">
      <SmallCheckbox
        v-if="selectable"
        :id="template.title"
        :name="template.title"
        :value="template.title"
        :checked="checked"
        @change="$emit('change', $event)"
      >
        График {{ template.title }}
      </SmallCheckbox>
      <span v-else>График {{ template.title }}</span>
    </div>
    <div>
      <slot name="default" />
    </div>
    <div v-if="editable" class="template-card__buttons">
      <button type="button" class="template-card__edit" @click="$emit('edit')" />
      <DeleteButton
        :is-dark="false"
        class="template-card__delete"
        delete-text="Удалить шаблон"
        @click.native.stop="$emit('delete')"
      />
    </div>
  </div>
</template>

<script>
import DeleteButton from '~/components/common/DeleteButton.vue'
import SmallCheckbox from '~/components/common/SmallCheckbox'

export default {
  name: 'TemplateCard',
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
      }
    }
    .default-checkbox {
      width: 100%;
      margin-top: 0;
    }
    .default-checkbox__checkbox {
      border-radius: 50%;
    }
    .default-checkbox__label {
      font-weight: 600;
      color: #07101C;
    }
  }
</style>
