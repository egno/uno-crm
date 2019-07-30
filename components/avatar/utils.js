import { uuidv4 } from '~/components/utils'

export function canvasToFormData (img, fileName) {
  var blobBin = atob(img.toDataURL().split(',')[1])
  var array = []
  for (var i = 0; i < blobBin.length; i++) {
    array.push(blobBin.charCodeAt(i))
  }
  var file = new Blob([new Uint8Array(array)], { type: 'image/png' })
  let formData = new FormData()
  let newFileName = fileName || `${uuidv4()}.png`
  formData.append('file', file, newFileName)
  return formData
}

export function imagePath (src) {
  return (
    src &&
    src !== '' &&
    src !== null &&
    `${process.env.VUE_APP_IMAGES || ''}${src}`
  )
}
