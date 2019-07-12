import Vue from 'vue'
import { createRouter } from './router'
import { createStore } from './store'
import { sync } from 'vuex-router-sync'
import App from './App.vue'
import messages from './messages.json'
import vueI18n from './vueI18n'

export function createApp (context = {}) {
  const router = createRouter()
  const store = createStore()

  const i18n = vueI18n({ messages })

  // import all svg
  const svgs = require.context('./assets/img/svg', false, /\.svg$/)
  svgs.keys().forEach(svgs)

  sync(store, router)

  const app = new Vue({
    render: h => h(App),
    i18n,
    router,
    store
  })
  return { app, router, store }
}
