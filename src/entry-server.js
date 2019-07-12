import { createApp } from './client/app'
import { CODE_NOTFOUND } from './server/constant/code'

export default function (context = {}) {
  return new Promise((resolve, reject) => {
    const { app, router, store } = createApp(context)

    // jump to server req.url
    router.push(context.url)

    router.onReady(async () => {
      const matchedComponents = router.getMatchedComponents()

      // not match router => 404
      const hasRoute = matchedComponents.length
      if (!hasRoute) {
        return reject(
          new Error({
            code: CODE_NOTFOUND
          })
        )
      }

      try {
        await Promise.all(
          matchedComponents.map((Component = {}) => {
            const asyncData = Component.asyncData
            if (asyncData) {
              return asyncData({
                store,
                route: router.currentRoute
              })
            }
          })
        )

        // window.__INITIAL_STATE__
        context.state = store.state

        // match => render app
        resolve(app)
      } catch (err) {
        reject(err)
      }
    }, reject)
  })
}
