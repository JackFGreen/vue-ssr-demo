const { createApp } = require("./app");

const { app, router, store } = createApp();
console.log("entry-client");

if (window.__INITIAL_STATE__) {
  store.replaceState(window.__INITIAL_STATE__);
}

router.onReady(() => {
  console.log("router.onReady");
  router.beforeResolve(async (to, from, next) => {
    const matched = router.getMatchedComponents(to);
    const prevMatched = router.getMatchedComponents(from);

    let diff = false;
    const activated = matched.filter((c, i) => {
      return diff || (diff = prevMatched[i] !== c);
    });

    if (!activated.length) {
      return next();
    }

    // loading start...
    try {
      await Promise.all(
        activated.map((c = {}) => {
          const asyncData = c.asyncData;
          if (asyncData) return asyncData({ store, route: to });
        })
      );
      // loading stop...
      next();
    } catch (err) {
      next(err);
    }
  });

  app.$mount("#app");
});
