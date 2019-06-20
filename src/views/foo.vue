<script>
export default {
  asyncData ({ store, route }) {
    return store.dispatch('getList')
  },
  data () {
    return {}
  },
  computed: {
    list () {
      return this.$store.state.list
    }
  },
  render (h) {
    const tag = 'div'
    const data = {
      class: 'page-foo'
    }
    const children = this.list.map(el => {
      return h('p', el.zh_name)
    })
    return h(tag, data, ['render from h() function', children])
  }
}
</script>
