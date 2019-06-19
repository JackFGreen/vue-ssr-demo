<template>
  <div id="app">
    访问的 URL 是： {{ url }}
    <routerView />
  </div>
</template>

<script>
export default {
  name: "App",
  data() {
    const url = this.$route.path
    return {
      url
    };
  }
};
</script>
