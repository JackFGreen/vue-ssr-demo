import Vue from "vue";
import Router from "vue-router";
import Foo from "./pages/foo";

Vue.use(Router);

export const routes = [
  {
    path: "/"
  },
  {
    path: "/foo",
    component: Foo
  },
  {
    path: "/bar",
    component: () => import("./pages/bar.vue")
  }
]

export function createRouter() {
  return new Router({
    mode: "history",
    routes
  });
}
