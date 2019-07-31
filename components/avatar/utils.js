import { uuidv4 } from '~/components/utils'

export function canvasToFormData (img, fileName) {
  const blobBin = atob(img.toDataURL().split(',')[1])
  const array = []
  for (let i = 0; i < blobBin.length; i++) {
    array.push(blobBin.charCodeAt(i))
  }
  const file = new Blob([new Uint8Array(array)], { type: 'image/png' })
  const formData = new FormData()
  const newFileName = fileName || `${uuidv4()}.png`
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
