import axios from 'axios'
import { uuidv4 } from '~/components/utils'

export default () => {
  const requestId = uuidv4()
  const options = {
    baseURL: process.env.VUE_APP_UPLOAD,
    headers: {
      'Content-Type': 'multipart/form-data',
      'X-Request-ID': requestId,
    },
  }
  if (localStorage.getItem('accessToken')) {
    options.headers.Authorization = `Bearer ${localStorage.getItem(
      'accessToken'
    )}`
  }
  return axios.create(options)
}
