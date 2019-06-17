const Vue = require("vue");
const Router = require("vue-router");
const Foo = require("./pages/foo");

Vue.use(Router);

exports.createRouter = () => {
  return new Router({
    mode: "history",
    routes: [
      {
        path: "/"
      },
      {
        path: "/foo",
        component: Foo
      },
      {
        path: "/bar",
        component: () => import('./pages/bar.vue')
      }
    ]
  });
};
