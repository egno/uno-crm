import Api from '@/api/backend'

export function imagePath (imgId, businessId) {
  return (
    imgId &&
    imgId !== '' &&
    imgId !== null &&
    `${process.env.VUE_APP_IMAGES}${businessId}/${imgId}`
  )
}

export function deleteImage (id) {
  if (!id)
    return new Promise(function (resolve, reject) {
      reject('no ID')
    })
  return Api().delete(`gallery?id=eq.${id}`)
}

export function isMobile () {
  return window.innerWidth < 1360
}
