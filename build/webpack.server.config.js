const path = require('path')
const merge = require('webpack-merge')
const nodeExternals = require('webpack-node-externals')
const baseConfig = require('./webpack.base.config')
const VueSSRServerPlugin = require('vue-server-renderer/server-plugin')

function resolve (...arg) {
  return path.resolve(__dirname, ...arg)
}

module.exports = merge(baseConfig, {
  target: 'node',
  entry: resolve('../src/entry-server.js'),
  output: {
    libraryTarget: 'commonjs2'
  },
  externals: nodeExternals({
    whitelist: /\.css$/
  }),
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [
          'null-loader',
          'postcss-loader',
          {
            loader: 'sass-loader',
            options: {
              indentedSyntax: false
            }
          }
        ]
      }
    ]
  },
  plugins: [new VueSSRServerPlugin()]
})
