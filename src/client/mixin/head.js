/**
 * set page head
 * @module headMixin
 * @example
 * import head from '../mixin/head'
 *
 * export default {
 *   mixin: [head],
 *   head () {
 *     return {
 *       title: 'page-title',
 *       description: 'page-description',
 *       keywords: 'page-keywords'
 *     }
 *   }
 * }
 */

/**
 * vue instatnce
 * @typedef {Object} VM
 */

/**
 * @typedef {Object} Head
 * @property {String} title title
 * @property {String} description description
 * @property {String} keywords keywords
 */

/**
 * get component head
 * @param {VM}
 * @returns {Head}
 */
function getHead (vm) {
  // 组件可以提供一个 `title` 选项
  // 此选项可以是一个字符串或函数
  const { head } = vm.$options
  if (head) {
    return typeof head === 'function' ? head.call(vm) : head
  }
}

/**
 * set server head
 */
const serverHeadMixin = {
  created () {
    const head = getHead(this)
    if (head) {
      const { title, description, keywords } = head
      this.$ssrContext.title = title
      this.$ssrContext.description = description
      this.$ssrContext.keywords = keywords
    }
  }
}

/**
 * set client head
 */
const clientHeadMixin = {
  mounted () {
    const head = getHead(this)
    if (head) {
      const { title, description, keywords } = head
      document.title = title
      document.querySelector('meta[name=description]').setAttribute('content', description)
      document.querySelector('meta[name=keywords]').setAttribute('content', keywords)
    }
  }
}

const headMixin = process.env.VUE_ENV === 'server' ? serverHeadMixin : clientHeadMixin
export default headMixin
