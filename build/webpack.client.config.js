const path = require('path')
const merge = require('webpack-merge')
const baseConfig = require('./webpack.base.config')
const VueSSRClientPlugin = require('vue-server-renderer/client-plugin')

function resolve (...arg) {
  return path.resolve(__dirname, ...arg)
}

module.exports = merge(baseConfig, {
  entry: {
    app: resolve('../src/entry-client.js')
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all'
        }
      }
    }
  },
  plugins: [new VueSSRClientPlugin()]
})
