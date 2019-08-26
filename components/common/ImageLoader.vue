<template>
  <div>
    <form enctype="multipart/form-data" novalidate>
      <input
        type="file"
        :multiple="multiple"
        :name="uploadFieldName"
        :disabled="!!status"
        accept="image/*"
        class="input-file"
        @change="
          filesChange($event.target.name, $event.target.files)
          fileCount = $event.target.files.length
        "
      >
      <p v-if="placeText && !hasSlot && !status">
        {{ placeText }}
      </p>
      <slot v-else name="add-photo-button" />
    </form>
  </div>
</template>

<script>
import axios from 'axios'
import { mapGetters } from 'vuex'
import { uuidv4 } from '~/components/utils'

export default {
  props: {
    aspectRatio: { type: Number, default: 1 },
    multiple: { type: Boolean, default: false },
    placeText: { type: String, default: 'Перетащите файлы сюда' },
    src: { type: String, default: undefined },
    placeHolder: { type: String, default: undefined },
    hasSlot: { type: Boolean, default: false },
  },
  data () {
    return {
      fileCount: undefined,
      status: undefined,
      uploadFieldName: 'file',
    }
  },
  computed: {
    ...mapGetters({ businessId: 'business/businessId' }),
  },
  methods: {
    filesChange (fieldName, fileList) {
      const formData = new FormData()
      const fileNames = []
      if (!fileList.length) { return }
      Array.from(Array(fileList.length).keys()).map((x) => {
        const newFile = { file: fileList[x].name, path: uuidv4() }
        fileNames.push(newFile)
        formData.append(fieldName, fileList[x], newFile.path)
      })
      this.saveImage(formData, fileNames)
    },
    saveImage (formData, fileNames) {
      this.status = 'process'
      const vm = this
      if (!this.businessId) { return }
      axios
        .post(process.env.VUE_APP_UPLOAD, formData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            businessid: this.businessId,
          },
        })
        .then((res) => {
          if (res.status === 200) {
            this.$emit('onFilesUpload', { formData, fileNames })
          }
        })
        .then(() => {
          vm.status = ''
        })
        .catch(function () {
          console.log('FAILURE!!')
          vm.status = ''
        })
    },
  },
}
</script>

<style lang="scss" scoped>
form {
  position: relative;
  width: 100%;
  height: 100%;
}
input[type='file'] {
  position: absolute;
  left: 0;
  top: 0;
  display: block;
  width: 100%;
  height: 100%;
  opacity: 0;
  &:hover {
    cursor: pointer;
  }
}
</style>
