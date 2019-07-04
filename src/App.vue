<i18n src="./app.json"></i18n>
<template>
  <div id="app">
    <!-- i18n -->
    <button v-for="(item, index) in langs" :key="index" @click="$root.$i18n.locale = item">{{item}}</button>
    {{$t('hello')}}{{$t('world')}}

    <!-- img svg -->
    <img src="./assets/img/logo-48.png" alt>
    <img src="./assets/img/actor.svg" alt>
    <svg class="icon-svg">
      <use xlink:href="#account"></use>
    </svg>

    <!-- router -->
    访问的 URL 是： {{ url }}
    <router-link class="router-link" v-for="(item, index) in routes" :key="index" :to="item.path">
      {{
      item.path.slice(1)
      }}
    </router-link>
    <routerView/>
  </div>
</template>

<script>
import { routes } from './router'

export default {
  name: 'App',
  data () {
    const url = this.$route.path
    return {
      routes: routes.slice(1),
      url,
      langs: [
        'zh-CN',
        'en-US'
      ]
    }
  },
  watch: {
    $route (route) {
      this.url = route.path
    }
  }
}
</script>

<style lang="scss">
#app {
  background: url('./assets/img/1.jpg') no-repeat center;

  .router-link {
    display: flex;
    padding: 0 10px;
  }

  .icon-svg {
    width: 16px;
    height: 16px;
    fill: red;
  }
}
</style>
