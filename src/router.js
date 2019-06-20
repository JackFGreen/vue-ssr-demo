import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

function loadView (view) {
  return () =>
    import(
      /* webpackChunkName: "[request]" */
      `./views/${view}.vue`
    )
}

export const routes = [
  {
    path: '/'
  },
  {
    path: '/foo',
    component: loadView('foo')
  },
  {
    path: '/bar',
    component: loadView('bar')
  }
]

export function createRouter () {
  return new Router({
    mode: 'history',
    routes
  })
}
