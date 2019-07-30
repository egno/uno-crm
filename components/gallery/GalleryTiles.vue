<template>
  <v-card flat>
    <v-container
      grid-list-xs
      fluid
      align-content-space-between
      fill-height
      pa-2
    >
      <v-layout
        row
        wrap
      >
        <v-flex
          v-for="(image, n) in currentImages"
          :key="n"
          xs4
          @click="showSlider(n)"
        >
          <v-card
            flat
            tile
            class="d-flex"
          >
            <v-img
              :src="image"
              aspect-ratio="1"
            >
              <v-layout
                slot="placeholder"
                fill-height
                align-center
                justify-center
                ma-0
              >
                <v-progress-circular
                  indeterminate
                  color="grey lighten-5"
                />
              </v-layout>
            </v-img>
          </v-card>
        </v-flex>
        <v-flex
          v-if="more"
          xs4
        >
          <v-btn
            block
            depressed
            large
            @click="onClickMore"
          >
            Ещё {{ imagesArray.length - currentImages.length }}
          </v-btn>
        </v-flex>
        <v-flex
          v-if="addPlace"
          xs4
        >
          <form
            enctype="multipart/form-data"
            novalidate
          >
            <div class="dropbox">
              <input
                type="file"
                multiple
                :name="uploadFieldName"
                :disabled="!isInitial"
                accept="image/*"
                class="input-file"
                @change="filesChange($event.target.name, $event.target.files); fileCount = $event.target.files.length"
              >
              <p v-if="isInitial">
                Перетащите фалы сюда
              </p>
              <p v-if="!isInitial">
                Загружено файлов: {{ fileCount }}
              </p>
            </div>
          </form>
        </v-flex>
      </v-layout>
    </v-container>
  </v-card>
</template>

<script>
import axios from 'axios'
import { mapGetters } from 'vuex'
import Api from '@/api/backend'
import { uuidv4 } from '@/components/utils'

export default {
  props: {
    edit: { type: Boolean, default: false },
    company: { type: String, default: undefined },
    service: { type: String, default: undefined },
    employee: { type: String, default: undefined },
    images: { type: Array, default: undefined },
    fixed: { type: Boolean, default: false },
    rows: { type: Number, default: 3 },
    to: { type: Object, default: undefined }
  },
  data () {
    return {
      full: false,
      data: [],
      index: 0,
      isInitial: true,
      uploadFieldName: 'file'
    }
  },
  computed: {
    ...mapGetters({ businessId: 'business/businessId'}),
    addPlace () {
      return (
        this.employee && this.service && !this.fixed && this.edit && !this.more
      )
    },
    currentCompany () {
      return this.company || this.businessId
    },
    currentImages () {
      if (!this.imagesArray) return
      if (!this.full) {
        return this.imagesArray.slice(
          0,
          this.maxImages -
            (!this.fixed &&
            (this.edit || this.imagesArray.length !== this.maxImages)
              ? 1
              : 0)
        )
      }
      return this.imagesArray
    },
    imagesArray () {
      return (
        this.data &&
        this.businessId &&
        this.data.map(
          x => `${process.env.VUE_APP_IMAGES}${this.businessId}/${x.id}`
        )
      )
    },
    maxImages () {
      return this.rows * 3
    },
    more () {
      return (
        !this.fixed &&
        this.imagesArray &&
        this.imagesArray.length > this.currentImages.length
      )
    }
  },
  watch: {
    currentCompany: 'load',
    business: 'load',
    images: 'load',
    employee: 'load',
    dervice: 'load'
  },
  mounted () {
    this.load()
  },
  methods: {
    filesChange (fieldName, fileList) {
      const formData = new FormData()
      let fileNames = []
      if (!fileList.length) return
      Array.from(Array(fileList.length).keys()).map(x => {
        const newFile = { file: fileList[x].name, path: uuidv4() }
        fileNames.push(newFile)
        formData.append(fieldName, fileList[x], newFile.path)
      })
      this.saveImage(formData, fileNames)
    },
    load () {
      if (this.images) {
        this.data = this.images
        return
      }
      if (!this.currentCompany) return
      let cond = [`business_id.eq.${this.currentCompany}`]
      if (this.service) {
        cond.push(`services.cs.{${this.service}}`)
      }
      if (this.employee) {
        cond.push(`employees.cs.{${this.employee}}`)
      }
      let filterString = `and=(${cond.join(',')})`
      if (!filterString) return
      if (this.fixed) {
        filterString = `${filterString}&limit=${this.maxImages}`
      }
      let vm = this
      Api()
        .get(`gallery?${filterString}`)
        .then(res => res.data)
        .then(res => {
          vm.data = res.map(x => {
            return { id: x.id, j: x.j }
          })
        })
    },
    onClickMore () {
      if (this.to) {
        this.$router.push(this.to)
      } else {
        this.full = true
      }
    },
    showSlider (payload) {
      this.$emit('showSlider', payload)
    },

    saveImage (formData, fileNames) {
      this.isInitial = false
      let vm = this
      if (!this.businessId) return
      axios
        .post(process.env.VUE_APP_UPLOAD, formData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            businessid: this.businessId
          }
        })
        .then(() => {
          let url = 'gallery'
          let payload = fileNames.map(x => {
            return {
              id: x.path,
              business_id: this.businessId,
              j: {
                file_name: x.file,
                service: [this.service],
                employee: [this.employee]
              }
            }
          })
          Api()
            .post(url, payload)
            .then(() => {
              vm.data = [...payload, ...vm.data]
            })
        })
        .then(() => {
          vm.isInitial = true
        })
        .catch(function () {
          console.log('FAILURE!!')
          vm.isInitial = true
        })
    }
  }
}
</script>
