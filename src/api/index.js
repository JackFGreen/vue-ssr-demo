import axios from 'axios'

const ajax = axios.create({ baseURL: 'http://localhost:3000' })

export function getList () {
  return ajax.get('/country.json')
}
