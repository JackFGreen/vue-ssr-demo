<template>
  <div id="app">
    访问的 URL 是： {{ url }}
    <router-link
      class="router-link"
      v-for="(item, index) in routes"
      :key="index"
      :to="item.path"
    >{{item.path.slice(1)}}</router-link>
    <routerView/>
  </div>
</template>

<script>
import { routes } from "./router";

export default {
  name: "App",
  data() {
    const url = this.$route.path;
    return {
      routes: routes.slice(1),
      url
    };
  },
  watch: {
    $route (route) {
      this.url = route.path
    }
  }
};
</script>

<style lang="scss">
#app {
  .router-link {
    padding: 0 10px;
  }
}
</style>
