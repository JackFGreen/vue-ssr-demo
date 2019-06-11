const Vue = require("vue");
const { createRouter } = require("./router");
const { createStore } = require("./store");
const { sync } = require("vuex-router-sync");

exports.createApp = (context = {}) => {
  const router = createRouter();
  const store = createStore();

  sync(store, router);

  const app = new Vue({
    router,
    store,
    data () {
      return {
        url: context.url || router.currentRoute.path
      }
    },
    render(h) {
      const routerView = h("router-view");

      return h(
        "div",
        {
          attrs: {
            id: "app"
          }
        },
        [`访问的 URL 是： ${this.url}`, routerView]
      );
    }
  });
  return { app, router, store };
};
