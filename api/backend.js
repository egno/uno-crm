import axios from 'axios'
import { uuidv4 } from '~/components/utils'

export default () => {
  const requestId = uuidv4()
  let options = {
    baseURL: process.env.VUE_APP_API,
    withCredentials: false,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Prefer: 'count=exact',
      'X-Request-ID': requestId
    }
  }
  if (localStorage.getItem('accessToken')) {
    options.headers.Authorization = `Bearer ${localStorage.getItem(
      'accessToken'
    )}`
  }
  return axios.create(options)
}
