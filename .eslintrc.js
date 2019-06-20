module.exports = {
  parserOptions: {
    parser: 'babel-eslint'
  },
  extends: ['standard', 'plugin:vue/essential'],
  plugins: ['vue'],
  rules: {
    'generator-star-spacing': 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off'
  }
}
