const path = require('path')
const webpack = require('webpack')
const merge = require('webpack-merge')
const baseConfig = require('./webpack.base.config')
const VueSSRClientPlugin = require('vue-server-renderer/client-plugin')
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')
// const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const { assetPath } = require('./utlis')

function resolve (...arg) {
  return path.resolve(__dirname, ...arg)
}

const isProd = process.env.NODE_ENV === 'production'
const hashLen = 8

module.exports = merge(baseConfig, {
  entry: {
    app: resolve('../src/entry-client.js')
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all'
        }
      }
    },
    minimizer: [new OptimizeCSSPlugin()]
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [
          isProd ? MiniCssExtractPlugin.loader : 'vue-style-loader',
          'css-loader',
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
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
      'process.env.VUE_ENV': '"client"'
    }),
    new VueSSRClientPlugin(),
    new webpack.HashedModuleIdsPlugin(),
    new MiniCssExtractPlugin({
      filename: `${assetPath('css')}/[name].[contenthash:${hashLen}].css`
    })
  ]
})
