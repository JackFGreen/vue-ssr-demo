const Vue = require("vue");
const { createRouter } = require("./router");
const { createStore } = require("./store");
const { sync } = require("vuex-router-sync");
// const App = require('./App.vue')
// import App from './App.vue'

exports.createApp = (context = {}) => {
  const router = createRouter();
  const store = createStore();

  sync(store, router);

  const app = new Vue({
    router,
    store,
    data() {
      return {
        url: context.url || router.currentRoute.path
      };
    },
    // render: h => h(App)
    render(h) {
      return h(
        "div",
        {
          id: "app"
        },
        [`访问的 URL 是： ${this.url}`, h("routerView")]
      );
    }
  });
  return { app, router, store };
};
