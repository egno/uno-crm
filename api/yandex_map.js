import axios from 'axios'

export function geocode (address) {
  return axios.get(
    `https://geocode-maps.yandex.ru/1.x?geocode=${address}&kind=house&format=json&lang=ru_RU`
  )
}
