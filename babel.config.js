module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        modules: 'commonjs',
        useBuiltIns: 'usage',
        corejs: '2.0.0'
      }
    ]
  ],
  plugins: [
    'transform-vue-jsx',
    '@babel/plugin-syntax-dynamic-import',
    [
      '@babel/plugin-transform-runtime',
      {
        corejs: 2
      }
    ]
  ]
}
