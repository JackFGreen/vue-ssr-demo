const path = require('path')
const merge = require('webpack-merge')
const nodeExternals = require('webpack-node-externals')
const baseConfig = require('./webpack.base.config')
const VueSSRServerPlugin = require('vue-server-renderer/server-plugin')

function resolve (...arg) {
  return path.resolve(__dirname, ...arg)
}

module.exports = merge(baseConfig, {
  mode: 'production',
  entry: resolve('../src/entry-server.js'),
  target: 'node',
  // devtool: 'source-map',
  output: {
    libraryTarget: 'commonjs2'
  },
  externals: nodeExternals({
    whitelist: /\.css$/
  }),
  plugins: [
    new VueSSRServerPlugin()
  ]
})
