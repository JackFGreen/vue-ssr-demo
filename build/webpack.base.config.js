const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const { VueLoaderPlugin } = require('vue-loader')
const StyleLintPlugin = require('stylelint-webpack-plugin')
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin')
const ProgressBarPlugin = require('progress-bar-webpack-plugin')
const chalk = require('chalk')
const merge = require('webpack-merge')
const { assetPath } = require('./utlis')

function resolve (...arg) {
  return path.resolve(__dirname, ...arg)
}

const isProd = process.env.NODE_ENV === 'production'

const limitSize = 4096
const hashLen = 8

function generateFileLoader (dir) {
  return {
    loader: 'url-loader',
    options: {
      limit: limitSize,
      fallback: {
        loader: 'file-loader',
        options: {
          name: `${assetPath(dir)}/[name].[hash:${hashLen}].[ext]`
        }
      }
    }
  }
}

// svg-sprite-loader directory
const svgDir = resolve(`../src/${assetPath('assets/img/svg')}`)

const svgoConfig = {
  plugins: [
    {
      removeTitle: true
    }
  ]
}

const svgSpriteConfig = merge(svgoConfig, {
  plugins: [
    {
      removeAttrs: {
        attrs: '(stroke|fill)'
      }
    }
  ]
})

function generateImgWbLoader () {
  return {
    loader: 'image-webpack-loader',
    options: {
      svgo: svgoConfig,
      mozjpeg: {
        progressive: true,
        quality: 65
      },
      pngquant: {
        quality: '65-90',
        speed: 4
      },
      gifsicle: {
        interlaced: true,
        colors: 64,
        optimizationLevel: 3
      }
    }
  }
}

const config = {
  mode: process.env.NODE_ENV,
  devtool: isProd ? false : '#cheap-module-source-map',
  output: {
    path: resolve('../dist'),
    publicPath: '/',
    filename: `${assetPath('js')}/[name].[chunkhash:${hashLen}].js`
  },
  resolve: {
    extensions: ['.mjs', '.js', '.jsx', '.vue', '.json', '.wasm'],
    alias: {
      vue$: 'vue/dist/vue.runtime.min.js',
      'vue-router': 'vue-router/dist/vue-router.min.js'
    }
  },
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.(js|vue)$/,
        loader: 'eslint-loader',
        exclude: /node_modules/
      },
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        include: [resolve('../src'), resolve('../node_modules/demo-lib')]
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      // i18n
      {
        resourceQuery: /blockType=i18n/,
        type: 'javascript/auto',
        loader: '@kazupon/vue-i18n-loader'
      },
      {
        test: /\.svg$/,
        include: [resolve(svgDir)],
        use: [
          {
            loader: 'svg-sprite-loader'
          },
          {
            loader: 'image-webpack-loader',
            options: {
              // https://github.com/svg/svgo#what-it-can-do
              svgo: svgSpriteConfig
            }
          }
        ]
      },
      {
        test: /\.(png|jpe?g|gif|webp|svg)(\?.*)?$/,
        exclude: [resolve(svgDir)],
        use: [generateFileLoader('img'), generateImgWbLoader()]
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        use: [generateFileLoader('media')]
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/i,
        use: [generateFileLoader('fonts')]
      }
    ]
  },
  plugins: [
    new VueLoaderPlugin(),
    new MiniCssExtractPlugin({
      filename: `${assetPath('css')}/[name].[contenthash:${hashLen}].css`
    }),
    new StyleLintPlugin({
      files: ['**/*.{vue,htm,html,css,sss,less,scss,sass}']
    }),
    new CaseSensitivePathsPlugin(),
    new ProgressBarPlugin({
      format: '  build [:bar] ' + chalk.green.bold(':percent') + ' (:elapsed seconds)',
      clear: false
    })
  ]
}

module.exports = config
