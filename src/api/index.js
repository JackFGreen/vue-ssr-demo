import axios from 'axios'

const ajax = axios.create({ proxy: { host: '127.0.0.1', port: 3000 } })

export function getList () {
  return ajax.get('/country.json')
}
