<script>
import head from '../mixin/head'

export default {
  name: 'bar',
  mixins: [head],
  head () {
    return {
      title: 'bar'
    }
  },
  data () {
    return {}
  },
  render () {
    return <div class='page-bar'>render form jsx</div>
  }
}
</script>
