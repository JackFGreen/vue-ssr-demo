import Vue from 'vue'
import { createRouter } from './router'
import { createStore } from './store'
import { sync } from 'vuex-router-sync'
import App from './App.vue'

export function createApp (context = {}) {
  const router = createRouter()
  const store = createStore()

  // import all svg
  const svgs = require.context('./assets/img/svg', false, /\.svg$/)
  svgs.keys().forEach(svgs)

  sync(store, router)

  const app = new Vue({
    router,
    store,
    render: h => h(App)
  })
  return { app, router, store }
}
