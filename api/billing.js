import axios from 'axios'
import { uuidv4 } from '~/components/utils'

export default () => {
  const requestId = uuidv4()
  const options = {
    baseURL: process.env.VUE_APP_BILLING_API,
    withCredentials: false,
    headers: {
      Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'Range-Unit': 'items',
      Prefer: 'count=exact',
      'X-Request-ID': requestId,
    },
  }
  return axios.create(options)
}
