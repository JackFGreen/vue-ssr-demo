const path = require('path')

function resolve (...arg) {
  return path.resolve(__dirname, ...arg)
}

module.exports = {
  output: {
    path: resolve('../dist'),
    publicPath: '/dist/',
    filename: '[name].[chunkhash].js'
  },
  resolve: {
    alias: {
      vue$: 'vue/dist/vue.runtime.min.js',
      'vue-router': 'vue-router/dist/vue-router.min.js',
      // vuex$: 'vuex/dist/vuex.min.js'
    }
  }
}


