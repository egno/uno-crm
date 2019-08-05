import axios from 'axios'
import { uuidv4 } from '~/components/utils'

export default (noToken = false) => {
  const requestId = uuidv4()
  const options = {
    baseURL: process.env.VUE_APP_API,
    withCredentials: false,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Prefer: 'count=exact',
      'X-Request-ID': requestId
    }
  }
  if (process.client && localStorage.getItem('accessToken') && !noToken) {
    options.headers.Authorization = `Bearer ${localStorage.getItem(
      'accessToken'
    )}`
  }
  return axios.create(options)
}
